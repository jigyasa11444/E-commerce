// packages
import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

//utiles
import connectDB from "./config/db.js";
import userRoutes from './routes/userRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import orderRoutes from './routes/orderRoutes.js'

dotenv.config();                          //Loads environment variables from a .env file into process.env.
const port = process.env.PORT || 5000;    //Retrieves the server port from the environment variables (.env file).otherwise it takes defaults to 5000

connectDB();                              //funtion call to connect mongoDB

const app = express();

app.use(express.json());                 //Ensures that req.body contains parsed JSON instead of undefined.
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());

app.use('/api/users', userRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/products', productRoutes)
app.use('/api/upload',uploadRoutes)
app.use('/api/orders',orderRoutes)

// connecting PayPay
app.get("/api/config/paypal", (req, res) => {
    res.send({clientId: process.env.PAYPAL_CLIENT_ID })
})

const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname + "/uploads")));

app.listen(port,()=>{
    console.log(`server running on ${port}`);
})