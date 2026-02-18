import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { resourceAPI, bookingAPI, userAPI } from '../../services/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ users: 0, pending: 0, resources: 0 });

    useEffect(() => {
        const fetch = async () => {
            const [u, b, r] = await Promise.all([
                userAPI.getAll(),
                bookingAPI.getAll(),
                resourceAPI.getAll()
            ]);
            setStats({
                users: u.data.length,
                pending: b.data.filter(x => x.status === 'PENDING').length,
                resources: r.data.length
            });
        };
        fetch();
    }, []);

    return (
        <Layout role="ADMIN">
            <div className="stats-grid">
                <div className="stat-card">
                    <div><span className="stat-label">Total Active Users</span><p className="stat-value">{stats.users}</p></div>
                    <div className="stat-badge-circle" style={{ background: '#eff6ff' }}></div>
                </div>
                <div className="stat-card">
                    <div><span className="stat-label">Pending Approvals</span><p className="stat-value">{stats.pending}</p></div>
                    <div className="stat-badge-circle" style={{ background: '#f0fdf4' }}></div>
                </div>
                <div className="stat-card">
                    <div><span className="stat-label">System Resources</span><p className="stat-value">{stats.resources}</p></div>
                    <div className="stat-badge-circle" style={{ background: '#fffbeb' }}></div>
                </div>
            </div>

            <div className="welcome-hero">
                <h2>Digital Resource Booking Portal</h2>
                <p>Select an option from the sidebar to begin managing your system data.</p>
            </div>
        </Layout>
    );
};

export default AdminDashboard;
