require("dotenv").config()
const express = require("express")
const cors = require('cors')
const bodyParser =require("body-parser")
require("express-async-errors")
require("./config/database")

const app = express();

const userRoutes = require('./routes/user_routes')

const corsOptions = {
    origin: '*', // Update with your frontend's URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Enable CORS credentials (cookies, authorization headers, etc.)
    allowedHeaders: 'Content-Type,Authorization',
};

app.use(cors(corsOptions));

//middleware
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json());
app.use('/public', express.static('public'));
app.use('/',userRoutes)
app.use((err, req, res, next) => {
    console.log(err)
    res.status(err.status || 500).json({
        error : err,
        message : `Internal server error!`,
        success : false
    })
    client.release()
})


app.listen(3000,()=>{
    console.log("server running on port 3000");
})