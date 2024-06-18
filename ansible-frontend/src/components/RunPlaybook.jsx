import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, IconButton, Backdrop } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import DomainDrawer from './DomainDrawer';
import PlaybookForm from './PlaybookForm';
import { fetchDomains, fetchPlaybooks, fetchVariables, runPlaybook } from './useApi';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const RunPlaybook = () => {
    const [domains, setDomains] = useState([]);
    const [selectedDomain, setSelectedDomain] = useState("");
    const [playbooks, setPlaybooks] = useState([]);
    const [playbookName, setPlaybookName] = useState("");
    const [loadingDomains, setLoadingDomains] = useState(true);
    const [loadingPlaybooks, setLoadingPlaybooks] = useState(false);
    const [loadingVariables, setLoadingVariables] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [executionResult, setExecutionResult] = useState(null);

    useEffect(() => {
        const loadDomains = async () => {
            setLoadingDomains(true);
            const domainsData = await fetchDomains();
            setDomains(domainsData);
            setLoadingDomains(false);
        };
        loadDomains();
    }, []);

    useEffect(() => {
        const loadPlaybooks = async () => {
            if (!selectedDomain) return;
            setLoadingPlaybooks(true);
            const playbooksData = await fetchPlaybooks(selectedDomain);
            setPlaybooks(playbooksData);
            setLoadingPlaybooks(false);
        };
        loadPlaybooks();
    }, [selectedDomain]);

    useEffect(() => {
        const loadVariables = async () => {
            if (!selectedDomain || !playbookName) {
                formik.setFieldValue('variables', [{ name: '', value: '' }], false);
                return;
            }
            setLoadingVariables(true);
            const variablesData = await fetchVariables(selectedDomain, playbookName);
            const variablesArray = Object.entries(variablesData).map(([name, value]) => ({ name, value }));
            formik.setFieldValue('variables', variablesArray, false);
            setLoadingVariables(false);
        };
        loadVariables();
    }, [playbookName, selectedDomain]);

    const formik = useFormik({
        initialValues: {
            playbookPath: '',
            variables: [{ name: '', value: '' }],
        },
        validationSchema: Yup.object({
            playbookPath: Yup.string().required('Playbook path is required'),
            variables: Yup.array().of(
                Yup.object().shape({
                    name: Yup.string().required('Variable name is required'),
                    value: Yup.string().required('Variable value is required'),
                })
            ),
        }),
        onSubmit: async (values, { setSubmitting, setStatus }) => {
            setSubmitting(true);
            try {
                const response = await runPlaybook(values.playbookPath, values.variables, selectedDomain);
                setStatus({ success: response.output });
                setExecutionResult({ success: response.output });
            } catch (error) {
                setStatus({ error: error.response ? error.response.data : { message: error.message } });
                setExecutionResult({ error: error.response ? error.response.data : { message: error.message } });
            } finally {
                setSubmitting(false);
            }
        },
    });

    const handleDomainSelection = (domain) => {
        setSelectedDomain(domain);
        setPlaybookName("");
        formik.setFieldValue('playbookPath', '');
        formik.setFieldValue('variables', [{ name: '', value: '' }], false);
        setDrawerOpen(false);
    };

    const handlePlaybookSelection = (playbook) => {
        formik.setFieldValue('playbookPath', playbook);
        setPlaybookName(playbook);
    };

    return (
        <Container maxWidth="lg">
            <Backdrop open={drawerOpen} onClick={() => setDrawerOpen(false)} />
            <DomainDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                domains={domains}
                loadingDomains={loadingDomains}
                onSelectDomain={handleDomainSelection}
            />
            <Box ml={drawerOpen ? '270px' : '0'} mt={5} transition="margin-left 0.3s">
                <Typography variant="h4" align="center" gutterBottom>
                    Run Ansible Playbook
                </Typography>
                <PlaybookForm
                    playbooks={playbooks}
                    loadingPlaybooks={loadingPlaybooks}
                    onSubmit={formik.handleSubmit}
                    onPlaybookChange={handlePlaybookSelection}
                    formik={formik}
                />
                {executionResult && (
                    <Box mt={2}>
                        {executionResult.success && (
                            <Typography variant="body1" color="primary">
                                {executionResult.success}
                            </Typography>
                        )}
                        {executionResult.error && (
                            <Typography variant="body1" color="error">
                                {executionResult.error.message || executionResult.error.error}
                            </Typography>
                        )}
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default RunPlaybook;
