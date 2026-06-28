const express = require('express')
const cors = require('cors');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const {connectMongoDB}=require('./connectDB');

const app = express()
const port = process.env.PORT || 5000;

//middlewares
app.use(cors());
app.use(express.json());

//connection to mongoDb
connectMongoDB(`mongodb+srv://${process.env.MongoDB_USER}:${process.env.MongoDB_PASS}@cluster0.l5sbbgb.mongodb.net/chapter-and-verse?retryWrites=true&w=majority`)

// Routes
app.use(require("./routes/users.routes"));
app.use(require("./routes/authors.routes"));
app.use(require("./routes/publishers.routes"));
app.use(require("./routes/categories.routes"));
app.use(require("./routes/books.routes"));
app.use(require("./routes/orders.routes"));


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Server is running at port ${port}`)
})