import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { Building2, User, Mail, Phone, Lock, Check, X } from 'lucide-react';
import './Auth.css';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: 'STUDENT',
        department: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [validations, setValidations] = useState({
        emailAt: false,
        emailSmall: false,
        length: false,
        upper: false,
        number: false,
        special: false,
        match: false
    });

    useEffect(() => {
        setValidations({
            emailAt: formData.email.includes('@'),
            emailSmall: formData.email === formData.email.toLowerCase() && formData.email !== '',
            length: formData.password.length >= 8,
            upper: /[A-Z]/.test(formData.password),
            number: /[0-9]/.test(formData.password),
            special: /[!@#$%^&*()]/.test(formData.password),
            match: formData.password === formData.confirmPassword && formData.confirmPassword !== ''
        });
    }, [formData.email, formData.password, formData.confirmPassword]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Pop Checks (Alerts)
        if (!formData.name) return alert('Name is required');
        if (!validations.emailAt) return alert('Email must contain @ symbol');
        if (!validations.emailSmall) return alert('Email must be in small letters');
        if (formData.phone.length < 10) return alert('Please enter a valid phone number');
        if (!formData.department) return alert('Please select your department');

        if (!validations.length) return alert('Password must be at least 8 characters long');
        if (!validations.upper) return alert('Password must contain at least one uppercase letter');
        if (!validations.number) return alert('Password must contain at least one number');
        if (!validations.special) return alert('Password must contain at least one special character');
        if (!validations.match) return alert('Passwords do not match');

        setLoading(true);
        try {
            const { confirmPassword, ...submitData } = formData;
            await authAPI.register(submitData);
            alert('Registration Successful! Redirecting to login...');
            navigate('/login');
        } catch (err) {
            const msg = err.response?.data?.message || 'Registration failed';
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
                        <button className="toggle-btn" onClick={() => navigate('/login')}>Login</button>
                        <button className="toggle-btn active">Sign Up</button>
                    </div>
                </div>
            </div>

            <div className="right-pane">
                <div className="form-container" style={{ maxWidth: '500px' }}>
                    <h2>Create Account</h2>
                    <p>Join the Digital Resource Network</p>

                    <form onSubmit={handleSubmit} className="smart-form">
                        <div className="smart-input-group">
                            <span><User size={18} /></span>
                            <input type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                        </div>

                        <div className="smart-input-group">
                            <span><Mail size={18} /></span>
                            <input type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                        </div>

                        <div className="smart-input-group">
                            <span><Phone size={18} /></span>
                            <input type="text" placeholder="Phone Number" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
                        </div>

                        <div className="smart-input-group">
                            <span><User size={18} /></span>
                            <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} style={{ paddingLeft: '45px' }}>
                                <option value="STUDENT">Student</option>
                                <option value="FACULTY">Faculty</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>

                        <div className="smart-input-group">
                            <span><Building2 size={18} /></span>
                            <select value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} style={{ paddingLeft: '45px' }} required>
                                <option value="">Select Department</option>
                                <option value="CSE">Computer Science</option>
                                <option value="IT">Information Technology</option>
                                <option value="ECE">Electronics</option>
                            </select>
                        </div>

                        <div className="smart-input-group">
                            <span><Lock size={18} /></span>
                            <input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                        </div>

                        <div className="smart-input-group">
                            <span><Lock size={18} /></span>
                            <input type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} required />
                        </div>

                        <div className="password-pop">
                            <div className={`pop-item ${validations.length ? 'valid' : ''}`}>{validations.length ? <Check size={12} /> : <X size={12} />} 8+ Chars</div>
                            <div className={`pop-item ${validations.emailSmall ? 'valid' : ''}`}>{validations.emailSmall ? <Check size={12} /> : <X size={12} />} Small Mail</div>
                            <div className={`pop-item ${validations.match ? 'valid' : ''}`}>{validations.match ? <Check size={12} /> : <X size={12} />} Match</div>
                        </div>

                        <button type="submit" className="smart-btn" style={{ background: '#ff0055' }} disabled={loading}>
                            {loading ? 'REGISTERING...' : 'REGISTER'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
