const express = require('express');
const Books = require('../models/books');
const router = express.Router();

//get all data
router.get("/", async (req, res) => {
  try {
    const books = await Books.find();
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

//get single data
router.get("/:bookName", async (req, res) => {
  try {
    const bookName = req.params.bookName;
    const query = { bookName: bookName };
    const books = await Books.findOne(query);
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

//search books
router.get("/search-books/:bookName", async (req, res) => {
  try {
    const name = req.params.bookName;
    // Use Mongoose to perform the search
    const result = await Books.find({ bookName: { $regex: new RegExp(name, 'i') } })
      .sort({ bookName: 1 })
      .select({ bookName: 1 })
      .exec();

    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get('/home/featured-books', async (req, res) => {
  try {
    const books = await Books.find()
      .sort({ bookName: 1 })
      .select('bookName bookImage price availableCopies soldCopies category')
      .limit(5)

    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/* 
  //get data of single book---x
  router.get("/books/:bookName", async (req, res) => {
    const bookName = req.params.bookName;
    const query = { bookName: bookName };
    const result = await booksCollection.findOne(query);
    res.send(result);
  })

  router.get("/search-books/:bookName", async (req, res) => {---x
    const name = req.params.bookName;
    const query = { bookName: { $regex: new RegExp(name, 'i') } }
    const options = {
      sort: { bookName: 1 },
      projection: { bookName: 1 }
    };
    const cursor = booksCollection.find(query, options);
    const result = await cursor.toArray();
    res.send(result);
  })

  //featured books----x
  router.get("/featured-books", async (req, res) => {
    const query = {};
    const options = {
      sort: { bookName: 1 },
      projection: { bookName: 1, bookImage: 1, price: 1, availableCopies: 1, soldCopies: 1, category: 1 }
    };
    const cursor = booksCollection.find(query, options).limit(5);
    const result = await cursor.toArray();
    res.send(result);
  })

  //best selling books books
  router.get("/best-selling", async (req, res) => {
    const query = {};
    const options = {
      sort: { soldCopies: -1 },
      projection: { bookName: 1, bookImage: 1, price: 1, availableCopies: 1, soldCopies: 1, category: 1 }
    };
    const cursor = booksCollection.find(query, options).limit(5);
    const result = await cursor.toArray();
    res.send(result);
  })

  //new arrivals
  router.get("/new-arrivals", async (req, res) => {
    const query = {};
    const options = {
      sort: { dateOfArrival: -1 },
      projection: { bookName: 1, bookImage: 1, price: 1, availableCopies: 1, soldCopies: 1, category: 1 }
    };
    const cursor = booksCollection.find(query, options).limit(5);
    const result = await cursor.toArray();
    res.send(result);
  })

  //get data of books by author name
  router.get("/books-by-author/:authorName", async (req, res) => {
    const authorName = req.params.authorName;
    const query = { authorName: authorName };
    const options = {
      projection: { bookName: 1, bookImage: 1, price: 1, availableCopies: 1, soldCopies: 1, category: 1 }
    };
    const cursor = booksCollection.find(query, options);
    const result = await cursor.toArray();
    res.send(result);
  })

  //get data by publisher name
  router.get("/books-by-publisher/:publisherName", async (req, res) => {
    const publisherName = req.params.publisherName;
    const query = { publisherName: publisherName };
    const options = {
      projection: { bookName: 1, bookImage: 1, price: 1, availableCopies: 1, soldCopies: 1, category: 1 }
    };
    const cursor = booksCollection.find(query, options);
    const result = await cursor.toArray();
    res.send(result);
  })

  //get data by category name
  router.get("/books-by-category/:category", async (req, res) => {
    const category = req.params.category;
    const query = { category: category };
    const options = {
      projection: { bookName: 1, bookImage: 1, price: 1, availableCopies: 1, soldCopies: 1, category: 1 }
    };
    const cursor = booksCollection.find(query, options);
    const result = await cursor.toArray();
    res.send(result);
  })

  //add books
  router.post("/add-books", async (req, res) => {
    const newBook = req.body;
    const result = await booksCollection.insertOne(newBook);
    res.send(result);
  })

  //update a book
  router.put("/update-book/:id", async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const options = { upsert: true }
    const updateBook = req.body;
    const updatedBook = {
      $set: {
        bookName: updateBook.bookName,
        bookImage: updateBook.bookImage,
        authorName: updateBook.authorName,
        publisherName: updateBook.publisherName,
        price: updateBook.price,
        category: updateBook.category,
        dateOfArrival: updateBook.dateOfArrival,
        availableCopies: updateBook.availableCopies,
        soldCopies: updateBook.soldCopies,
        numberOfPages: updateBook.numberOfPages,
        description: updateBook.description

      }
    };
    const result = await booksCollection.updateOne(filter, updatedBook, options);
    res.send(result);
  })

  //delete
  router.delete('/delete-book/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await booksCollection.deleteOne(query);
    res.send(result);
  })

 */

module.exports = router;

