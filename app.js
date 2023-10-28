const express = require('express');
const cors = require('cors')
const app = express();
const fileUpload = require('express-fileupload');


app.use(cors());
const userRoute = require("./routes/userRoute.js")
const doctorRoute = require("./routes/doctorRoute.js")

const port = process.env.PORT || 5000;
require('dotenv').config();


app.use(express.json())
// app.use(fileUpload({
//     limits: { fileSize: 50 * 1024 * 1024 }, // Set to 50MB as an example

//   }));
app.use(fileUpload({ useTempFiles : true, tempFileDir : '/tmp/' }));
  

const dbConfig = require("./config/dbConfig.js")
//apis
app.use('/api/patient', userRoute)

app.use('/api/doctor' , doctorRoute)




app.listen(port , () => console.log("Server Fine"))
