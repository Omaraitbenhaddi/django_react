import React, { useEffect, useState } from 'react';
import { useFormik, FieldArray, FormikProvider } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import {
    TextField, Button, Container, Typography, Box, MenuItem, Select,
    InputLabel, FormControl, Drawer, List, ListItem, ListItemText, Paper, CircularProgress, Grid
} from '@mui/material';

const RunPlaybook = () => {
    const [domains, setDomains] = useState([]);
    const [selectedDomain, setSelectedDomain] = useState("");
    const [playbooks, setPlaybooks] = useState([]);
    const [playbookName, setPlaybookName] = useState("");
    const [loadingDomains, setLoadingDomains] = useState(true);
    const [loadingPlaybooks, setLoadingPlaybooks] = useState(false);
    const [loadingVariables, setLoadingVariables] = useState(false);

    useEffect(() => {
        const fetchDomains = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/get_domaine/');
                setDomains(response.data);
            } catch (error) {
                console.error('Error fetching domains:', error);
            } finally {
                setLoadingDomains(false);
            }
        };

        fetchDomains();
    }, []);

    useEffect(() => {
        const fetchPlaybooks = async () => {
            if (!selectedDomain) return;
            setLoadingPlaybooks(true);
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/get-playbooks/${selectedDomain}/`);
                setPlaybooks(response.data);
            } catch (error) {
                console.error('Error fetching playbooks:', error);
            } finally {
                setLoadingPlaybooks(false);
            }
        };

        fetchPlaybooks();
    }, [selectedDomain]);

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
                const response = await axios.post('http://localhost:8000/api/run-playbook/', {
                    playbook_path: values.playbookPath,
                    variables: values.variables.reduce((acc, variable) => {
                        acc[variable.name] = variable.value;
                        return acc;
                    }, {}),
                });
                setStatus({ success: response.data.output });
            } catch (error) {
                setStatus({ error: error.response ? error.response.data : { message: error.message } });
            } finally {
                setSubmitting(false);
            }
        },
    });

    useEffect(() => {
        const fetchVariables = async () => {
            if (!selectedDomain || !playbookName) {
                formik.setFieldValue('variables', [{ name: '', value: '' }]);
                return;
            }
            setLoadingVariables(true);
            try {
                const response = await axios.get(`http://localhost:8000/api/get_variables/${selectedDomain}/${playbookName.slice(0, -4)}/`);
                const variables = Object.entries(response.data).map(([name, value]) => ({ name, value }));
                formik.setFieldValue('variables', variables);
            } catch (error) {
                console.error('Error fetching variables:', error);
            } finally {
                setLoadingVariables(false);
            }
        };

        fetchVariables();
    }, [playbookName, selectedDomain]);

    const handleDomainSelection = (domain) => {
        setSelectedDomain(domain);
        setPlaybookName("");
        formik.setFieldValue('playbookPath', '');
        formik.setFieldValue('variables', [{ name: '', value: '' }]);
    };

    const handlePlaybookSelection = (playbook) => {
        formik.setFieldValue('playbookPath', playbook);
        setPlaybookName(playbook);
    };

    return (
        <Container maxWidth="lg">
            <Drawer variant="permanent" anchor="left">
                <List>
                    {loadingDomains ? (
                        <ListItem>
                            <CircularProgress />
                        </ListItem>
                    ) : (
                        domains.map((domain) => (
                            <ListItem button key={domain} onClick={() => handleDomainSelection(domain)}>
                                <ListItemText primary={domain} />
                            </ListItem>
                        ))
                    )}
                </List>
            </Drawer>
            <Box ml={30} mt={5}>
                <Typography variant="h4" align="center" gutterBottom>
                    Run Ansible Playbook
                </Typography>
                <FormikProvider value={formik}>
                    <Paper elevation={3} style={{ padding: '16px' }}>
                        <form onSubmit={formik.handleSubmit}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="playbook-label">Playbook</InputLabel>
                                <Select
                                    labelId="playbook-label"
                                    id="playbookPath"
                                    name="playbookPath"
                                    value={formik.values.playbookPath}
                                    onChange={(e) => {
                                        formik.handleChange(e);
                                        handlePlaybookSelection(e.target.value);
                                    }}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.playbookPath && Boolean(formik.errors.playbookPath)}
                                >
                                    {loadingPlaybooks ? (
                                        <MenuItem disabled><CircularProgress size={24} /></MenuItem>
                                    ) : (
                                        playbooks.map((playbook) => (
                                            <MenuItem key={playbook} value={playbook}>
                                                {playbook}
                                            </MenuItem>
                                        ))
                                    )}
                                </Select>
                            </FormControl>
                            <FieldArray name="variables">
                                {({ push, remove }) => (
                                    <div>
                                        {formik.values.variables.map((variable, index) => (
                                            <Grid container spacing={2} key={index} alignItems="center">
                                                <Grid item xs={5}>
                                                    <TextField
                                                        fullWidth
                                                        id={`variables[${index}].name`}
                                                        name={`variables[${index}].name`}
                                                        label="Variable Name"
                                                        value={variable.name}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        error={formik.touched.variables?.[index]?.name && Boolean(formik.errors.variables?.[index]?.name)}
                                                        helperText={formik.touched.variables?.[index]?.name && formik.errors.variables?.[index]?.name}
                                                        margin="normal"
                                                        variant="outlined"
                                                        disabled
                                                    />
                                                </Grid>
                                                <Grid item xs={5}>
                                                    <TextField
                                                        fullWidth
                                                        id={`variables[${index}].value`}
                                                        name={`variables[${index}].value`}
                                                        label="Variable Value"
                                                        value={variable.value}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        error={formik.touched.variables?.[index]?.value && Boolean(formik.errors.variables?.[index]?.value)}
                                                        helperText={formik.touched.variables?.[index]?.value && formik.errors.variables?.[index]?.value}
                                                        margin="normal"
                                                        variant="outlined"
                                                    />
                                                </Grid>
                                            </Grid>
                                        ))}
                                    </div>
                                )}
                            </FieldArray>
                            <Box mt={2}>
                                <Button color="primary" variant="contained" fullWidth type="submit" disabled={formik.isSubmitting}>
                                    {formik.isSubmitting ? <CircularProgress size={24} /> : "Run Playbook"}
                                </Button>
                            </Box>
                        </form>
                    </Paper>
                </FormikProvider>
                {formik.status && (
                    <Box mt={2}>
                        {formik.status.success && (
                            <Typography variant="body1" color="primary">
                                {formik.status.success}
                            </Typography>
                        )}
                        {formik.status.error && (
                            <Typography variant="body1" color="error">
                                {formik.status.error.message || formik.status.error.error}
                            </Typography>
                        )}
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default RunPlaybook;
