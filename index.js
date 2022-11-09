const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000
require('dotenv').config()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('server running')
})

// user: trainerXDb
// pass: NDvjtDuCDc9902Xe

const uri = "mongodb+srv://trainerXDb:NDvjtDuCDc9902Xe@cluster0.3dkasq3.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const servicesCollection = client.db('trainerX').collection('services')
        const reviewsCollection = client.db('trainerX').collection('reviews')
        app.get('/servicesHome', async (req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services);
        })

        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.send(service);
        })

        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewsCollection.insertOne(review)
            res.send(result);
        })

        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { service: id }
            const cursor = reviewsCollection.find(query)
            const reviews = await cursor.toArray()
            res.send(reviews);
        })

        app.get('/reviews', async (req, res) => {
            let query = {}
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewsCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews)
        })

        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewsCollection.deleteOne(query)
            res.send(result);
        })

        app.patch('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const message = req.body.message
            const query = { _id: ObjectId(id) }
            const updatedDoc = {
                $set: {
                    message: message
                }

            }
            const result = await reviewsCollection.updateOne(query, updatedDoc)
            res.send(result);
        })
    }
    finally {

    }
}
run().catch(error => console.error(error))


app.listen(port, () => {
    console.log(`TrainerX server running on ${port}`)
})