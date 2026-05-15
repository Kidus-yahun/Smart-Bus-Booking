import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { DashboardLayout } from './DashboardLayout';
import { User, TrendingUp, DollarSign, MessageCircle, CheckCircle, XCircle, Clock, Send } from 'lucide-react';
import type { Parent, Student, Exam, ExamResult, FeePayment, Message } from '../utils/mockData';

export function ParentDashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<Parent | null>(null);
  const [child, setChild] = useState<Student | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'fees' | 'messages'>('overview');
  const [exams, setExams] = useState<Exam[]>([]);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [feePayments, setFeePayments] = useState<FeePayment[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  // Message state
  const [showSendMessage, setShowSendMessage] = useState(false);
  const [messageForm, setMessageForm] = useState({
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
    if (userData.userType !== 'parent') {
      navigate('/');
      return;
    }
    setCurrentUser(userData);

    // Load child data
    const storedStudents = JSON.parse(localStorage.getItem('students') || '[]');
    const childData = storedStudents.find((s: Student) => s.id === userData.studentId);
    setChild(childData);

    if (childData) {
      // Load exams for child's class
      const storedExams = JSON.parse(localStorage.getItem('exams') || '[]');
      const childExams = storedExams.filter((e: Exam) => e.class === childData.class);
      setExams(childExams);

      // Load child's results
      const storedResults = JSON.parse(localStorage.getItem('examResults') || '[]');
      const childResults = storedResults.filter((r: ExamResult) => r.studentId === childData.id);
      setResults(childResults);

      // Load fee payments
      const storedFees = JSON.parse(localStorage.getItem('feePayments') || '[]');
      const childFees = storedFees.filter((f: FeePayment) => f.studentId === childData.id);
      setFeePayments(childFees);

      // Load messages
      const storedMessages = JSON.parse(localStorage.getItem('messages') || '[]');
      const parentMessages = storedMessages.filter((m: Message) => 
        m.to === userData.id || m.from === userData.id
      );
      setMessages(parentMessages);
    }
  }, [navigate]);

  const handleSendMessage = () => {
    if (!currentUser || !messageForm.subject || !messageForm.content) {
      alert('Please fill in all message fields');
      return;
    }

    // Send to first teacher (in a real app, parent would select teacher)
    const teachers = JSON.parse(localStorage.getItem('teachers') || '[]');
    if (teachers.length === 0) {
      alert('No teachers available');
      return;
    }

    const newMessage: Message = {
      id: `m${Date.now()}`,
      from: currentUser.id,
      to: teachers[0].id,
      subject: messageForm.subject,
      content: messageForm.content,
      date: new Date().toISOString().split('T')[0],
      read: false
    };

    const allMessages = JSON.parse(localStorage.getItem('messages') || '[]');
    localStorage.setItem('messages', JSON.stringify([...allMessages, newMessage]));

    setMessages([...messages, newMessage]);
    setShowSendMessage(false);
    setMessageForm({ subject: '', content: '' });
  };

  const getAverageScore = () => {
    if (results.length === 0) return 0;
    const total = results.reduce((sum, r) => sum + (r.score / r.totalMarks) * 100, 0);
    return Math.round(total / results.length);
  };

  const getTotalFeesPaid = () => {
    return feePayments.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0);
  };

  const getTotalFeesPending = () => {
    return feePayments.filter(f => f.status === 'pending' || f.status === 'overdue').reduce((sum, f) => sum + f.amount, 0);
  };

  if (!currentUser || !child) return null;

  return (
    <DashboardLayout userName={currentUser.name} userRole="Parent">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Parent Portal</h2>
        <p className="text-gray-600">Monitoring: {child.name} - Class {child.class}</p>
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
              onClick={() => setActiveTab('performance')}
              className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'performance'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Performance
            </button>
            <button
              onClick={() => setActiveTab('fees')}
              className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'fees'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Fee Payments
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-colors ${
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
                  <User className="w-8 h-8 text-blue-600 mb-3" />
                  <p className="text-sm text-blue-800 mb-1">Student</p>
                  <p className="text-lg font-bold text-blue-900">{child.name}</p>
                  <p className="text-xs text-blue-700">Class {child.class}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-6">
                  <TrendingUp className="w-8 h-8 text-green-600 mb-3" />
                  <p className="text-sm text-green-800 mb-1">Average Score</p>
                  <p className="text-3xl font-bold text-green-900">{getAverageScore()}%</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-6">
                  <DollarSign className="w-8 h-8 text-purple-600 mb-3" />
                  <p className="text-sm text-purple-800 mb-1">Pending Fees</p>
                  <p className="text-3xl font-bold text-purple-900">${getTotalFeesPending()}</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-6">
                  <MessageCircle className="w-8 h-8 text-orange-600 mb-3" />
                  <p className="text-sm text-orange-800 mb-1">Messages</p>
                  <p className="text-3xl font-bold text-orange-900">{messages.length}</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white mb-6">
                <h3 className="text-xl font-semibold mb-2">Quick Overview</h3>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-white/20 rounded-lg p-4">
                    <p className="text-sm opacity-90 mb-1">Exams Taken</p>
                    <p className="text-2xl font-bold">{results.length} / {exams.length}</p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4">
                    <p className="text-sm opacity-90 mb-1">Total Fees Paid</p>
                    <p className="text-2xl font-bold">${getTotalFeesPaid()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Recent Exam Results</h3>
                {results.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No exam results yet</p>
                ) : (
                  <div className="space-y-3">
                    {results.slice(0, 3).map(result => {
                      const exam = exams.find(e => e.id === result.examId);
                      if (!exam) return null;
                      const percentage = (result.score / result.totalMarks) * 100;
                      return (
                        <div key={result.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                          <div>
                            <p className="font-medium text-gray-900">{exam.title}</p>
                            <p className="text-sm text-gray-600">{exam.subject}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-gray-900">{result.score}/{result.totalMarks}</p>
                            <p className={`text-sm font-medium ${
                              percentage >= 70 ? 'text-green-600' :
                              percentage >= 50 ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              {percentage.toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Academic Performance</h3>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Overall Average</p>
                  <p className="text-3xl font-bold text-indigo-600">{getAverageScore()}%</p>
                </div>
              </div>

              <div className="space-y-4">
                {results.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No exam results to display</p>
                ) : (
                  results.map(result => {
                    const exam = exams.find(e => e.id === result.examId);
                    if (!exam) return null;
                    const percentage = (result.score / result.totalMarks) * 100;
                    return (
                      <div key={result.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-4">
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

                        <div className="pt-4 border-t border-gray-200">
                          <p className="text-sm font-medium text-gray-700 mb-2">Performance:</p>
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

                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full ${
                                percentage >= 70 ? 'bg-green-500' :
                                percentage >= 50 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {activeTab === 'fees' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-green-800 mb-1">Total Paid</p>
                  <p className="text-2xl font-bold text-green-900">${getTotalFeesPaid()}</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <p className="text-sm text-yellow-800 mb-1">Pending</p>
                  <p className="text-2xl font-bold text-yellow-900">${getTotalFeesPending()}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-800 mb-1">Total Fees</p>
                  <p className="text-2xl font-bold text-blue-900">${getTotalFeesPaid() + getTotalFeesPending()}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h3>
                <div className="space-y-3">
                  {feePayments.map(fee => (
                    <div key={fee.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{fee.month}</h4>
                          <p className="text-sm text-gray-600">Due Date: {fee.dueDate}</p>
                          {fee.paidDate && (
                            <p className="text-sm text-gray-600">Paid Date: {fee.paidDate}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-gray-900">${fee.amount}</p>
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                            fee.status === 'paid' ? 'bg-green-100 text-green-700' :
                            fee.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {fee.status === 'paid' ? (
                              <>
                                <CheckCircle className="w-4 h-4" />
                                Paid
                              </>
                            ) : fee.status === 'pending' ? (
                              <>
                                <Clock className="w-4 h-4" />
                                Pending
                              </>
                            ) : (
                              <>
                                <XCircle className="w-4 h-4" />
                                Overdue
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                      {fee.status !== 'paid' && (
                        <button
                          onClick={() => alert('Payment simulation (demo mode). In production, this would integrate with a payment gateway.')}
                          className="mt-3 w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                        >
                          Pay Now
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> This is a demo system. Payment buttons are simulated and do not process real transactions.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div>
              {!showSendMessage ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Messages with Teachers</h3>
                    <button
                      onClick={() => setShowSendMessage(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      Contact Teacher
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
                            {message.from === currentUser.id ? 'To: Teacher' : 'From: Teacher'}
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
                    <h3 className="text-lg font-semibold text-gray-900">Contact Teacher</h3>
                    <button
                      onClick={() => setShowSendMessage(false)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="space-y-4">
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
                        placeholder="Type your message to the teacher..."
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
