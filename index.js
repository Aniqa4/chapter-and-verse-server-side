const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
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
    //----------------------------------------x------------------------------------------



    //Authors' Collection----------------------------------------------------------------
    
    app.get("/names-of-authors", async (req, res) => {
      const query = {};
      const options = {
        projection: {name:1}
      };
      const cursor = authorsCollection.find(query,options);
      const result = await cursor.toArray();
      res.send(result);
    })
    //-------------------------------------------------------------------------------------






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