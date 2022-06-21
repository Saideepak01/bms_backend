import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 2001; //adding a port number to make a connection to the port
const MONGO_URL = process.env.MONGO_URL; //connecting the mongoDB database

//making a connection to start the server with the mongoclient
async function createConnection() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  console.log("Mongo DB connected");
  return client;
}

const client = await createConnection();

app.use(express.json()); //this converts every connection request as json
app.use(cors()); //to enable cross origin resource sharing

// reads the database using get and send the DB to the frontend
app.get("/", async (request, response) => {
  const data = await client.db("bms").collection("bms_data").find({}).toArray(); // to eliminate cursor (pagination) we are converting to array to send every data to the frontend
  response.send(data);
});

// add a new data using post method and send the data to the frontend
app.post("/", async (request, response) => {
  const newData = request.body;

  const data = await client.db("bms").collection("bms_data").insertOne(newData);

  response.send(data);
});

//to start listening to the connection on the specified port
app.listen(PORT, () => console.log("app is started"));
