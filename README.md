## About
Ethereum request generater server

if you use the ethereum json rpc,
you still have to do a lot of calculators for post data of the request.

Now just do it by http request

## Use
Run in server
```
node src/index.js
```

In any other language (Client):
1. create a wallet
```
http.get('http://127.0.0.1:28888/create_wallet')
```

2. enter a wallet by private_key
```
http.get('http://127.0.0.1:28888/decrypt_wallet?private_key=${private_key}')
```

3. get balance
```
postData = http.get('http://127.0.0.1:28888/get_balance?address=${eth_address}')
endpoint = 'https://api.myetherapi.com/eth' // eth json rpc server
http.post(url = endpoint, post = postData, headers = 'Content-Type: application/json')
```

4. get token balance
```
postData = http.get('http://127.0.0.1:28888/get_token_balance?' + some_params)
endpoint = 'https://api.myetherapi.com/eth' // eth json rpc server
http.post(url = endpoint, post = postData, headers = 'Content-Type: application/json')
```

5. transfer token
```
#get transfer gas
postData = http.get('http://127.0.0.1:28888/transfer_estimate_gas?' + some_params) #some_params = token_contract,token_decimals,from_eth_address,to_eth_address,value
endpoint = 'https://api.myetherapi.com/eth' // eth json rpc server
http.post(url = endpoint, post = postData, headers = 'Content-Type: application/json')

#do transfer
postData = http.get('http://127.0.0.1:28888/transfer_token?' + some_params) #some_params = token_contract,token_decimals,gas_price,gas_limit,private_key,from_eth_address,to_eth_address,value
endpoint = 'https://api.myetherapi.com/eth' // eth json rpc server
http.post(url = endpoint, post = postData, headers = 'Content-Type: application/json')
```
