import React from 'react';
import { Book } from 'lucide-react';

const BookCard = ({ book, onClick, onBorrow }) => {
    return (
        <div className="bg-white p-5 rounded-lg shadow hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div className="relative cursor-pointer" onClick={() => onClick(book)}>
                <div className="h-48 bg-gray-200 rounded mb-4 overflow-hidden relative">
                    {book.cover_image ?
                        <img src={book.cover_image} alt={book.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" /> :
                        <div className="flex items-center justify-center h-full text-gray-400"><Book className="w-12 h-12" /></div>
                    }
                    {book.quantity < 1 && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                            <span className="text-white font-bold border border-white px-2 py-1 rounded">OUT OF STOCK</span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
                        {/* Hover effect overlay */}
                    </div>
                </div>
                <h3 className="font-bold text-lg text-gray-900 leading-tight mb-1">{book.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{book.genre}</span>
                    <span className={`text-xs font-bold ${book.quantity > 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {book.quantity} left
                    </span>
                </div>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={() => onClick(book)}
                    className="flex-1 py-2 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                    Details
                </button>
                <button
                    onClick={() => onBorrow(book.id)}
                    disabled={book.quantity < 1}
                    className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${book.quantity > 0 ? 'bg-primary text-white hover:bg-blue-800' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                >
                    Borrow
                </button>
            </div>
        </div>
    );
};

export default BookCard;
