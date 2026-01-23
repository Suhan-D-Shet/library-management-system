import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Trash2, Plus, Users, BarChart2, BookOpen, X } from 'lucide-react';
import BookDetailsModal from '../components/BookDetailsModal';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const AdminDashboard = () => {
    const { logout, user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('inventory');
    const [books, setBooks] = useState([]);
    const [analyticsData, setAnalyticsData] = useState(null);
    const [newBook, setNewBook] = useState({ title: '', author: '', genre: '', quantity: 1, cover_image: '', description: '', published_date: '' });
    const [error, setError] = useState('');
    const [selectedBook, setSelectedBook] = useState(null);
    const [issueModalOpen, setIssueModalOpen] = useState(false);
    const [issueBookId, setIssueBookId] = useState(null);
    const [guestDetails, setGuestDetails] = useState({ guest_name: '', guest_email: '', guest_phone: '' });

    useEffect(() => {
        if (activeTab === 'inventory') {
            fetchBooks();
        } else {
            fetchAnalytics();
        }
    }, [activeTab]);

    const fetchBooks = async () => {
        try {
            const res = await api.get('/books/');
            setBooks(res.data);
        } catch (err) {
            console.error("Failed to fetch books");
        }
    };

    const fetchAnalytics = async () => {
        try {
            const res = await api.get('/ai/analytics/dashboard');
            setAnalyticsData(res.data);
        } catch (err) {
            console.error("Failed to fetch analytics");
        }
    };

    const handleDelete = async (bookId) => {
        if (!window.confirm("Are you sure you want to delete this book?")) return;
        try {
            await api.delete(`/books/${bookId}`);
            setBooks(books.filter(b => b.id !== bookId));
        } catch (err) {
            alert("Failed to delete book. You might be restricted.");
        }
    };

    const handleAddBook = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/books/', newBook);
            setBooks([...books, res.data]);
            setNewBook({ title: '', author: '', genre: '', quantity: 1, cover_image: '', description: '', published_date: '' });
            setError('');
        } catch (err) {
            setError('Failed to add book. Ensure you are an Admin.');
        }
    };

    const toggleStock = async (book) => {
        const newQuantity = book.quantity > 0 ? 0 : 5;
        try {
            const res = await api.put(`/books/${book.id}`, { quantity: newQuantity });
            setBooks(books.map(b => b.id === book.id ? res.data : b));
        } catch (err) {
            alert("Failed to update stock.");
        }
    };

    const openIssueModal = (bookId) => {
        setIssueBookId(bookId);
        setIssueModalOpen(true);
        setGuestDetails({ guest_name: '', guest_email: '', guest_phone: '' });
    };

    const handleIssueBook = async (e) => {
        e.preventDefault();
        try {
            await api.post('/operations/borrow', {
                book_id: issueBookId,
                ...guestDetails
            });
            alert("Book Issued Successfully!");
            setIssueModalOpen(false);
            fetchBooks();
        } catch (err) {
            alert(err.response?.data?.detail || "Failed to issue book");
        }
    };

    // Charts Colors
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Header */}
            <nav className="bg-white shadow-sm border-b border-gray-100 z-10 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center space-x-2">
                            <BookOpen className="w-6 h-6 text-indigo-600" />
                            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Library Books Manager</h1>
                        </div>
                        <div className="flex items-center space-x-6">
                            <span className="text-gray-500 text-sm">Welcome, <span className="font-semibold text-gray-800">{user?.email}</span></span>
                            <span className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full font-medium border border-indigo-100">Admin</span>
                            <button onClick={logout} className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors">Logout</button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">

                {/* Tabs */}
                <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg w-fit mb-8 mx-auto sm:mx-0">
                    <button
                        onClick={() => setActiveTab('inventory')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'inventory' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Inventory Management
                    </button>
                    <button
                        onClick={() => setActiveTab('managelibrary')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'managelibrary' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Book Management
                    </button>
                    <button
                        onClick={() => setActiveTab('analytics')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'analytics' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Advanced Analytics
                    </button>
                </div>

                {activeTab === 'inventory' ? (
                    <>
                        {/* Book List - Inventory View (Focus on Issue/Stock) */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                                <h3 className="font-semibold text-gray-800">Current Inventory</h3>
                                <span className="text-sm text-gray-500">{books.length} Books Total</span>
                            </div>
                            <ul className="divide-y divide-gray-100">
                                {books.map(book => (
                                    <li key={book.id} className="p-4 sm:px-6 hover:bg-indigo-50/30 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer group" onClick={() => setSelectedBook(book)}>
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="relative w-12 h-16 bg-gray-200 rounded-md overflow-hidden flex-shrink-0 shadow-sm">
                                                {book.cover_image ?
                                                    <img src={book.cover_image} alt={book.title} className="w-full h-full object-cover" /> :
                                                    <div className="flex items-center justify-center h-full text-gray-400"><BookOpen className="w-6 h-6" /></div>
                                                }
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{book.title}</h4>
                                                <p className="text-xs text-gray-500 mt-0.5">{book.author} • <span className="text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{book.genre}</span></p>
                                                <p className={`text-xs mt-1.5 font-medium ${book.quantity > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                                    {book.quantity > 0 ? `${book.quantity} Available` : 'Out of Stock'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 self-end sm:self-auto" onClick={(e) => e.stopPropagation()}>
                                            <button onClick={() => openIssueModal(book.id)} disabled={book.quantity < 1} className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors border ${book.quantity > 0 ? 'border-indigo-200 text-indigo-700 hover:bg-indigo-50' : 'border-gray-200 text-gray-400 cursor-not-allowed'}`}>
                                                Issue Book
                                            </button>
                                            <button onClick={() => toggleStock(book)} className="text-xs px-3 py-1.5 rounded-md font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors">
                                                {book.quantity > 0 ? 'Mark Out' : 'Restock'}
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                ) : activeTab === 'managelibrary' ? (
                    <>
                        {/* Add Book Form - Moved here */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 transition-all hover:shadow-md">
                            <h3 className="text-lg font-semibold text-gray-800 mb-5 flex items-center">
                                <Plus className="w-5 h-5 mr-2 text-indigo-600" /> Add New Book
                            </h3>
                            <form onSubmit={handleAddBook} className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
                                <input type="text" placeholder="Title" required className="border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 rounded-lg p-2.5 outline-none transition-all"
                                    value={newBook.title} onChange={e => setNewBook({ ...newBook, title: e.target.value })} />
                                <input type="text" placeholder="Author" required className="border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 rounded-lg p-2.5 outline-none transition-all"
                                    value={newBook.author} onChange={e => setNewBook({ ...newBook, author: e.target.value })} />
                                <input type="text" placeholder="Genre" required className="border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 rounded-lg p-2.5 outline-none transition-all"
                                    value={newBook.genre} onChange={e => setNewBook({ ...newBook, genre: e.target.value })} />
                                <input type="number" placeholder="Qty" required className="border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 rounded-lg p-2.5 outline-none transition-all"
                                    value={newBook.quantity} onChange={e => setNewBook({ ...newBook, quantity: parseInt(e.target.value) })} />
                                <input type="text" placeholder="Cover Image URL" className="border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 rounded-lg p-2.5 outline-none transition-all lg:col-span-2"
                                    value={newBook.cover_image} onChange={e => setNewBook({ ...newBook, cover_image: e.target.value })} />
                                <input type="date" placeholder="Published Date" className="border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 rounded-lg p-2.5 outline-none transition-all"
                                    value={newBook.published_date} onChange={e => setNewBook({ ...newBook, published_date: e.target.value })} />
                                <input type="text" placeholder="Description" className="border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 rounded-lg p-2.5 outline-none transition-all lg:col-span-4"
                                    value={newBook.description} onChange={e => setNewBook({ ...newBook, description: e.target.value })} />

                                <div className="lg:col-span-4 flex justify-end">
                                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-6 rounded-lg shadow-sm transition-colors flex items-center">
                                        <Plus className="w-4 h-4 mr-2" /> Add to Library
                                    </button>
                                </div>
                            </form>
                            {error && <p className="text-red-500 mt-3 text-sm flex items-center"><X className="w-4 h-4 mr-1" /> {error}</p>}
                        </div>

                        {/* Book List - Management View (Focus on Delete) */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                                <h3 className="font-semibold text-gray-800">Manage Books</h3>
                                <span className="text-sm text-gray-500">{books.length} Books Total</span>
                            </div>
                            <ul className="divide-y divide-gray-100">
                                {books.map(book => (
                                    <li key={book.id} className="p-4 sm:px-6 hover:bg-red-50/30 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer group" onClick={() => setSelectedBook(book)}>
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="relative w-12 h-16 bg-gray-200 rounded-md overflow-hidden flex-shrink-0 shadow-sm">
                                                {book.cover_image ?
                                                    <img src={book.cover_image} alt={book.title} className="w-full h-full object-cover" /> :
                                                    <div className="flex items-center justify-center h-full text-gray-400"><BookOpen className="w-6 h-6" /></div>
                                                }
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-900 group-hover:text-red-700 transition-colors">{book.title}</h4>
                                                <p className="text-xs text-gray-500 mt-0.5">{book.author}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 self-end sm:self-auto" onClick={(e) => e.stopPropagation()}>
                                            <button onClick={() => handleDelete(book.id)} className="flex items-center gap-2 px-3 py-1.5 text-red-600 border border-red-200 hover:bg-red-50 rounded-md transition-all text-xs font-bold">
                                                <Trash2 className="w-4 h-4" /> Remove Book
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                ) : (
                    <div className="space-y-6">
                        {/* Analytics Tab */}
                        {analyticsData ? (
                            <>
                                {/* AI Summary Card */}
                                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
                                    <div className="relative z-10">
                                        <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                                            <Users className="w-5 h-5" /> AI Insight Summary
                                        </h3>
                                        <p className="text-indigo-100 leading-relaxed text-sm md:text-base">
                                            {analyticsData.summary}
                                        </p>
                                    </div>
                                    <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
                                        <BarChart2 className="w-64 h-64" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Most Borrowed Chart */}
                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                        <h3 className="font-bold text-gray-800 mb-6">Most Borrowed Books</h3>
                                        <div className="h-64">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={analyticsData.most_borrowed} layout="vertical" margin={{ left: 20 }}>
                                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                                                    <XAxis type="number" hide />
                                                    <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                                                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                                    <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {/* Genre Pie Chart */}
                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                        <h3 className="font-bold text-gray-800 mb-6">Genre Distribution</h3>
                                        <div className="h-64">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={analyticsData.genre_popularity}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={60}
                                                        outerRadius={80}
                                                        paddingAngle={5}
                                                        dataKey="value"
                                                    >
                                                        {analyticsData.genre_popularity.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip contentStyle={{ borderRadius: '8px' }} />
                                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {/* Daily Activity Line Chart */}
                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
                                        <h3 className="font-bold text-gray-800 mb-6">30-Day Activity Trends</h3>
                                        <div className="h-64">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={analyticsData.daily_activity}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                                                    <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                                                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                                    <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex justify-center py-20">
                                <span className="text-gray-400 animate-pulse">Loading analytics...</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Issue Book Modal */}
                {issueModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/30">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in duration-200">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <h3 className="text-lg font-bold text-gray-800">Issue Book to Guest</h3>
                                <button onClick={() => setIssueModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleIssueBook} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Guest Name</label>
                                    <input type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                        value={guestDetails.guest_name} onChange={e => setGuestDetails({ ...guestDetails, guest_name: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
                                    <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                        value={guestDetails.guest_email} onChange={e => setGuestDetails({ ...guestDetails, guest_email: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
                                    <input type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                        value={guestDetails.guest_phone} onChange={e => setGuestDetails({ ...guestDetails, guest_phone: e.target.value })} />
                                </div>
                                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all mt-2">
                                    Issue Book
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Book Details Modal */}
                <BookDetailsModal book={selectedBook} onClose={() => setSelectedBook(null)} />
            </div>
        </div>
    );
};

export default AdminDashboard;
