const express = require('express')
const cors = require('cors');
require('dotenv').config();

const {connectMongoDB}=require('./connectDB');
const booksRouter= require('./routes/books')

const app = express()
const port = process.env.PORT || 5000;

//malwares
app.use(cors());
app.use(express.json());

//connection to mongoDb
connectMongoDB(`mongodb+srv://${process.env.MongoDB_USER}:${process.env.MongoDB_PASS}@cluster0.l5sbbgb.mongodb.net/chapter-and-verse?retryWrites=true&w=majority`)


app.use('/books', booksRouter)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Server is running at port ${port}`)
})