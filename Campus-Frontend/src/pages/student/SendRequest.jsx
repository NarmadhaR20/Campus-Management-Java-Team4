import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { resourceAPI, userAPI, requestAPI } from '../../services/api';
import { Send, Calendar, Clock, MapPin, User, FileText, Info, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../components/Dashboard.css';

const SendRequest = () => {
    const navigate = useNavigate();
    const [resources, setResources] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        resourceId: '',
        facultyId: '',
        date: '',
        timeSlot: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // BUG FIX: Use getFaculties() instead of getAll() to avoid 403 error for students
                const [resData, userData] = await Promise.all([
                    resourceAPI.getAll(),
                    userAPI.getFaculties()
                ]);
                setResources(resData.data.filter(r => r.status === 'AVAILABLE'));
                setFaculties(userData.data);
            } catch (err) {
                console.error("Fetch Data Error:", err);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            await requestAPI.create({
                eventTitle: formData.title,
                eventDate: formData.date,
                resourceId: formData.resourceId,
                facultyId: formData.facultyId,
                timeSlot: formData.timeSlot,
                description: formData.description,
                studentId: user.id
            });
            alert('Your event suggestion has been sent to faculty for review!');
            navigate('/student/status');
        } catch (err) {
            alert('Failed to send suggestion. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout role="STUDENT">
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <div style={{ marginBottom: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <div style={{ background: '#f5f3ff', color: '#6200ea', padding: '10px', borderRadius: '14px' }}>
                            <Sparkles size={24} />
                        </div>
                        <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', margin: 0 }}>Suggest an Event</h2>
                    </div>
                    <p style={{ color: '#64748b', fontSize: '15px' }}>Propose a new workshop, seminar, or event to your department faculty. Early suggestions get early approvals!</p>
                </div>

                <div style={{ background: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}>
                    <form onSubmit={handleSubmit} className="smart-form">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <div className="smart-input-group" style={{ gridColumn: 'span 2' }}>
                                <span><FileText size={18} /></span>
                                <input
                                    name="title"
                                    placeholder="Enter a catchy event title (e.g. Next-Gen Web3 Workshop)"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="smart-input-group">
                                <span><User size={18} /></span>
                                <select name="facultyId" value={formData.facultyId} onChange={handleChange} style={{ paddingLeft: '45px' }} required>
                                    <option value="">Choose Responsible Faculty</option>
                                    {faculties.map(f => (
                                        <option key={f.id} value={f.id}>{f.name} ({f.department || 'General'})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="smart-input-group">
                                <span><MapPin size={18} /></span>
                                <select name="resourceId" value={formData.resourceId} onChange={handleChange} style={{ paddingLeft: '45px' }} required>
                                    <option value="">Suggest Resource/Venue</option>
                                    {resources.map(r => (
                                        <option key={r.id} value={r.id}>{r.name} ({r.type.replace('_', ' ')})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="smart-input-group">
                                <span><Calendar size={18} /></span>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    style={{ paddingLeft: '45px' }}
                                    required
                                />
                            </div>

                            <div className="smart-input-group">
                                <span><Clock size={18} /></span>
                                <select name="timeSlot" value={formData.timeSlot} onChange={handleChange} style={{ paddingLeft: '45px' }} required>
                                    <option value="">Preferred Time Slot</option>
                                    <option value="09:00-12:00">Morning (09:00-12:00)</option>
                                    <option value="13:00-16:00">Afternoon (13:00-16:00)</option>
                                    <option value="10:00-17:00">Full Day (10:00-17:00)</option>
                                </select>
                            </div>

                            <div className="smart-input-group" style={{ gridColumn: 'span 2' }}>
                                <span style={{ top: '22px' }}><Info size={18} /></span>
                                <textarea
                                    name="description"
                                    placeholder="Briefly describe the objective, target audience, and any special requirements..."
                                    value={formData.description}
                                    onChange={handleChange}
                                    style={{
                                        padding: '15px 15px 15px 45px',
                                        minHeight: '120px',
                                        width: '100%',
                                        borderRadius: '12px',
                                        border: '1px solid #e2e8f0',
                                        fontSize: '14px',
                                        fontFamily: 'inherit'
                                    }}
                                    required
                                ></textarea>
                            </div>

                            <div style={{ gridColumn: 'span 2', marginTop: '10px' }}>
                                <button
                                    type="submit"
                                    className="smart-btn"
                                    disabled={loading}
                                    style={{ background: '#6200ea' }}
                                >
                                    {loading ? 'SENDING SUGGESTION...' : 'SUBMIT EVENT SUGGESTION'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default SendRequest;
