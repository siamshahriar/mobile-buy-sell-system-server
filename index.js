const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const { query } = require("express");
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
    const bookingsCollection = client
      .db("mobileBuySell")
      .collection("bookings");

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
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    //post booking items on db
    app.post("/booking", async (req, res) => {
      const booking = req.body;
      const query = {
        productName: booking.productName,
      };
      const checkDuplicate = await bookingsCollection.find(query).toArray();

      if (checkDuplicate.length) {
        const message = `You already booked ${booking.productName}`;
        return res.send({ acknowledged: false, message });
      }
      const result = await bookingsCollection.insertOne(booking);
      res.send(result);
    });

    //get the buyers bookings
    app.get("/booking/:email", async (req, res) => {
      const email = req.params.email;
      const query = {
        email: email,
      };

      const result = await bookingsCollection.find(query).toArray();
      res.send(result);
    });

    //add products to db
    app.post("/products", async (req, res) => {
      const product = req.body;
      const query = {
        productName: product.productName,
      };
      const checkDuplicate = await productsCollection.find(query).toArray();

      if (checkDuplicate.length) {
        const message = `You already booked ${product.productName}`;
        return res.send({ acknowledged: false, message });
      }
      const result = await productsCollection.insertOne(product);
      res.send(result);
    });

    //find sellers products
    app.get("/products/:email", async (req, res) => {
      const email = req.params.email;
      const query = {
        email: email,
      };

      const result = await productsCollection.find(query).toArray();
      res.send(result);
    });

    //it will delete the product based on id
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
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
