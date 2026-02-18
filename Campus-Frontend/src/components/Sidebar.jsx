import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, Calendar, FileText, LogOut, Send, Box, ClipboardList, MapPin } from 'lucide-react';
import { authAPI } from '../services/api';
import './Dashboard.css';

const Sidebar = ({ role }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        authAPI.logout();
        navigate('/login');
    };

    const menuItems = {
        STUDENT: [
            { path: '/student/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
            { path: '/student/resources', icon: <MapPin size={20} />, label: 'View Resources' },
            { path: '/student/send-request', icon: <Send size={20} />, label: 'Send Request' },
            { path: '/student/status', icon: <ClipboardList size={20} />, label: 'Booking Status' }
        ],
        FACULTY: [
            { path: '/faculty/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
            { path: '/faculty/resources', icon: <MapPin size={20} />, label: 'View Resources' },
            { path: '/faculty/requests', icon: <FileText size={20} />, label: 'Student Requests' },
            { path: '/faculty/bookings', icon: <ClipboardList size={20} />, label: 'My Bookings' },
            { path: '/faculty/create-booking', icon: <Calendar size={20} />, label: 'Create Booking' }
        ],
        ADMIN: [
            { path: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
            { path: '/admin/users', icon: <Users size={20} />, label: 'Manage Users' },
            { path: '/admin/resources', icon: <Box size={20} />, label: 'Manage Resources' },
            { path: '/admin/bookings', icon: <BookOpen size={20} />, label: 'Approve Bookings' }
        ]
    }[role] || [];

    return (
        <div className="sidebar">
            <div className="sidebar-profile">
                <div className="profile-avatar">{user.name?.charAt(0).toUpperCase()}</div>
                <h3 className="profile-name">{user.name}</h3>
                <p className="profile-role">{role === 'ADMIN' ? 'Administrator' : role.charAt(0) + role.slice(1).toLowerCase()}</p>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <Link key={item.path} to={item.path} className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}>
                        {item.icon}
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="logout-btn-container">
                <button onClick={handleLogout} className="logout-sidebar-btn">
                    <LogOut size={18} />
                    <span>LOGOUT</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
