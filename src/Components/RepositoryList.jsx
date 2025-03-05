import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import RepositoryService from '../Services/RepositoryService';
import '../Components/RepositoryList.css';

function RepositoryList({ showInfo = false }) {
    const [repositories, setRepositories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [perPage, setPerPage] = useState(100);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState('Ascending');
    const [searchTerm, setSearchTerm] = useState(() => {
        return localStorage.getItem('githubSearchTerm') || '';
    });
    const [filteredRepositories, setFilteredRepositories] = useState([])

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        localStorage.setItem('githubSearchTerm', searchTerm);

        // fetchRepositories();
    }, [perPage, currentPage, sortOrder, searchTerm]);

    const fetchOrgs = async () => {
        setLoading(true);
        try {
            const response = await RepositoryService.getRepositoryByName({
                orgName: searchTerm,
            });
            setRepositories(response.data);
            setLoading(false);
            const filtered = repositories
                ? repositories.filter(repo =>
                    repo.repoName.toLowerCase().includes(savedSearchTerm.toLowerCase() || ''))
                : repositories;

            setFilteredRepositories(filtered)
            console.log("filtered", repositories);

        } catch (err) {
            console.log("This is the error", err);

            // setError('Failed to fetch repositories');
            setLoading(false);
        }
    };
    const fetchRepositories = async () => {
        setLoading(true);
        try {
            const response = await RepositoryService.getRepositories({
                repoName: searchTerm,
                perPage,
                page: currentPage,
                sort: sortOrder.toLowerCase()
            });
            setRepositories(response.data);

            setLoading(false);

        } catch (err) {
            if (err) {

                setError('Failed to fetch repositories');
            }
            setLoading(false);
        }
    };

    const handlePerPageChange = (e) => {
        setPerPage(parseInt(e.target.value));
    };

    const handlePageChange = (e) => {
        setCurrentPage(parseInt(e.target.value));
    };

    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
    };

    const handleSearchChange = (e) => {

        const newSearchTerm = e.target.value;
        setSearchTerm(newSearchTerm);
    };

    const handleTabChange = (isInfo) => {
        if (isInfo) {
            navigate('/repo-info');
        } else {
            navigate('/');
        }
    };
    const savedSearchTerm = localStorage.getItem('githubSearchTerm');



    return (
        <div className="repository-container">
            <div className="repository-header">
                <h1>{showInfo ? 'Organization Repositories Info' : 'Organization Repositories'}</h1>
                <div className="info-icon">ⓘ</div>
            </div>

            <div className="repository-controls">
                {showInfo && (<div className="pagination-controls">
                    <div className="per-page">
                        <label>No. per Page:</label>
                        <select value={perPage} onChange={handlePerPageChange}>
                            <option value="10">10</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>

                    <div className="page-selector">
                        <label>Page:</label>
                        <select value={currentPage} onChange={handlePageChange}>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </select>
                    </div>

                    <div className="sort-selector">
                        <label>Sort:</label>
                        <select value={sortOrder} onChange={handleSortChange}>
                            <option value="Ascending">Ascending</option>
                            <option value="Descending">Descending</option>
                        </select>
                    </div>
                </div>)}

                <div className="tab-controls">
                    <button
                        className={!showInfo ? 'active-tab' : ''}
                        onClick={() => handleTabChange(false)}
                    >
                        Organization Repo
                    </button>
                    <button
                        className={showInfo ? 'active-tab' : ''}
                        onClick={() => handleTabChange(true)}
                    >
                        Organization Repo Info
                    </button>
                </div>
            </div>

            {!showInfo && (
                <div className="search-box">
                    <label>Search:</label>
                    <input
                        type="text"
                        placeholder="Search by repo name"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <button className="search-button" onClick={(e) => { e.preventDefault(); fetchOrgs() }}>🔍</button>
                </div>
            )}

            {loading ? (
                <div className="loading">Loading repositories...</div>
            ) : error ? (
                <div className="error">{error}</div>
            ) : (
                <div className="repository-table">
                    <table>
                        <thead>
                            <tr>
                                <th className="checkbox-column"></th>
                                <th className="name-column">
                                    Repo Name
                                    <span className="column-sorter">+</span>
                                </th>
                                <th className="description-column">
                                    Repo Description
                                </th>
                                <th className="stars-column">
                                    No. of Stars
                                    <span className="column-sorter-stars">↑</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {repositories && repositories.map((repo,index) => (
                                <tr key={index}>
                                    <td><input type="checkbox" /></td>
                                    <td>{repo.repoName}</td>
                                    <td>{repo.description||"N/A"}</td>
                                    <td className="stars-count">{repo.stars}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default RepositoryList;


