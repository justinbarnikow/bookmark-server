require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const errorHandler = require('./errorHandler')
const bookmarkRouter = require('./bookmarks/bookmark-router')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.use('/api/bookmarks', bookmarkRouter)

app.get('/', (req, res) => {
  res.send('Hello!')
})

app.use(errorHandler)

module.exports = app