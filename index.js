const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require("body-parser");

require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: "false" }));
app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const trackingModel = require('./myApp');

app.post('/api/users', function(req, res, next) {
  trackingModel.createUser(req.body, function(err, data) {
    if (err) next(err);
    res.json(data)
  });
});

app.get('/api/users', function(req, res, next) {
  trackingModel.findAllUsers(function(err, data) {
    if (err) next(err);
    res.send(data)
  });
});

app.post('/api/users/:_id/exercises', function(req, res, next) {
  trackingModel.createExercise(req.params._id, req.body, function(err, data) {
    if (err) next(err);
    res.json(data)
  });
});


app.get('/api/users/:_id/logs', function (req, res, next) {
  trackingModel.findUserLogs(req, function (err, data) {
    if (err) next(err);
    res.send(data)
  });
});

// Error handler
app.use(function(err, req, res, next) {
  if (err) {
    res
      .status(err.status || 500)
      .type("txt")
      .send(err.message || "SERVER ERROR");
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
