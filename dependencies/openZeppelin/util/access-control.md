# Learning Access Control Essentials 

> Access control—that is, "who is allowed to do this thing"—is incredibly important in the world of smart contracts. The access control of your contract may govern who can mint tokens, vote on proposals, freeze transfers, and many other things. It is therefore critical to understand how you implement it, lest someone else steals your whole system.

## Ownership and Ownable

> The most common and basic form of access control is the concept of ownership: there’s an account that is the owner of a contract and can do administrative tasks on it. This approach is perfectly reasonable for contracts that have a single administrative user.

> OpenZeppelin Contracts provides Ownable for implementing ownership in your contracts.

```solidity
// contracts/MyContract.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract MyContract is Ownable {
    function normalThing() public {
        // anyone can call this normalThing()
    }

    function specialThing() public onlyOwner {
        // only the owner can call specialThing()!
    }
}
```

> By default, the owner of an Ownable contract is the account that deployed it, which is usually exactly what you want. Ownable also lets you:

1. `transferOwnership` from the owner account to a new one, and
1. `renounceOwnership` for the owner to relinquish this administrative privilege, a common pattern **after an initial stage with centralized administration is over**.

> Note that a contract can also be the owner of another one! This opens the door to using, for example, a Gnosis Safe, an Aragon DAO, or a totally custom contract that you create.

> In this way you can use composability to add additional layers of access control complexity to your contracts. Instead of having a single regular Ethereum account (Externally Owned Account, or EOA) as the owner, you could use a 2-of-3 multisig run by your project leads, for example. Prominent projects in the space, such as MakerDAO, use systems similar to this one.

## Role-Based Access Control

> While the simplicity of ownership can be useful for simple systems or quick prototyping, different levels of authorization are often needed. You may want for an account to have permission to ban users from a system, but not create new tokens. Role-Based Access Control (RBAC) offers flexibility in this regard.

> In essence, we will be defining multiple roles, each allowed to perform different sets of actions. An account may have, for example, 'moderator', 'minter' or 'admin' roles, which you will then check for instead of simply using onlyOwner. This check can be enforced through the onlyRole modifier. Separately, you will be able to define rules for how accounts can be granted a role, have it revoked, and more.

> Most software uses access control systems that are role-based: some users are regular users, some may be supervisors or managers, and a few will often have administrative privileges.

### Using AccessControl

> OpenZeppelin Contracts provides AccessControl for implementing role-based access control. Its usage is straightforward: for each role that you want to define, you will create a new role identifier that is used to grant, revoke, and check if an account has that role.

> Here’s a simple example of using AccessControl in an ERC20 token to define a 'minter' role, which allows accounts that have it create new tokens:

```solidity
// contracts/MyToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20, AccessControl {
    // Create a new role identifier for the minter role
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor(address minter) ERC20("MyToken", "TKN") {
        // Grant the minter role to a specified account
        _setupRole(MINTER_ROLE, minter);
    }

    function mint(address to, uint256 amount) public {
        // Check that the calling account has the minter role
        require(hasRole(MINTER_ROLE, msg.sender), "Caller is not a minter");
        _mint(to, amount);
    }
}
```

> While clear and explicit, this isn’t anything we wouldn’t have been able to achieve with Ownable. Indeed, where AccessControl shines is in scenarios where granular permissions are required, which can be implemented by defining multiple roles.

> Let’s augment our ERC20 token example by also defining a 'burner' role, which lets accounts destroy tokens, and by using the onlyRole modifier:

```solidity
// contracts/MyToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    constructor(address minter, address burner) ERC20("MyToken", "TKN") {
        _setupRole(MINTER_ROLE, minter);
        _setupRole(BURNER_ROLE, burner);
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) public onlyRole(BURNER_ROLE) {
        _burn(from, amount);
    }
}
```

> So clean! By splitting concerns this way, more granular levels of permission may be implemented than were possible with the simpler ownership approach to access control. Limiting what each component of a system is able to do is known as the principle of least privilege, and is a good security practice. Note that each account may still have more than one role, if so desired.

## Granting and Revoking Roles

> The ERC20 token example above uses _setupRole, an internal function that is useful when programmatically assigning roles (such as during construction). But what if we later want to grant the 'minter' role to additional accounts?

> By default, _accounts with a role cannot grant it or revoke it from other accounts_: all having a role does is making the hasRole check pass. To grant and revoke roles dynamically, you will need help from `the role’s admin`.

> Every role has an associated admin role, which grants permission to call the grantRole and revokeRole functions. A role can be granted or revoked by using these if the calling account has the corresponding admin role. Multiple roles may have the same admin role to make management easier. A role’s admin can even be the same role itself, which would cause accounts with that role to be able to also grant and revoke it.

