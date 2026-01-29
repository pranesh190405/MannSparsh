const CounsellorDashboard = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Counsellor Dashboard</h1>
            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Overview</h2>
                <p className="text-gray-600">
                    You have 0 pending appointments today.
                </p>
            </div>
        </div>
    );
};

export default CounsellorDashboard;
