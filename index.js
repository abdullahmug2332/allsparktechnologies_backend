import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import db from './db.js';
import cors from 'cors';
import authRoutes from "./Routes/authRoutes.js"

import propertyRoutes from "./Routes/propertyRoutes.js"; 
const app = express();

app.use("/images", express.static("images"));

const PORT = process.env.PORT ;


app.use(express.json());
app.use(cors());

app.use("/",authRoutes)
app.use("/", propertyRoutes);



app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
