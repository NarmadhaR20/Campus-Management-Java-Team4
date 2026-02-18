import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { bookingAPI, resourceAPI } from '../../services/api';
import { Clock, CheckCircle, XCircle, MapPin, Calendar, ClipboardCheck } from 'lucide-react';
import '../../components/Dashboard.css';

const FacultyBookings = () => {
    const [myBookings, setMyBookings] = useState([]);
    const [otherBookings, setOtherBookings] = useState([]);
    const [resources, setResources] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user) return;

                // Fetch Resources
                try {
                    const resData = await resourceAPI.getAll();
                    const resMap = {};
                    resData.data.forEach(r => resMap[r.id] = r);
                    setResources(resMap);
                } catch (resErr) {
                    console.error("Resources Fetch Error:", resErr);
                }

                // Fetch All Bookings and Split
                try {
                    const bookData = await bookingAPI.getAll();
                    const mine = bookData.data.filter(b => b.facultyId === user.id);
                    const others = bookData.data.filter(b => b.facultyId !== user.id && b.status === 'APPROVED');
                    setMyBookings(mine);
                    setOtherBookings(others);
                } catch (bookErr) {
                    console.error("Bookings Fetch Error (split):", bookErr);
                    // Fallback to only fetching MY bookings if GET / (all) fails
                    try {
                        const myBookData = await bookingAPI.getFacultyBookings(user.id);
                        setMyBookings(myBookData.data);
                    } catch (myErr) {
                        console.error("Faculty Private Fetch Error:", myErr);
                    }
                }
            } catch (err) {
                console.error("Fatal Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'APPROVED': return { bg: '#f0fdf4', color: '#166534', icon: <CheckCircle size={14} /> };
            case 'REJECTED': return { bg: '#fef2f2', color: '#991b1b', icon: <XCircle size={14} /> };
            default: return { bg: '#fffbeb', color: '#b45309', icon: <Clock size={14} /> };
        }
    };

    const BookingCard = ({ book, titleSuffix = "" }) => {
        const style = getStatusStyle(book.status);
        return (
            <div key={book.id} className="stat-card" style={{ borderLeft: `5px solid ${style.color}`, padding: '25px', display: 'block', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                    <div>
                        <h3 style={{ margin: '0 0 5px 0', fontSize: '18px', color: '#1a1a1a' }}>{book.eventName} {titleSuffix}</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', color: '#64748b', fontSize: '13px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> {resources[book.resourceId]?.name || 'Resource'}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14} /> {book.eventDate}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {book.timeSlot}</span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, padding: '4px 12px', borderRadius: '20px', background: style.bg, color: style.color }}>
                        {style.icon} {book.status}
                    </div>
                </div>
                {book.description && <p style={{ fontSize: '14px', color: '#475569', margin: '0 0 10px 0' }}>{book.description}</p>}
                {book.status === 'REJECTED' && book.rejectionReason && (
                    <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', padding: '12px', borderRadius: '10px', marginTop: '10px' }}>
                        <p style={{ margin: 0, fontSize: '13px', color: '#991b1b', fontWeight: 600 }}>Admin Feedback:</p>
                        <p style={{ margin: 0, fontSize: '13px', color: '#b91c1c' }}>{book.rejectionReason}</p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <Layout role="FACULTY">
            <div style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#1a1a1a', margin: '0 0 8px 0' }}>Hall Booking Status</h2>
                <p style={{ color: '#64748b', fontSize: '15px' }}>View your personal requests and other approved campus bookings.</p>
            </div>

            <div style={{ marginBottom: '50px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#6200ea', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ClipboardCheck size={20} /> My Booking Status
                </h3>
                {myBookings.length > 0 ? (
                    myBookings.map(book => <BookingCard key={book.id} book={book} />)
                ) : (
                    <p style={{ color: '#94a3b8', fontSize: '14px', fontStyle: 'italic' }}>No personal bookings initiated yet.</p>
                )}
            </div>

            <div style={{ marginTop: '30px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Calendar size={20} /> Other Approved Bookings
                </h3>
                {otherBookings.length > 0 ? (
                    otherBookings.map(book => <BookingCard key={book.id} book={book} />)
                ) : (
                    <p style={{ color: '#94a3b8', fontSize: '14px', fontStyle: 'italic' }}>No other approved bookings found.</p>
                )}
            </div>
        </Layout>
    );
};

export default FacultyBookings;
