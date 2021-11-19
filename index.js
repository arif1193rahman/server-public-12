const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middle Ware is important
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.l9eit.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
//   console.log('coooool',uri);

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// connect to the database
async function run() {
  try {
    await client.connect();
    const database = client.db("secureProperty").collection("services");
    const exploreCollect = client.db("secureProperty");
    const exploreServiceConnection = exploreCollect.collection("explore");
    const review = client.db("secureProperty");
    const reviewConnection = review.collection("reviewPart");

    //  Get API
    app.get("/services", async (req, res) => {
      const cursor = database.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    // Get single service
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const services = await database.findOne(query);
      res.json(services);
    });

    // POST API
    app.post("/services", async (req, res) => {
      const service = req.body;
      const result = await database.insertOne(service);
      res.json(result);
    });

    //get explore Collection

    app.get("/explore", async (req, res) => {
      const cursor = exploreServiceConnection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    //post review reviewPart
    app.post("/reviewPart", async (req, res) => {
      const reviews = req.body;
      const result = await reviewConnection.insertOne(reviews);
      console.log(result);
      res.json(result);
    });

    // Get all reviews
    app.get("/reviewPart", async (req, res) => {
      const cursor = reviewConnection.find({});
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    app.put("/services/admin", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await database.updateDoc(filter, updateDoc);
      res.json(result);
    });

    app.get("/services", async (req, res) => {
      const cursor = database.find({});
      const booking = await cursor.toArray();
      res.send(booking);
    });

    // confirm order
    app.post("/services", async (req, res) => {
      const result = await database.insertOne(req.body);
      res.json(result);
    });

    // My order
    app.get("/myOrders/:email", async (req, res) => {
      const result = await database.find({ email: req.params.email }).toArray();
      res.json(result);
    });
  } finally {
    // await clint.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!!!!");
});

app.listen(port, () => {
  console.log("this is running", port);
});
