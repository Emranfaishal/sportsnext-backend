const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URL;

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
        const bookingCollection = db.collection('bookings');



        // =========================
        // Sports Collection Routes
        // =========================

        // Get All Sports
        app.get('/sportsCollection', async (req, res) => {

            const result = await sportsCollection.find().toArray();

            res.json(result);
        });


        // Add Sports
        app.post('/sportsCollection', async (req, res) => {

            const sportsData = req.body;

            const result = await sportsCollection.insertOne(sportsData);

            res.json(result);
        });


        // Get Single Sports
        app.get('/sportsCollection/:id', async (req, res) => {

            const { id } = req.params;

            const result = await sportsCollection.findOne({
                _id: new ObjectId(id)
            });

            res.json(result);
        });


        // Update Sports
        app.patch('/sportsCollection/:id', async (req, res) => {

            const { id } = req.params;

            const updateData = req.body;

            const result = await sportsCollection.updateOne(
                { _id: new ObjectId(id) },
                { $set: updateData }
            );

            res.json(result);
        });


        // Delete Sports
        app.delete('/sportsCollection/:id', async (req, res) => {

            const { id } = req.params;

            const result = await sportsCollection.deleteOne({
                _id: new ObjectId(id)
            });

            res.json(result);
        });




        // =========================
        // Booking Routes
        // =========================

        // Add Booking
        app.post('/booking', async (req, res) => {

            const bookingData = req.body;

            const result = await bookingCollection.insertOne(bookingData);

            res.json(result);
        });


        // Get User Bookings
        app.get('/booking/:userId', async (req, res) => {

            const { userId } = req.params;

            const result = await bookingCollection
                .find({ userId: userId })
                .toArray();

            res.json(result);
        });


        // Delete Booking
        app.delete('/booking/:bookingId', async (req, res) => {

            const { bookingId } = req.params;

            const result = await bookingCollection.deleteOne({
                _id: new ObjectId(bookingId)
            });

            res.json(result);
        });



        await client.db("admin").command({ ping: 1 });

        console.log("MongoDB Connected Successfully!");

    }

    finally {

        // await client.close();

    }
}

run().catch(console.dir);




app.get('/', (req, res) => {

    res.send('Server is running fine!');

});


app.listen(port, () => {

    console.log(`Server running on port ${port}`);

});