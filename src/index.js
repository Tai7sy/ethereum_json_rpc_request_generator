const promise = require('es6-promise');
promise.polyfill();

const http = require("http");
const url = require('url');
const wallet = require('./wallet.js');

http.createServer(function (request, response) {
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  let params = url.parse(request.url, true);
  let res = '';
  switch (params.pathname) {
    case '/':
      res = 'hello world';
      break;
    case '/create_wallet':
      res = wallet.generate();
      break;
    case '/decrypt_wallet':
      res = wallet.decrypt(params.query.private_key);
      break;
    case '/get_balance':
      res = wallet.getBalance(params.query.address);
      break;
    case '/get_token_balance':
      res = wallet.getTokenBalance(params.query.token, params.query.address);
      break;
    case '/transfer_estimate_gas':
      res = wallet.estimateGas(
        params.query.token,
        params.query.dec,
        params.query.from,
        params.query.to,
        params.query.value
      );
      break;
    case '/transfer_token':
      res = wallet.transferToken(
        params.query.token,
        params.query.dec,
        params.query.gas_price,
        params.query.gas_limit,
        params.query.private_key,
        params.query.from,
        params.query.to,
        params.query.value
      );
      break;
    default:
      res = JSON.stringify(params);

  }
  response.end(JSON.stringify(res));
}).listen(28888);

// 终端打印如下信息
console.log('Server running at http://127.0.0.1:28888/');