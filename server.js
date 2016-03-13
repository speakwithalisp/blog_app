var app = require('./src/routes/routes.js');

var port = process.env.PORT || 8080;        // set our port



app.listen(port, function () {
  console.log('App listening on port!'+ port);
});
















