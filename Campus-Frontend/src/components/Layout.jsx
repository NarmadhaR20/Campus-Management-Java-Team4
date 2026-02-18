import Sidebar from './Sidebar';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import './Dashboard.css';

const Layout = ({ children, role }) => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        authAPI.logout();
        navigate('/login');
    };

    return (
        <div className="layout-container">
            <Sidebar role={role} />
            <div className="content-area">
                <header className="dashboard-header">
                    <div className="header-title-section">
                        <h1>Dashboard Overview</h1>
                    </div>
                    <div className="header-user-badge">
                        <div className="badge-text">
                            <span className="badge-welcome">WELCOME {role}</span>
                            <span className="badge-name">{user.name}</span>
                        </div>
                        <button className="logout-icon-btn" onClick={handleLogout}>
                            <LogOut size={20} />
                        </button>
                    </div>
                </header>
                <main>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
