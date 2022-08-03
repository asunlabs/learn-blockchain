# Upgrades plugins

<details>
<summary> Workflow</summary>

1. Write your Proxy contract with initializer modifier. If the contract is either ERC20 or ERC721, use @openzeppelin/contracts-upgradeable, not @openzeppelin/contracts.
1. Deploy the Proxy contract first, using hardhat plugin script
1. Write your Upgradable contract with changed logic keeping storage in order
1. Deploy the Upgradable contract with proxy contract address, using hardhat plugin script
</details>

> Integrate upgrades into your existing workflow. Plugins for Hardhat and Truffle to deploy and manage upgradeable contracts on Ethereum.

- Deploy upgradeable contracts.
- Upgrade deployed contracts.
- Manage proxy admin rights.
- Easily use in tests.

## Installation

> For Hardhat users,

```sh
npm install --save-dev @openzeppelin/contracts-upgradeable @openzeppelin/hardhat-upgrades @nomiclabs/hardhat-ethers ethers
```

> and then load them in your Hardhat config file:

```js
// hardhat.config.js
require('@openzeppelin/hardhat-upgrades')
```

```ts
// hardhat.config.ts
import '@openzeppelin/hardhat-upgrades'
```

> For Truffle user,

```sh
npm install --save-dev @openzeppelin/truffle-upgrades
```

## Usage

For Hardhat user,

> Hardhat users will be able to write scripts that use the plugin to deploy or upgrade a contract, and manage proxy admin rights.

```js
const { ethers, upgrades } = require('hardhat')

async function main() {
  // Deploying
  const Box = await ethers.getContractFactory('Box')
  const instance = await upgrades.deployProxy(Box, [42]) // [42]: initializer params
  await instance.deployed()

  // Upgrading: should provide proxy address
  const BoxV2 = await ethers.getContractFactory('BoxV2')
  const upgraded = await upgrades.upgradeProxy(instance.address, BoxV2)
}

main()
```

For Truffle user,

> Truffle users will be able to write migrations that use the plugin to deploy or upgrade a contract, or manage proxy admin rights.

```js
const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades')

const Box = artifacts.require('Box')
const BoxV2 = artifacts.require('BoxV2')

module.exports = async function (deployer) {
  const instance = await deployProxy(Box, [42], { deployer })
  const upgraded = await upgradeProxy(instance.address, BoxV2, { deployer })
}
```

For testing, 

> Whether you’re using Hardhat or Truffle, you can use the plugin in your tests to ensure everything works as expected.

```js
it('works before and after upgrading', async function () {
  // testing proxy contract 
  const instance = await upgrades.deployProxy(Box, [42]);
  assert.strictEqual(await instance.retrieve(), 42);

  // testing upgraded proxy contract
  await upgrades.upgradeProxy(instance.address, BoxV2);
  assert.strictEqual(await instance.retrieve(), 42);
});
```

## How the plugins work

> Both plugins provide functions which take care of managing upgradeable deployments of your contracts.

> deployProxy does the following:

1. Validate that the **implementation is upgrade-safe**.
1. **Deploy a proxy admin** for your project (if needed).
1. **Deploy** the **implementation** contract.
1. Create and **initialize** the proxy contract.

<details>
<summary>What is a proxy admin?</summary>

> A ProxyAdmin is a contract that acts as the owner of all your proxies. **Only one per network** gets deployed. When you start your project, the **ProxyAdmin is owned by the deployer address**, but you can **transfer ownership** of it by calling **transferOwnership**.
</details>

> upgradeProxy does the following:

1. Validate that the new implementation is **upgrade-safe and is compatible** with the previous one.
1. Check if there is an implementation contract deployed with the same bytecode, and deploy one if not.
1. Upgrade the proxy to use the **new implementation contract**.

> The plugins will keep track of all the **implementation contracts** you have deployed in an **.openzeppelin folder** in the project root, as well as the **proxy admin**. You will find one file per network there. It is advised that you commit to source control the files for all networks except the development ones (you may see them as .openzeppelin/unknown-\*.json

- .openzeppelin: implementation + proxy admin addresses

## Proxy patterns

- Plugin proxy pattern: UUPS, transparent, beacon
- UUPS, transparent: deployProxy, upgradeProxy
- Beacon: deployBeacon, deployBeaconProxy, upgradeBeacon

> The plugins **support the UUPS, transparent, and beacon proxy patterns**. UUPS and transparent proxies are upgraded individually, whereas any number of beacon proxies can be upgraded atomically at the same time by upgrading the beacon that they point to. For more details on the different proxy patterns available, see the documentation for Proxies.

> For UUPS and transparent proxies, use deployProxy and upgradeProxy as shown above. For beacon proxies, use deployBeacon, deployBeaconProxy, and upgradeBeacon. See the documentation for Hardhat Upgrades and Truffle Upgrades for examples.

## Managing ownership

> **Transparent proxies define an admin address which has the rights to upgrade them**. By default, the admin is a proxy admin contract deployed behind the scenes. You can change the admin of a proxy by calling the **admin.changeProxyAdmin** function in the plugin. Keep in mind that the admin of a proxy **can only upgrade it**, but not interact with the implementation contract. Read Transparent Proxies and Function Clashes for more info on this restriction.

> The proxy admin contract also defines an **owner address which has the rights to operate it**. By default, this address is the **externally owned account used during deployment**. You can change the proxy admin owner by calling the **admin.transferProxyAdminOwnership** function in the plugin. Note that changing the proxy admin owner effectively transfers the power to upgrade any proxy in your whole project to the new owner, **so use with care**. Refer to each plugin documentation for more details on the admin functions.

```ts
import { upgrades } from 'hardhat'

// if upgradeable contract uses transparent proxy pattern
upgrades.admin.changeProxyAdmin // change ProxyAdmin contract address
upgrades.admin.transferProxyAdminOwnership // change ProxyAdmin owner address(signer)
```

> **UUPS and beacon proxies do not use admin addresses**. **UUPS proxies** rely on an **_authorizeUpgrade** function to be overridden to include **access restriction** to the upgrade mechanism, whereas **beacon proxies** are upgradable **only by the owner** of their corresponding beacon.

> Once you have transferred the rights to upgrade a proxy or beacon to another address, you can still use your local setup to validate and deploy the implementation contract. The plugins include a **prepareUpgrade** function that will **validate that the new implementation is upgrade-safe and compatible** with the previous one, and deploy it using your local Ethereum account. You can then execute the upgrade itself from the admin or owner address. You can **also use the proposeUpgrade** function to automatically set up the upgrade in **Defender Admin**.

```ts
import { upgrades } from 'hardhat'

upgrades.prepareUpgrades // upgrade validation
```