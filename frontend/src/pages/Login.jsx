import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(username, password);
        if (result.success) {
            if (result.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } else {
            setError('Invalid username or password');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-xl md:w-1/3">
                <h3 className="text-2xl font-bold text-center text-primary">Login to Library System</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mt-4">
                        <label className="block text-gray-600" htmlFor="username">Username or Email</label>
                        <div className="relative flex items-center mt-2">
                            <User className="absolute left-3 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Username"
                                className="w-full pl-10 px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="block text-gray-600">Password</label>
                        <div className="relative flex items-center mt-2">
                            <Lock className="absolute left-3 w-5 h-5 text-gray-400" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className="w-full pl-10 pr-10 px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    <div className="flex items-baseline justify-between">
                        <button className="px-6 py-2 mt-4 text-white bg-primary rounded-lg hover:bg-blue-900 w-full md:w-auto">
                            Login
                        </button>
                        <Link to="/register" className="text-sm text-blue-600 hover:underline">Register</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
