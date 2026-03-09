import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Grid, Paper, CircularProgress, Alert, Card, CardContent, Divider, Button
} from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import {
    PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line
} from 'recharts';
import axios from 'axios';
import { generateMentalHealthReport, generateUtilizationReport, generateHighRiskReport } from '../utils/reportGenerator';

const Analytics = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [mentalHealthData, setMentalHealthData] = useState([]);
    const [highRiskStudents, setHighRiskStudents] = useState([]);
    const [appointmentData, setAppointmentData] = useState(null);
    const [screeningsOverTime, setScreeningsOverTime] = useState([]);
    const [departmentHeatmap, setDepartmentHeatmap] = useState([]);

    const COLORS = ['#10b981', '#fbbf24', '#f97316', '#ef4444'];

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);

                const token = sessionStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };

                // Fetch Mental Health Status
                const mhRes = await axios.get('/api/analytics/mental-health-status', config);
                const transformedMhData = [
                    { name: 'Minimal', value: mhRes.data.minimal || 0 },
                    { name: 'Mild', value: mhRes.data.mild || 0 },
                    { name: 'Moderate', value: mhRes.data.moderate || 0 },
                    { name: 'Severe', value: mhRes.data.severe || 0 },
                ];
                setMentalHealthData(transformedMhData);

                // Fetch High Risk Students
                const hrRes = await axios.get('/api/analytics/high-risk-students', config);
                setHighRiskStudents(hrRes.data);

                // Fetch Appointment Utilization
                const appRes = await axios.get('/api/analytics/appointment-utilization', config);
                setAppointmentData(appRes.data);

                // Fetch Screenings Over Time
                const sotRes = await axios.get('/api/analytics/screenings-over-time', config);
                setScreeningsOverTime(sotRes.data);

                // Fetch Department Heatmap
                const dhRes = await axios.get('/api/analytics/department-heatmap', config);
                setDepartmentHeatmap(dhRes.data);

            } catch (err) {
                console.error("Analytics fetch error:", err);
                setError("Failed to load analytics data. Ensure you are logged in as a Counsellor.");
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
            <CircularProgress />
        </Box>
    );

    if (error) return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;

    const apptDisplayData = [
        { name: 'Completed', count: appointmentData?.completed || 0 },
        { name: 'Pending', count: appointmentData?.pending || 0 },
        { name: 'Approved', count: appointmentData?.approved || 0 },
        { name: 'Cancelled', count: appointmentData?.cancelled || 0 },
    ];

    // Removing CSV logic as we are switching to full DOCX reports

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom color="text.primary">
                Reports and Analytics
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
                Counsellor overview of student mental health trends and system utilization.
            </Typography>

            <Grid container spacing={4}>
                {/* 1. Mental Health Status Report */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3, height: '100%', borderRadius: 4, position: 'relative' }}>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                            <Typography variant="h6" fontWeight="bold">
                                Mental Health Status Report
                            </Typography>
                            <Button
                                size="small"
                                variant="outlined"
                                startIcon={<DownloadIcon />}
                                onClick={() => generateMentalHealthReport(mentalHealthData)}
                            >
                                Generate Full Report (Docx)
                            </Button>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Aggregated stress, anxiety, and burnout levels across all student screenings.
                        </Typography>
                        <Box sx={{ height: 350, width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={mentalHealthData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {mentalHealthData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </Grid>

                {/* 3. Appointment Utilization Report */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3, height: '100%', borderRadius: 4, position: 'relative' }}>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                            <Typography variant="h6" fontWeight="bold">
                                Appointment Utilization Report
                            </Typography>
                            <Button
                                size="small"
                                variant="outlined"
                                startIcon={<DownloadIcon />}
                                onClick={() => generateUtilizationReport(appointmentData)}
                            >
                                Generate Full Report (Docx)
                            </Button>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Tracks the status of your counseling sessions and engagement.
                            <br />
                            Total Appointments: <strong>{appointmentData?.total || 0}</strong> ({appointmentData?.emergency || 0} Emergency)
                        </Typography>
                        <Box sx={{ height: 350, width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={apptDisplayData}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                                    <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </Grid>

                {/* 2. High-Risk Student Identification API */}
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 4, position: 'relative' }}>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                            <Typography variant="h6" fontWeight="bold">
                                High-Risk Student Identification
                            </Typography>
                            <Button
                                size="small"
                                variant="outlined"
                                startIcon={<DownloadIcon />}
                                disabled={highRiskStudents.length === 0}
                                color="error"
                                onClick={() => generateHighRiskReport(highRiskStudents)}
                            >
                                Generate Action Plan (Docx)
                            </Button>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Highlights students requiring urgent attention based on recent severe assessment scores or flagged chat logs.
                        </Typography>

                        {highRiskStudents.length === 0 ? (
                            <Alert severity="success">No recent high-risk patterns detected.</Alert>
                        ) : (
                            <Grid container spacing={3}>
                                {highRiskStudents.map((item, index) => (
                                    <Grid item xs={12} md={6} lg={4} key={index}>
                                        <Card variant="outlined" sx={{ borderColor: '#ef4444', bgcolor: 'rgba(239, 68, 68, 0.05)' }}>
                                            <CardContent>
                                                <Typography variant="subtitle1" fontWeight="bold" color="error">
                                                    {item.student?.name || 'Unknown Student'}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                                    ID: {item.student?.universityId || 'N/A'} | {item.student?.department || 'N/A'}
                                                </Typography>
                                                <Divider sx={{ my: 1 }} />
                                                <Typography variant="body2" fontWeight="medium">
                                                    Reason for Alert:
                                                </Typography>
                                                <Typography variant="body2" color="error.dark">
                                                    {item.reason}
                                                </Typography>
                                                <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                                                    Detected: {new Date(item.date).toLocaleString()}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Paper>
                </Grid>

                {/* 4. Screenings Over Time Report */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3, height: '100%', borderRadius: 4 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                            <Typography variant="h6" fontWeight="bold">
                                Screenings Over Time (30 Days)
                            </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Tracks the volume of mental health assessments taken over the last month to spot spikes in campus stress.
                        </Typography>
                        <Box sx={{ height: 350, width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={screeningsOverTime}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                                    <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </Grid>

                {/* 5. Department Alert Heatmap */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3, height: '100%', borderRadius: 4 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                            <Typography variant="h6" fontWeight="bold">
                                Department Alert Heatmap
                            </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Identifies which university faculties have the highest concentration of high-risk students.
                        </Typography>
                        <Box sx={{ height: 350, width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={departmentHeatmap}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                    layout="vertical"
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" allowDecimals={false} />
                                    <YAxis type="category" dataKey="department" width={140} tick={{ fontSize: 11 }} />
                                    <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                                    <Bar dataKey="highRiskCount" fill="#f43f5e" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </Grid>

            </Grid>
        </Box>
    );
};

export default Analytics;
