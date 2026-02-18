import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { userAPI } from '../../services/api';
import { Trash2, UserPlus, Search, User } from 'lucide-react';
import '../../components/Dashboard.css';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

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
            </div>

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
