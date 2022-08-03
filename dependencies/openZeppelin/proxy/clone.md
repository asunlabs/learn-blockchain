# Clone library for a minimal proxy

> **EIP 1167** is a standard for deploying minimal proxy contracts, also known as "clones". To simply and **cheaply clone contract functionality in an immutable way**, this standard specifies a **minimal bytecode** implementation that delegates all calls to a known, fixed address.

```solidity
import "@openzeppelin/contracts/proxy/Clones.sol";
```

> The library **includes functions to deploy** a proxy using either create (traditional deployment) or create2 (salted deterministic deployment). It also **includes functions to predict the addresses of clones** deployed using the deterministic method.

```
clone(implementation)

cloneDeterministic(implementation, salt)

predictDeterministicAddress(implementation, salt, deployer)

predictDeterministicAddress(implementation, salt)
```

