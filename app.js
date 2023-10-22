const express = require('express');
const cors = require('cors')
const app = express();

app.use(cors());
const userRoute = require("./routes/userRoute.js")

const port = process.env.PORT || 5000;
require('dotenv').config();


app.use(express.json())


const dbConfig = require("./config/dbConfig.js")
//apis
app.use('/api/user', userRoute)

app.listen(port , () => console.log("Server Fine"))
