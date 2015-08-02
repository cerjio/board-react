var express = require('express'),
mongodb = require('mongodb'),
app = express(),
bodyPaser = require('body-parser'),
validator = require('express-validator'),
logger = require('morgan'),
errorHandler = require('errorhandler'),
compression = require('compression'),
url = 'mongodb://localhost:27017/board'

mongodb.MongoClient.connect(url, function(err, db){
  if(err) {
    console.error(err)
    process.exit(1)
  }
  app.use(compression())
  app.use(logger('combined'))
  app.use(bodyPaser.urlencoded({extended:true}))
  app.use(bodyPaser.json())
  app.use(validator())
  app.use(express.static('public'))

  app.use(function(req, res, next){
    req.messages = db.collection('messages')
    return next()
  })

  app.get('/messages', function(req, res, next){
    req.messages.find({}, {sort: {_id: -1}}).toArray(function(err, docs){
      if(err) return next(err)
      return res.json(docs)
    })

  app.post('/messages', function(req, res, next){
      req.checkBody('message', 'Invalid message in body').notEmpty().isAlphanumeric()
      req.checkBody('name' ,'Invalid name body').notEmpty().isAlphanumeric()
      var errors = req.validationErrors()
      if(errors) return next(errors)
      req.messages.insert(req.body, function(err, result) {
        if(err) return next(err)
        return res.json(result.ops[0])
      })
  })

  })
  app.listen(5000)
})
