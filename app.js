const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const path = require('path');
const port = process.env.PORT || 3001;


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGODB;

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
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

const database = client.db('frenchlessons');
const messagesCol = database.collection('messages');

let users;

if (process.env.NODE_ENV === 'production') {
    users = JSON.parse(process.env.USERS);
} else {
    users = [
        { username: 'Loki', password: 'aaaaaaaaaaaaa', color: '#41e742' },
        { username: 'Aqua', password: 'bbbbbbbbbbbbb', color: '#75e3ff' },
        { username: 'Athena', password: 'ccccccccccccc', color: '#ffb522' }
    ];
}

app.use(bodyParser.text());

app.get('/', (req, res) => res.type('html').status(404).sendFile(path.join(__dirname + '/404.html')));
app.get('/404.js', (req, res) => res.type('js').sendFile(path.join(__dirname + '/404.js')));
app.get('/styles.css', (req, res) => res.type('css').sendFile(path.join(__dirname + '/styles.css')));

app.put('/index.html', (req, res) => res.type('html').sendFile(path.join(__dirname + '/index.html')));

app.post('/verify-password', (req, res) => {
    let response = false;
    const colors = users.map(user => { return { username: user.username, color: user.color } });

    users.forEach(user => {
        if (req.body === user.password) {
            response = { user: user.username, colors: colors };
        }
    });

    res.json(response);
});

app.get('/script.js', (req, res) => res.type('js').sendFile(path.join(__dirname + '/script.js')));

app.get('/load-messages/:messagesNumber', async (req, res) => {
    await client.connect();
    const cursor = messagesCol.find().sort({ date: -1 }).limit(Number(req.params.messagesNumber));
    const messages = await cursor.toArray();
    await client.close();

    res.json(messages);
});

app.post('/create-message', async (req, res) => {
    const message = { ...JSON.parse(req.body), date: Date.now() };

    await client.connect();
    await messagesCol.insertOne(message);
    await client.close();

    res.json(message);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
