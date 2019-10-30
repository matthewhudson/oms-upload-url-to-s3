#!/usr/bin/env node

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { actionHandler } = require('./actions')

app.use(bodyParser.json())

const port = process.env.PORT || 8080

const message = {
  success: false
}

app.post('/upload', (req, res) => {
  const { url } = req.body

  actionHandler(url)
    .then(url => {
      message.success = true
      message.url = url
      res.json(message)
    })
    .catch(er => {
      // @TODO: Log
      message.error = `[500] ${er}`
      res.status(500).json(message)
    })
})

app.get('/health', (req, res) => res.send('OK'))

app.listen(port, () =>
  console.log(`Listening on localhost: http://localhost:${port}`)
)
