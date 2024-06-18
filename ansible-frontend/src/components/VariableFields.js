import React from 'react';
import { FieldArray, useFormikContext } from 'formik';
import { Grid, TextField } from '@mui/material';

const VariableFields = () => {
    const formik = useFormikContext();
    return (
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
    );
};

export default VariableFields;
