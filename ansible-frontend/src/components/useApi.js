import axiosInstance from './AxiosInstance ';

export const fetchDomains = async () => {
  const response = await axiosInstance.get('http://127.0.0.1:8000/api/get_domaine/');
  return response.data;
};

export const fetchLogs = async (page) => {
  const response = await axiosInstance.get(`http://localhost:8000/logs/?page=${page}`);
  return response.data;
};

export const fetchLog = async (id) => {
  const response = await axiosInstance.get(`http://localhost:8000/logs/${id}`);
  return response.data;
};

export const fetchPlaybooks = async (selectedDomain) => {
  const response = await axiosInstance.get(`http://127.0.0.1:8000/api/get-playbooks/${selectedDomain}/`);
  return response.data;
};

export const fetchVariables = async (selectedDomain, playbookName) => {
  const response = await axiosInstance.get(`http://localhost:8000/api/get_variables/${selectedDomain}/${playbookName.slice(0, -4)}/`);
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

  const response = await axiosInstance.post('http://localhost:8000/api/run-playbook/', payload);
  return response.data;
};
