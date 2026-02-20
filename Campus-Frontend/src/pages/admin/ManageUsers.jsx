import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { userAPI } from '../../services/api';
import { Trash2, UserPlus, Search, User, X, Lock } from 'lucide-react';
import '../../components/Dashboard.css';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        password: '',
        role: 'STUDENT',
        department: ''
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await userAPI.getAll();
            setUsers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            await userAPI.create(newUser);
            alert('User registered successfully');
            setShowAddModal(false);
            setNewUser({ name: '', email: '', password: '', role: 'STUDENT', department: '' });
            fetchUsers();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to register user');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await userAPI.delete(id);
            setUsers(users.filter(u => u.id !== id));
        } catch (err) {
            alert('Delete failed');
        }
    };

    const filteredUsers = users.filter(u =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Layout role="ADMIN">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div style={{ position: 'relative', width: '300px' }}>
                    <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={18} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '10px', border: '1px solid #e2e8f0' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="auth-button"
                    style={{
                        width: 'auto',
                        padding: '10px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'linear-gradient(135deg, #6200ea 0%, #3700b3 100%)',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(98, 0, 234, 0.2)'
                    }}
                >
                    <UserPlus size={18} /> Add User
                </button>
            </div>

            {showAddModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', padding: '40px', borderRadius: '24px', width: '450px', maxWidth: '95%', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
                        <button
                            onClick={() => setShowAddModal(false)}
                            style={{ position: 'absolute', right: '24px', top: '24px', border: 'none', background: '#f1f5f9', padding: '8px', borderRadius: '12px', cursor: 'pointer', color: '#64748b' }}
                        >
                            <X size={20} />
                        </button>

                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                            <div style={{ width: '60px', height: '60px', background: '#f5f3ff', color: '#6200ea', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                                <UserPlus size={32} />
                            </div>
                            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#1e293b', margin: 0 }}>Create New User</h2>
                            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '8px' }}>Register a new account in the system</p>
                        </div>

                        <form onSubmit={handleAddUser} className="smart-form" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div className="smart-input-group">
                                <span><User size={18} /></span>
                                <input
                                    type="text"
                                    placeholder="Full Name (Max 50 chars)"
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                    maxLength={50}
                                    pattern=".*[a-zA-Z].*"
                                    title="Name must contain at least one letter"
                                    required
                                />
                            </div>

                            <div className="smart-input-group">
                                <span><User size={18} /></span>
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    maxLength={80}
                                    required
                                />
                            </div>

                            <div className="smart-input-group">
                                <span><User size={18} /></span>
                                <select
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                    style={{ paddingLeft: '45px' }}
                                >
                                    <option value="STUDENT">Student</option>
                                    <option value="FACULTY">Faculty</option>
                                    <option value="ADMIN">Administrator</option>
                                </select>
                            </div>

                            <div className="smart-input-group">
                                <span><User size={18} /></span>
                                <select
                                    value={newUser.department}
                                    onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                                    style={{ paddingLeft: '45px' }}
                                    required
                                >
                                    <option value="">Select Department</option>
                                    <option value="CSE">Computer Science (CSE)</option>
                                    <option value="ECE">Electronics (ECE)</option>
                                    <option value="IT">Information Technology (IT)</option>
                                    <option value="MECH">Mechanical (MECH)</option>
                                    <option value="CIVIL">Civil Engineering</option>
                                    <option value="MBA">Management (MBA)</option>
                                    <option value="SCIENCE">Science & Humanities</option>
                                </select>
                            </div>

                            <div className="smart-input-group">
                                <span><Lock size={18} /></span>
                                <input
                                    type="password"
                                    placeholder="Initial Password (Min 6)"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    minLength={6}
                                    required
                                />
                            </div>

                            <button type="submit" className="smart-btn" style={{ marginTop: '10px' }}>
                                REGISTER USER
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <tr>
                            <th style={{ padding: '15px 20px', fontSize: '14px', fontWeight: 600, color: '#64748b' }}>User</th>
                            <th style={{ padding: '15px 20px', fontSize: '14px', fontWeight: 600, color: '#64748b' }}>Role</th>
                            <th style={{ padding: '15px 20px', fontSize: '14px', fontWeight: 600, color: '#64748b' }}>Department</th>
                            <th style={{ padding: '15px 20px', fontSize: '14px', fontWeight: 600, color: '#64748b', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '15px 20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '36px', height: '36px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justify_content: 'center', color: '#6200ea' }}>
                                            <User size={18} />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: '14px' }}>{user.name}</div>
                                            <div style={{ fontSize: '12px', color: '#64748b' }}>{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '15px 20px' }}>
                                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '20px', background: user.role === 'ADMIN' ? '#fdf2f8' : (user.role === 'FACULTY' ? '#f5f3ff' : '#eff6ff'), color: user.role === 'ADMIN' ? '#9d174d' : (user.role === 'FACULTY' ? '#6200ea' : '#1d4ed8') }}>
                                        {user.role}
                                    </span>
                                </td>
                                <td style={{ padding: '15px 20px', fontSize: '14px', color: '#64748b' }}>{user.department || 'N/A'}</td>
                                <td style={{ padding: '15px 20px', textAlign: 'right' }}>
                                    <button onClick={() => handleDelete(user.id)} style={{ border: 'none', background: '#fee2e2', color: '#ef4444', padding: '8px', borderRadius: '8px', cursor: 'pointer', transition: '0.2s' }}>
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredUsers.length === 0 && !loading && (
                    <div style={{ textAlign: 'center', padding: '50px', color: '#64748b' }}>No users found.</div>
                )}
            </div>
        </Layout>
    );
};

export default ManageUsers;
