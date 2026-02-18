import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        // Do not send token for login or register endpoints
        if (token && !config.url.includes('/auth/')) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const errorData = error.response?.data;
        if (errorData && typeof errorData === 'object') {
            const message = errorData.message || 'An unexpected error occurred';
            const location = errorData.location ? `\n(Error Location: ${errorData.location})` : '';
            // We'll throw a new error with a formatted message that includes the location
            const formattedError = new Error(`${message}${location}`);
            formattedError.response = error.response; // Preserve the response object
            return Promise.reject(formattedError);
        }
        return Promise.reject(error);
    }
);

const getMockUser = (token) => {
    try {
        const decoded = jwtDecode(token);
        const email = decoded.sub;
        const role = decoded.role;
        const userId = decoded.userId;

        let user = {
            email,
            role,
            name: email.split('@')[0],
            id: userId // Use the real ID from backend token
        };

        // Fallback for hardcoded test accounts if needed
        if (email === 'admin@test.com') {
            user.name = 'Admin User';
            user.id = '69942164324a5e33be5816aa';
        } else if (email === 'faculty@test.com' && !userId) {
            user.name = 'Prof. Richards';
            user.id = 'FACULTY_001';
        } else if (email === 'student@test.com' && !userId) {
            user.name = 'Alice Smith';
            user.id = 'STUDENT_001';
        }

        return user;
    } catch (e) {
        return null;
    }
};

export const authAPI = {
    login: async (credentials, role) => {
        // Pass role to backend as well, some backends use this to verify portal-specific access
        const response = await api.post('/auth/login', { ...credentials, role });
        const token = response.data.token;
        const user = getMockUser(token);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        return { data: { token, user } };
    },
    register: (data) => api.post('/auth/register', data),
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};

export const resourceAPI = {
    getAll: () => api.get('/resources'),
    create: (data) => api.post('/resources', data),
    delete: (id) => api.delete(`/resources/${id}`),
};

export const bookingAPI = {
    getAll: () => api.get('/bookings'),
    getMyBookings: () => api.get('/bookings/my'),
    getFacultyBookings: (facultyId) => api.get(`/bookings/faculty/${facultyId}`),
    getStudentBookings: (studentId) => api.get(`/bookings/student/${studentId}`),
    create: (data) => api.post('/bookings', data),
    approve: (id, adminId) => api.put(`/bookings/${id}/approve`, { adminId }),
    reject: (id, reason) => api.put(`/bookings/${id}/reject`, { reason }),
};

export const requestAPI = {
    create: (data) => api.post('/requests', data),
    getFacultyRequests: (facultyId) => api.get(`/requests/faculty/${facultyId}`),
    getStudentRequests: (studentId) => api.get(`/requests/student/${studentId}`),
    getMyRequests: () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.role === 'STUDENT') return api.get(`/requests/student/${user.id}`);
        if (user?.role === 'FACULTY') return api.get(`/requests/faculty/${user.id}`);
        return Promise.resolve({ data: [] });
    },
    updateStatus: (id, status, reason) => api.put(`/requests/${id}/status`, { status, reason }), // Changed to JSON for reason support
    delete: (id) => api.delete(`/requests/${id}`)
};

export const userAPI = {
    getAll: () => api.get('/users'),
    getFaculties: () => api.get('/users/faculties'),
    delete: (id) => api.delete(`/users/${id}`)
};

export default api;
