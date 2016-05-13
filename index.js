var express = require('express'),
    app = express();
var request = require('request');
var token = '';


var oauth2 = require('simple-oauth2')({
  clientID: 'bHzFQdixXXbZNU7Mzwj14Zki8yPOrxKxAvxm3EpW',
  clientSecret: 'dofc3DKJJDh7FusT3SLmLHwzKlxtrsOmwxha5ISO',
  site: 'http://www.twitchalerts.com/',
  tokenPath: 'api/v1.0/token',
  authorizationPath: 'api/v1.0/authorize'
});

// Authorization uri definition
var authorization_uri = oauth2.authCode.authorizeURL({
  redirect_uri: 'https://br-mario-marathon.herokuapp.com/callback',
  scope: 'donations.create',
  state: '3(#0/!~'
});

// Initial page redirecting to Github
app.get('/auth', function (req, res) {
    res.redirect(authorization_uri);
});

// Callback service parsing the authorization token and asking for the access token
app.get('/callback', function (req, res) {
  var code = req.query.code;

  oauth2.authCode.getToken({
    code: code,
    redirect_uri: 'https://br-mario-marathon.herokuapp.com/callback'
  }, saveToken);

  function saveToken(error, result) {
    if (error) { console.log('Access Token Error', error.message); }

    console.log('aquired token: ', token);

    token = oauth2.accessToken.create(result);
  }

  res.send(200);
});

app.get('/', function (req, res) {
  res.send('Hello<br><a href="/auth">Log in with Twitch Alerts</a>');
});

app.get('/donation', (req, res) => {
  var data = req.query;
  data.access_token = token.token.access_token;

  console.log('sending donation:', data);

  var options = {
    hostname: 'https://www.twitchalerts.com/api/v1.0/donations',
    method: 'POST',
    json: true,
    body: JSON.stringify(data)
  };

  // callback = function(response) {
  //   var str = '';
  //
  //   //another chunk of data has been recieved, so append it to `str`
  //   response.on('data', function (chunk) {
  //     str += chunk;
  //   });
  //
  //   //the whole response has been recieved, so we just print it out here
  //   response.on('end', function () {
  //     console.log(str);
  //   });
  // }
  //
  // var request = new http.ClientRequest(options, callback);
  // request.end(data);

  request(options, (err, res, body) => {console.log(res, body)});

  res.send(200);
});

app.listen(process.env.PORT || 3000);

console.log('Express server started on port 3000');
