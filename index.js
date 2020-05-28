require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()
const logger = require('./lib/logger')
const router = require('./config/routes')
const port = 8000
const dbURI = 'mongodb://localhost/plants-db3'

mongoose.connect(
  dbURI,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  (err) => {
    if (err) return console.log(err)
    console.log('Mongo is Connected')
  }
)


app.use(bodyParser.json())

app.use(logger)

app.use('/api', router)


app.listen(port, () => console.log(`App is listening on port ${port}`))