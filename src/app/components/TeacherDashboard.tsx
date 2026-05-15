import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { DashboardLayout } from './DashboardLayout';
import { Users, FileText, BarChart3, MessageCircle, Plus, Trash2, Send } from 'lucide-react';
import type { Teacher, Student, Exam, ExamResult, Question, Message } from '../utils/mockData';

export function TeacherDashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<Teacher | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'exams' | 'performance' | 'messages'>('overview');
  const [students, setStudents] = useState<Student[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Exam creation state
  const [showCreateExam, setShowCreateExam] = useState(false);
  const [newExam, setNewExam] = useState({
    title: '',
    subject: '',
    date: '',
    duration: 60,
    totalMarks: 100,
    class: '10A'
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0
  });

  // Message state
  const [showSendMessage, setShowSendMessage] = useState(false);
  const [messageForm, setMessageForm] = useState({
    to: '',
    subject: '',
    content: ''
  });

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      navigate('/');
      return;
    }
    const userData = JSON.parse(user);
    if (userData.userType !== 'teacher') {
      navigate('/');
      return;
    }
    setCurrentUser(userData);

    // Load data
    const storedStudents = JSON.parse(localStorage.getItem('students') || '[]');
    setStudents(storedStudents);

    const storedExams = JSON.parse(localStorage.getItem('exams') || '[]');
    const teacherExams = storedExams.filter((e: Exam) => e.teacherId === userData.id);
    setExams(teacherExams);

    const storedResults = JSON.parse(localStorage.getItem('examResults') || '[]');
    setResults(storedResults);

    const storedMessages = JSON.parse(localStorage.getItem('messages') || '[]');
    const teacherMessages = storedMessages.filter((m: Message) => m.to === userData.id || m.from === userData.id);
    setMessages(teacherMessages);
  }, [navigate]);

  const handleAddQuestion = () => {
    if (!newQuestion.question || newQuestion.options.some(o => !o)) {
      alert('Please fill in all question fields');
      return;
    }

    setQuestions([...questions, {
      id: `q${Date.now()}`,
      question: newQuestion.question,
      options: [...newQuestion.options],
      correctAnswer: newQuestion.correctAnswer
    }]);

    setNewQuestion({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    });
  };

  const handleCreateExam = () => {
    if (!currentUser) return;

    if (!newExam.title || !newExam.subject || !newExam.date || questions.length === 0) {
      alert('Please fill in all exam details and add at least one question');
      return;
    }

    const exam: Exam = {
      id: `e${Date.now()}`,
      title: newExam.title,
      subject: newExam.subject,
      date: newExam.date,
      duration: newExam.duration,
      totalMarks: newExam.totalMarks,
      questions: questions,
      teacherId: currentUser.id,
      class: newExam.class
    };

    const updatedExams = [...exams, exam];
    setExams(updatedExams);

    const allExams = JSON.parse(localStorage.getItem('exams') || '[]');
    localStorage.setItem('exams', JSON.stringify([...allExams, exam]));

    setShowCreateExam(false);
    setNewExam({
      title: '',
      subject: '',
      date: '',
      duration: 60,
      totalMarks: 100,
      class: '10A'
    });
    setQuestions([]);
  };

  const handleDeleteExam = (examId: string) => {
    if (!confirm('Are you sure you want to delete this exam?')) return;

    const updatedExams = exams.filter(e => e.id !== examId);
    setExams(updatedExams);

    const allExams = JSON.parse(localStorage.getItem('exams') || '[]');
    const filteredExams = allExams.filter((e: Exam) => e.id !== examId);
    localStorage.setItem('exams', JSON.stringify(filteredExams));
  };

  const handleSendMessage = () => {
    if (!currentUser || !messageForm.to || !messageForm.subject || !messageForm.content) {
      alert('Please fill in all message fields');
      return;
    }

    const newMessage: Message = {
      id: `m${Date.now()}`,
      from: currentUser.id,
      to: messageForm.to,
      subject: messageForm.subject,
      content: messageForm.content,
      date: new Date().toISOString().split('T')[0],
      read: false
    };

    const allMessages = JSON.parse(localStorage.getItem('messages') || '[]');
    localStorage.setItem('messages', JSON.stringify([...allMessages, newMessage]));

    setMessages([...messages, newMessage]);
    setShowSendMessage(false);
    setMessageForm({ to: '', subject: '', content: '' });
  };

  const getStudentPerformance = (studentId: string) => {
    const studentResults = results.filter(r => r.studentId === studentId);
    if (studentResults.length === 0) return 0;
    const total = studentResults.reduce((sum, r) => sum + (r.score / r.totalMarks) * 100, 0);
    return Math.round(total / studentResults.length);
  };

  if (!currentUser) return null;

  return (
    <DashboardLayout userName={currentUser.name} userRole="Teacher">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Teacher Dashboard</h2>
        <p className="text-gray-600">{currentUser.subject}</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <div className="flex gap-1 p-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 px-4 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`py-3 px-4 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'students'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Students ({students.length})
            </button>
            <button
              onClick={() => setActiveTab('exams')}
              className={`py-3 px-4 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'exams'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Exams ({exams.length})
            </button>
            <button
              onClick={() => setActiveTab('performance')}
              className={`py-3 px-4 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'performance'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Performance
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`py-3 px-4 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'messages'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Messages
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div>
              <div className="grid md:grid-cols-4 gap-6 mb-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <Users className="w-8 h-8 text-blue-600 mb-3" />
                  <p className="text-sm text-blue-800 mb-1">Total Students</p>
                  <p className="text-3xl font-bold text-blue-900">{students.length}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-6">
                  <FileText className="w-8 h-8 text-green-600 mb-3" />
                  <p className="text-sm text-green-800 mb-1">Active Exams</p>
                  <p className="text-3xl font-bold text-green-900">{exams.length}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-6">
                  <BarChart3 className="w-8 h-8 text-purple-600 mb-3" />
                  <p className="text-sm text-purple-800 mb-1">Total Submissions</p>
                  <p className="text-3xl font-bold text-purple-900">{results.length}</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-6">
                  <MessageCircle className="w-8 h-8 text-orange-600 mb-3" />
                  <p className="text-sm text-orange-800 mb-1">Messages</p>
                  <p className="text-3xl font-bold text-orange-900">{messages.length}</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
                <h3 className="text-xl font-semibold mb-2">Quick Actions</h3>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => {
                      setActiveTab('exams');
                      setShowCreateExam(true);
                    }}
                    className="px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                  >
                    Create New Exam
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('messages');
                      setShowSendMessage(true);
                    }}
                    className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors font-medium"
                  >
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Student List</h3>
              </div>
              {students.map(student => (
                <div key={student.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{student.name}</h3>
                    <p className="text-sm text-gray-600">{student.email}</p>
                    <p className="text-xs text-gray-500 mt-1">Class {student.class} • Grade {student.grade}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Average Performance</p>
                    <p className="text-2xl font-bold text-indigo-600">{getStudentPerformance(student.id)}%</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'exams' && (
            <div>
              {!showCreateExam ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">My Exams</h3>
                    <button
                      onClick={() => setShowCreateExam(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Create Exam
                    </button>
                  </div>
                  <div className="space-y-4">
                    {exams.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">No exams created yet</p>
                    ) : (
                      exams.map(exam => {
                        const submissions = results.filter(r => r.examId === exam.id).length;
                        return (
                          <div key={exam.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">{exam.title}</h3>
                                <p className="text-sm text-gray-600">{exam.subject} • {exam.date}</p>
                                <div className="flex items-center gap-4 mt-2">
                                  <span className="text-xs text-gray-500">{exam.questions.length} questions</span>
                                  <span className="text-xs text-gray-500">{exam.duration} min</span>
                                  <span className="text-xs text-gray-500">{exam.totalMarks} marks</span>
                                  <span className="text-xs text-gray-500">Class {exam.class}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm">
                                  {submissions} submissions
                                </span>
                                <button
                                  onClick={() => handleDeleteExam(exam.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              ) : (
                <div className="max-w-3xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Create New Exam</h3>
                    <button
                      onClick={() => setShowCreateExam(false)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Exam Title</label>
                        <input
                          type="text"
                          value={newExam.title}
                          onChange={(e) => setNewExam({ ...newExam, title: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                          placeholder="e.g., Mathematics Mid-Term"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                        <input
                          type="text"
                          value={newExam.subject}
                          onChange={(e) => setNewExam({ ...newExam, subject: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                          placeholder="e.g., Mathematics"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                        <input
                          type="date"
                          value={newExam.date}
                          onChange={(e) => setNewExam({ ...newExam, date: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Duration (min)</label>
                        <input
                          type="number"
                          value={newExam.duration}
                          onChange={(e) => setNewExam({ ...newExam, duration: parseInt(e.target.value) })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Total Marks</label>
                        <input
                          type="number"
                          value={newExam.totalMarks}
                          onChange={(e) => setNewExam({ ...newExam, totalMarks: parseInt(e.target.value) })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                        <select
                          value={newExam.class}
                          onChange={(e) => setNewExam({ ...newExam, class: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        >
                          <option value="10A">10A</option>
                          <option value="10B">10B</option>
                          <option value="9A">9A</option>
                          <option value="9B">9B</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Questions ({questions.length})</h4>
                    
                    {questions.map((q, idx) => (
                      <div key={q.id} className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 mb-2">{idx + 1}. {q.question}</p>
                            <div className="space-y-1">
                              {q.options.map((opt, optIdx) => (
                                <p key={optIdx} className={`text-sm ${optIdx === q.correctAnswer ? 'text-green-700 font-medium' : 'text-gray-600'}`}>
                                  {String.fromCharCode(65 + optIdx)}. {opt} {optIdx === q.correctAnswer && '✓'}
                                </p>
                              ))}
                            </div>
                          </div>
                          <button
                            onClick={() => setQuestions(questions.filter(q2 => q2.id !== q.id))}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}

                    <div className="bg-blue-50 rounded-lg p-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
                        <input
                          type="text"
                          value={newQuestion.question}
                          onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                          placeholder="Enter question text"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        {newQuestion.options.map((opt, idx) => (
                          <div key={idx}>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Option {String.fromCharCode(65 + idx)}
                            </label>
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => {
                                const newOptions = [...newQuestion.options];
                                newOptions[idx] = e.target.value;
                                setNewQuestion({ ...newQuestion, options: newOptions });
                              }}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                              placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                            />
                          </div>
                        ))}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
                        <select
                          value={newQuestion.correctAnswer}
                          onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: parseInt(e.target.value) })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        >
                          <option value={0}>Option A</option>
                          <option value={1}>Option B</option>
                          <option value={2}>Option C</option>
                          <option value={3}>Option D</option>
                        </select>
                      </div>

                      <button
                        onClick={handleAddQuestion}
                        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Add Question
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={handleCreateExam}
                      className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Create Exam
                    </button>
                    <button
                      onClick={() => setShowCreateExam(false)}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Student Performance Overview</h3>
              {students.map(student => {
                const studentResults = results.filter(r => r.studentId === student.id);
                return (
                  <div key={student.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900">{student.name}</h4>
                        <p className="text-sm text-gray-600">Class {student.class}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Average Score</p>
                        <p className="text-2xl font-bold text-indigo-600">{getStudentPerformance(student.id)}%</p>
                      </div>
                    </div>
                    {studentResults.length > 0 ? (
                      <div className="space-y-2">
                        {studentResults.map(result => {
                          const exam = exams.find(e => e.id === result.examId);
                          if (!exam) return null;
                          return (
                            <div key={result.id} className="flex items-center justify-between bg-gray-50 rounded p-3">
                              <span className="text-sm text-gray-700">{exam.title}</span>
                              <span className="text-sm font-medium text-gray-900">
                                {result.score}/{result.totalMarks} ({Math.round((result.score / result.totalMarks) * 100)}%)
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-4">No exam results yet</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'messages' && (
            <div>
              {!showSendMessage ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
                    <button
                      onClick={() => setShowSendMessage(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      New Message
                    </button>
                  </div>
                  <div className="space-y-4">
                    {messages.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">No messages</p>
                    ) : (
                      messages.map(message => (
                        <div key={message.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{message.subject}</h4>
                            <span className="text-xs text-gray-500">{message.date}</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {message.from === currentUser.id ? 'To: Student/Parent' : 'From: Student/Parent'}
                          </p>
                          <p className="text-gray-700">{message.content}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <div className="max-w-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Send New Message</h3>
                    <button
                      onClick={() => setShowSendMessage(false)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Recipient</label>
                      <select
                        value={messageForm.to}
                        onChange={(e) => setMessageForm({ ...messageForm, to: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      >
                        <option value="">Select a student</option>
                        {students.map(student => (
                          <option key={student.id} value={student.id}>{student.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                      <input
                        type="text"
                        value={messageForm.subject}
                        onChange={(e) => setMessageForm({ ...messageForm, subject: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        placeholder="Message subject"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                      <textarea
                        value={messageForm.content}
                        onChange={(e) => setMessageForm({ ...messageForm, content: e.target.value })}
                        rows={6}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                        placeholder="Type your message here..."
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleSendMessage}
                        className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                      >
                        Send Message
                      </button>
                      <button
                        onClick={() => setShowSendMessage(false)}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
