import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { FaPaperPlane, FaRobot, FaCalendarPlus } from 'react-icons/fa';

const AIChat = () => {
    const [messages, setMessages] = useState([
        { role: 'model', text: "Hello! I'm CampusMind AI. I'm here to listen and help you navigate through any stress or anxiety you might be feeling. How can I support you today?" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const detectAppointmentIntent = (text) => {
        const keywords = ['appointment', 'book', 'schedule', 'counsellor', 'counselor', 'session', 'talk to someone', 'professional help'];
        return keywords.some(keyword => text.toLowerCase().includes(keyword));
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const res = await api.post('/ai/chat', { prompt: input });
            const botMessage = {
                role: 'model',
                text: res.data.reply,
                showBooking: detectAppointmentIntent(res.data.reply) || detectAppointmentIntent(input)
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (err) {
            console.error(err);
            const errorMessage = {
                role: 'model',
                text: err.response?.data?.message || "I'm having trouble connecting right now. Please try again later."
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-primary p-4 text-white flex items-center shadow-sm">
                <FaRobot className="text-2xl mr-3" />
                <div>
                    <h2 className="font-bold text-lg">CampusMind AI Companion</h2>
                    <p className="text-xs text-indigo-200">Always here to listen</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                    >
                        <div
                            className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${msg.role === 'user'
                                ? 'bg-primary text-white rounded-br-none'
                                : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                                }`}
                        >
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                        </div>
                        {msg.showBooking && (
                            <button
                                onClick={() => navigate('/student/book')}
                                className="mt-2 flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition shadow-md text-sm font-medium"
                            >
                                <FaCalendarPlus />
                                Book an Appointment
                            </button>
                        )}
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-gray-200 shadow-sm">
                            <div className="flex space-x-2">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-200 flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message here..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    disabled={loading}
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary text-white p-3 rounded-full hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                    <FaPaperPlane />
                </button>
            </form>
        </div>
    );
};

export default AIChat;
