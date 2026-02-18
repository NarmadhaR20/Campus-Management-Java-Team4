import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { requestAPI, resourceAPI, bookingAPI } from '../../services/api';
import { Clock, CheckCircle, XCircle, MapPin, Calendar, FileText, Sparkles, ArrowRight } from 'lucide-react';
import '../../components/Dashboard.css';

const MyStatus = () => {
    const [requests, setRequests] = useState([]);
    const [approvedBookings, setApprovedBookings] = useState([]);
    const [resources, setResources] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));

                // Fetch Resources first
                const resData = await resourceAPI.getAll();
                const resMap = {};
                resData.data.forEach(r => resMap[r.id] = r);
                setResources(resMap);

                // Fetch Student Requests
                try {
                    const reqData = await requestAPI.getStudentRequests(user.id);
                    setRequests(reqData.data);
                } catch (reqErr) {
                    console.error("Requests Fetch Error:", reqErr);
                }

                // Fetch Approved Bookings (Campus Schedule)
                try {
                    const bookData = await bookingAPI.getAll();
                    setApprovedBookings(bookData.data.filter(b => b.status === 'APPROVED'));
                } catch (bookErr) {
                    console.error("Bookings Fetch Error:", bookErr);
                }
            } catch (err) {
                console.error("Fatal Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'ACCEPTED': return { bg: '#dcfce7', text: '#166534', icon: <CheckCircle size={16} /> };
            case 'APPROVED': return { bg: '#dcfce7', text: '#166534', icon: <CheckCircle size={16} /> };
            case 'REJECTED': return { bg: '#fee2e2', text: '#991b1b', icon: <XCircle size={16} /> };
            default: return { bg: '#fef3c7', text: '#92400e', icon: <Clock size={16} /> };
        }
    };

    return (
        <Layout role="STUDENT">
            <div style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <div style={{ background: '#f8fafc', color: '#1e293b', padding: '10px', borderRadius: '14px' }}>
                        <FileText size={24} />
                    </div>
                    <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', margin: 0 }}>My Event Suggestions</h2>
                </div>
                <p style={{ color: '#64748b', fontSize: '15px' }}>Track your proposals. "Accepted" suggestions will be forwarded for resource booking.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '24px', marginBottom: '60px' }}>
                {requests.map(req => {
                    const style = getStatusStyle(req.status);
                    return (
                        <div key={req.id} className="stat-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', transition: 'transform 0.2s', cursor: 'default' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <div style={{ background: '#f5f3ff', color: '#6200ea', padding: '8px', borderRadius: '10px' }}>
                                        <Sparkles size={18} />
                                    </div>
                                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>{req.eventTitle || req.title}</h3>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    padding: '5px 12px',
                                    borderRadius: '20px',
                                    background: style.bg,
                                    color: style.text,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    {style.icon} {req.status}
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#64748b', fontSize: '13px', background: '#f8fafc', padding: '10px', borderRadius: '10px' }}>
                                    <MapPin size={16} /> {resources[req.resourceId]?.name || 'Unknown Venue'}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#64748b', fontSize: '13px', background: '#f8fafc', padding: '10px', borderRadius: '10px' }}>
                                    <Calendar size={16} /> {req.eventDate || req.date}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#64748b', fontSize: '13px', background: '#f8fafc', padding: '10px', borderRadius: '10px', gridColumn: 'span 2' }}>
                                    <Clock size={16} /> {req.timeSlot}
                                </div>
                            </div>
                            <div style={{ padding: '15px', background: '#fff', borderRadius: '12px', border: '1px dashed #e2e8f0' }}>
                                <p style={{ fontSize: '13px', color: '#475569', margin: 0, lineHeight: 1.6 }}>{req.description}</p>
                            </div>
                            {req.status === 'REJECTED' && req.rejectionReason && (
                                <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', padding: '12px', borderRadius: '10px' }}>
                                    <p style={{ margin: 0, fontSize: '13px', color: '#991b1b', fontWeight: 600 }}>Rejection Feedback:</p>
                                    <p style={{ margin: 0, fontSize: '13px', color: '#b91c1c' }}>{req.rejectionReason}</p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {requests.length === 0 && !loading && (
                <div style={{ textAlign: 'center', padding: '60px 40px', background: 'white', borderRadius: '32px', border: '1px solid #e2e8f0', marginBottom: '60px' }}>
                    <p style={{ color: '#64748b', margin: 0 }}>You haven't sent any event suggestions yet.</p>
                </div>
            )}

            <div style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <div style={{ background: '#f5f3ff', color: '#6200ea', padding: '10px', borderRadius: '14px' }}>
                        <Calendar size={24} />
                    </div>
                    <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', margin: 0 }}>Campus Event Schedule</h2>
                </div>
                <p style={{ color: '#64748b', fontSize: '15px' }}>Official approved events across all university resources.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '24px' }}>
                {approvedBookings.map(book => (
                    <div key={book.id} className="stat-card" style={{ padding: '24px', borderLeft: '5px solid #10b981' }}>
                        <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', fontWeight: 700, color: '#1a1a1a' }}>{book.eventName}</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '13px' }}>
                                <MapPin size={14} /> {resources[book.resourceId]?.name}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '13px' }}>
                                <Calendar size={14} /> {new Date(book.eventDate).toLocaleDateString()}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '13px', gridColumn: 'span 2' }}>
                                <Clock size={14} /> {book.timeSlot}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Layout>
    );
};

export default MyStatus;
