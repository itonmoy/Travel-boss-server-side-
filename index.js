var express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors =require('cors');

require('dotenv').config()

var app = express();
// const port =5000;
const port =procees.env.PORT || 5000;

// middlewares 
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.evzcc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
try{
    await client.connect();
    const database = client.db('travellingBoss');
    const servicesCollection =database.collection('services');

    // Get APi
    app.get('/services', async (req, res) => {
        const cursor = servicesCollection.find({});
        const services = await cursor.toArray();
        res.send(services);
    });
     // GET Single Service
     app.get('/services/:id', async (req, res) => {
        const id = req.params.id;
        console.log('getting specific service', id);
        const query = { _id: ObjectId(id) };
        const service = await servicesCollection.findOne(query);
        res.json(service);
    })

    // Post API
    app.post('/services', async(req, res)=>{
        const service =req.body;
        console.log('hit the post API',service )

        const result =await servicesCollection.insertOne(service);
        console.log(result);
        res.json(result);

    })
    // DELETE API
    app.delete('/services/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await servicesCollection.deleteOne(query);
        res.json(result);
    })
}
finally{
    // await client.close();
}

}
run().catch(console.dir);
app.get('/', function (req, res) {
  res.send('hello from TravelBoss server')
})

app.listen(port, ()=>{
    console.log("Ruuning the TravelBoss server", port);
})