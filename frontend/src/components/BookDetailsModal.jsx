import React from 'react';
import { X } from 'lucide-react';

const BookDetailsModal = ({ book, onClose }) => {
    if (!book) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all duration-300">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-10"
                >
                    <X className="w-5 h-5 text-gray-600" />
                </button>

                <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 p-4">
                        <img
                            src={book.cover_image}
                            alt={book.title}
                            className="w-full h-auto object-cover rounded shadow-md"
                        />
                    </div>

                    <div className="md:w-2/3 p-6">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">{book.title}</h2>
                        <h3 className="text-xl text-gray-600 mb-4">by {book.author}</h3>

                        <div className="space-y-4">
                            <div>
                                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wide">
                                    {book.genre}
                                </span>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-700">Description</h4>
                                <p className="text-gray-600 leading-relaxed">
                                    {book.description || "No description available."}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 border-t pt-4">
                                <div>
                                    <span className="font-semibold block">Published Date:</span>
                                    {book.published_date || "Unknown"}
                                </div>
                                <div>
                                    <span className="font-semibold block">Available Copies:</span>
                                    {book.quantity}
                                </div>
                            </div>

                            {/* Placeholder for future reviews feature */}
                            {/* <div className="mt-4">
                                <h4 className="font-semibold text-gray-700">Recent Reviews</h4>
                                <p className="text-gray-500 italic text-sm">No reviews yet.</p>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetailsModal;
