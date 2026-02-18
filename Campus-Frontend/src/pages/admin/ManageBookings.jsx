import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { bookingAPI, resourceAPI, userAPI } from '../../services/api';
import { CheckCircle, XCircle, Clock, User, MapPin, Calendar, BookOpen } from 'lucide-react';
import '../../components/Dashboard.css';

const ManageBookings = () => {
    const [pendingBookings, setPendingBookings] = useState([]);
    const [approvedBookings, setApprovedBookings] = useState([]);
    const [rejectedBookings, setRejectedBookings] = useState([]);
    const [resources, setResources] = useState({});
    const [faculties, setFaculties] = useState({});
    const [loading, setLoading] = useState(true);
    const [rejectingId, setRejectingId] = useState(null);
    const [reason, setReason] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [bookData, resData, userData] = await Promise.all([
                    bookingAPI.getAll(),
                    resourceAPI.getAll(),
                    userAPI.getAll()
                ]);

                const resMap = {};
                resData.data.forEach(r => resMap[r.id] = r);
                setResources(resMap);

                const userMap = {};
                userData.data.forEach(u => userMap[u.id] = u);
                setFaculties(userMap);

                setPendingBookings(bookData.data.filter(b => b.status === 'PENDING'));
                setApprovedBookings(bookData.data.filter(b => b.status === 'APPROVED'));
                setRejectedBookings(bookData.data.filter(b => b.status === 'REJECTED'));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleAction = async (id, status) => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        try {
            if (status === 'APPROVED') {
                await bookingAPI.approve(id, user.id);
                const movedBooking = pendingBookings.find(b => b.id === id);
                if (movedBooking) {
                    setPendingBookings(pendingBookings.filter(b => b.id !== id));
                    setApprovedBookings([...approvedBookings, { ...movedBooking, status: 'APPROVED' }]);
                }
                alert(`Booking approved successfully!`);
            } else {
                setRejectingId(id);
            }
        } catch (err) {
            alert('Operation failed');
        }
    };

    const submitRejection = async () => {
        if (!reason.trim()) return alert("Please provide a reason for rejection.");
        try {
            await bookingAPI.reject(rejectingId, reason);
            const movedBooking = pendingBookings.find(b => b.id === rejectingId);
            if (movedBooking) {
                setPendingBookings(pendingBookings.filter(b => b.id !== rejectingId));
                setRejectedBookings([...rejectedBookings, { ...movedBooking, status: 'REJECTED', rejectionReason: reason }]);
            }
            alert("Booking rejected successfully.");
            setRejectingId(null);
            setReason('');
        } catch (err) {
            alert("Failed to reject booking");
        }
    };

    const BookingCard = ({ book, showActions = false }) => (
        <div key={book.id} className="stat-card" style={{ borderLeft: book.status === 'PENDING' ? '5px solid #F59E0B' : (book.status === 'APPROVED' ? '5px solid #10B981' : '5px solid #EF4444'), padding: '25px', display: 'block', marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <div>
                    <h3 style={{ margin: '0 0 5px 0', fontSize: '18px', color: '#1a1a1a' }}>{book.eventName}</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', color: '#64748b', fontSize: '13px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><User size={14} /> Requested By: {faculties[book.facultyId]?.name || 'Faculty Member'}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> {resources[book.resourceId]?.name || 'Unknown Location'}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14} /> {book.eventDate}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {book.timeSlot}</span>
                    </div>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '20px', background: book.status === 'PENDING' ? '#fffbeb' : (book.status === 'APPROVED' ? '#f0fdf4' : '#fef2f2'), color: book.status === 'PENDING' ? '#b45309' : (book.status === 'APPROVED' ? '#166534' : '#991b1b') }}>
                    {book.status}
                </span>
            </div>

            {book.description && (
                <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 20px 0', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                    <strong>Note:</strong> {book.description}
                </p>
            )}

            {book.status === 'REJECTED' && book.rejectionReason && (
                <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', padding: '12px', borderRadius: '10px', marginBottom: '20px' }}>
                    <p style={{ margin: 0, fontSize: '13px', color: '#991b1b', fontWeight: 600 }}>Reason for Rejection:</p>
                    <p style={{ margin: 0, fontSize: '13px', color: '#b91c1c' }}>{book.rejectionReason}</p>
                </div>
            )}

            {showActions && book.status === 'PENDING' && (
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <button
                        onClick={() => handleAction(book.id, 'REJECTED')}
                        style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '8px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <XCircle size={16} /> Reject
                    </button>
                    <button
                        onClick={() => handleAction(book.id, 'APPROVED')}
                        style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <CheckCircle size={16} /> Approve
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <Layout role="ADMIN">
            <div style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#1a1a1a', margin: '0 0 8px 0' }}>Booking Management</h2>
                <p style={{ color: '#64748b', fontSize: '15px' }}>Approve new requests or monitor the confirmed campus schedule.</p>
            </div>

            <div style={{ marginBottom: '50px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#f59e0b', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Clock size={20} /> Pending Requests
                </h3>
                {pendingBookings.length > 0 ? (
                    pendingBookings.map(book => <BookingCard key={book.id} book={book} showActions />)
                ) : (
                    <p style={{ color: '#94a3b8', fontSize: '14px', fontStyle: 'italic' }}>No pending requests found.</p>
                )}
            </div>

            <div style={{ marginTop: '30px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#10b981', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckCircle size={20} /> Approved Schedule
                </h3>
                {approvedBookings.length > 0 ? (
                    approvedBookings.map(book => <BookingCard key={book.id} book={book} />)
                ) : (
                    <p style={{ color: '#94a3b8', fontSize: '14px', fontStyle: 'italic' }}>No approved bookings yet.</p>
                )}
            </div>

            <div style={{ marginTop: '30px', marginBottom: '100px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ef4444', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <XCircle size={20} /> Rejected Requests
                </h3>
                {rejectedBookings.length > 0 ? (
                    rejectedBookings.map(book => <BookingCard key={book.id} book={book} />)
                ) : (
                    <p style={{ color: '#94a3b8', fontSize: '14px', fontStyle: 'italic' }}>No rejected requests found.</p>
                )}
            </div>

            {/* Rejection Modal */}
            {rejectingId && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                    <div style={{ background: 'white', padding: '30px', borderRadius: '24px', maxWidth: '500px', width: '100%', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: '0 0 15px 0' }}>Reason for Rejection</h3>
                        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>Please explain why this booking is being denied. This message will be sent to the faculty and student.</p>

                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="e.g., Hall already booked for maintenance, Another event scheduled..."
                            style={{ width: '100%', minHeight: '120px', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '14px', marginBottom: '20px', resize: 'none', outline: 'none' }}
                        />

                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => { setRejectingId(null); setReason(''); }}
                                style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitRejection}
                                style={{ background: '#ef4444', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}
                            >
                                Confirm Rejection
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default ManageBookings;
