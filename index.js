process.on("uncaughtException", (err) => {
  console.log("error", err);
});

import express from "express";
import dotenv from "dotenv";

import { dbConnection } from "./dataBases/dbConnections.js";
import { bootStrap } from "./src/modules/index.routers.js";
import axios from "axios";

dotenv.config();
const app = express();

dbConnection();
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.get("/",(req,res,next)=>{
  res.status(200).json({msg: "success"})
})
app.get('/map/:location', async (req, res) => {
  const location = req.params.location;

  try {
      // Make a request to Mapbox Static Images API
      const response = await axios.get(`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${encodeURIComponent(location)}/800x600?access_token=YOUR_MAPBOX_ACCESS_TOKEN`);
      console.log(response)
      // Send the image as a response
      res.set('Content-Type', 'image/png');
      res.send(response.data);
  } catch (error) {
      console.error('Error fetching map:', error.message);
      res.status(500).send('Error fetching map');
  }
}); 

bootStrap(app);



process.on("unhandledRejection", (err) => {
  console.log("error", err);
});
app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`)
);

