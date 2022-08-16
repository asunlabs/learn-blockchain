geth 
--networkid 99999 
--datadir ./data 
--port 30303 
--http 
--http.port 8545 
--http.corsdomain "*" 
--http.addr "172.31.94.134" # private EC2 address 
--http.api personal,admin,db,eth,net,web3,miner,shh,txpool,debug,clique 
--ipcdisable 
--syncmode full
--allow-insecure-unlock 
--unlock 0x7f88d0D01DE0F4FAD2E2008eB9B3507279C6CEA2 
--password ./password.txt 
--mine 
--miner.etherbase 0 
--miner.gasprice 0 
--miner.gaslimit 9999999 
--ws  
--ws.port 8546 
--ws.origins "*" 
--ws.addr 0.0.0.0 
--ws.api personal,admin,db,eth,net,web3,miner,shh,txpool,debug,clique 
--maxpeers 25 
console

# EC2 network => ping => public ip: enabling other clients can access
# geth: create an Ethereum account and save data in EC2
# genesis file: an initial network configuration file 
# geth: web3, clef, puppeth(using docker-compose) 
# web3: node interaction
# geth: account creation
# clef: key management
# puppeth: network configuration
