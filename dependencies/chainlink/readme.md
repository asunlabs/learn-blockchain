# Learning Chainlink oracle essentials

Below you will find some glossary as to Chainlink Oracle.

- Chainlink oracle is a blockchain middleware.
- external transaction ===(API call)===> initiator ===(read/write)===> blockhain(on-chain data)
- initiator: instructions that tell a chainlink node when/how to start getting external data
- adapter/task: instructions that tell a chainlink node what to do with data once they receive it => adapters == a list of instructions
- initiator + adapter = a job in chainlink node. job has its own id.
- the most common functionality for the job is log initiator combined with HTTP GET, JSON parse, multiply, Fuint256, and FTX adapters.

> Chainlink expands the capabilities of smart contracts by enabling access to real-world data and off-chain computation while maintaining the security and reliability guarantees inherent to blockchain technology.

> Chainlink gives smart contract developers **the oracle infrastructure and tooling** they need to build scalable and externally-connected dApps on several blockchains and layer-2 networks.

## Workflow

1. Chainlink node **watches blockchain to find an event** with a job-specific id.
1. Once the event found, chainlink node **executes adapters**, posting data to on-chain.

## What is a LINK token?

- Ether ==> rewards for Ethereum nodes confirming transactions
- Link ==> rewards for Chainlink nodes retrieving data

> The LINK token is an ERC677 token that inherits functionality from the ERC20 token standard and **allows token transfers to contain a data payload**. It is used to **pay node operators for retrieving data** for smart contracts and also for deposits placed by node operators as required by contract creators.

> Any wallet that handles ERC20 tokens can store LINK tokens. The ERC677 token standard that the LINK token implements still retains all functionality of ERC20 tokens.

## What are oracles?

> Oracles provide a bridge between the real-world and on-chain smart contracts by **being a source of data that smart contracts can rely on, and act upon**.

> Oracles play a critical role in **facilitating** the full potential of **smart contract utility**. Without a reliable connection to real-world conditions, smart contracts cannot effectively serve the real-world.

## How do smart contracts use oracles?

> **Oracles are most popularly used with Data Feeds**. DeFi platforms like AAVE and Synthetix use Chainlink data feed oracles **to obtain accurate real-time asset prices** in their smart contracts.

> Chainlink data feeds are sources of data aggregated **from many independent Chainlink node operators**. **Each data feed has an on-chain address and functions** that enable contracts to read from that address. For example, the ETH/USD feed.

> Smart contracts also use oracles to get other capabilities on-chain:

1. Generate Verifiable Random Numbers (VRF): Use Chainlink **VRF to consume randomness** in your smart contracts.
1. Call External APIs (Any API): **Request & Receive data from any API** using the Chainlink contract library.
1. Automate Smart Contract Functions (Keepers): Automating smart contract functions and regular contract maintenance.

## Introduction to Data Feeds

> Chainlink Data Feeds are the quickest way to connect your smart contracts to the real-world data such as asset prices. One use for data feeds is to retrieve the latest pricing data of an asset in a single call and use that data either on-chain in a smart contract or off-chain in another application of your choice.

> If you already have a project started and would like to integrate Chainlink, you can add Chainlink to your existing project by using the chainlink NPM package.

> See the Data Feeds Contract Addresses page for a list of networks and proxy addresses. For important updates regarding the use of Chainlink Price Feeds, users should join the official Chainlink Discord and subscribe to the data-feeds-user-notifications channel: https://discord.gg/Dqy5N9UbsR

### Retrieve the laktest asset prices

> Often, smart contracts need to act in real-time on data such as prices of assets. This is especially true in DeFi.

> For example, Synthetix uses Data Feeds to determine prices on their derivatives platform. Lending and borrowing platforms like AAVE use Data Feeds to ensure the total value of the collateral.

> Data Feeds aggregate many data sources and publish them on-chain using a combination of the Decentralized Data Model and Off-Chain Reporting.

### Components of a data feed

- the proxy and aggregator contracts are all on-chain.

