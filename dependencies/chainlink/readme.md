# Learning Chainlink oracle essentials

Below you will find some glossary as to Chainlink Oracle.

- Chainlink oracle is a blockchain middleware.
- external transaction ===(API call)===> initiator ===(read/write)===> blockhain(on-chain data)
- initiator: instructions that tell a chainlink node when/how to start getting external data
- adapter/task: instructions that tell a chainlink node what to do with data once they receive it => adapters == a list of instructions
- initiator + adapter = a job in chainlink node. job has its own id.
- the most common functionality for the job is log initiator.

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

### Retrieve the latest asset prices

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
