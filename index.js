const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.l8rzo73.mongodb.net/?retryWrites=true&w=majority`;

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
    // ------------------------------------------------------------
    // Collect data from database
    await client.connect();
    const classCollection = client.db("LwLDB").collection("Classes")
    const teacherCollection = client.db("LwLDB").collection("teachers")

    app.post('/teacher', async(req, res) =>{
      const newTeacher = req.body;
      console.log(newTeacher)
      const result = await teacherCollection.insertOne(newTeacher);
      res.send(result)
    })
    app.get('/class/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const options = {
        projection: {title:1, name:1, image:1, price:1, short_description:1 }
      }
      const result = await classCollection.findOne(query, options);
      res.send(result);
    })
    app.get('/class', async(req, res) =>{
      const result = await classCollection.find().toArray(); 
      res.send(result);
    } )
    // Send data to Database
    app.post('/addedClass', async(req, res) =>{
      const newClass = req.body;
      console.log(newClass)
      const result = await classCollection.insertOne(newClass);
      res.send(result)
    })
    // Next--Create a collection
    
    // ----------------------------------------------------------
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Learn With Learners server is Running')
})

app.listen(port, () => {
    console.log(`Learn With Learners is running on port ${port}`)
})