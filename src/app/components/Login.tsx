import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { BookOpen } from 'lucide-react';
import { initializeMockData, mockStudents, mockTeachers, mockParents } from '../utils/mockData';

export function Login() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<'student' | 'teacher' | 'parent'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    initializeMockData();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    let users;
    let redirectPath;

    switch (userType) {
      case 'student':
        users = mockStudents;
        redirectPath = '/student';
        break;
      case 'teacher':
        users = mockTeachers;
        redirectPath = '/teacher';
        break;
      case 'parent':
        users = mockParents;
        redirectPath = '/parent';
        break;
    }

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem('currentUser', JSON.stringify({ ...user, userType }));
      navigate(redirectPath);
    } else {
      setError('Invalid email or password');
    }
  };

  const getDemoCredentials = () => {
    switch (userType) {
      case 'student':
        return 'alice@student.com / password';
      case 'teacher':
        return 'anderson@teacher.com / password';
      case 'parent':
        return 'mary@parent.com / password';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="flex items-center justify-center mb-8">
          <BookOpen className="w-12 h-12 text-indigo-600 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">School Portal</h1>
            <p className="text-sm text-gray-600">Management System</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              I am a:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setUserType('student')}
                className={`py-2 px-4 rounded-lg border-2 transition-all ${
                  userType === 'student'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setUserType('teacher')}
                className={`py-2 px-4 rounded-lg border-2 transition-all ${
                  userType === 'teacher'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                Teacher
              </button>
              <button
                type="button"
                onClick={() => setUserType('parent')}
                className={`py-2 px-4 rounded-lg border-2 transition-all ${
                  userType === 'parent'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                Parent
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Sign In
          </button>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-xs text-blue-800 mb-1 font-medium">Demo Credentials:</p>
            <p className="text-xs text-blue-700">{getDemoCredentials()}</p>
          </div>
        </form>
      </div>
    </div>
  );
}
