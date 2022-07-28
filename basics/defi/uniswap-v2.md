# The Uniswap V2 Protocol

Read docs, idiot.

## How Uniswap works

![image](https://user-images.githubusercontent.com/83855174/179388798-518a068f-2607-490d-8ffd-e921002d7086.png)

> Uniswap is an automated liquidity protocol powered by a constant product formula and implemented in a system of non-upgradeable smart contracts on the Ethereum blockchain. It obviates the need for trusted intermediaries, prioritizing decentralization, censorship resistance, and security. Uniswap is open-source software licensed under the GPL.

> Each Uniswap smart contract, or pair, manages a liquidity pool made up of reserves of two ERC-20 tokens.

> Anyone can become a liquidity provider (LP) for a pool by depositing an equivalent value of each underlying token in return for pool tokens. These tokens track pro-rata LP shares of the total reserves, and can be redeemed for the underlying assets at any time.

![image](https://user-images.githubusercontent.com/83855174/179388957-1b76dcee-997c-47a8-8561-c118224d0d20.png)

> In practice, Uniswap applies a 0.30% fee to trades, which is added to reserves. As a result, each trade actually increases k. This functions as a payout to LPs, which is realized when they burn their pool tokens to withdraw their portion of total reserves. In the future, this fee may be reduced to 0.25%, with the remaining 0.05% withheld as a protocol-wide charge.

![image](https://user-images.githubusercontent.com/83855174/179389122-270996ce-8333-478a-8f58-d37873313178.png)

> Because the relative price of the two pair assets can only be changed through trading, divergences between the Uniswap price and external prices create arbitrage opportunities. This mechanism ensures that Uniswap prices always trend toward the market-clearing price.

> To see how token swaps work in practice, and to walk through the lifecycle of a swap, check out Swaps. Or, to see how liquidity pools work, see Pools.

> Ultimately, of course, the Uniswap protocol is just smart contract code running on Ethereum. To understand how they work, head over to Smart Contracts.

## Swaps

![image](https://user-images.githubusercontent.com/83855174/179389397-0c2627d9-679d-4126-b86e-8a97058731c9.png)

> **Token swaps** in Uniswap are a simple way to **trade one ERC-20 token for another**.

> For end-users, swapping is intuitive: a user picks an input token and an output token. They specify an input amount, and the protocol calculates how much of the output token they’ll receive. They then execute the swap with one click, receiving the output token in their wallet immediately.

> In this guide, we’ll look at what happens during a swap at the protocol level in order to gain a deeper understanding of how Uniswap works.

> Swaps in Uniswap are different from trades on traditional platforms. Uniswap does not use an order book to represent liquidity or determine prices. Uniswap uses an automated market maker mechanism to provide instant feedback on rates and slippage.

> As we learned in Protocol Overview, each pair on Uniswap is actually underpinned by a liquidity pool. **Liquidity pools are smart contracts that hold balances of two unique tokens** and enforces rules around depositing and withdrawing them.

> This rule is the constant product formula. When either token is withdrawn (purchased), a proportional amount of the other must be deposited (sold), in order to maintain the constant.

### Anatomy of a swap

> At the most basic level, all swaps in Uniswap V2 happen within a single function, aptly named swap:

```solidity
function swap(uint amount0Out, uint amount1Out, address to, bytes calldata data);
```

### Receiving tokens

> As is probably clear from the function signature, Uniswap requires swap callers to specify how many output tokens they would like to receive via the amount{0,1}Out parameters, which correspond to the desired amount of token{0,1}.

### Sending tokens

> What’s not as clear is how Uniswap receives tokens as payment for the swap. Typically, smart contracts which need tokens to perform some functionality require callers to **first make an approval** on the token contract, then call a function that **in turn calls transferFrom** on the token contract. **This is not how V2 pairs accept tokens**.

> Instead, pairs check their token balances at the end of every interaction. Then, at the beginning of the next interaction, current balances are differenced against the stored values to determine the amount of tokens that were sent by the current interactor. See the whitepaper for a justification of why this is the case.

> **The takeaway is that tokens must be transferred to pairs before swap is called** (the one exception to this rule is Flash Swaps). This means that to safely use the swap function, it must be called from another smart contract. The alternative (transferring tokens to the pair and then calling swap) is not safe to do non-atomically because the sent tokens would be **vulnerable to arbitrage**.

## Implement a Swap

> When trading from a smart contract, **the most important thing** to keep in mind is that **access to an external price source is required**. Without this, trades can be frontrun for considerable loss.

### Using the Router

> The easiest way to safely swap tokens is to use the router, which provides a variety of methods to safely swap to and from different assets. You'll notice that there is a function for each permutation of swapping to/from an exact amount of ETH/tokens.

> **First you must use an external price source** to calculate the safety parameters for the function you'd like to call. This is either a minimum amount received when selling an exact input or the maximum amount you are willing to pay when a buying an exact output amount

> It is also important to ensure that your contract controls enough ETH/tokens to make the swap, and has granted approval to the router to withdraw this many tokens. Check out the Pricing page for a more in depth discussion on getting prices.

#### Example

> Imagine you want to swap 50 DAI for as much ETH as possible from your smart contract.

> transferFrom: Before swapping, our smart contracts needs to be in control of 50 DAI. The easiest way to accomplish this is by calling transferFrom on DAI with the owner set to msg.sender:

```solidity
uint amountIn = 50 * 10 ** DAI.decimals();
require(DAI.transferFrom(msg.sender, address(this), amountIn), 'transferFrom failed.');
```

> approve: Now that our contract owns 50 DAI, we need to approve to the router to withdraw this DAI:

```solidity
require(DAI.approve(address(UniswapV2Router02), amountIn), 'approve failed.');
```

> swapExactTokensForETH: Now we're ready to swap:

```solidity
// amountOutMin must be retrieved from an oracle of some kind
address[] memory path = new address[](2);
path[0] = address(DAI);
path[1] = UniswapV2Router02.WETH();
UniswapV2Router02.swapExactTokensForETH(amountIn, amountOutMin, path, msg.sender, block.timestamp);
```

### Safety Considerations

> Because Ethereum transactions occur in an adversarial environment, smart contracts that do not perform safety checks can be exploited for profit. If a smart contract assumes that the current price on Uniswap is a "fair" price without performing safety checks, it is vulnerable to manipulation. A bad actor could e.g. easily insert transactions before and after the swap (a "sandwich" attack) causing the smart contract to trade at a much worse price, profit from this at the trader's expense, and then return the contracts to their original state. (One important caveat is that these types of attacks are mitigated by trading in extremely liquid pools, and/or at low values.)

> The best way to protect against these attacks is to use an external price feed or "price oracle". The best "oracle" is simply traders' off-chain observation of the current price, which can be passed into the trade as a safety check. This strategy is best for situations where users initiate trades on their own behalf.

> However, when an off-chain price can't be used, an on-chain oracle should be used instead. Determining the best oracle for a given situation is a not part of this guide, but for more details on the Uniswap V2 approach to oracles, see Oracles.

## Pools

> Each Uniswap liquidity pool is a trading venue for a pair of ERC20 tokens. When a pool contract is created, its balances of each token are 0; in order for the pool to begin facilitating trades, someone must seed it with an initial deposit of each token. This first liquidity provider is the one who sets the initial price of the pool. They are incentivized to deposit an equal value of both tokens into the pool. To see why, consider the case where the first liquidity provider deposits tokens at a ratio different from the current market rate. This immediately creates a profitable arbitrage opportunity, which is likely to be taken by an external party.

> When other liquidity providers add to an existing pool, they must deposit pair tokens proportional to the current price. If they don’t, the liquidity they added is at risk of being arbitraged as well. If they believe the current price is not correct, they may arbitrage it to the level they desire, and add liquidity at that price.

### Pool tokens

![image](https://user-images.githubusercontent.com/83855174/179400624-1b33f483-70fa-4fad-ab51-40d69c0a1327.png)

> **Whenever liquidity is deposited into a pool, unique tokens known as liquidity tokens are minted and sent to the provider's address**. These tokens represent a given liquidity provider's contribution to a pool. The proportion of the pool's liquidity provided determines the number of liquidity tokens the provider receives. If the provider is minting a new pool, the number of liquidity tokens they will receive will equal sqrt(x \* y), where x and y represent the amount of each token provided.

> Whenever a trade occurs, a 0.3% fee is charged to the transaction sender. This fee is distributed pro-rata to all LPs in the pool upon completion of the trade.

> To retrieve the underlying liquidity, plus any fees accrued, liquidity providers must "burn" their liquidity tokens, effectively exchanging them for their portion of the liquidity pool, plus the proportional fee allocation.

> As liquidity tokens are themselves tradable assets, liquidity providers may sell, transfer, or otherwise use their liquidity tokens in any way they see fit.

### Why pools?

> It is important to reiterate that a Pool is just a smart contract, operated by users calling functions on it. Swapping tokens is calling swap on a Pool contract instance, while providing liquidity is calling deposit.

> Just how end-users can interact with the Uniswap protocol through the Interface (which in turn interacts with the underlying contracts), developers can interact directly with the smart contracts and integrate Uniswap functionality into their own applications without relying on intermediaries or needing permission.

> Uniswap is unique in that it doesn’t use an order book to derive the price of an asset or to match buyers and sellers of tokens. Instead, Uniswap uses what are called Liquidity Pools.

> Liquidity is typically represented by discrete orders placed by individuals onto a centrally operated order book. A participant looking to provide liquidity or make markets must actively manage their orders, continuously updating them in response to the activity of others in the marketplace.

> While order books are foundational to finance and work great for certain usecases, they suffer from a few important limitations that are especially magnified when applied to a decentralized or blockchain-native setting. Order books require intermediary infrastructure to host the orderbook and match orders. This creates points of control and adds additional layers of complexity. They also require active participation and management from market makers who usually use sophisticated infrastructure and algorithms, limiting participation to advanced traders.

> Order books were invented in a world with relatively few assets being traded, so it is not surprising they aren't ideal for an ecosystem where anyone can create their own token, and those tokens usually have low liquidity. In sum, with the infrastructural trade-offs presented by a platform like Ethereum, order books are not the native architecture for implementing a liquidity protocol on a blockchain.

> Uniswap focuses on the strengths of Ethereum to reimagine token swaps from first principles.

> A blockchain-native liquidity protocol should take advantage of the trusted code execution environment, the autonomous and perpetually running virtual machine, and an open, permissionless, and inclusive access model that produces an exponentially growing ecosystem of virtual assets.

## Smart contract

### Factory

> Address: UniswapV2Factory is deployed at 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f on the Ethereum mainnet, and the Ropsten, Rinkeby, Görli, and Kovan testnets. It was built from commit 8160750.

### Events

> PairCreated: token0 is guaranteed to be strictly less than token1 by sort order. The final uint log value will be 1 for the first pair created, 2 for the second, etc. (see allPairs/getPair). Emitted each time a pair is created via createPair.

```solidity
event PairCreated(address indexed token0, address indexed token1, address pair, uint);
```

#### Read-only functions

> getPair: Returns the address of the pair for tokenA and tokenB, if it has been created, else address(0) (0x0000000000000000000000000000000000000000).

```solidity 
function getPair(address tokenA, address tokenB) external view returns (address pair);
```

- tokenA and tokenB are interchangeable.
- Pair addresses can also be calculated deterministically via the SDK.

> allPairs: Returns the address of the nth pair (0-indexed) created through the factory, or address(0) (0x0000000000000000000000000000000000000000) if not enough pairs have been created yet.

```solidity
function allPairs(uint) external view returns (address pair);
```

- Pass 0 for the address of the first pair created, 1 for the second, etc.

> allPairsLength: Returns the total number of pairs created through the factory so far.

```solidity
function allPairsLength() external view returns (uint);
```

> feeTo: See Protocol Charge Calculation.

```solidity 
function feeTo() external view returns (address);
```

> feeToSetter: The address allowed to change feeTo.

```solidity
function feeToSetter() external view returns (address);
```

#### State-Changing Functions

> createPair: Creates a pair for tokenA and tokenB if one doesn't exist already.

```solidity
function createPair(address tokenA, address tokenB) external returns (address pair);
```

- tokenA and tokenB are interchangeable.
- Emits PairCreated.

#### Interface

```solidity
pragma solidity >=0.5.0;

interface IUniswapV2Factory {
  event PairCreated(address indexed token0, address indexed token1, address pair, uint);

  function getPair(address tokenA, address tokenB) external view returns (address pair);
  function allPairs(uint) external view returns (address pair);
  function allPairsLength() external view returns (uint);

  function feeTo() external view returns (address);
  function feeToSetter() external view returns (address);

  function createPair(address tokenA, address tokenB) external returns (address pair);
}
```

You also can find an ABI from dependency like below

```solidity 
import IUniswapV2Factory from '@uniswap/v2-core/build/IUniswapV2Factory.json'
```

### Pair

> This documentation covers Uniswap-specific functionality. For ERC-20 functionality, see Pair (ERC-20).

> Mint: Emitted each time liquidity tokens are created via mint.

```solidity
event Mint(address indexed sender, uint amount0, uint amount1);
```

> Burn: Emitted each time liquidity tokens are destroyed via burn.

```solidity
event Burn(address indexed sender, uint amount0, uint amount1, address indexed to);
```

> Swap: Emitted each time a swap occurs via swap.

```solidity
event Swap(
  address indexed sender,
  uint amount0In,
  uint amount1In,
  uint amount0Out,
  uint amount1Out,
  address indexed to
);
```

> Sync: Emitted each time reserves are updated via mint, burn, swap, or sync.

```solidity
event Sync(uint112 reserve0, uint112 reserve1);
```

#### Read-only functions

> MINIMUM_LIQUIDITY: Returns 1000 for all pairs. See Minimum Liquidity.

```solidity
function MINIMUM_LIQUIDITY() external pure returns (uint);
```

> factory: Returns the factory address.

```solidity
function factory() external view returns (address);
```

====== 20220728 done
https://docs.uniswap.org/protocol/V2/reference/smart-contracts/pair#token0


### Fees

#### Liquidity provider fees

> There is a 0.3% fee for swapping tokens. This fee is split by liquidity providers proportional to their contribution to liquidity reserves.

> Swapping fees are immediately deposited into liquidity reserves. This increases the value of liquidity tokens, functioning as a payout to all liquidity providers proportional to their share of the pool. Fees are collected by burning liquidity tokens to remove a proportional share of the underlying reserves.

> Since fees are added to liquidity pools, the invariant increases at the end of every trade. Within a single transaction, the invariant represents token0_pool / token1_pool at the end of the previous transaction.

#### Protocol fees

> At the moment there are no protocol fees. However, it is possible for a 0.05% fee to be turned on in the future.

#### Protocol Charge Calculation

> In the future, it is possible that a protocol-wide charge of 0.05% per trade will take effect. This represents ⅙th (16.6̅%) of the 0.30% fee. The fee is in effect if feeTo is not address(0) (0x0000000000000000000000000000000000000000), indicating that feeTo is the recipient of the charge.

> This amount would not affect the fee paid by traders, but would affect the amount received by liquidity providers.

> Rather than calculating this charge on swaps, which would significantly increase gas costs for all users, the charge is instead calculated when liquidity is added or removed. See the whitepaper for more details.

### Router02

> Because routers are stateless and do not hold token balances, they can be replaced safely and trustlessly, if necessary. This may happen if more efficient smart contract patterns are discovered, or if additional functionality is desired. For this reason, routers have release numbers, starting at 01. This is currently recommended release, 02.

#### Address

> UniswapV2Router02 is deployed at 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D on the Ethereum mainnet, and the Ropsten, Rinkeby, Görli, and Kovan testnets. It was built from commit 6961711.

#### Read-only functions

- factory: returns factory address 

```solidity
function factory() external pure returns (address);
```

- WETH: Returns the canonical WETH address on the Ethereum mainnet, or the Ropsten, Rinkeby, Görli, or Kovan testnets.

```solidity
function WETH() external pure returns (address);
```

- quote: Given some asset amount and reserves, returns an amount of the other asset representing equivalent value. Useful for calculating optimal token amounts before calling mint.

```solidity
function quote(uint amountA, uint reserveA, uint reserveB) internal pure returns (uint amountB);
```

##### getAmount

- getAmountOut: Given an input asset amount, returns the maximum output amount of the other asset (accounting for fees) given reserves. Used in getAmountsOut.

```solidity
function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) internal pure returns (uint amountOut);
```

- getAmountsOut: Given an input asset amount and an array of token addresses, **calculates all subsequent maximum output token amounts** by calling getReserves for each pair of token addresses in the path in turn, and using these to call getAmountOut. **Useful for calculating optimal token amounts before calling swap**.

```solidity
function getAmountsOut(uint amountIn, address[] memory path) internal view returns (uint[] memory amounts);
```

- getAmountIn: Returns the minimum input asset amount required to buy the given output asset amount (accounting for fees) given reserves. Used in getAmountsIn.

```solidity
function getAmountIn(uint amountOut, uint reserveIn, uint reserveOut) internal pure returns (uint amountIn);
```

- **getAmountsIn**: Given an output asset amount and an array of token addresses, **calculates all preceding minimum input token amounts** by calling getReserves for each pair of token addresses in the path in turn, and using these to call getAmountIn. **Useful for calculating optimal token amounts before calling swap**.

```solidity
function getAmountsIn(address factory, uint amountOut, address[] memory path) internal view returns (uint[] memory amounts);
```

> 

## Reference

- [Uniswap: protocol overview](https://docs.uniswap.org/protocol/V2/concepts/protocol-overview/how-uniswap-works)
- [Uniswap: swap](https://docs.uniswap.org/protocol/V2/concepts/core-concepts/swaps)
