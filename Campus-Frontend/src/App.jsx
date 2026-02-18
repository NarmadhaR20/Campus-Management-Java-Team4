import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/student/StudentDashboard';
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageBookings from './pages/admin/ManageBookings';
import SendRequest from './pages/student/SendRequest';
import MyStatus from './pages/student/MyStatus';
import ViewRequests from './pages/faculty/ViewRequests';
import CreateBooking from './pages/faculty/CreateBooking';
import FacultyBookings from './pages/faculty/FacultyBookings';
import Resources from './pages/shared/Resources';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/login/:role" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/admin/dashboard" element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/resources" element={<ProtectedRoute role="ADMIN"><Resources role="ADMIN" /></ProtectedRoute>} />
                <Route path="/admin/bookings" element={<ProtectedRoute role="ADMIN"><ManageBookings /></ProtectedRoute>} />
                <Route path="/admin/users" element={<ProtectedRoute role="ADMIN"><ManageUsers /></ProtectedRoute>} />

                <Route path="/faculty/dashboard" element={<ProtectedRoute role="FACULTY"><FacultyDashboard /></ProtectedRoute>} />
                <Route path="/faculty/resources" element={<ProtectedRoute role="FACULTY"><Resources role="FACULTY" /></ProtectedRoute>} />
                <Route path="/faculty/requests" element={<ProtectedRoute role="FACULTY"><ViewRequests /></ProtectedRoute>} />
                <Route path="/faculty/bookings" element={<ProtectedRoute role="FACULTY"><FacultyBookings /></ProtectedRoute>} />
                <Route path="/faculty/create-booking" element={<ProtectedRoute role="FACULTY"><CreateBooking /></ProtectedRoute>} />

                <Route path="/student/dashboard" element={<ProtectedRoute role="STUDENT"><StudentDashboard /></ProtectedRoute>} />
                <Route path="/student/resources" element={<ProtectedRoute role="STUDENT"><Resources role="STUDENT" /></ProtectedRoute>} />
                <Route path="/student/send-request" element={<ProtectedRoute role="STUDENT"><SendRequest /></ProtectedRoute>} />
                <Route path="/student/status" element={<ProtectedRoute role="STUDENT"><MyStatus /></ProtectedRoute>} />
            </Routes>
        </Router>
    );
}

export default App;
