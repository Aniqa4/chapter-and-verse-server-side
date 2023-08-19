const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000;

//malwares
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.MongoDB_USER}:${process.env.MongoDB_PASS}@cluster0.l5sbbgb.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    //await client.connect();



    //collections-----------------------------------------------------------------------
    const usersCollection = client.db('chapter-and-verse').collection('users');
    const authorsCollection = client.db('chapter-and-verse').collection('authors');
    const publishersCollection = client.db('chapter-and-verse').collection('publishers');
    const booksCollection = client.db('chapter-and-verse').collection('books');
    const categoriesCollection = client.db('chapter-and-verse').collection('categories');
    //----------------------------------------x------------------------------------------



    //Authors Collection----------------------------------------------------------------

    //get all data
    app.get("/authors", async (req, res) => {
      const cursor = authorsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    //get only id and names
    app.get("/names-of-authors", async (req, res) => {
      const query = {};
      const options = {
        projection: { name: 1 }
      };
      const cursor = authorsCollection.find(query, options);
      const result = await cursor.toArray();
      res.send(result);
    })

    //get one document based on id
    app.get("/authors/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await authorsCollection.findOne(query);
      res.send(result);
    })

    //add authors
    app.post("/add-authors", async (req, res) => {
      const newAuthor = req.body;
      const result = await authorsCollection.insertOne(newAuthor);
      res.send(result);
    })

    //update author
    app.put("/update-author/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true }
      const updateAuthor = req.body;
      const updatedAuthor = {
        $set: {
          name: updateAuthor.name,
          email: updateAuthor.email,
          phone: updateAuthor.phone,
          description: updateAuthor.description
        }
      };
      const result = await authorsCollection.updateOne(filter, updatedAuthor, options);
      res.send(result);
    })

    //delete author
    app.delete('/delete-author/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await authorsCollection.deleteOne(query);
      res.send(result);
    })

    //--------------------------------------------x----------------------------------------




    //Publishers collection---------------------------------------------------------------

    //get all data
    app.get("/publishers", async (req, res) => {
      const cursor = publishersCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    //get only id and names
    app.get("/names-of-publications", async (req, res) => {
      const query = {};
      const options = {
        projection: { name: 1 }
      };
      const cursor = publishersCollection.find(query, options);
      const result = await cursor.toArray();
      res.send(result);
    })

    //get one document based on id
    app.get("/publishers/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await publishersCollection.findOne(query);
      res.send(result);
    })

    //add publishers
    app.post("/add-publishers", async (req, res) => {
      const newPublisher = req.body;
      const result = await publishersCollection.insertOne(newPublisher);
      res.send(result);
    })

    //update publisher
    app.put("/update-publisher/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true }
      const updatePublisher = req.body;
      const updatedPublisher = {
        $set: {
          name: updatePublisher.name,
          email: updatePublisher.email,
          phone: updatePublisher.phone,
          description: updatePublisher.description
        }
      };
      const result = await publishersCollection.updateOne(filter, updatedPublisher, options);
      res.send(result);
    })

    //delete
    app.delete('/delete-publisher/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await publishersCollection.deleteOne(query);
      res.send(result);
    })
    //------------------------------------------x------------------------------------------



    //Categories collection---------------------------------------------------------------

    //get all data
    app.get("/categories", async (req, res) => {
      const cursor = categoriesCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    //get only id and names
    app.get("/names-of-categories", async (req, res) => {
      const query = {};
      const options = {
        projection: { name: 1 }
      };
      const cursor = categoriesCollection.find(query, options);
      const result = await cursor.toArray();
      res.send(result);
    })
    //------------------------------------------x------------------------------------------


    //Books collection---------------------------------------------------------------

    //get all data
    app.get("/Books", async (req, res) => {
      const cursor = booksCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    //get data of single book
    app.get("/Books/:bookName", async (req, res) => {
      const bookName = req.params.bookName;
      const query = { bookName: bookName };
      const result = await booksCollection.findOne(query);
      res.send(result);
    })

    //get all data with a few info
    app.get("/books-with-less-info", async (req, res) => {
      const query = {};
      const options = {
        projection: { bookName: 1, bookImage: 1, price: 1, availableCopies: 1, soldCopies: 1, category: 1 }
      };
      const cursor = booksCollection.find(query, options);
      const result = await cursor.toArray();
      res.send(result);
    })

    //get data of books by authors name
    app.get("/books-by-author/:authorName", async (req, res) => {
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
    app.get("/books-by-publisher/:publisherName", async (req, res) => {
      const publisherName = req.params.publisherName;
      const query = { publisherName: publisherName };
      const options = {
        projection: { bookName: 1, bookImage: 1, price: 1, availableCopies: 1, soldCopies: 1, category: 1 }
      };
      const cursor = booksCollection.find(query, options);
      const result = await cursor.toArray();
      res.send(result);
    })

    //get data by authors name
    app.get("/books-by-category/:category", async (req, res) => {
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
    app.post("/add-books", async (req, res) => {
      const newBook = req.body;
      const result = await booksCollection.insertOne(newBook);
      res.send(result);
    })

    //update a book
    app.put("/update-book/:id", async (req, res) => {
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
          description: updateBook.description

        }
      };
      const result = await booksCollection.updateOne(filter, updatedBook, options);
      res.send(result);
    })

     //delete
     app.delete('/delete-book/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await booksCollection.deleteOne(query);
      res.send(result);
    })

    
    //------------------------------------------x------------------------------------------




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Server is running at port ${port}`)
})