- You can call the latestRoundData() function directly on the aggregator, but it is a best practice to use the proxy instead so that changes to the aggregator do not affect your application

> Data Feeds are an example of a decentralized oracle network and include the following components:

> **Consumer**: A consumer is an on-chain or off-chain application that uses Data Feeds. **Consumer contracts use the AggregatorV3Interface to call functions on the proxy contract and retrieve information from the aggregator contract**. For a complete list of functions available in the AggregatorV3Interface, see the Data Feeds API Reference.

> **Proxy contract**: Proxy contracts are on-chain proxies that point to the aggregator for a particular data feed. **Using proxies enables the underlying aggregator to be upgraded** without any service interruption to consuming contracts. Proxy contracts can vary from one data feed to another, but the AggregatorProxy.sol contract on Github is a common example.

> **Aggregator contract**: An aggregator is **a contract that receives periodic data updates from the oracle network**. Aggregators **store** aggregated **data on-chain** so that consumers can retrieve it and act upon it within the same transaction. For a complete list of functions and variables available on most aggregator contracts, see the Data Feeds API Reference.

### Updates to proxy and aggregator contracts

> To accommodate the dynamic nature of off-chain environments, Chainlink Data Feeds are updated from time to time to add new features and capabilities as well as respond to externalities such as token migrations, protocol rebrands, extreme market events, and upstream issues with data or node operations.

> These updates include changes to the aggregator configuration or a complete replacement of the aggregator that the proxy uses. If you consume data feeds through the proxy, your applications can continue to operate during these changes.

> Proxy and aggregator contracts all have an owner address that has permission to change variables and functions. For example, if you read the BTC/USD proxy contract in Etherscan, you can see the owner address. This address is a multi-signature safe (multisig) that you can also inspect.

> If you view the multisig contract in Etherscan using the Read as Proxy feature, you can see the full details of the multisig including the list of addresses that can sign and the number of signers required for the multisig to approve actions on any contracts that it owns.

> The multisig-coordinated upgradability of Chainlink Data Feeds involves time-tested processes that balance collusion-resistance with the flexibility required to implement improvements and swiftly react to external conditions. The approach taken to upgradability will continue to evolve over time to meet user requirements.

### Monitoring Data Feeds

> When you build applications and protocols that depend on data feeds, include monitoring and safeguards to protect against the negative impact of extreme market events, possible malicious activity on third-party venues or contracts, potential delays, and outages.

> Create your own monitoring alerts based on deviations in the answers that data feeds provide. This will notify you when potential issues occur so you can respond to them.

#### Check the latest answer against reasonable limits

> The data feed aggregator includes both minAnswer and maxAnswer values. These variables prevent the aggregator from updating the latestAnswer outside the agreed range of acceptable values, but they do not stop your application from reading the most recent answer.

> Configure your application to detect when the reported answer is close to reaching minAnswer or maxAnswer and issue an alert so you can respond to a potential market event. Separately, configure your application to detect and respond to extreme price volatility or prices that are outside of your acceptable limits.

#### Check the timestamp of the latest answer

> Chainlink Price Feeds do not provide streaming data. Rather, the aggregator updates its latestAnswer when the value deviates beyond a specified threshold or when the heartbeat idle time has passed. You can find the heartbeat and deviation values for each data feed at data.chain.link or in the Contract Addresses lists.

> Your application should track the latestTimestamp variable or use the updatedAt value from the latestRoundData() function to make sure that the latest answer is recent enough for your application to use it. If your application detects that the reported answer is not updated within the heartbeat or within time limits that you determine are acceptable for your application, pause operation or switch to an alternate operation mode while identifying the cause of the delay.

> During periods of low volatility, the heartbeat triggers updates to the latest answer. Some heartbeats are configured to last several hours, so your application should check the timestamp and verify that the latest answer is recent enough for your application.

> To learn more about the heartbeat and deviation threshold, read the Decentralized Data Model page.

### Consuming Data Feeds

