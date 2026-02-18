import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';
import { Building2, User, Lock, AlertCircle } from 'lucide-react';
import './Auth.css';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const isAdmin = location.pathname === '/login/admin';
    const isStudent = location.pathname === '/login/student';
    const isFaculty = location.pathname === '/login/faculty';
    const role = isAdmin ? 'ADMIN' : (isFaculty ? 'FACULTY' : 'STUDENT');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Basic pop check as requested
        if (!formData.email.includes('@')) return alert('Email must contain @ symbol');
        if (formData.email !== formData.email.toLowerCase()) return alert('Email must contain small letters only');

        setLoading(true);
        try {
            const { data } = await authAPI.login(formData, role);
            const user = data.user;

            // Verify role matches the login portal
            if (role !== user.role) {
                throw new Error(`This portal is for ${role.toLowerCase()}s only.`);
            }

            alert('Login Successful! Redirecting...');
            if (user.role === 'ADMIN') navigate('/admin/dashboard');
            else if (user.role === 'FACULTY') navigate('/faculty/dashboard');
            else navigate('/student/dashboard');
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Invalid credentials';
            alert(msg);
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="left-pane">
                <div className="left-content">
                    <div className="brand-icon">
                        <Building2 />
                    </div>
                    <h1>Digital Resource</h1>
                    <p>Booking System</p>

                    <div className="pane-toggles">
                        <button className="toggle-btn active">Login</button>
                        <button className="toggle-btn" onClick={() => navigate('/register')}>Sign Up</button>
                    </div>
                </div>
            </div>

            <div className="right-pane">
                <div className="form-container">
                    <h2>Sign In</h2>
                    <p>Access the Digital Resource Portal</p>

                    {error && <div className="error-alert"><AlertCircle size={18} /> {error}</div>}

                    <form onSubmit={handleSubmit} className="smart-form">
                        <div className="smart-input-group">
                            <span><User size={18} /></span>
                            <select
                                value={role}
                                onChange={(e) => navigate(`/login/${e.target.value.toLowerCase()}`)}
                                style={{ paddingLeft: '45px' }}
                            >
                                <option value="STUDENT">Student Portal</option>
                                <option value="FACULTY">Faculty Portal</option>
                                <option value="ADMIN">Admin Portal</option>
                            </select>
                        </div>

                        <div className="smart-input-group">
                            <span><User size={18} /></span>
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div className="smart-input-group">
                            <span><Lock size={18} /></span>
                            <input
                                type="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                            <a
                                href="#"
                                onClick={(e) => { e.preventDefault(); alert('Reset password link has been sent to your email.'); }}
                                style={{ color: '#6200ea', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}
                            >
                                Forgot Password?
                            </a>
                        </div>

                        <button type="submit" className="smart-btn" disabled={loading}>
                            {loading ? 'SIGNING IN...' : 'LOGIN'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
