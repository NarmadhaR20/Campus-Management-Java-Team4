import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { resourceAPI } from '../../services/api';
import { Search, MapPin, Box, Plus, Trash2, X, Building2, Users, Calendar } from 'lucide-react';
import '../../components/Dashboard.css';

const Resources = ({ role }) => {
    const [resources, setResources] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newResource, setNewResource] = useState({
        name: '',
        type: 'CLASSROOM',
        capacity: '',
        location: '',
        status: 'AVAILABLE'
    });

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        try {
            const { data } = await resourceAPI.getAll();
            setResources(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this resource?')) return;
        try {
            await resourceAPI.delete(id);
            alert('Resource deleted successfully');
            fetchResources();
        } catch (err) {
            alert('Failed to delete resource');
        }
    };

    const handleAddResource = async (e) => {
        e.preventDefault();
        try {
            await resourceAPI.create(newResource);
            alert('Resource added successfully');
            setShowAddModal(false);
            setNewResource({ name: '', type: 'CLASSROOM', capacity: '', location: '', status: 'AVAILABLE' });
            fetchResources();
        } catch (err) {
            alert('Failed to add resource');
        }
    };

    const isAdmin = role === 'ADMIN';

    const filteredResources = resources.filter(res =>
        res.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.type?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Layout role={role}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div style={{ position: 'relative', width: '300px' }}>
                    <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={18} />
                    <input
                        type="text"
                        placeholder="Search resources..."
                        style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '10px', border: '1px solid #e2e8f0' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {isAdmin && (
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="auth-button"
                        style={{
                            width: 'auto',
                            padding: '10px 24px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'linear-gradient(135deg, #ff0055 0%, #d40046 100%)',
                            border: 'none',
                            boxShadow: '0 4px 15px rgba(255, 0, 85, 0.25)',
                            borderRadius: '12px',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <Plus size={18} /> Add Resource
                    </button>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {filteredResources.map(res => (
                    <div key={res.id} className="stat-card" style={{ flexDirection: 'column', alignItems: 'flex-start', borderLeft: 'none', borderTop: '4px solid #6200ea' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '15px' }}>
                            <div className="stat-icon" style={{ background: '#f5f3ff', color: '#6200ea' }}>
                                {res.type === 'LAB' ? <Box size={24} /> : <MapPin size={24} />}
                            </div>
                            {isAdmin && (
                                <button
                                    onClick={() => handleDelete(res.id)}
                                    style={{ border: 'none', background: '#fee2e2', color: '#ef4444', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                        <h3 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>{res.name}</h3>
                        <p style={{ margin: '0 0 15px 0', color: '#64748b', fontSize: '14px' }}>Capacity: {res.capacity} persons</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                            <span style={{
                                fontSize: '12px',
                                padding: '4px 10px',
                                borderRadius: '20px',
                                background: res.status === 'AVAILABLE' ? '#dcfce7' : (res.status === 'BOOKED' ? '#fee2e2' : '#f1f5f9'),
                                color: res.status === 'AVAILABLE' ? '#166534' : (res.status === 'BOOKED' ? '#991b1b' : '#64748b'),
                                fontWeight: 600
                            }}>
                                {res.status}
                            </span>
                            {role === 'FACULTY' && (
                                <button
                                    disabled={res.status !== 'AVAILABLE'}
                                    style={{
                                        border: 'none',
                                        background: res.status === 'AVAILABLE' ? '#6200ea' : '#cbd5e1',
                                        color: 'white',
                                        padding: '6px 14px',
                                        borderRadius: '6px',
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        cursor: res.status === 'AVAILABLE' ? 'pointer' : 'not-allowed'
                                    }}
                                >
                                    {res.status === 'AVAILABLE' ? 'Book Now' : 'Not Available'}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {showAddModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', padding: '40px', borderRadius: '24px', width: '450px', maxWidth: '95%', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
                        <button
                            onClick={() => setShowAddModal(false)}
                            style={{ position: 'absolute', right: '24px', top: '24px', border: 'none', background: '#f1f5f9', padding: '8px', borderRadius: '12px', cursor: 'pointer', color: '#64748b', transition: '0.2s' }}
                        >
                            <X size={20} />
                        </button>

                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                            <div style={{ width: '60px', height: '60px', background: '#f5f3ff', color: '#6200ea', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                                <Plus size={32} />
                            </div>
                            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#1e293b', margin: 0 }}>Add New Resource</h2>
                            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '8px' }}>Create a new facility for campus bookings</p>
                        </div>

                        <form onSubmit={handleAddResource} className="smart-form" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div className="smart-input-group" title="Must contain at least one letter">
                                <span><Building2 size={18} /></span>
                                <input
                                    type="text"
                                    placeholder="Resource Name (Max 40 chars)"
                                    value={newResource.name}
                                    onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
                                    maxLength={40}
                                    pattern=".*[a-zA-Z].*"
                                    title="Resource name must contain at least one letter"
                                    required
                                />
                            </div>

                            <div className="smart-input-group">
                                <span><Box size={18} /></span>
                                <select
                                    value={newResource.type}
                                    onChange={(e) => setNewResource({ ...newResource, type: e.target.value })}
                                    style={{ paddingLeft: '45px' }}
                                >
                                    <option value="CLASSROOM">Classroom</option>
                                    <option value="LAB">Laboratory</option>
                                    <option value="SEMINAR_HALL">Seminar Hall</option>
                                    <option value="EVENT_HALL">Event Hall</option>
                                </select>
                            </div>

                            <div className="smart-input-group">
                                <span><Users size={18} /></span>
                                <input
                                    type="number"
                                    placeholder="Capacity (Max 2000)"
                                    value={newResource.capacity}
                                    onChange={(e) => setNewResource({ ...newResource, capacity: e.target.value })}
                                    min={1}
                                    max={2000}
                                    required
                                />
                            </div>

                            <div className="smart-input-group" title="Must contain at least one letter">
                                <span><MapPin size={18} /></span>
                                <input
                                    type="text"
                                    placeholder="Location (Block/Floor) - Max 50 chars"
                                    value={newResource.location}
                                    onChange={(e) => setNewResource({ ...newResource, location: e.target.value })}
                                    maxLength={50}
                                    pattern=".*[a-zA-Z].*"
                                    title="Location must contain at least one letter"
                                    required
                                />
                            </div>

                            <button type="submit" className="smart-btn" style={{ marginTop: '10px' }}>
                                REGISTER RESOURCE
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {filteredResources.length === 0 && !loading && (
                <div style={{ textAlign: 'center', padding: '50px', color: '#64748b' }}>
                    No resources found matching your search.
                </div>
            )}
        </Layout>
    );
};

export default Resources;
