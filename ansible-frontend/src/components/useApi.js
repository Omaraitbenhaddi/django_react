import axios from 'axios';




export const fetchDomains = async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/get_domaine/');
    return response.data;
};
  
export const fetchLogs = async (setLogs, setLoadingLogs) => {
    try {
      const response = await axios.get('http://localhost:8000/logs/');
      setLogs(response.data);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoadingLogs(false);
    }
  };


  export const fetchLog = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8000/logs/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching log with id ${id}:`, error);
      return null;
    }
  };
  
export const fetchAllSecrets = async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/getAllSecrets/');
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



export const runPlaybook = async (playbookPath, variables, selectedDomain, vaultPass) => {
    const payload = {
        playbook_path: playbookPath,
        vaultPass: vaultPass || "", 
        selectedDomain: selectedDomain,
        variables: variables.reduce((acc, variable) => {
            acc[variable.name] = variable.value;
            return acc;
        }, {}),
    };

    const response = await axios.post('http://localhost:8000/api/run-playbook/', payload);
    return response.data;
};

export const AddSecrets = async (nom,  password) => {
    const response = await axios.post('http://localhost:8000/add-password/', {
        nom: nom,
        password: password,
    })
    return response.data
};



