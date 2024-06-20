import axios from 'axios';

export const fetchDomains = async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/get_domaine/');
    return response.data;
};

export const fetchPlaybooks = async (selectedDomain) => {
    const response = await axios.get(`http://127.0.0.1:8000/api/get-playbooks/${selectedDomain}/`);
    return response.data;
};

export const fetchVariables = async (selectedDomain, playbookName) => {
    const response = await axios.get(`http://localhost:8000/api/get_variables/${selectedDomain}/${playbookName.slice(0, -4)}/`);
    return response.data;
};

export const runPlaybook = async (playbookPath, variables, selectedDomain) => {
    const response = await axios.post('http://localhost:8000/api/run-playbook/', {
        playbook_path: playbookPath,
        vaultPass: "",
        selectedDomain: selectedDomain,
        variables: variables.reduce((acc, variable) => {
            acc[variable.name] = variable.value;
            return acc;
        }, {}),
    });
    return response.data;
};
