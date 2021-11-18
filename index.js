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
    // const bookingCollect = client.db("secureProperty").collection("booking");
    //  const exploreCollect = client.db("secureProperty").collection("explore");

    // console.log('connect to database');

 // Get API
 app.get("/services", async (req, res) => {
  const cursor = database.find({});
  const services = await cursor.toArray();
  res.send(services);
});

// Get single service
app.get('/services/:id', async(req, res)=>{
  const id = req.params.id;
  // console.log('getting specifi service', id)
  const query = {_id: ObjectId(id)};
  const services = await database.findOne(query);
  res.json(services);
})

    // POST API
    app.post('/services',async(req, res)=>{
        const service = req.body;
        const result = await database.insertOne(service);
        // console.log('hit the post API');
        res.json(result)
    } )




    // Explore
    // app.get("/explore", async (req, res) => {
    //   const cursor = database.find({});
    //   const explore = await cursor.toArray();
    //   res.send(explore);
    // });
    
     // Get single service
    // app.get('/explore/:id', async(req, res)=>{
    //   const id = req.params.id;
       // console.log('getting specifi service', id)
    //   const query = {_id: ObjectId(id)};
    //   const explore = await database.findOne(query);
    //   res.json(explore);
    // })
    
        // POST API explore
    // app.post('/explore',async(req, res)=>{
    //         const explore = req.body;
    //         const result = await exploreCollect.insertOne(explore);
            // console.log('hit the post API');
    //         res.json(result)
    //     } )


app.get('/services', async(req, res)=>{
  const cursor = database.find({});
      const booking = await cursor.toArray();
      res.send(booking);
})

    // confirm order
    app.post('/services', async(req, res)=>{
      const result = await database.insertOne(req.body);
    res.json(result);
    })


    // My order
    app.get('/myOrders/:email', async(req, res)=>{
      const result = await database.find({email: req.params.email}).toArray();
      res.json(result);
    })

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
