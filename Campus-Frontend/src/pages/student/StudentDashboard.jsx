import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { requestAPI, resourceAPI } from '../../services/api';
import { Send, Clock, MapPin, Sparkles, TrendingUp } from 'lucide-react';
import '../../components/Dashboard.css';

const StudentDashboard = () => {
    const [stats, setStats] = useState({ sent: 0, pending: 0, resources: 0 });
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        const fetch = async () => {
            try {
                const [reqs, res] = await Promise.all([
                    requestAPI.getStudentRequests(user.id),
                    resourceAPI.getAll()
                ]);
                setStats({
                    sent: reqs.data.length,
                    pending: reqs.data.filter(x => x.status === 'PENDING').length,
                    resources: res.data.filter(r => r.status === 'AVAILABLE').length
                });
            } catch (err) {
                console.error("Dashboard Stats Fetch Error:", err);
            }
        };
        fetch();
    }, [user.id]);

    return (
        <Layout role="STUDENT">
            <div style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                    <div style={{ background: 'linear-gradient(135deg, #6200ea, #b388ff)', color: 'white', padding: '12px', borderRadius: '16px', boxShadow: '0 8px 16px -4px rgba(98, 0, 234, 0.3)' }}>
                        <Sparkles size={28} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0, color: '#1e293b' }}>Welcome back, {user.name}!</h1>
                        <p style={{ margin: 0, color: '#64748b', fontSize: '16px' }}>Ready to shape the campus life? Suggest your next big event today.</p>
                    </div>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <span className="stat-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Send size={16} color="#6200ea" /> Sent Suggestions
                        </span>
                        <p className="stat-value" style={{ fontSize: '36px', margin: '10px 0 0 0' }}>{stats.sent}</p>
                    </div>
                    <TrendingUp style={{ position: 'absolute', bottom: '-10px', right: '-10px', width: '80px', height: '80px', color: '#6200ea', opacity: 0.05 }} />
                </div>

                <div className="stat-card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <span className="stat-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Clock size={16} color="#f59e0b" /> Pending Review
                        </span>
                        <p className="stat-value" style={{ fontSize: '36px', margin: '10px 0 0 0' }}>{stats.pending}</p>
                    </div>
                    <Clock style={{ position: 'absolute', bottom: '-10px', right: '-10px', width: '80px', height: '80px', color: '#f59e0b', opacity: 0.05 }} />
                </div>

                <div className="stat-card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <span className="stat-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <MapPin size={16} color="#10b981" /> Open Resources
                        </span>
                        <p className="stat-value" style={{ fontSize: '36px', margin: '10px 0 0 0' }}>{stats.resources}</p>
                    </div>
                    <MapPin style={{ position: 'absolute', bottom: '-10px', right: '-10px', width: '80px', height: '80px', color: '#10b981', opacity: 0.05 }} />
                </div>
            </div>

            <div style={{ marginTop: '40px', background: 'linear-gradient(135deg, #1e293b, #334155)', borderRadius: '24px', padding: '40px', color: 'white', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <h3 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 10px 0' }}>Initiate Change</h3>
                    <p style={{ fontSize: '16px', opacity: 0.8, maxWidth: '500px', marginBottom: '25px' }}>
                        Have an idea for a coding hackathon, a guest lecture, or a sports meet? Send a suggestion to your faculty now.
                    </p>
                    <button
                        onClick={() => window.location.href = '/student/send-request'}
                        style={{ background: 'white', color: '#1e293b', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', transition: 'transform 0.2s' }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        Get Started <Send size={18} />
                    </button>
                </div>
                <div style={{ position: 'absolute', top: '20px', right: '40px', opacity: 0.1 }}>
                    <Sparkles size={120} />
                </div>
            </div>
        </Layout>
    );
};

export default StudentDashboard;
