import axios from 'axios';

// Replace with your actual backend API URL
const API_URL = 'https://githubstartrackerapi.onrender.com/api';

class RepositoryService {
    // Get all repositories with optional filtering
    async getRepositories(payload = {}) {
        const { repoName, perPage,
            page,
            sort } = payload
        try {
            return await axios.get(`${API_URL}/GithubStarTracker/repo_info?repoName=${repoName}`, {
                perPage,
                page,
                sort
            });
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    // Get a specific repository by name
    async getRepositoryByName(payload = {}) {
        const { 
            orgName, 
            perPage,
            page,
            sort } = payload
        try {
            return await axios.get(`${API_URL}/GithubStarTracker/org_repos?orgName=${orgName}&pageSize=${perPage}&page=${page}&sort=${sort}`);
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }



    // Add this for error handling
    handleError(error) {
        // Log errors or handle them based on status codes
        if (error.response) {
            console.error('API Error Response:', error.response.data);
        } else if (error.request) {
            console.error('API Error Request:', error.request);
        } else {
            console.error('API Error Message:', error.message);
        }
    }
}

export default new RepositoryService();