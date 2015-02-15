var logger             = require('morgan'),
    cors               = require('cors'),
    http               = require('http'),
    express            = require('express'),
    errorhandler       = require('errorhandler'),
    cors               = require('cors'),
    dotenv             = require('dotenv'),
    InstagramGrabber   = require('./instagramGrabber'),
    bodyParser         = require('body-parser');



dotenv.load();

var app = express();

// Parsers
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(cors());

app.use(function(err, req, res, next) {
  if (err.name === 'StatusError') {
    res.send(err.status, err.message);
  } else {
    next(err);
  }
});

if (process.env.NODE_ENV === 'development') {
  app.use(express.logger('dev'));
  app.use(errorhandler())
}

app.get('/search/user/:username/:hashtag', function(req, res) {
  var grabber = new InstagramGrabber(process.env.CLIENT_ID);
  grabber.searchByUsernameAndHashtag(req.params.username,
    req.params.hashtag, req.query.amount).then(function(photos) {
      console.log("Finished", photos);
      res.status(200).send(photos);
    }, function(error) {
      console.log(arguments);
      res.status(500).send({
        error: error,
        text: "There was an error"
      });
    });
});

var port = process.env.PORT || 3000;

http.createServer(app).listen(port, function (err) {
  console.log('listening in http://localhost:' + port);
});

