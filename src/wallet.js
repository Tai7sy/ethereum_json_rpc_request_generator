const ether = require('ethereumjs-wallet');
const ethUtil = require('ethereumjs-util');
const abi = require('ethereumjs-abi');
const Tx = require('ethereumjs-tx');
const crypto = require('crypto');
const units = require('./libs/units');

/**
 * 生成钱包地址
 * @returns {{private_key: *, public_key: *, address: *}}
 */
function generate () {
  const wallet = ether.generate();
  return {
    "private_key": wallet.getPrivateKeyString(),
    "public_key": wallet.getPublicKeyString(),
    "address": wallet.getAddressString(),
  };
}

/**
 * 通过钱包私钥 访问钱包
 * @param private_key
 * @returns {*}
 */
function decrypt (private_key) {
  if (!private_key || private_key.length < 10)
    return 'private_key error';
  try {
    const wallet = ether.fromPrivateKey(ethUtil.toBuffer(private_key));
    return {
      "address": wallet.getAddressString()
    }
  } catch (e) {
    return 'error'
  }
}

function getBalance (address) {
  return {
    id: crypto.randomBytes(16).toString('hex'),
    jsonrpc: "2.0",
    method: "eth_getBalance",
    params: [address, "latest"]
  }
}


const ERC20 = {
  balanceOf (address) {
    const name = 'balanceOf';
    const inputs = [
      {
        name: '_owner',
        type: 'address'
      }
    ];
    const inputTypes = inputs.map(e => e.type);
    const encodedArgs = abi.rawEncode(inputTypes, [address]).toString('hex');
    const methodSelector = abi.methodID(name, inputTypes).toString('hex');
    return ethUtil.addHexPrefix(`${methodSelector}${encodedArgs}`);
  },
  transfer (to, value) {
    const name = 'transfer';
    const inputs = [
      {
        name: '_to',
        type: 'address'
      },
      {
        name: '_value',
        type: 'uint256'
      }
    ];
    const inputTypes = inputs.map(e => e.type);
    const encodedArgs = abi.rawEncode(inputTypes, [to, value]).toString('hex');
    const methodSelector = abi.methodID(name, inputTypes).toString('hex');
    return ethUtil.addHexPrefix(`${methodSelector}${encodedArgs}`);
  }
};

function getTokenBalance (token, address) {
  const data = ERC20.balanceOf(address);

  return [{
    id: crypto.randomBytes(16).toString('hex'),
    jsonrpc: "2.0",
    method: "eth_call",
    params: [
      {
        'to': token,
        'data': data
      },
      "pending"]
  }]
}

function estimateGas (token, token_dec, from, to, _value) {
  const value = units.toWei(_value, token_dec);
  const data = ERC20.transfer(to, value);
  return [
    {
      id: crypto.randomBytes(16).toString('hex'),
      jsonrpc: "2.0",
      method: "eth_gasPrice",
      params: []
    },
    {
      id: crypto.randomBytes(16).toString('hex'),
      jsonrpc: "2.0",
      method: "eth_estimateGas",
      params: [{
        from: from,
        to: token,
        value: "0x0",
        data: data
      }],
    }]
}

function transferToken (
  token,
  token_dec,
  gasPrice,
  gasLimit,
  private_key,
  from,
  to,
  _value
) {
  const value = units.toWei(_value, token_dec);
  const data = ERC20.transfer(to, value);


  const transaction = {
    nonce: "0x00",
    gasPrice: "0x098bca5a00",
    //  = ethUtil.addHexPrefix(units.gasPriceToBase(41)),
    //  = 41 gwei(0.000000041 ETH) per gas)
    //  用 gasPrice (5-10 gwei) 可能会转账较慢, 被人抢先
    gasLimit: gasLimit,
    to: token,
    value: "0x00",
    data: data,
    chainId: 1
  };

  const tx_info = new Tx(transaction);
  tx_info.sign(ethUtil.toBuffer(private_key));
  // tx_info.si
  const tran_id = ethUtil.bufferToHex(tx_info.serialize());

  return [{
    id: crypto.randomBytes(16).toString('hex'),
    jsonrpc: "2.0",
    method: "eth_sendRawTransaction",
    params: [tran_id]
  }]
}


module.exports = {
  generate, decrypt, getBalance, getTokenBalance, estimateGas, transferToken
};