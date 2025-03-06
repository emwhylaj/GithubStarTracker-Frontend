import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import RepositoryService from '../Services/RepositoryService';
import '../Components/RepositoryList.css';

function RepositoryList({ showInfo = false }) {
    const [repositories, setRepositories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState('Ascending');
    const [searchTerm, setSearchTerm] = useState(() => {
        return localStorage.getItem('githubSearchTerm') || '';
    });
    const [paginationInfo, setPaginationInfo] = useState({
        totalRepositories: 0,
        totalPages: 0
    });

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        localStorage.setItem('githubSearchTerm', searchTerm);
    }, [searchTerm]);

    // Don't automatically fetch on parameter changes to avoid unexpected API calls
    // Instead, rely on the search button click

    const fetchOrgs = async ({ orgNameParam="",perPageParam=perPage, pageParam=currentPage, sortParam=sortOrder }) => {
        if (!searchTerm.trim()) {
            setError('Please enter an organization name');
            return;
        }

        setLoading(true);
        setError(null); // Clear previous errors

        try {
            // Log the request parameters for debugging
            // console.log("Sending request with params:", {
            //     orgName: orgNameParam||searchTerm,
            //     perPage,
            //     page,
            //     sort: sort.toLowerCase()
            // });

            const response = await RepositoryService.getRepositoryByName({
                orgName: searchTerm,
                perPage: perPageParam || perPage,
                page: pageParam || currentPage,
                sort: sortParam.toLowerCase() || sortOrder.toLowerCase()
            });

            console.log("API Response:", response);

            if (response && response.data) {
                // Check if the response has the repositories array
                if (response.data.repositories) {
                    setRepositories(response.data.repositories);
                    setPaginationInfo({
                        totalRepositories: response.data.totalRepositories || 0,
                        totalPages: response.data.totalPages || 1
                    });
                } else {
                    // Fallback if the response format is different
                    setRepositories(Array.isArray(response.data) ? response.data : []);
                    setPaginationInfo({
                        totalRepositories: Array.isArray(response.data) ? response.data.length : 0,
                        totalPages: 1
                    });
                }
                setError(null);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (err) {
            console.error("Error fetching repositories:", err);

            if (err.response) {
                setError(`Server error: ${err.response.status} - ${err.response.data?.message || 'Unknown error'}`);
            } else if (err.request) {
                setError('No response from server. Please check your network connection.');
            } else {
                setError(`Error: ${err.message || 'Failed to fetch repositories'}`);
            }
        } finally {
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

    // Generate page options dynamically based on total pages
    const renderPageOptions = () => {
        const options = [];
        const totalPages = Math.max(paginationInfo.totalPages, 1);
        for (let i = 1; i <= totalPages; i++) {
            options.push(<option key={i} value={i}>{i}</option>);
        }
        return options;
    };

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
                        <select value={perPage} onChange={(e) => {
                            handlePerPageChange(e)
                            fetchOrgs({ perPageParam: e.target.value })
                        }}>
                            <option value="10">10</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>

                    <div className="page-selector">
                        <label>Page:</label>
                        <select value={currentPage} onChange={(e) => {
                            handlePageChange(e)
                            fetchOrgs({ pageParam: e.target.value })
                        }}>
                            {renderPageOptions()}
                        </select>
                    </div>

                    <div className="sort-selector">
                        <label>Sort:</label>
                        <select value={sortOrder} onChange={(e) => {
                            handleSortChange(e)
                            fetchOrgs({ sortParam: e.target.value })
                        }}>
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

            {!showInfo && (<div className="search-box">
                <label>Search:</label>
                <input
                    type="text"
                    placeholder="Search by repo name"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <button className="search-button" onClick={()=>fetchOrgs({orgNameParam:searchTerm})}>🔍</button>
            </div>)}

            {error && <div className="error-message">{error}</div>}

            {loading ? (
                <div className="loading">Loading repositories...</div>
            ) : repositories.length > 0 ? (
                <>
                    <div className="pagination-info">
                        Showing {repositories.length} of {paginationInfo.totalRepositories} repositories | Page {currentPage} of {paginationInfo.totalPages}
                    </div>
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
                                {repositories.map((repo, index) => (
                                    <tr key={index}>
                                        <td><input type="checkbox" /></td>
                                        <td>{repo.repoName}</td>
                                        <td>{repo.description || "N/A"}</td>
                                        <td className="stars-count">{repo.stars}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : !error && !loading ? (
                <div className="no-results">No repositories found. Please search for an organization.</div>
            ) : null}
        </div>
    );
}

export default RepositoryList;