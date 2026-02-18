import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { resourceAPI, bookingAPI, requestAPI } from '../../services/api';
import { Calendar, Clock, MapPin, Target, Send, Info, MessageSquare } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../components/Dashboard.css';

const CreateBooking = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(false);

    // Pre-fill logic from Student Suggestion
    const preFill = location.state?.preFill || null;

    const [formData, setFormData] = useState({
        eventName: preFill?.eventTitle || preFill?.title || '',
        resourceId: preFill?.resourceId || '',
        eventDate: preFill?.eventDate || preFill?.date || '',
        timeSlot: preFill?.timeSlot || '',
        description: preFill?.description || '',
        requestId: preFill?.id || ''
    });

    useEffect(() => {
        resourceAPI.getAll().then(res => setResources(res.data.filter(r => r.status === 'AVAILABLE')));
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            await bookingAPI.create({
                ...formData,
                facultyId: user.id
            });

            // SYNC STATUS: If this booking came from a student suggestion, mark it as ACCEPTED
            if (preFill?.id) {
                try {
                    await requestAPI.updateStatus(preFill.id, 'ACCEPTED');
                } catch (syncErr) {
                    console.error("Status Sync Error:", syncErr);
                }
            }

            alert('Booking request sent for approval! Student will see "ACCEPTED" status.');
            navigate('/faculty/dashboard');
        } catch (err) {
            alert(err.response?.data || 'Failed to create booking');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout role="FACULTY">
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <div style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', margin: '0 0 10px 0' }}>Request a Resource</h2>
                    <p style={{ color: '#64748b', fontSize: '15px' }}>Submit a formal booking request for campus facilities. Admin approval is required.</p>
                </div>

                {preFill && (
                    <div style={{ background: '#f5f3ff', borderLeft: '4px solid #6200ea', padding: '16px 20px', borderRadius: '12px', marginBottom: '32px', display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <div style={{ background: '#6200ea', color: 'white', padding: '8px', borderRadius: '10px' }}>
                            <Info size={20} />
                        </div>
                        <span style={{ fontSize: '14px', color: '#4c1d95', fontWeight: 500 }}>
                            This request is pre-filled from <strong>{preFill.title}</strong> suggestion.
                        </span>
                    </div>
                )}

                <div style={{ background: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}>
                    <form onSubmit={handleSubmit} className="smart-form">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <div className="smart-input-group" style={{ gridColumn: 'span 2' }}>
                                <span><Target size={18} /></span>
                                <input
                                    name="eventName"
                                    placeholder="Booking Purpose / Title (e.g. Workshop on Web3)"
                                    value={formData.eventName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="smart-input-group">
                                <span><MapPin size={18} /></span>
                                <select
                                    name="resourceId"
                                    value={formData.resourceId}
                                    onChange={handleChange}
                                    style={{ paddingLeft: '45px' }}
                                    required
                                >
                                    <option value="">Choose Hall/Lab</option>
                                    {resources.map(r => (
                                        <option key={r.id} value={r.id}>
                                            {r.name} ({r.type.replace('_', ' ')})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="smart-input-group">
                                <span><Calendar size={18} /></span>
                                <input
                                    type="date"
                                    name="eventDate"
                                    value={formData.eventDate}
                                    onChange={handleChange}
                                    style={{ paddingLeft: '45px' }}
                                    required
                                />
                            </div>

                            <div className="smart-input-group">
                                <span><Clock size={18} /></span>
                                <select
                                    name="timeSlot"
                                    value={formData.timeSlot}
                                    onChange={handleChange}
                                    style={{ paddingLeft: '45px' }}
                                    required
                                >
                                    <option value="">Select Time Slot</option>
                                    <option value="09:00-12:00">Morning (09:00 - 12:00)</option>
                                    <option value="13:00-16:00">Afternoon (13:00 - 16:00)</option>
                                    <option value="10:00-17:00">Full Day (10:00 - 17:00)</option>
                                </select>
                            </div>

                            <div style={{ gridColumn: 'span 2', background: '#fffbeb', border: '1px solid #fef3c7', padding: '12px 15px', borderRadius: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <Info size={16} style={{ color: '#b45309' }} />
                                <p style={{ margin: 0, fontSize: '13px', color: '#b45309', fontWeight: 500 }}>
                                    A mandatory <strong>30-minute buffer</strong> is added automatically before and after each booking for resource preparation.
                                </p>
                            </div>

                            <div className="smart-input-group" style={{ gridColumn: 'span 2' }}>
                                <span style={{ top: '22px' }}><MessageSquare size={18} /></span>
                                <textarea
                                    name="description"
                                    placeholder="Additional requirements or coordination notes..."
                                    value={formData.description}
                                    onChange={handleChange}
                                    style={{
                                        padding: '15px 15px 15px 45px',
                                        minHeight: '120px',
                                        width: '100%',
                                        borderRadius: '12px',
                                        border: '1px solid #e2e8f0',
                                        fontSize: '14px'
                                    }}
                                ></textarea>
                            </div>

                            <div style={{ gridColumn: 'span 2', marginTop: '10px' }}>
                                <button
                                    type="submit"
                                    className="smart-btn"
                                    disabled={loading}
                                    style={{ background: '#ff0055' }}
                                >
                                    {loading ? 'SENDING REQUEST...' : 'SUBMIT BOOKING REQUEST'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default CreateBooking;