> This mechanism can be used to create complex permissioning structures resembling organizational charts, but it also provides an easy way to manage simpler applications. AccessControl includes a special role, called `DEFAULT_ADMIN_ROLE`, which acts as the `default admin role for all roles`. An account with this role will be able to manage any other role, unless `_setRoleAdmin` is used to select a new admin role.

> Let’s take a look at the ERC20 token example, this time taking advantage of the default admin role:


```solidity 
// contracts/MyToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    constructor() ERC20("MyToken", "TKN") {
        // Grant the contract deployer the default admin role: it will be able
        // to grant and revoke any roles
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) public onlyRole(BURNER_ROLE) {
        _burn(from, amount);
    }
}
```

> Note that, unlike the previous examples, no accounts are granted the `'minter'` or `'burner'` roles. However, because those roles' admin role is the default admin role, and that role was granted to msg.sender, that same account can call `grantRole` to give minting or burning permission, and `revokeRole` to remove it.

> Dynamic role allocation is often a desirable property, for example in systems where trust in a participant may vary over time. It can also be used to support use cases such as `KYC`, where the list of role-bearers may not be known up-front, or may be prohibitively expensive to include in a single transaction.

## Querying Privileged Accounts

> Because accounts might grant and revoke roles dynamically, it is not always possible to determine which accounts hold a particular role. This is important as it allows to prove certain properties about a system, such as that an administrative account is a multisig or a DAO, or that a certain role has been removed from all users, effectively disabling any associated functionality.

> Under the hood, AccessControl uses EnumerableSet, a more powerful variant of Solidity’s mapping type, which allows for key enumeration. `getRoleMemberCount` can be used to retrieve the number of accounts that have a particular role, and getRoleMember can then be called to get the address of each of these accounts.

```js
const minterCount = await myToken.getRoleMemberCount(MINTER_ROLE);

const members = [];
for (let i = 0; i < minterCount; ++i) {
    members.push(await myToken.getRoleMember(MINTER_ROLE, i));
}
```

## Delayed operation

> Access control is essential to prevent unauthorized access to critical functions. These functions may be used to mint tokens, freeze transfers or perform an upgrade that completely changes the smart contract logic. While Ownable and AccessControl can prevent unauthorized access, they do not address the issue of a misbehaving administrator attacking their own system to the prejudice of their users.

>This is the issue the TimelockController is addressing.

> The TimelockController is a proxy that is governed by proposers and executors. When set as the owner/admin/controller of a smart contract, it ensures that whichever maintenance operation is ordered by the proposers is subject to a delay. **This delay protects the users of the smart contract by giving them time to review the maintenance operation and exit the system** if they consider it is in their best interest to do so.

## Using TimelockController

> By default, the address that deployed the TimelockController gets administration privileges over the timelock. This role grants the right to assign proposers, executors, and other administrators.

> The first step in configuring the TimelockController is to assign at least one proposer and one executor. These can be assigned during construction or later by anyone with the administrator role. These roles are not exclusive, meaning an account can have both roles.

> Roles are managed using the AccessControl interface and the bytes32 values for each role are accessible through the ADMIN_ROLE, PROPOSER_ROLE and EXECUTOR_ROLE constants.

> There is an additional feature built on top of AccessControl: **giving the executor role to address(0) opens access to anyone to execute a proposal once the timelock has expired**. This feature, while useful, should be used with caution.

> At this point, with both a proposer and an executor assigned, the timelock can perform operations.

> An optional next step is for the deployer to renounce its administrative privileges and leave the timelock self-administered. If the deployer decides to do so, all further maintenance, including assigning new proposers/schedulers or changing the timelock duration will have to follow the timelock workflow. This links the governance of the timelock to the governance of contracts attached to the timelock, and enforce a delay on timelock maintenance operations.

> If the deployer renounces administrative rights in favour of timelock itself, assigning new proposers or executors will require a timelocked operation. This means that if the accounts in charge of any of these two roles become unavailable, then the entire contract (and any contract it controls) becomes locked indefinitely.

> With both the proposer and executor roles assigned and the timelock in charge of its own administration, you can now transfer the ownership/control of any contract to the timelock.

> A recommended configuration is to grant both roles to a secure governance contract such as a DAO or a multisig, and to additionally grant the executor role to a few EOAs held by people in charge of helping with the maintenance operations. These wallets cannot take over control of the timelock but they can help smoothen the workflow.

## Minimum delay

> Operations executed by the TimelockController are not subject to a fixed delay but rather a minimum delay. Some major updates might call for a longer delay. For example, if a delay of just a few days might be sufficient for users to audit a minting operation, it makes sense to use a delay of a few weeks, or even a few months, when scheduling a smart contract upgrade.

> The minimum delay (accessible through the getMinDelay method) can be updated by calling the updateDelay function. Bear in mind that access to this function is only accessible by the timelock itself, meaning this maintenance operation has to go through the timelock itself.

