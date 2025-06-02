import axios from "../api/axios";

export async function fetchAllJobs() {
  const response = await axios.get('/jobs');
  return response.data;
}

// Function to fetch a specific job by ID
export async function fetchJobById(id) {
  const response = await axios.get(`/jobs/${id}`);
  return response.data;
}

// Function to fetch company details by ID
export async function fetchCompanyById(id) {
  try {
    const response = await axios.get(`/company/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching company:', error);
    return null;
  }
}

// Helper function to get company name by ID
export async function getCompanyName(companyId) {
  if (!companyId) return 'Unknown Company';
  
  try {
    const company = await fetchCompanyById(companyId);
    return company?.name || 'Company not found';
  } catch (error) {
    console.error('Error getting company name:', error);
    return 'Unknown Company';
  }
}