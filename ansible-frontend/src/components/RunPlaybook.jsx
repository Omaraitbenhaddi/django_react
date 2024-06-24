import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, CircularProgress, Grid, Backdrop } from '@mui/material';
import DomainDrawer from './DomainDrawer';
import PlaybookCard from './PlaybookCard';
import PlaybookForm from './PlaybookForm';
import { fetchDomains, fetchPlaybooks, fetchVariables, runPlaybook } from './useApi';
import { useFormik, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

const RunPlaybook = () => {
    const [domains, setDomains] = useState([]);
    const [domainPlaybooks, setDomainPlaybooks] = useState({});
    const [selectedDomain, setSelectedDomain] = useState("");
    const [playbookName, setPlaybookName] = useState("");
    const [loadingDomains, setLoadingDomains] = useState(true);
    const [loadingPlaybooks, setLoadingPlaybooks] = useState(false);
    const [loadingVariables, setLoadingVariables] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [executionResult, setExecutionResult] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadDomainsAndPlaybooks = async () => {
            setLoadingDomains(true);
            const domainsData = await fetchDomains();
            setDomains(domainsData);
            setLoadingDomains(false);
            setLoadingPlaybooks(true);
            const playbooksByDomain = {};
            for (const domain of domainsData) {
                const playbooksData = await fetchPlaybooks(domain);
                playbooksByDomain[domain] = playbooksData;
            }
            setDomainPlaybooks(playbooksByDomain);
            setLoadingPlaybooks(false);
        };
        loadDomainsAndPlaybooks();
    }, []);

    useEffect(() => {
        const loadVariables = async () => {
            if (!playbookName || !selectedDomain) {
                formik.setFieldValue('variables', [], false);
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
            variables: [],
            vaultName: '', 
        },
        validationSchema: Yup.object({
            playbookPath: Yup.string().required('Playbook path is required'),
            variables: Yup.array().of(
                Yup.object().shape({
                    name: Yup.string().required('Variable name is required'),
                    value: Yup.string().required('Variable value is required'),
                })
            ),
            vaultName: Yup.string(), // Ajout de cette ligne
        }),
        onSubmit: async (values, { setSubmitting, setStatus }) => {
            setSubmitting(true);
            try {
                const response = await runPlaybook(values.playbookPath, values.variables ,selectedDomain, values.vaultName);
                setStatus({ success: response.output });
                setExecutionResult({ success: response.output });
                setPlaybookName("");
                navigate('/logs', { state: { logs: response.output } });
            } catch (error) {
                setStatus({ error: error.response ? error.response.data : { message: error.message } });
                setExecutionResult({ error: error.response ? error.response.data : { message: error.message } });
                navigate('/logs', { state: { logs: error.message } });
            } finally {
                setSubmitting(false);
            }
        },
    });

    const handlePlaybookSelection = (domain, playbook) => {
        formik.setFieldValue('playbookPath', playbook);
        setSelectedDomain(domain);
        setPlaybookName(playbook);
    };

    const handleDomainSelection = (domain) => {
        setSelectedDomain(domain);
        setPlaybookName("");
        formik.setFieldValue('playbookPath', '');
        formik.setFieldValue('variables', []);
        setDrawerOpen(false);
    };

    return (
        <Container maxWidth="lg">
            <Backdrop open={drawerOpen} onClick={() => setDrawerOpen(false)}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <DomainDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                domains={domains}
                loadingDomains={loadingDomains}
                onSelectDomain={handleDomainSelection}
            />
            <Box mt={5}>
                <Typography variant="h4" align="center" gutterBottom>
                    Run Ansible Playbook
                </Typography>
                {loadingVariables ? (
                    <Box display="flex" justifyContent="center">
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                    {playbookName && (
                        <FormikProvider  value={formik}>
                            <PlaybookForm onSubmit={formik.handleSubmit} />
                        </FormikProvider>
                    )}
            
                    {!playbookName && Object.entries(domainPlaybooks).map(([domain, playbooks]) => (
                        <Box key={domain} mt={4} pb={3}>
                            <Typography variant="h5" gutterBottom sx={{ color: '#e60000', borderBottom: '3px solid #e60000', paddingBottom: '10px', fontWeight: 'bold' }}>
                                {domain}
                            </Typography>
                            <Grid container spacing={4}>
                                {playbooks.map((playbook) => (
                                    <Grid item xs={12} sm={6} md={4} key={playbook}>
                                        <PlaybookCard playbook={playbook} onClick={() => handlePlaybookSelection(domain, playbook)} />
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    ))}
                </>
                )}
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
