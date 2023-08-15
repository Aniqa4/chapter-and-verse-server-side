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