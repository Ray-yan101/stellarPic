const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

const API_KEY = process.env.NASA_API_KEY;

app.get("/apod", async (req, res) => {
    try {
        const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;
        const { data } = await axios.get(url);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Error fetching APOD" });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));
