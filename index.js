const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
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
        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })
    }
    finally {

    }
}
run().catch(error => console.error(error))


app.listen(port, () => {
    console.log(`TrainerX server running on ${port}`)
})