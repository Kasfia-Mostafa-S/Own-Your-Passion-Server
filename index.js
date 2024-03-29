const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

//middleware

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ijwgr8d.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const productCollection = client
      .db("electronicDB")
      .collection("electronic");


    const cartCollection = client
      .db("cartDB")
      .collection("cart");

      app.post("/cartBrand", async (req, res) => {
        const newProducts = req.body;
        const result = await cartCollection.insertOne(newProducts);
        res.send(result);
      });

    app.get("/cartBrands", async (req, res) => {
      const cursor = cartCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.delete('/cartBrands/:id', async(req,res)=> {
      const id = req.params.id
      console.log("DELETE", id)
      const query = {_id : new ObjectId(id)}
      const result = await cartCollection.deleteOne(query)
      res.send(result)
   })

    app.get("/products", async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

   
    app.get("/productB/:brandName", async (req, res) => {
      const brandName = req.params.brandName;
      const query = { brand : brandName };
      const cursor = productCollection.find(query);
      const result = await cursor.toArray()
      res.send(result);
    });

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    });

    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    });
    
    app.post("/products", async (req, res) => {
      const newProducts = req.body;
      const result = await productCollection.insertOne(newProducts);
      res.send(result);
    });

   

    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedProduct = req.body;
      const products = {
        $set: {
          name: updatedProduct.name,
          brand: updatedProduct.brand,
          price: updatedProduct.price,
          category: updatedProduct.category,
          photo: updatedProduct.photo,
          rating: updatedProduct.rating,
        },
      };
      const result = await productCollection.updateOne(filter,products,options)
      res.send(result)
    });

    

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Products available");
});

app.listen(port, () => {
  console.log(`Product server is running on port : ${port}`);
});
