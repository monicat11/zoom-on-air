const { createProxyMiddleware } = require('http-proxy-middleware');

// proxy middleware options
/** @type {import('http-proxy-middleware/dist/types').Options} */
const options = {
  target: 'http://localhost:3001', // target host
  changeOrigin: true, // needed for virtual hosted sites
  ws: true, // proxy websockets
  pathRewrite: {
    // '^/api/test': 'http://localhost:3001/test', // rewrite path
    // '^/api/remove/path': '/path', //remove base path
  },
  router: {
    // when request.headers.host == 'dev.localhost:3000',
    // override target 'http://www.example.org' to 'http://localhost:8000'
    'dev.localhost:3000': 'http://localhost:3001',
  },
};

// create the proxy (without context)
const exampleProxy = createProxyMiddleware(options);

exports.exampleProxy=exampleProxy;