// process.stdout.write('\033c'); // clear the screen
const webserver = require('../lib/webserver');
let p = 9876;

function port() {
  return --p;
}

// this is our fake local and private web server
const echoServerPort = port();
const { app: echoServer, server } = webserver({
  port: echoServerPort,
  httpsKey: process.env.TEST_KEY, // Optional
  httpsCert: process.env.TEST_CERT, // Optional
});

echoServer.get('/echo-param/:param', (req, res) => {
  res.send(req.params.param);
});

echoServer.post('/echo-body/:param?', (req, res) => {
  const contentType = req.get('Content-Type');
  if (contentType) {
    res.type(contentType);
  }
  res.send(req.body);
});

echoServer.post('/echo-headers/:param?', (req, res) => {
  res.json(req.headers);
});

echoServer.get('/echo-query/:param?', (req, res) => {
  res.json(req.query);
});

echoServer.get(
  '/nested/path-with/wildcard/and-an-escaped-slash/to/:filename',
  (req, res) => {
    res.send(req.params.filename);
  });

echoServer.get('/repos/owner/repo/contents/folder/package.json',
  (req, res) => {
    res.json({headers: req.headers, query: req.query, url: req.url});
  });

echoServer.all('*', (req, res) => {
  res.send(false);
});


module.exports = (tap) => {
  tap.tearDown(() => {
    server.close();
  });

  return {
    echoServerPort,
    port,
    server
  };
};
