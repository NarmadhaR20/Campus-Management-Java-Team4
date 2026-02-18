import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { requestAPI, resourceAPI } from '../../services/api';
import { ClipboardList, CalendarPlus, XCircle, User, MapPin, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../components/Dashboard.css';

const ViewRequests = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [resources, setResources] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const [reqData, resData] = await Promise.all([
                    requestAPI.getFacultyRequests(user.id),
                    resourceAPI.getAll()
                ]);

                const resMap = {};
                resData.data.forEach(r => resMap[r.id] = r);
                setResources(resMap);
                // ONLY SHOW PENDING SUGGESTIONS TO FACULTY
                setRequests(reqData.data.filter(r => r.status === 'PENDING'));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleCreateBooking = (req) => {
        // Navigate to create booking with pre-filled state
        navigate('/faculty/create-booking', { state: { preFill: req } });
    };

    const handleDismiss = async (id) => {
        try {
            await requestAPI.updateStatus(id, 'REJECTED');
            setRequests(requests.filter(r => r.id !== id));
            alert('Suggestion dismissed and moved to rejected status.');
        } catch (err) {
            console.error("Dismiss Error:", err);
            alert('Failed to dismiss suggestion.');
        }
    };

    return (
        <Layout role="FACULTY">
            <div style={{ marginBottom: '30px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#1a1a1a', margin: '0 0 8px 0' }}>Student Suggestions</h2>
                <p style={{ color: '#64748b', fontSize: '14px' }}>Review event suggestions from students and initiate formal booking requests.</p>
            </div>

            <div style={{ display: 'grid', gap: '20px' }}>
                {requests.map(req => (
                    <div key={req.id} className="stat-card" style={{ borderLeft: '5px solid #6200ea', padding: '25px', display: 'block' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                            <div>
                                <h3 style={{ margin: '0 0 5px 0', fontSize: '18px', color: '#1a1a1a' }}>{req.eventTitle || req.title}</h3>
                                <div style={{ display: 'flex', gap: '15px', color: '#64748b', fontSize: '13px' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><User size={14} /> Student: {req.studentId}</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> {resources[req.resourceId]?.name || 'Unknown Venue'}</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {req.eventDate || req.date} | {req.timeSlot}</span>
                                </div>
                            </div>
                            <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '20px', background: '#f5f3ff', color: '#6200ea' }}>
                                {req.status}
                            </span>
                        </div>

                        <p style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px', fontSize: '14px', color: '#334155', margin: '0 0 20px 0', border: '1px solid #e2e8f0' }}>
                            {req.description}
                        </p>

                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => handleDismiss(req.id)}
                                style={{ background: 'none', border: '1.5px solid #e2e8f0', padding: '8px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', color: '#64748b' }}
                            >
                                Dismiss
                            </button>
                            <button
                                onClick={() => handleCreateBooking(req)}
                                style={{ background: '#6200ea', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                <CalendarPlus size={16} /> Create Booking Request
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {requests.length === 0 && !loading && (
                <div style={{ textAlign: 'center', padding: '80px', background: 'white', borderRadius: '20px', color: '#64748b' }}>
                    <ClipboardList size={48} style={{ opacity: 0.2, marginBottom: '20px' }} />
                    <p>No student suggestions available at the moment.</p>
                </div>
            )}
        </Layout>
    );
};

export default ViewRequests;
