import React from 'react';
import { Box, Button, CircularProgress, TextField } from '@mui/material';
import { useFormikContext } from 'formik';
import VariableFields from './VariableFields';

const PlaybookForm = ({ onSubmit  }) => {
    const formik = useFormikContext();

    return (
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
            <VariableFields formik={formik} />
            <Box mt={2}>
                <Button color="primary" variant="contained" fullWidth type="submit" disabled={formik.isSubmitting}>
                    {formik.isSubmitting ? <CircularProgress size={24} /> : "Run Playbook"}
                </Button>
            </Box>
        </Box>
    );
};

export default PlaybookForm;
