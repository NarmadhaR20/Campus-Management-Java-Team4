import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { requestAPI, bookingAPI, resourceAPI } from '../../services/api';

const FacultyDashboard = () => {
    const [stats, setStats] = useState({ requests: 0, myBookings: 0, resources: 0 });
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        const fetch = async () => {
            const [reqs, books, res] = await Promise.all([
                requestAPI.getFacultyRequests(user.id),
                bookingAPI.getFacultyBookings(user.id),
                resourceAPI.getAll()
            ]);
            setStats({
                requests: reqs.data.length,
                myBookings: books.data.length,
                resources: res.data.length
            });
        };
        fetch();
    }, [user.id]);

    return (
        <Layout role="FACULTY">
            <div className="stats-grid">
                <div className="stat-card">
                    <div><span className="stat-label">Student Suggestions</span><p className="stat-value">{stats.requests}</p></div>
                    <div className="stat-badge-circle" style={{ background: '#f5f3ff' }}></div>
                </div>
                <div className="stat-card">
                    <div><span className="stat-label">My Active Bookings</span><p className="stat-value">{stats.myBookings}</p></div>
                    <div className="stat-badge-circle" style={{ background: '#eff6ff' }}></div>
                </div>
                <div className="stat-card">
                    <div><span className="stat-label">Campus Resources</span><p className="stat-value">{stats.resources}</p></div>
                    <div className="stat-badge-circle" style={{ background: '#fdf2f8' }}></div>
                </div>
            </div>

            <div className="welcome-hero">
                <h2>Digital Resource Booking</h2>
                <p>Track student event suggestions and manage your hall bookings.</p>
            </div>
        </Layout>
    );
};

export default FacultyDashboard;
