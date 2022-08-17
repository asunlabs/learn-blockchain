# Learning How To Build Private Network 

This is a lecture summary for [Udemy - Build your Private Ethereum Geth PoA Blockchain Network](https://www.udemy.com/course/geth-ethereum/).

**Lecture background**

> Not all the enterprises likes keeping their data in public Blockchain network, the main aim of creating this course is to create Private Ehtereum PoA Blockchain network and deploy smart contracts for building production-ready applications.

> In this course, we are going to use Geth and build Private Ethereum Proof of Authority (PoA) Blockchain Network. We are going to discuss right from creating Virtual machine till the deployment and adding the validators and remove validators to the network, No slides. Just implementation.

> _73% of Ethereum Nodes in Ethereum Mainnet uses Geth_

**Topics covered**

> Creating VM
> Installing Geth
> Create First Node
> Launching the Network
> Creating Genesis file from scratch
> Customizing Genesis File
> Launching the Network
> Testing our Network
> Add another Node to network and lot more

## Tips and tricks

**Ethereum installation**

Install Ethereum in AWS EC2.

```sh
# install ppa ethereum in AWS EC2 instance 
sudo add-apt-repository -y ppa:ethereum/ethereum

# update
sudo apt-get update

# install ethereum 
sudo apt-get install ethereum
```

**Node accessibility**

Add security rules for network node.

<img width="1523" alt="aws-ec2-inbound-rules-protocols" src="https://user-images.githubusercontent.com/83855174/185022441-f766a51e-f577-42fc-af2e-854c2073b48f.png">

To check if the security rules are properly set, send a ping to the node's public IPv4 address. 

```sh 
# send a request to the node. data should not be lost
ping 18.233.1.175
```

**Account creation**

Use geth to create a node account. The account creation will require to set a password, which will be required later. The command will initialize a public key and secret key file in keystore directory. 

```sh
# use clef later.
geth --datadir "./data" account new
```

**Network configuration**

A newly created network will start from a genesis block. The network is initialized with configuration like below. You will set a network genesis file with _puppeth_. 

```sh
puppeth
```

<details>
<summary>What is puppeth? </summary>

> Puppeth is a CLI wizard that aids in creating a new Ethereum network down to the genesis, bootnodes, signers, ethstats, faucet, dashboard and more, without the hassle that it would normally take to configure all these services one by one. Puppeth uses ssh to dial into remote servers, and builds its network components out of docker containers using docker-compose. The user is guided through the process via a command line wizard that does the heavy lifting and topology configuration automatically behind the scenes.

> Truth be told, if you’ve ever tried to set up your own private Ethereum network - whether for friendly fun, corporate work, or hackathon aid - you’ll certainly know the pain it takes to do so. Configuring a genesis block is one thing, but when you get to bootnodes, full nodes, miners and light clients, things start to wear thin fast… and we haven’t even talked about monitoring, explorers, faucets, wallets. It’s a mess.

> Geth 1.6 ships a new tool called puppeth, which aims to solve this particular pain point.

</details>

Consider to set chain id, block generation time, adjusting the number of accounts, and the ETH balance of the accounts.

```json: test.json
{
  "config": {
    "chainId": 99999,
    "homesteadBlock": 0,
    "eip150Block": 0,
    "eip150Hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "eip155Block": 0,
    "eip158Block": 0,
    "byzantiumBlock": 0,
    "constantinopleBlock": 0,
    "petersburgBlock": 0,
    "istanbulBlock": 0,
    "clique": {
      "period": 5,
      "epoch": 30000
    }
  },
  "nonce": "0x0",
  "timestamp": "0x62fb015c",
  "extraData": "0x00000000000000000000000000000000000000000000000000000000000000007f88d0d01de0f4fad2e2008eb9b3507279c6cea20000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "gasLimit": "0x47b760",
  "difficulty": "0x1",
  "mixHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
  "coinbase": "0x0000000000000000000000000000000000000000",
  "alloc": {
    "7f88d0d01de0f4fad2e2008eb9b3507279c6cea2": {
      "balance": "100000000000000000000000"
    }
  },
  "number": "0x0",
  "gasUsed": "0x0",
  "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
  "baseFeePerGas": null
}
```

**Geth initialization**

With the generated and customized network configuration, the very next thing you have to do is to initialize Geth with the configuration.

```sh
geth --datadir "./data" init ./test.json
```

**Geth network launch**

Run below command to launch a geth network. Note that you have to add a proper chain id, EC2 private address, node public address, and password.  

```sh
geth --networkid 99999 --datadir ./data --port 30303 --http --ipcdisable --syncmode full --allow-insecure-unlock --http.corsdomain "*" --http.port 8545 --http.addr "EC2 private address here(e.g 172.31.94.134)" --unlock "node public address here(e.g. 0x7f88d0D01DE0F4FAD2E2008eB9B3507279C6CEA2)" --password "password path here(e.g ./password.txt)" --mine --http.api personal,admin,db,eth,net,web3,miner,shh,txpool,debug,clique --ws  --ws.addr 0.0.0.0 --ws.port 8546 --ws.origins "*" --ws.api personal,admin,db,eth,net,web3,miner,shh,txpool,debug,clique --maxpeers 25 --miner.etherbase 0 --miner.gasprice 0 --miner.gaslimit 9999999 console
```

Once the comand succeeded, a new private blockchain network is launched.

**Attach RPC to network**

Outside the blockchain network, client can access and interact with the network. This is done with geth attach command. 

```sh
geth attach http://(EC2-public-address-here):(port-number-here)
```

Once attached, clients will be able to interact with the newly created private network. 

**Account import to wallet**

To import the created account from the private network to third party wallet like Metamask, the pirvate network should be added first. 

Find a secret file created and create a JSON file with it. Use Metamask to import node account from the private network.

<img width="268" alt="import-account-json" src="https://user-images.githubusercontent.com/83855174/185031422-aa59a0bb-5f07-4347-b458-37de82ae7042.png">

Once the pre-funded account imported, the network is ready to deploy a smart contract. 

**Running network**

In Ubuntu, systemd is used to manage processes with systemctl cli commands.

```sh
# Must run to reload changed unit files
sudo systemctl `daemon-reload`

# Enable a service to start on boot
sudo systemctl `enable` geth.service

# Start a service
sudo systemctl `start` geth.service

# See if service is running/enabled
sudo systemctl `status` geth.service
```

<details>
<summary>man systemd reload</summary>

> Asks all units listed on the command line to reload their configuration. Note that this will reload the service-specific configuration, not the unit configuration file of systemd.

> If you want systemd to reload the configuration file of a unit, use the daemon-reload command. In other words: for the example case of Apache, this will reload Apache's httpd.conf in the web server, not the apache.service systemd unit file.

</details>

**Network configuration**

In configuring network, each node should be initialized in different EC2 instances. For example, if there are four nodes in the private network, it means that the four node were initialized and configurated individually.

- Geth initialization
- Puppeth genesis configuration
- Geth attachement for client
- Node accessibility (opening ports and setting up security rules)

**Peer management**

Once Geth is attached to one of the network nodes(EC2 instance, in this case), peers can be added to network through thje Geth Javascript console. 

```sh
# Attach RPC to EC2
geth attach http://(EC2-public-address):(port-number)

# Check enode with Geth Javascript console
admin.nodeInfo.enode

# Add peer to network
admin.addPeer(enode-URI-here)
```

You can find an enode definition by [Blockchain for Enterprise by Narayan Prusty](https://www.oreilly.com/library/view/blockchain-for-enterprise/9781788479745/8df288d0-31ec-4512-bf34-a0c722dcfda2.xhtml#:~:text=An%20enode%20is%20a%20way,particular%20node%20on%20the%20network.)

> An enode is a way to describe an **Ethereum node in the form of a URI**. Every node in the network has a different enode. The enode conatins a 512-bit public key called _a node ID_, which is used to verify communication from a particular node on the network. The encode also contains the _IP address_.

You can set static nodes instead of manually adding each peer.

```json:static-nodes.json
[
    "enode://cdbf3715c7b71a6df0649cbbbaecf516aad8744ed49277e9f252653cba8691b4419bef19c953576977c51e02bc4a65a9baa818a329767a072e15e80dafbdd29e@18.233.1.175:30303",
    "enode://e1bb1172b37dd6a2b2af274ef8b4f78e202b248d14a0f1ac70efaf8f4918287f4741fc15690f4e90bbf7301094a463e11a43876d5704834094d061c8aceebb63@52.204.161.99:30303"
]
```

## Reference 

- [Udemy - Build your Private Ethereum Geth PoA Blockchain Network](https://www.udemy.com/course/geth-ethereum/)
- [Ethereum blog: Geth 1.6 – Puppeth Master](https://blog.ethereum.org/2017/04/14/geth-1-6-puppeth-master/)