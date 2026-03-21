require('dotenv').config();
const express = require('express');
const app = express();

const PORT = process.env.PORT
const db = require('./src/db')

async function start() {
  await db.getConnection()
  console.log('Database connected')
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
}

start().catch(console.error)