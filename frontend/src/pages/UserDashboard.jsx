import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Book, RotateCcw, Star, Info } from 'lucide-react';
import BookDetailsModal from '../components/BookDetailsModal';
import BookCard from '../components/BookCard';

const UserDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [books, setBooks] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [history, setHistory] = useState([]);
    const [activeTab, setActiveTab] = useState('catalog');
    const [selectedBook, setSelectedBook] = useState(null);

    useEffect(() => {
        fetchBooks();
        fetchRecommendations();
        fetchHistory();

        // Polling for real-time updates (every 5 seconds)
        const interval = setInterval(() => {
            fetchBooks();
            fetchHistory();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const fetchBooks = async () => {
        try {
            const res = await api.get('/books/');
            setBooks(res.data);
        } catch (err) {
            console.error("Failed to fetch books");
        }
    };

    const fetchRecommendations = async () => {
        try {
            // Recommendations don't change as often, usually on action
            const res = await api.get('/ai/recommendations');
            setRecommendations(res.data);
        } catch (err) {
            console.error("Failed to fetch recommendations");
        }
    };

    const fetchHistory = async () => {
        try {
            const res = await api.get('/operations/history');
            setHistory(res.data);
        } catch (err) {
            console.error("Failed to fetch history");
        }
    };

    const handleBorrow = async (bookId) => {
        try {
            await api.post('/operations/borrow', { book_id: bookId });
            alert("Book Borrowed successfully!");
            fetchBooks();
            fetchHistory();
            fetchRecommendations();
        } catch (err) {
            alert(err.response?.data?.detail || "Borrow failed");
        }
    };

    const handleReturn = async (borrowId) => {
        try {
            await api.post(`/operations/return/${borrowId}`);
            const now = new Date().toLocaleTimeString();
            alert(`Book Returned successfully at ${now}!`);
            fetchBooks();
            fetchHistory();
        } catch (err) {
            alert(err.response?.data?.detail || "Return failed");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <nav className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-primary">Library Management System</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-600">Welcome, {user?.username} | </span>
                            <button onClick={logout} className="text-red-500 hover:text-red-700">Logout</button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">

                {/* Recommendation Section */}
                {recommendations.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                            <Star className="w-5 h-5 text-yellow-500 mr-2" /> Recommended for You
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {recommendations.map(book => (
                                <div key={book.id} onClick={() => setSelectedBook(book)} className="bg-gradient-to-br from-indigo-50 to-white p-4 rounded-lg shadow border border-indigo-100 cursor-pointer hover:shadow-md transition">
                                    <h3 className="font-bold text-gray-800">{book.title}</h3>
                                    <p className="text-sm text-gray-600">{book.author}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('catalog')}
                            className={`${activeTab === 'catalog' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Book Catalog
                        </button>
                        <button
                            onClick={() => setActiveTab('mybooks')}
                            className={`${activeTab === 'mybooks' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            My Borrow History
                        </button>
                    </nav>
                </div>

                {/* Content */}
                {activeTab === 'catalog' ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {books.map(book => (
                            <BookCard
                                key={book.id}
                                book={book}
                                onClick={setSelectedBook}
                                onBorrow={handleBorrow}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <ul className="divide-y divide-gray-200">
                            {history.map(record => (
                                <li key={record.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <p className="text-sm font-medium text-primary">
                                                Borrow ID: {record.id} • Book ID: {record.book_id}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Borrowed: {new Date(record.borrow_date).toLocaleDateString()}
                                            </p>
                                            {record.status === 'returned' && (
                                                <p className="text-sm text-gray-500">
                                                    Returned: {new Date(record.return_date).toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                                                ${record.status === 'returned' ? 'bg-green-100 text-green-800' :
                                                    record.status === 'return_requested' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-blue-100 text-blue-800'}`}>
                                                {record.status === 'returned' ? 'Returned' :
                                                    record.status === 'return_requested' ? 'Pending Return Approval' :
                                                        'Borrowed'}
                                            </span>

                                            {record.status === 'borrowed' && (
                                                <button
                                                    onClick={() => handleReturn(record.id)}
                                                    className="inline-flex items-center text-indigo-600 hover:text-indigo-900 text-sm font-medium border border-indigo-200 px-3 py-1 rounded hover:bg-indigo-50 transition"
                                                >
                                                    <RotateCcw className="w-4 h-4 mr-1" /> Return
                                                </button>
                                            )}
                                            {record.status === 'return_requested' && (
                                                <span className="text-sm text-gray-400 italic">Waiting for approval...</span>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))}
                            {history.length === 0 && <p className="p-4 text-gray-500 text-center">No borrowing history found.</p>}
                        </ul>
                    </div>
                )}

                {/* Modal */}
                <BookDetailsModal book={selectedBook} onClose={() => setSelectedBook(null)} />
            </div>
        </div>
    );
};

export default UserDashboard;
