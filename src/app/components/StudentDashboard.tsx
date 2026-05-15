import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { DashboardLayout } from './DashboardLayout';
import { FileText, TrendingUp, MessageCircle, Clock, CheckCircle, XCircle } from 'lucide-react';
import type { Exam, ExamResult, Message, Student } from '../utils/mockData';

export function StudentDashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<Student | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'exams' | 'results' | 'messages'>('overview');
  const [exams, setExams] = useState<Exam[]>([]);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [takingExam, setTakingExam] = useState<Exam | null>(null);
  const [currentAnswers, setCurrentAnswers] = useState<number[]>([]);
  const [examStartTime, setExamStartTime] = useState<number>(0);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      navigate('/');
      return;
    }
    const userData = JSON.parse(user);
    if (userData.userType !== 'student') {
      navigate('/');
      return;
    }
    setCurrentUser(userData);

    // Load data
    const storedExams = JSON.parse(localStorage.getItem('exams') || '[]');
    const studentExams = storedExams.filter((e: Exam) => e.class === userData.class);
    setExams(studentExams);

    const storedResults = JSON.parse(localStorage.getItem('examResults') || '[]');
    const studentResults = storedResults.filter((r: ExamResult) => r.studentId === userData.id);
    setResults(studentResults);

    const storedMessages = JSON.parse(localStorage.getItem('messages') || '[]');
    const studentMessages = storedMessages.filter((m: Message) => m.to === userData.id);
    setMessages(studentMessages);
  }, [navigate]);

  const handleStartExam = (exam: Exam) => {
    // Check if already taken
    const alreadyTaken = results.some(r => r.examId === exam.id);
    if (alreadyTaken) {
      alert('You have already taken this exam!');
      return;
    }

    setTakingExam(exam);
    setCurrentAnswers(new Array(exam.questions.length).fill(-1));
    setExamStartTime(Date.now());
  };

  const handleSubmitExam = () => {
    if (!takingExam || !currentUser) return;

    // Calculate score
    let score = 0;
    takingExam.questions.forEach((q, idx) => {
      if (currentAnswers[idx] === q.correctAnswer) {
        score += takingExam.totalMarks / takingExam.questions.length;
      }
    });

    const newResult: ExamResult = {
      id: `r${Date.now()}`,
      examId: takingExam.id,
      studentId: currentUser.id,
      score: Math.round(score),
      totalMarks: takingExam.totalMarks,
      answers: currentAnswers,
      submittedAt: new Date().toISOString()
    };

    const updatedResults = [...results, newResult];
    setResults(updatedResults);
    localStorage.setItem('examResults', JSON.stringify([...JSON.parse(localStorage.getItem('examResults') || '[]'), newResult]));

    setTakingExam(null);
    setCurrentAnswers([]);
    setActiveTab('results');
  };

  const getAverageScore = () => {
    if (results.length === 0) return 0;
    const total = results.reduce((sum, r) => sum + (r.score / r.totalMarks) * 100, 0);
    return Math.round(total / results.length);
  };

  if (!currentUser) return null;

  if (takingExam) {
    return (
      <DashboardLayout userName={currentUser.name} userRole="Student">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{takingExam.title}</h2>
                <p className="text-gray-600">{takingExam.subject} • {takingExam.totalMarks} marks</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Duration</p>
                <p className="text-lg font-semibold text-indigo-600">{takingExam.duration} min</p>
              </div>
            </div>

            <div className="space-y-6">
              {takingExam.questions.map((question, idx) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                  <p className="font-medium text-gray-900 mb-4">
                    {idx + 1}. {question.question}
                  </p>
                  <div className="space-y-2">
                    {question.options.map((option, optIdx) => (
                      <label
                        key={optIdx}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                          currentAnswers[idx] === optIdx
                            ? 'border-indigo-600 bg-indigo-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${idx}`}
                          checked={currentAnswers[idx] === optIdx}
                          onChange={() => {
                            const newAnswers = [...currentAnswers];
                            newAnswers[idx] = optIdx;
                            setCurrentAnswers(newAnswers);
                          }}
                          className="mr-3"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleSubmitExam}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Submit Exam
              </button>
              <button
                onClick={() => setTakingExam(null)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userName={currentUser.name} userRole="Student">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {currentUser.name}!</h2>
        <p className="text-gray-600">Class {currentUser.class}</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <div className="flex gap-1 p-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'overview'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('exams')}
              className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'exams'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Exams ({exams.length})
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'results'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Results ({results.length})
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'messages'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Messages ({messages.filter(m => !m.read).length})
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <FileText className="w-8 h-8 text-blue-600 mb-3" />
                <p className="text-sm text-blue-800 mb-1">Available Exams</p>
                <p className="text-3xl font-bold text-blue-900">{exams.length - results.length}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-6">
                <TrendingUp className="w-8 h-8 text-green-600 mb-3" />
                <p className="text-sm text-green-800 mb-1">Average Score</p>
                <p className="text-3xl font-bold text-green-900">{getAverageScore()}%</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-6">
                <MessageCircle className="w-8 h-8 text-purple-600 mb-3" />
                <p className="text-sm text-purple-800 mb-1">Unread Messages</p>
                <p className="text-3xl font-bold text-purple-900">{messages.filter(m => !m.read).length}</p>
              </div>
            </div>
          )}

          {activeTab === 'exams' && (
            <div className="space-y-4">
              {exams.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No exams available</p>
              ) : (
                exams.map(exam => {
                  const taken = results.some(r => r.examId === exam.id);
                  return (
                    <div key={exam.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{exam.title}</h3>
                        <p className="text-sm text-gray-600">{exam.subject} • {exam.date}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {exam.duration} min
                          </span>
                          <span className="text-xs text-gray-500">
                            {exam.totalMarks} marks
                          </span>
                        </div>
                      </div>
                      {taken ? (
                        <span className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
                          Completed
                        </span>
                      ) : (
                        <button
                          onClick={() => handleStartExam(exam)}
                          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          Start Exam
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === 'results' && (
            <div className="space-y-4">
              {results.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No results yet</p>
              ) : (
                results.map(result => {
                  const exam = exams.find(e => e.id === result.examId);
                  if (!exam) return null;
                  const percentage = (result.score / result.totalMarks) * 100;
                  return (
                    <div key={result.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{exam.title}</h3>
                          <p className="text-sm text-gray-600">{exam.subject}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Submitted: {new Date(result.submittedAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">
                            {result.score}/{result.totalMarks}
                          </p>
                          <p className={`text-sm font-medium ${
                            percentage >= 70 ? 'text-green-600' :
                            percentage >= 50 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {percentage.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm font-medium text-gray-700 mb-2">Answer Review:</p>
                        <div className="flex flex-wrap gap-2">
                          {result.answers.map((answer, idx) => {
                            const isCorrect = answer === exam.questions[idx].correctAnswer;
                            return (
                              <div
                                key={idx}
                                className={`w-8 h-8 rounded flex items-center justify-center text-sm font-medium ${
                                  isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}
                              >
                                {isCorrect ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="space-y-4">
              {messages.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No messages</p>
              ) : (
                messages.map(message => (
                  <div key={message.id} className={`border rounded-lg p-4 ${
                    message.read ? 'border-gray-200' : 'border-indigo-200 bg-indigo-50'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{message.subject}</h3>
                      <span className="text-xs text-gray-500">{message.date}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">From: Teacher</p>
                    <p className="text-gray-700">{message.content}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
