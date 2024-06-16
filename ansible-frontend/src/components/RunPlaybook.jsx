import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box } from '@mui/material';

const RunPlaybook = () => {
    const formik = useFormik({
        initialValues: {
            playbookPath: '',
        },
        validationSchema: Yup.object({
            playbookPath: Yup.string()
                .required('Playbook path is required')
                .matches(/^.+\.yml$/, 'Must be a .yml file'),
        }),
        onSubmit: async (values, { setSubmitting, setStatus }) => {
            setSubmitting(true);
            try {
                const response = await axios.post('http://127.0.0.1:8000/api/run-playbook/', { playbook_path: values.playbookPath });
                console.log(response)
                setStatus({ success: response.data.output });
            } catch (error) {
                setStatus({ error: error.response ? error.response.data : error.message });
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <Container maxWidth="sm">
            <Box mt={5}>
                <Typography variant="h4" align="center" gutterBottom>
                    Run Ansible Playbook
                </Typography>
                <form onSubmit={formik.handleSubmit}>
                    <TextField
                        fullWidth
                        id="playbookPath"
                        name="playbookPath"
                        label="Playbook Path"
                        value={formik.values.playbookPath}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.playbookPath && Boolean(formik.errors.playbookPath)}
                        helperText={formik.touched.playbookPath && formik.errors.playbookPath}
                        margin="normal"
                        variant="outlined"
                    />
                    <Box mt={2}>
                        <Button color="primary" variant="contained" fullWidth type="submit" disabled={formik.isSubmitting}>
                            Run Playbook
                        </Button>
                    </Box>
                </form>
                {formik.status && (
                    <Box mt={2}>
                        {formik.status.success && (
                            <Typography variant="body1" color="primary">
                                {formik.status.success}
                            </Typography>
                        )}
                        {formik.status.error && (
                            <Typography variant="body1" color="error">
                                {formik.status.error}
                            </Typography>
                        )}
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default RunPlaybook;
