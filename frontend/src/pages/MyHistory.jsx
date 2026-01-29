import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const MyHistory = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const res = await api.get('/appointments');
                setAppointments(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">My Appointment History</h1>
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                {appointments.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No appointment history found.</div>
                ) : (
                    <ul>
                        {appointments.map((appt) => (
                            <li key={appt._id} className="border-b border-gray-100 last:border-b-0 p-6 hover:bg-gray-50 transition">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-800">Counsellor: {appt.counsellor?.name}</h3>
                                        <p className="text-gray-500">{new Date(appt.date).toLocaleDateString()} at {appt.timeSlot}</p>
                                        {appt.meetLink && appt.status === 'confirmed' && (
                                            <Link
                                                to={appt.meetLink}
                                                className="inline-flex items-center mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-medium"
                                            >
                                                🎥 Join Video Meeting
                                            </Link>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                        ${appt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                appt.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                    appt.status === 'completed' ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {appt.status}
                                        </span>
                                        <p className="text-xs text-gray-400 mt-2 uppercase">{appt.mode}</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default MyHistory;
