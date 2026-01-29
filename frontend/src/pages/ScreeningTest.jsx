import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const questions = [
    "In the last month, how often have you been upset because of something that happened unexpectedly?",
    "In the last month, how often have you felt that you were unable to control the important things in your life?",
    "In the last month, how often have you felt nervous and \"stressed\"?",
    "In the last month, how often have you felt confident about your ability to handle your personal problems?",
    "In the last month, how often have you felt that things were going your way?",
    "In the last month, how often have you found that you could not cope with all the things that you had to do?",
    "In the last month, how often have you been able to control irritations in your life?",
    "In the last month, how often have you felt that you were on top of things?",
    "In the last month, how often have you been angered because of things that were outside of your control?",
    "In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?"
];

// PSS-10 Scoring:
// Questions 0, 1, 2, 5, 8, 9 are scored: 0=Never, 1=Almost Never, 2=Sometimes, 3=Fairly Often, 4=Very Often
// Questions 3, 4, 6, 7 are REVERSE scored: 4=Never, 3=Almost Never, 2=Sometimes, 1=Fairly Often, 0=Very Often

const reverseIndices = [3, 4, 6, 7];

const ScreeningTest = () => {
    const [answers, setAnswers] = useState({});
    const [score, setScore] = useState(null);
    const navigate = useNavigate();

    const handleOptionChange = (qIndex, value) => {
        setAnswers({ ...answers, [qIndex]: parseInt(value) });
    };

    const calculateScore = () => {
        let total = 0;
        questions.forEach((_, index) => {
            let val = answers[index] || 0;
            if (reverseIndices.includes(index)) {
                val = 4 - val;
            }
            total += val;
        });
        setScore(total);
    };

    const getInterpretation = (score) => {
        if (score <= 13) return { level: 'Low Stress', color: 'text-green-600', advice: "You're doing great! Keep up your healthy coping mechanisms." };
        if (score <= 26) return { level: 'Moderate Stress', color: 'text-yellow-600', advice: "You have some stress. Consider mindfulness exercises or talking to a friend." };
        return { level: 'High Stress', color: 'text-red-600', advice: "Your stress levels are high. We strongly recommend booking a session with a counsellor." };
    };

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Mental Health Screening</h1>
            <p className="text-gray-600 mb-8">Perceived Stress Scale (PSS-10). Please answer based on your feelings in the last month.</p>

            {!score && (
                <div className="bg-white p-8 rounded-xl shadow-md space-y-8">
                    {questions.map((q, index) => (
                        <div key={index}>
                            <p className="font-medium text-gray-800 mb-3">{index + 1}. {q}</p>
                            <div className="grid grid-cols-5 gap-2 text-sm">
                                {['Never', 'Almost Never', 'Sometimes', 'Fairly Often', 'Very Often'].map((option, val) => (
                                    <label key={val} className="flex flex-col items-center cursor-pointer p-2 rounded hover:bg-gray-50 border border-transparent hover:border-gray-200 transition">
                                        <input
                                            type="radio"
                                            name={`q-${index}`}
                                            value={val}
                                            onChange={() => handleOptionChange(index, val)}
                                            checked={answers[index] === val}
                                            className="mb-2"
                                        />
                                        <span className="text-center text-gray-600">{option}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={calculateScore}
                        disabled={Object.keys(answers).length < 10}
                        className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        See Results
                    </button>
                </div>
            )}

            {score !== null && (
                <div className="bg-white p-8 rounded-xl shadow-md text-center">
                    <h2 className="text-2xl font-bold mb-4">Your Stress Score: {score}</h2>
                    <div className={`text-4xl font-extrabold mb-4 ${getInterpretation(score).color}`}>
                        {getInterpretation(score).level}
                    </div>
                    <p className="text-lg text-gray-700 mb-8">{getInterpretation(score).advice}</p>

                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => setScore(null)}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                        >
                            Retake Test
                        </button>
                        {score > 13 && (
                            <button
                                onClick={() => navigate('/student/book')}
                                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-indigo-700 transition shadow-md"
                            >
                                Book Appointment
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScreeningTest;