> When you connect a smart contract to real-world services or off-chain data, you create a hybrid smart contract. For example, you can **use Chainlink Data Feeds to connect your smart contracts to asset pricing data** like the ETH/USD feed. These data feeds use the data aggregated from many independent Chainlink node operators. Each price feed has an on-chain address and functions that enable contracts to read pricing data from that address

### Examine the sample contract

> For example, The following code describes a contract that obtains the latest ETH/USD price using the Kovan testnet.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PriceConsumerV3 {

    AggregatorV3Interface internal priceFeed;

    /**
     * Network: Kovan
     * Aggregator: ETH/USD
     * Address: 0x9326BFA02ADD2366b30bacB125260Af641031331
     */
    constructor() {
        priceFeed = AggregatorV3Interface(0x9326BFA02ADD2366b30bacB125260Af641031331);
    }

    /**
     * Returns the latest price
     */
    function getLatestPrice() public view returns (int) {
        (
            /*uint80 roundID*/,
            int price,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = priceFeed.latestRoundData();
        return price;
    }
}
```

> The import line imports an interface named AggregatorV3Interface. **Interfaces define functions without their implementation**, which leaves inheriting contracts to define the actual implementation themselves. In this case, AggregatorV3Interface defines that all v3 Aggregators have the function latestRoundData. You can see the complete code for the AggregatorV3Interface on GitHub.

> The **constructor**() {} initializes an interface object named priceFeed that uses AggregatorV3Interface and **connects specifically to a proxy aggregator contract** that is already deployed at **0x9326BFA02ADD2366b30bacB125260Af641031331**. The interface allows your contract to run functions on that deployed aggregator contract.

> The getLatestPrice() function calls your priceFeed object and runs the latestRoundData() function. When you deploy the contract, it initializes the priceFeed object to point to the aggregator at 0x9326BFA02ADD2366b30bacB125260Af641031331, which is **the proxy address for the Kovan ETH / USD data feed**.

> **Your contract connects to that address** and executes the function. The aggregator connects with several oracle nodes and aggregates the pricing data from those nodes. **The response from the aggregator includes several variables, but getLatestPrice() returns only the price variable**.

<details>
<summary>Notice</summary>

> If you have not already configured your MetaMask wallet and funded it with testnet ETH, follow the instructions in the Deploy Your First Smart Contract to set that up. You can get testnet ETH at https://faucets.chain.link/kovan/.

> You can run your own oracle networks that provide data to smart contracts similar to the AggregatorV3Interface, but first, you should learn how to configure your contracts to pay oracles using LINK tokens.

</details>

## Introduction to Using Any API

> Chainlink enables your contracts to access to any external data source through our decentralized oracle network.

> Whether your contract requires sports results, the latest weather, or any other publicly available data, the Chainlink contract library provides the tools required for your contract to consume it.

### Getting started

> We understand making smart contracts compatible with off-chain data adds to the complexity of building smart contracts. We created a framework with minimal requirements, yet unbounded flexibility, so developers can focus more on the functionality of smart contracts rather than what feeds them.

> Chainlink’s decentralized oracle network provides smart contracts with the ability to push and pull data, facilitating the interoperability between on-chain and off-chain applications.

#### Requesting Off-chain Data

> Outlined below are multiple ways developers can connect smart contracts to off-chain data feeds. Click a request type to learn more about it:

1. HTTP GET Single Word Response
1. HTTP GET Multi-Variable Responses
1. HTTP GET Element in Array Response
1. HTTP GET Large Reponses
1. Existing Job Request

> Building External Adapters: To learn more about building external adapters and adding them to nodes, refer to the External Adapters documentation. To understand different use cases for using any API, refer to Other Tutorials.

### Follow Chainlink blog/engineering tutorial

- [[See Description] Connect any API to your smart contract | Chainlink Engineering Tutorials](https://www.youtube.com/watch?v=AtHp7me2Yks)

> This video describes how to get data from HTTP GET requests, HTTP POST requests, and a number of other methods into your smart contract. showing you exactly how it plays out on the Ethereum blockchain.

- [Chainlink market](market.link): A node listing service where developers can find job id and oracle address. Independent nodes will post how to connect their chainlink nodes here.

- [APIs, Smart Contracts, and How to Connect Them](https://blog.chain.link/apis-smart-contracts-and-how-to-connect-them/)

> Smart contracts on any blockchain can connect to any API by integrating with Chainlink oracles. We’ve already seen massive growth of API and off-chain data use in Solidity since Chainlink has entered the space as an oracle solution. Now that list is growing rapidly to include Polkadot, Avalanche, Binance Smart Chain, Bitcoin via RSK, and more as all these chains benefit from API access to the external world. Chainlink is well known as the leading framework for DeFi Price Feeds, which currently secures billions in DeFi value. While Chainlink Price Feeds are an important functionality that empowers a multitude of DeFi platforms users know and love, that alone does not revolutionize the capabilities of smart contracts.

> **Chainlink** was designed with a much broader goal in mind: to be **the standard data middleware layer for smart contracts** and unlock the capability for smart contracts to reliably trigger events in the external world. To accomplish this, Chainlink gives Solidity developers and other smart contract developers a framework for interacting with any external API. This guide shows you exactly how to do so today, live on the Ethereum mainnet.

> In about 15 minutes you can have your own externally aware contract deployed on-chain and making API requests. You can learn more about connecting your smart contract at our Introduction to Using Any API page and continue below for a more in-depth analysis of making an HTTP GET request.

> **Chainlink Adapters**: The first concept to cover is Chainlink Adapters. Adapters are the data manipulation functions that every Chainlink node supports by default. Through these adapters, all developers have a standard interface for making data requests and node operators have a standard for serving that data. These adapters include functionality such as HTTP GET, HTTP POST, Compare, Copy, etc. Adapters are your dApp’s connection to the external world’s data.

#### Chainlink Requests

> For your smart contract to interact with these adapters, we need to introduce another element: requests. All contracts that inherit from ChainlinkClient can create a Chainlink.Request struct that allows developers to form a request to a Chainlink node. Submitting this request requires some basic fields such as the address of the node you wish to use as your oracle, the job ID, and the agreed-upon fee. In addition to those default fields, you must add your desired adapter parameters to the request struct like so:

```
// Set the URL to perform the GET request on
request.add("get", "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD");
```

### Single Word Response

> This guide explains how to make an HTTP GET request to an external API from a smart contract using Chainlink's Request & Receive Data cycle and receive a single response.

> To consume an API with multiple responses, your contract must import ChainlinkClient. This contract exposes a struct called Chainlink.Request, which your contract should use to build the API request. The request should include the following parameters:

1. Link token address
1. Oracle address
1. Job id
1. Request fee
1. Task parameters
1. Callback function signature

> ️ Note on Funding Contracts: Making a GET request will fail unless your deployed contract has enough LINK to pay for it. Learn how to Acquire testnet LINK and Fund your contract.

> Assume that a user wants to call the API above and retrieve only the 24h ETH trading volume from the response.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import '@chainlink/contracts/src/v0.8/ChainlinkClient.sol';
import '@chainlink/contracts/src/v0.8/ConfirmedOwner.sol';

/**
 * Request testnet LINK and ETH here: https://faucets.chain.link/
 * Find information on LINK Token Contracts and get the latest ETH and LINK faucets here: https://docs.chain.link/docs/link-token-contracts/
 */

/**
 * THIS IS AN EXAMPLE CONTRACT WHICH USES HARDCODED VALUES FOR CLARITY.
 * PLEASE DO NOT USE THIS CODE IN PRODUCTION.
 */
contract APIConsumer is ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;

    uint256 public volume;
    bytes32 private jobId;
    uint256 private fee;

    event RequestVolume(bytes32 indexed requestId, uint256 volume);

    /**
     * @notice Initialize the link token and target oracle
     *
     * Rinkeby Testnet details:
     * Link Token: 0x01BE23585060835E02B77ef475b0Cc51aA1e0709
     * Oracle: 0xf3FBB7f3391F62C8fe53f89B41dFC8159EE9653f (Chainlink DevRel)
     * jobId: ca98366cc7314957b8c012c72f05aeeb
     *
     */
    constructor() ConfirmedOwner(msg.sender) {
        setChainlinkToken(0x01BE23585060835E02B77ef475b0Cc51aA1e0709);
        setChainlinkOracle(0xf3FBB7f3391F62C8fe53f89B41dFC8159EE9653f);
        jobId = 'ca98366cc7314957b8c012c72f05aeeb';
        fee = (1 * LINK_DIVISIBILITY) / 10; // 0,1 * 10**18 (Varies by network and job)
    }

    /**
     * Create a Chainlink request to retrieve API response, find the target
     * data, then multiply by 1000000000000000000 (to remove decimal places from data).
     */
    function requestVolumeData() public returns (bytes32 requestId) {
        Chainlink.Request memory req = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);

        // Set the URL to perform the GET request on
        req.add('get', 'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD');

        // Set the path to find the desired data in the API response, where the response format is:
        // {"RAW":
        //   {"ETH":
        //    {"USD":
        //     {
        //      "VOLUME24HOUR": xxx.xxx,
        //     }
        //    }
        //   }
        //  }
        // request.add("path", "RAW.ETH.USD.VOLUME24HOUR"); // Chainlink nodes prior to 1.0.0 support this format
        req.add('path', 'RAW,ETH,USD,VOLUME24HOUR'); // Chainlink nodes 1.0.0 and later support this format

        // Multiply the result by 1000000000000000000 to remove decimals
        int256 timesAmount = 10**18;
        req.addInt('times', timesAmount);

        // Sends the request
        return sendChainlinkRequest(req, fee);
    }

    /**
     * Receive the response in the form of uint256
     */
    function fulfill(bytes32 _requestId, uint256 _volume) public recordChainlinkFulfillment(_requestId) {
        emit RequestVolume(_requestId, _volume);
        volume = _volume;
    }

    /**
     * Allow withdraw of Link tokens from the contract
     */
    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        require(link.transfer(msg.sender, link.balanceOf(address(this))), 'Unable to transfer');
    }
}
```

> To use this contract:

1. Open the contract in Remix.

2. Compile and deploy the contract using the Injected Web3 environment. The contract includes all the configuration variables for the Rinkeby testnet. Make sure your wallet is set to use Rinkeby. The constructor sets the following parameters:

- The Chainlink Token address for Rinkeby by calling the setChainlinkToken function.
- The Oracle contract address for Rinkeby by calling the setChainlinkOracle function.
- The jobId: A specific job for the oracle node to run. In this case, you must call a job that is configured to call a public API, parse a number from the response and remove any decimals from it. You can find the job spec for the Chainlink node here.

3. Fund your contract with 0.1 LINK. To learn how to send LINK to contracts, read the Fund Your Contracts page.

4. Call the volume function to confirm that the volume state variable is equal to zero.

5. Run the requestVolumeData function. This builds the Chainlink.Request using the correct parameters:

- The req.add("get", "<cryptocompareURL>") request parameter provides the oracle node with the url where to fetch the ETH-USD trading info.
  The req.add('path', 'RAW,ETH,USD,VOLUME24HOUR') request parameter tells the oracle node where to fetch the 24h ETH volume in the json response. It uses a JSONPath expression with comma(,) delimited string for nested objects. For example: 'RAW,ETH,USD,VOLUME24HOUR'.

- The req.addInt('times', timesAmount) request parameter provides the oracle node with the multiplier timesAmount by which the fetched volume is multiplied. Use this to remove any decimals from the volume.

- The APIConsumer in the example above is flexible enough to call any public API as long as the URL in get, path, and timesAmounnt are correct.

6. After few seconds, call the volume function. You should get a non-zero response.

<details>
<summary>Response Types</summary>

> Make sure to choose an oracle job that supports the data type that your contract needs to consume. Multiple data types are available such as:

1. uint256 - Unsigned integers
1. int256 - Signed integers
1. bool - True or False values
1. string - String
1. bytes32 - Strings and byte values. If you need to return a string, use bytes32. Here's one method of converting bytes32 to string. Currently, any return value must fit within 32 bytes. If the value is bigger than that, make multiple requests.
1. bytes - Arbitrary-length raw byte data
</details>

### Setting the LINK token address, Oracle, and JobId

> The setChainlinkToken function sets the LINK token address for the network you are deploying to. The setChainlinkOracle function sets a specific Chainlink oracle that a contract makes an API call from. The jobId refers to a specific job for that node to run.

> Each job is unique and returns different types of data. For example, a job that returns a bytes32 variable from an API would have a different jobId than a job that retrieved the same data, but in the form of a uint256 variable.

> Check the [Find Existing Jobs](https://docs.chain.link/docs/listing-services/) page to learn how to find a job suitable to your use case.

> Data provider nodes: Chainlink has facilitated the launch of several oracle data services that allow dApps to access rich data from external data sources through provider-owned nodes. The full list of such provider nodes is available [here](https://docs.chain.link/docs/data-provider-nodes/#data-provider-nodes-list)

## Random Numbers: Using Chainlink VRF

> In this guide, you will learn about generating randomness on blockchains. This includes learning how to implement a Request and Receive cycle with Chainlink oracles and how to consume random numbers with Chainlink VRF in smart contracts.

### How is randomness generated on blockchains? What is Chainlink VRF?

> Randomness is very difficult to generate on blockchains. This is because every node on the blockchain must come to the same conclusion and form a consensus. Even though random numbers are versatile and useful in a variety of blockchain applications, they cannot be generated natively in smart contracts. The solution to this issue is Chainlink VRF, also known as Chainlink Verifiable Random Function.

### What is the Request and Receive cycle?

> The previous guide explained how to consume Chainlink Data Feeds, which consist of reference data posted on-chain by oracles. This data is stored in a contract and can be referenced by consumers until the oracle updates the data again.

> Randomness, on the other hand, cannot be reference data. If the result of randomness is stored on-chain, any actor could retrieve the value and predict the outcome. Instead, **randomness must be requested from an oracle**, which generates a number and a cryptographic proof. Then, the oracle returns that result to the contract that requested it. This sequence is known as the Request and Receive cycle.

### What is the payment process for generating a random number?

> VRF requests receive funding from subscription accounts. The Subscription Manager lets you create an account and pre-pay for VRF requests, so that funding of all your application requests are managed in a single location.

### How can I use Chainlink VRF?

> To see a basic implementation of Chainlink VRF, see Get a Random Number. In this section, you will create an application that uses Chainlink VRF to generate randomness. The contract used in this application will have a Game of Thrones theme.

> The contract will **request randomness from Chainlink VRF**. The result of the randomness will transform into **a number between 1 and 20**, mimicking the rolling of a 20 sided die. Each number represents a Game of Thrones house. If the dice land on the value 1, the user is assigned house Targaryan, 2 for Lannister, and so on. A full list of houses can be found here.

> When rolling the dice, it will accept an address variable to track which address is assigned to each house.

The contract will have the following functions:

1. rollDice: This submits a randomness request to Chainlink VRF
1. fulfillRandomWords: The function that the Oracle uses to send the result back
1. house: To see the assigned house of an address

#### Create and fund a subscription

> Chainlink VRF requests receive funding from subscription accounts. The Subscription Manager lets you create an account and pre-pay your use of Chainlink VRF requests.

#### Importing VRFConsumerBaseV2 and VRFCoordinatorV2Interface

> Chainlink maintains a library of contracts that make consuming data from oracles easier. For Chainlink VRF, you will use:

1. VRFConsumerBaseV2 that must be imported and extended from the contract that you create.
1. VRFCoordinatorV2Interface that must be imported to communicate with the VRF coordinator.

====== 2022.06.20 done

## Reference

- [Chainlink official](https://docs.chain.link/)
- [Introduction to Data Feeds](https://docs.chain.link/docs/using-chainlink-reference-contracts/)
- [[See Description] Connect any API to your smart contract | Chainlink Engineering Tutorials](https://youtu.be/AtHp7me2Yks)
