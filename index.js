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

//Basic server start
app.get("/", async (req, res) => {
  res.send("mobile buy sell server is running");
});

app.listen(port, () => console.log(`mobile buy sell running on ${port}`));
