// db.js
import mysql from 'mysql2';
import dotenv from "dotenv";
dotenv.config();

const db = mysql.createConnection({
  host:"localhost",
  user: "root",
  password: '',
  database: "allsparktechnologies"
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('✅ Connected to MySQL database.');
});

export default db;
