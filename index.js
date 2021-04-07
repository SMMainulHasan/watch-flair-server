const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = 5055;
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cxq2v.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


// app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.header(
//       "Access-Control-Allow-Headers",
//       "Origin, X-Requested-With, Content-Type, Accept"
//     );
//     next();
//   }); 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World!')
})

client.connect(err => {
    const productCollection = client.db("watchFlair").collection("products");
    const orderedProductCollection = client.db("watchFlair").collection("orderedProduct");

    app.post('/addProduct', (req, res) => {
        productCollection.insertOne(req.body)
            .then(result => {
                if (result.insertedCount > 0) {
                    res.status(200).send('Product added successfully!')
                }
                else {
                    res.status(401).send('Server side error!')
                }
            })
    })

    app.get('/product-detail/:id', (req, res) => {
        const id = req.params.id;
        productCollection.find({ _id: ObjectID(id) })
            .toArray((err, document) => {
                res.send(document[0])
            })
    })

    app.get('/product', (req, res) => {
        productCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.post('/addOrderPlace', (req, res) => {
        orderedProductCollection.insertOne(req.body)
            .then(result => {
                if (result.insertedCount > 0) {
                    res.status(200).send('Product added successfully!')
                }
                else {
                    res.status(401).send('Server side error!')
                }
            })
    })


    app.get('/orders/:email', (req, res) => {
        orderedProductCollection.find({ email: req.params.email })
            .toArray((err, documents)=> {
            res.send(documents)
        })
    })


    app.delete('/deleteProduct/:id', (req, res)=> {
        productCollection.deleteOne({_id: ObjectID(req.params.id)})
        .then(result=>{
            res.send(result.deletedCount > 0)
        })
    })

    // client.close();
});
app.listen(process.env.PORT || port);