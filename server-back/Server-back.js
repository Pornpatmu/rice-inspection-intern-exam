require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT
const db = require('./src/db')
const cors = require('cors');

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type']
}))

app.use(express.json());
const standardRoute = require('./src/routes/standard.route');
const historyRoute = require('./src/routes/history.route');

app.use('/standard', standardRoute);
app.use('/history', historyRoute);



async function start() {
  await db.getConnection()
  console.log('Database connected')
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
}

start().catch(console.error)