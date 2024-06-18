import React from 'react';
import { FormikProvider } from 'formik';
import { Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Paper, Select, Typography } from '@mui/material';
import VariableFields from './VariableFields';

const PlaybookForm = ({ playbooks, loadingPlaybooks, onSubmit, onPlaybookChange, formik }) => (
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
                            onPlaybookChange(e.target.value);
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
                <VariableFields />
                <Box mt={2}>
                    <Button color="primary" variant="contained" fullWidth type="submit" disabled={formik.isSubmitting}>
                        {formik.isSubmitting ? <CircularProgress size={24} /> : "Run Playbook"}
                    </Button>
                </Box>
            </form>
        </Paper>
    </FormikProvider>
);

export default PlaybookForm;
