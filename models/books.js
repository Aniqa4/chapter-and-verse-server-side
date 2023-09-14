const mongoose = require('mongoose');

//Schema
const booksSchema = new mongoose.Schema(
    {
        bookName: {
            type: String,
            required: true,
        },
        bookImage: {
            type: String,
            required: true,
        },
        authorName: {
            type: String,
            required: true,
        },
        publisherName: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        dateOfArrival: {
            type: Date,
            required: true,
        },
        availableCopies: {
            type: Number,
            required: true,
        },
        soldCopies: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        numberOfPages: {
            type: Number,
            required: true,
        }
    }
)

const Books = mongoose.model('books', booksSchema);
module.exports = Books;