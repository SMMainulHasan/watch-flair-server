const express = require('express');
const app = express();
const cors = require('cors')
require('dotenv').config();
const port = 5055;
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cxq2v.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World!')
})

client.connect(err => {
    const productCollection = client.db("watchFlair").collection("products");

    app.post('/addProduct', (req, res) => {
        productCollection.insertOne(req.body)
            .then(result => {
                if(result.insertedCount > 0){
                    res.status(200).send('Product added successfully!')
                }
                else{
                    res.status(401).send('Server side error!')
                }
            })
    })

    app.get('/product', (req, res) => {
        productCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

    // client.close();
});

app.listen(port);