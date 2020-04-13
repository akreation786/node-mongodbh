const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;

require('dotenv').config()

const users = ['asad', 'MOin', 'saber', 'Susmita', 'Sohana', 'sabana'];

const app = express()

app.use(cors());
// parse application/json
app.use(bodyParser.json())

const dbUser = process.env.DB_USER;
const pass = process.env.DB_PASS;
const uri = process.env.DB_PATH;

let client = new MongoClient(uri, { useNewUrlParser: true });


app.get('/products', (req, res) =>{
   client = new MongoClient(uri, { useNewUrlParser: true });
   client.connect(err => {
      const collection = client.db("shopStore").collection("Products");
      collection.find().toArray((err, documents) => {
            if(err){
               res.status(500).send({message:err})
            }else{
               res.send(documents)
            }
         });
         client.close();
      });
})


app.get('/products/:key', (req, res)=>{
   const key = req.params.key;
   client = new MongoClient(uri, { useNewUrlParser: true });
   client.connect(err => {
      const collection = client.db("shopStore").collection("Products");
      collection.find({key}).toArray((err, documents) => {
         if(err){
            console.log(err);
            res.status(500).send({message:err})
         }else{
            res.send(documents[0])
         }
      });
      client.close();
   });
});

app.post('/getProductsByKey', (req, res)=>{
   const key = req.params.key;
   const productKeys = req.body;

   client = new MongoClient(uri, { useNewUrlParser: true });
   client.connect(err => {
      const collection = client.db("shopStore").collection("Products");
      collection.find({key: {$in: productKeys}}).toArray((err, documents) => {
         if(err){
            console.log(err);
            res.status(500).send({message:err})
         }else{
            res.send(documents)
         }
      });
      client.close();
   });
});
//delete
// update
//post
app.post('/addProduct', (req, res) => {
   client = new MongoClient(uri, { useNewUrlParser: true });
   const product = req.body;
   
   client.connect(errror => {
   const collection = client.db("shopStore").collection("Products");
   collection.insert(product, (err, result) => {
         if(err){
            console.log(err);
            res.status(500).send({message:err})
         }else{
            res.send(result.ops[0])
         }
      });
      client.close();
   });
})

app.post('/placeOrder', (req, res) => {
   const orderDetails = req.body;
   orderDetails.orderTime = new Date();
   client = new MongoClient(uri, { useNewUrlParser: true });
   
   client.connect(errror => {
   const collection = client.db("shopStore").collection("orders");
   collection.insertOne(orderDetails, (err, result) => {
         if(err){
            console.log(err);
            res.status(500).send({message:err})
         }else{
            res.send(result.ops[0])
         }
      });
      client.close();
   });
})

const port = process.env.PORT || 4200;
app.listen(port, () => console.log('Listentng to Port 4200'));
