const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

/* --- MongoDB ---- */

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dhw1j4v.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const categoryCollection = client
      .db("mobileBuySell")
      .collection("category");
    const productsCollection = client
      .db("mobileBuySell")
      .collection("products");
    const usersCollection = client.db("mobileBuySell").collection("users");

    //to get the category names
    app.get("/categories", async (req, res) => {
      const query = {};
      const result = await categoryCollection.find(query).toArray();
      //   console.log(result);
      res.send(result);
    });

    //get the products by categories
    app.get("/categories/:category", async (req, res) => {
      const category = req.params.category;
      const query = {
        categoryName: category,
        sold: false,
      };
      const result = await productsCollection.find(query).toArray();
      //   console.log(result);
      res.send(result);
    });

    //get the user information
    app.get("/users/:email", async (req, res) => {
      const userEmail = req.params.email;
      const query = {
        email: userEmail,
      };
      const result = await usersCollection.find(query).toArray();
      //   console.log(result);
      res.send(result);
    });

    //post user information on db
    app.post("/users", async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.log);

//Basic server start
app.get("/", async (req, res) => {
  res.send("mobile buy sell server is running");
});

app.listen(port, () => console.log(`mobile buy sell running on ${port}`));
