const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

const dbConfig = require("./config/dbConfig.js")
console.log(process.env.MONGO_URL)
app.listen(port , () => console.log("Server Fine"))
