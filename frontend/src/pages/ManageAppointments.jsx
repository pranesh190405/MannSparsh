import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const ManageAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAppointments = async () => {
        try {
            const res = await api.get('/appointments');
            setAppointments(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Failed to update status');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleStatusUpdate = async (id, status) => {
        try {
            await api.put(`/appointments/${id}`, { status });
            // Refresh list
            fetchAppointments();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Failed to update status');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Appointments</h1>
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                {appointments.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No appointments found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 font-semibold text-gray-600">Student</th>
                                    <th className="px-6 py-3 font-semibold text-gray-600">Date & Time</th>
                                    <th className="px-6 py-3 font-semibold text-gray-600">Mode</th>
                                    <th className="px-6 py-3 font-semibold text-gray-600">Status</th>
                                    <th className="px-6 py-3 font-semibold text-gray-600">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {appointments.map((appt) => (
                                    <tr key={appt._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{appt.student?.name}</div>
                                            <div className="text-sm text-gray-500">{appt.student?.department} ({appt.student?.year})</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>{new Date(appt.date).toLocaleDateString()}</div>
                                            <div className="text-sm text-gray-500">{appt.timeSlot}</div>
                                        </td>
                                        <td className="px-6 py-4 capitalize">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${appt.mode === 'online' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                                {appt.mode}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide 
                                                ${appt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                    appt.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                        appt.status === 'completed' ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {appt.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {appt.status === 'pending' ? (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleStatusUpdate(appt._id, 'confirmed')}
                                                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm font-medium"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(appt._id, 'cancelled')}
                                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            ) : appt.status === 'confirmed' && appt.meetLink ? (
                                                <Link
                                                    to={appt.meetLink}
                                                    className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-medium"
                                                >
                                                    🎥 Join Meeting
                                                </Link>
                                            ) : (
                                                <span className="text-gray-400 text-sm">No action</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageAppointments;
