const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
dotenv.config();
const uri = process.env.MONGODB_URL;
const app = express();
const port = process.env.PORT;
app.use(cors());
app.use(express.json())


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        const db = client.db('sports');
        const sportsCollection = db.collection('sportsCollections');

        // 1
        app.get('/sportsCollection', async (req, res) => {
            const result = await sportsCollection.find().toArray();
            res.json(result);
        });
        // 2
        app.post('/sportsCollection', async (req, res) => {
            const sportsData = req.body;
            // console.log(sportsData);
            const result = await sportsCollection.insertOne(sportsData);
            res.json(result);
        });
        // 3
        app.get('/sportsCollection/:id', async (req, res) => {
            const id = req.params;
            const result = await sportsCollection.findOne({ _id: new ObjectId(id) });
            res.json(result);
        });
        // 4
        app.patch('/sportsCollection/:id', async (req, res) => {
            const id = req.params;
            const updateData = req.body;
            const result = await sportsCollection.updateOne({ _id: new ObjectId(id) }, { $set: updateData });
            res.json(result);
        });
        // 5
        app.delete('/sportsCollection/:id', async (req, res) => {
            const id = req.params;
            const result = await sportsCollection.deleteOne({ _id: new ObjectId(id) });
            res.json(result);
        });



        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Server is running fine!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})