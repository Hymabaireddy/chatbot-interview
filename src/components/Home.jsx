import React, { useState, useRef, useEffect } from 'react';

// --- SVG Icon Components ---
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus-circle">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send-horizontal">
    <path d="m3 3 3 9-3 9 19-9Z" />
    <path d="M6 12h16" />
  </svg>
);

const BotIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bot">
        <rect width="18" height="10" x="3" y="11" rx="2" />
        <circle cx="12" cy="5" r="2" />
        <path d="M12 7v4" />
        <line x1="8" x2="8" y1="16" y2="16" />
        <line x1="16" x2="16" y1="16" y2="16" />
    </svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-circle">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="10" r="3" />
        <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
    </svg>
);

const RestartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-refresh-cw">
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
        <path d="M21 3v5h-5"/>
        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
        <path d="M3 21v-5h5"/>
    </svg>
);

const DashboardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-dashboard">
        <rect width="7" height="9" x="3" y="3" rx="1"/>
        <rect width="7" height="5" x="14" y="3" rx="1"/>
        <rect width="7" height="9" x="14" y="12" rx="1"/>
        <rect width="7" height="5" x="3" y="16" rx="1"/>
    </svg>
);

// --- Dashboard Component ---
const Dashboard = ({ results, switchToChat }) => (
    <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Interview Dashboard</h2>
            <div className="bg-white border border-gray-300 rounded-lg shadow-md">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-gray-300 text-xs text-gray-600 uppercase">
                        <tr>
                            <th scope="col" className="px-6 py-3">Candidate Name</th>
                            <th scope="col" className="px-6 py-3">Email</th>
                            <th scope="col" className="px-6 py-3">Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.length > 0 ? (
                            results.map((result) => (
                                <tr key={result.id} className="border-b border-gray-300 hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium whitespace-nowrap text-gray-800">{result.name}</td>
                                    <td className="px-6 py-4 text-gray-600">{result.email}</td>
                                    <td className="px-6 py-4 font-bold text-gray-800">{result.percentage}%</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center py-10 text-gray-500">No interview results yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
             <button onClick={switchToChat} className="mt-6 flex items-center gap-2 text-sm bg-black text-white hover:bg-gray-800 px-4 py-2 rounded-full transition-colors">
                Back to Chatbot
            </button>
        </div>
    </div>
);


// --- Main App Component ---
const App = () => {
    const initialState = {
        chatMessages: [{ sender: 'bot', text: "Hello! I am your AI interviewer. Please upload your resume in PDF format to begin." }],
        userInput: '',
        isLoading: false,
        error: '',
        interviewState: 'start', // 'start', 'generating_questions', 'in_progress', 'evaluating', 'finished'
        questions: [],
        currentQuestionIndex: 0,
        timer: null,
        userAnswers: [],
        resumeContext: null,
        currentUser: { name: null, email: null },
        view: 'chatbot', // 'chatbot', 'dashboard'
        dashboardResults: [],
    };

    const [chatMessages, setChatMessages] = useState(initialState.chatMessages);
    const [userInput, setUserInput] = useState(initialState.userInput);
    const [isLoading, setIsLoading] = useState(initialState.isLoading);
    const [error, setError] = useState(initialState.error);
    const [interviewState, setInterviewState] = useState(initialState.interviewState);
    const [questions, setQuestions] = useState(initialState.questions);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(initialState.currentQuestionIndex);
    const [timer, setTimer] = useState(initialState.timer);
    const [userAnswers, setUserAnswers] = useState(initialState.userAnswers);
    const [resumeContext, setResumeContext] = useState(initialState.resumeContext);
    const [currentUser, setCurrentUser] = useState(initialState.currentUser);
    const [view, setView] = useState(initialState.view);
    const [dashboardResults, setDashboardResults] = useState(initialState.dashboardResults);

    const fileInputRef = useRef(null);
    const chatEndRef = useRef(null);
    const timerIntervalRef = useRef(null);

    // NOTE: The API key is required for calling the Gemini API
    const API_KEY = "AIzaSyASxxRSRVIa8yEmdEmtpd7eB-ErezcOjdw"; 

    useEffect(() => {
        // Load dashboard data from localStorage on initial render
        try {
            const savedResults = localStorage.getItem('interviewDashboardResults');
            if (savedResults) {
                setDashboardResults(JSON.parse(savedResults));
            }
        } catch (e) {
            console.error("Failed to load dashboard results:", e);
        }
    }, []);

    useEffect(() => {
        if (view === 'chatbot') {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatMessages, view]);

    useEffect(() => {
        if (interviewState === 'in_progress' && currentQuestionIndex < questions.length) {
            const timeLimit = questions[currentQuestionIndex].timeLimit;
            setTimer(timeLimit);
            
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = setInterval(() => {
                setTimer(prev => {
                    if (prev <= 1) {
                        clearInterval(timerIntervalRef.current);
                        handleNextQuestion(true); // Auto-submit when timer runs out (isTimeout = true)
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timerIntervalRef.current);
    }, [interviewState, currentQuestionIndex, questions]);


    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            setError('Please upload a valid PDF file.');
            return;
        }

        setError('');
        setIsLoading(true);
        setInterviewState('generating_questions');
        setChatMessages(prev => [...prev, { sender: 'user', text: `Uploading resume: ${file.name}` }]);

        try {
            const base64Data = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result.split(',')[1]);
                reader.onerror = (error) => reject(error);
            });
            
            const resumeContentForAPI = { inlineData: { mimeType: "application/pdf", data: base64Data } };
            setResumeContext(resumeContentForAPI);

            const prompt = `You are an AI hiring assistant. Your first task is to analyze the provided resume.
            1. Validate if it contains a name, an email, and a phone number.
            2. If any are missing, respond ONLY with a JSON object like: {"validation": {"success": false, "missing": ["field1", "field2"]}}.
            3. If all information is present, proceed to the next step. Extract the candidate's name and email.
            4. Generate exactly 6 interview questions based on the resume's skills and projects.
            5. The questions must include 2 'easy' (20 seconds), 2 'medium' (60 seconds), and 2 'hard' (120 seconds).
            6. Respond ONLY with a JSON object like: {"validation": {"success": true, "name": "John Doe", "email": "john.doe@example.com"}, "questions": [{"question": "...", "difficulty": "easy", "timeLimit": 20}, ...]}. Do not include any other text, explanation or markdown formatting.`;

            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;
            const payload = {
                contents: [{ role: "user", parts: [{ text: prompt }, resumeContentForAPI] }],
                 generationConfig: { responseMimeType: "application/json" },
            };

            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

            if (!response.ok) throw new Error(`API call failed with status: ${response.status}`);
            
            const result = await response.json();
            const parsedResult = JSON.parse(result.candidates[0].content.parts[0].text);
            const generatedQuestions = parsedResult.questions || [];

            if (!parsedResult.validation.success) {
                const missingFields = parsedResult.validation.missing.join(', ');
                const errorMessage = `Resume validation failed. Missing required fields: ${missingFields}. Please upload a revised resume.`;
                setError(errorMessage);
                setChatMessages(prev => [...prev, { sender: 'bot', text: errorMessage }]);
                setInterviewState('start');
            } else if (generatedQuestions.length === 0) {
                const errorMessage = "I couldn't generate relevant questions from your resume. Please try a different resume or contact support.";
                setError(errorMessage);
                setChatMessages(prev => [...prev, { sender: 'bot', text: errorMessage }]);
                setInterviewState('start');
            }
            else {
                setCurrentUser({ name: parsedResult.validation.name, email: parsedResult.validation.email });
                setQuestions(generatedQuestions);

                // 1. Welcome Message
                const welcomeMessage = `Hello ${parsedResult.validation.name}! I've reviewed your resume and generated ${generatedQuestions.length} questions for our interview. We'll start now. Good luck!`;

                // 2. First Question Message with metadata
                const firstQuestion = generatedQuestions[0];
                const botQuestionMessage = { 
                    sender: 'bot', 
                    text: `**${firstQuestion.question}**`,
                    isQuestion: true,
                    questionIndex: 0,
                    difficulty: firstQuestion.difficulty,
                    isAnswered: false,
                };

                setChatMessages(prev => [
                    ...prev, 
                    { sender: 'bot', text: welcomeMessage },
                    botQuestionMessage 
                ]);
                setInterviewState('in_progress');
            }

        } catch (err) {
            console.error(err);
            const errorMessage = "Sorry, I couldn't process the resume or generate questions. Please try again.";
            setError(errorMessage);
            setChatMessages(prev => [...prev, { sender: 'bot', text: errorMessage }]);
            setInterviewState('start');
        } finally {
            setIsLoading(false);
            event.target.value = null;
        }
    };
    
    const handleNextQuestion = (isTimeout = false, userAnswer = '') => {
        const currentQuestionText = questions[currentQuestionIndex].question;
        const isLastQuestion = currentQuestionIndex >= questions.length - 1;
        let answerToLog = isTimeout ? "No answer provided within the time limit." : userAnswer;

        // Batch all chat message updates
        setChatMessages(prevMessages => {
            // 1. Mark current question as answered
            let updatedMessages = prevMessages.map(msg => 
                (msg.isQuestion && msg.questionIndex === currentQuestionIndex)
                ? { ...msg, isAnswered: true }
                : msg
            );

            // 2. Add user's answer OR timeout message
            if (!isTimeout && userAnswer) {
                updatedMessages.push({ sender: 'user', text: userAnswer });
            } else if (isTimeout) {
                updatedMessages.push({ sender: 'bot', text: `Time's up! Recording your response for question ${currentQuestionIndex + 1} as: *${answerToLog}*` });
            }

            // 3. Add the next question if applicable
            if (!isLastQuestion) {
                const nextQuestionIndex = currentQuestionIndex + 1;
                const nextQuestion = questions[nextQuestionIndex];
                updatedMessages.push({ 
                    sender: 'bot', 
                    text: `**${nextQuestion.question}**`,
                    isQuestion: true,
                    questionIndex: nextQuestionIndex,
                    difficulty: nextQuestion.difficulty,
                    isAnswered: false,
                });
            }
            
            return updatedMessages;
        });
        
        // Record the final answer
        const finalAnswers = [...userAnswers, { question: currentQuestionText, answer: answerToLog }];
        setUserAnswers(finalAnswers);
        
        // Clear timer
        clearInterval(timerIntervalRef.current);

        // Move to next question or end the interview
        if (isLastQuestion) {
            setInterviewState('evaluating');
            evaluatePerformance(finalAnswers); 
        } else {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        const currentInput = userInput;
        if (!currentInput.trim() || isLoading || interviewState !== 'in_progress') return;
        
        // Clear input field immediately for better UX
        setUserInput('');
        
        // Let handleNextQuestion manage all chat updates
        handleNextQuestion(false, currentInput);
    };

    const evaluatePerformance = async (finalAnswers) => {
        setIsLoading(true);
        setChatMessages(prev => [...prev, { sender: 'bot', text: "Thank you for your answers. I am now evaluating your performance..." }]);
        
        try {
            const answersText = finalAnswers.map((item, index) => `Question ${index + 1}: ${item.question}\nAnswer: ${item.answer}`).join('\n\n');
            const prompt = `You are an expert technical interviewer. The candidate's resume is provided. Below are the questions asked and the candidate's answers. Provide a brief, constructive performance summary in 2-3 paragraphs. Analyze the answers for technical accuracy, clarity, and problem-solving skills. Conclude with an overall assessment and a final score as a percentage.
            Respond ONLY with a JSON object like: {"evaluation": "...", "percentage": 85}. Do not include any other text, explanation or markdown formatting.
            
            ${answersText}`;
            
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;
            const payload = {
                contents: [{ role: "user", parts: [{ text: prompt }, resumeContext] }],
                generationConfig: { responseMimeType: "application/json" },
            };
            
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) throw new Error(`API call failed with status: ${response.status}`);
            
            const result = await response.json();
            const parsedResult = JSON.parse(result.candidates[0].content.parts[0].text);
            const { evaluation, percentage } = parsedResult;

            const finalMessage = `**Interview Complete! Your score is ${percentage}%.**\n\nHere is your feedback:\n\n${evaluation}`;
            setChatMessages(prev => [...prev, { sender: 'bot', text: finalMessage }]);

            // Save result to dashboard data and localStorage
            const newResult = { id: Date.now(), ...currentUser, percentage };
            const updatedResults = [...dashboardResults, newResult];
            setDashboardResults(updatedResults);
            localStorage.setItem('interviewDashboardResults', JSON.stringify(updatedResults));

        } catch (err) {
            console.error(err);
            const errorMessage = "Sorry, I couldn't generate your performance review. The interview is complete.";
            setChatMessages(prev => [...prev, { sender: 'bot', text: errorMessage }]);
        } finally {
            setIsLoading(false);
            setInterviewState('finished');
        }
    };

    const handleRestart = () => {
        setChatMessages(initialState.chatMessages);
        setUserInput(initialState.userInput);
        setIsLoading(initialState.isLoading);
        setError(initialState.error);
        setInterviewState(initialState.interviewState);
        setQuestions(initialState.questions);
        setCurrentQuestionIndex(initialState.currentQuestionIndex);
        setTimer(initialState.timer);
        setUserAnswers(initialState.userAnswers);
        setResumeContext(initialState.resumeContext);
        setCurrentUser(initialState.currentUser);
        clearInterval(timerIntervalRef.current);
        setView('chatbot');
    };

    const difficultyColors = {
        easy: 'text-gray-700 border-gray-400 bg-gray-100',
        medium: 'text-gray-800 border-gray-500 bg-gray-200',
        hard: 'text-white border-gray-700 bg-gray-800',
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50 text-gray-800 font-sans">
            <header className="bg-white/80 backdrop-blur-sm border-b border-gray-300 p-4 flex justify-between items-center">
                <div className="w-1/3"></div>
                <h1 className="text-xl font-bold text-center text-gray-800 w-1/3">AI Interview Chatbot</h1>
                <div className="w-1/3 flex justify-end">
                    {view === 'chatbot' && (
                        <button onClick={() => setView('dashboard')} className="flex items-center gap-2 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors" title="View Dashboard">
                            <DashboardIcon />
                        </button>
                    )}
                </div>
            </header>
            
            {view === 'dashboard' ? (
                <Dashboard results={dashboardResults} switchToChat={() => setView('chatbot')} />
            ) : (
                <>
                    <main className="flex-1 overflow-y-auto p-4 md:p-6">
                        <div className="max-w-3xl mx-auto space-y-6">
                            {chatMessages.map((msg, index) => (
                                <div key={index} className={`flex items-start gap-4 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                                    {msg.sender === 'bot' && (
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-500/20 flex items-center justify-center border border-gray-500 text-gray-600">
                                            <BotIcon />
                                        </div>
                                    )}
                                    <div className="flex flex-col w-full max-w-md md:max-w-lg">
                                        <div className={`p-3 rounded-2xl shadow-md ${msg.sender === 'user' ? 'bg-black text-white rounded-br-none self-end' : 'bg-white border border-gray-200 rounded-bl-none self-start'}`}>
                                             <p className="text-sm leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\\(.?)\\/g, '<strong>$1</strong>').replace(/\\(.?)\\/g, '<strong>$1</strong>') }}></p>
                                        
                                            {/* --- TIMER AND QUESTION INFO MOVED INSIDE BUBBLE --- */}
                                            {msg.isQuestion && !msg.isAnswered && (
                                                <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                                                    <div className="flex items-center gap-4">
                                                        <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full border ${difficultyColors[msg.difficulty]}`}>
                                                            {msg.difficulty}
                                                        </span>
                                                    </div>
                                                    <div className={`text-lg font-extrabold p-1 px-3 rounded-full shadow-inner 
                                                        ${timer <= 10 ? 'bg-red-100 text-red-700 animate-pulse border border-red-200' : 'bg-gray-100 text-gray-700 border border-gray-300'} 
                                                        transition-colors duration-500`}
                                                    >
                                                        {timer}s
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {msg.sender === 'user' && (
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-500/20 flex items-center justify-center border border-gray-500 text-gray-600">
                                            <UserIcon />
                                        </div>
                                    )}
                                </div>
                            ))}
                            {isLoading && interviewState !== 'in_progress' && (
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-500/20 flex items-center justify-center border border-gray-500 text-gray-600"><BotIcon /></div>
                                    <div className="max-w-md p-3 rounded-2xl bg-white border border-gray-200 rounded-bl-none">
                                        <div className="flex items-center space-x-2">
                                            <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                            <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                            <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>
                    </main>

                    <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-300 p-4">
                        <div className="max-w-3xl mx-auto">
                            {interviewState === 'finished' && (
                                <div className="text-center mb-4">
                                    <button onClick={handleRestart} className="flex items-center gap-2 text-sm bg-black text-white hover:bg-gray-800 px-4 py-2 rounded-full transition-colors mx-auto">
                                        <RestartIcon /> Start New Interview
                                    </button>
                                </div>
                            )}
                            
                            {error && <p className="text-red-600 text-sm mb-2 text-center">{error}</p>}
                            <form onSubmit={handleSendMessage} className={`flex items-center gap-2 bg-white rounded-full p-2 border border-gray-300 focus-within:ring-2 focus-within:ring-gray-500 transition-shadow ${interviewState === 'finished' ? 'hidden' : ''}`}>
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="application/pdf" className="hidden" disabled={interviewState !== 'start'} />
                                <button type="button" onClick={() => fileInputRef.current.click()} className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled={interviewState !== 'start'} aria-label="Upload Resume">
                                    <PlusIcon />
                                </button>
                                <input
                                    type="text"
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    placeholder={
                                        interviewState === 'start' ? "Upload your resume to begin..." :
                                        interviewState === 'in_progress' ? "Type your answer..." :
                                        "Interview has ended."
                                    }
                                    className="flex-1 bg-transparent focus:outline-none px-2 text-sm"
                                    disabled={interviewState !== 'in_progress' || timer === 0}
                                />
                                <button type="submit" className="p-2 rounded-full bg-black text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors" disabled={!userInput.trim() || interviewState !== 'in_progress' || timer === 0} aria-label="Send Message">
                                    <SendIcon />
                                </button>
                            </form>
                        </div>
                    </footer>
                </>
            )}
        </div>
    );
};

export default App;