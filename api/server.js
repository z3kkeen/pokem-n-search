const express = require('express')
const pg = require('pg')
const cors = require('cors')

const server = express()
require('dotenv').config()

const db = new pg.Client({
  user: process.env.USER,
  database: process.env.DATABSE,
  password: process.env.PASSWORD,
  host: process.env.Host
})

db.connect().then(res => console.log('connected'))

server.use(cors())
server.use(express.json())
server.use(express.urlencoded({ extended: true }))

server.get('/api/pokemon', async (req, res) => {

  const data = await db.query('SELECT * FROM pokemon')

  res.json(data.rows)
})

server.post('/api/pokemon', async (req, res) => {
  console.log(req.body);

  try {
    console.log(req.body)
    await db.query(`INSERT INTO pokemon(name) VALUES ($1)`, [req.body.name][req.body.base_experience])
  } catch (error) {
    console.log(error)
  }
  res.json({ msg: 'saved' })
})


server.listen(3000)