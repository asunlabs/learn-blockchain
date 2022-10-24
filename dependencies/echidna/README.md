# Learning Echidna Essentials

> Echidna: A Fast Smart Contract Fuzzer

## Usage

> The core Echidna functionality is an executable called echidna-test. echidna-test takes a contract and a list of `invariants` (properties that should `always remain true`) as input.

> For each invariant, it generates random sequences of calls to the contract and checks if the invariant holds. If it can find some way to falsify the invariant, it prints the call sequence that does so. If it can't, you have some assurance the contract is safe.

## Installation

### Precompiled binaries

> Before starting, make sure Slither is installed (pip3 install slither-analyzer --user). If you want to quickly test Echidna in Linux or MacOS, we provide statically linked Linux binaries built on Ubuntu and mostly static MacOS binaries on our releases page. You can also grab the same type of binaries from our CI pipeline, just click the commit to find binaries for Linux or MacOS.

> Mac OS: You can install Echidna with `brew install echidna`.

### Docker container

> If you prefer to use a pre-built Docker container, check out our docker package, which is auto-built via Github Actions. The echidna container is based on ubuntu:focal and it is meant to be a small yet flexible enough image to use Echidna on. It provides a pre-built version of echidna-test, as well as slither, crytic-compile, solc-select and nvm under 200 MB.

> Note that the container images currently only build on x86 systems. Running them on ARM devices, such as Mac M1 systems, is not recommended due to the performance loss incurred by the CPU emulation.

> To run the container with the latest Echidna version interactively, you can use something like the following command. It will map the current directory as /src inside the container, and give you a shell where you can use echidna-test:

```sh
# Get Echidna docker image
docker pull ghcr.io/crytic/echidna/echidna:latest

# Run it on Mac OS
docker run -it -v "$PWD":/home/training trailofbits/eth-security-toolbox

# Run in on Windows
docker run -it -v `pwd`:/home/training trailofbits/eth-security-toolbox
```

And then run echidna-test in terminal.

```sh
echidna-test
```

Update the docker container and install nano editor.

```sh
apt-get update
apt-get install nano
```

Install a matching Solidity version of your contracts in the container.

```sh
# install Solidity
solc-select install VERSION

# use Solidity
solc-select use VERSION
```

Run Echidna.

```sh
echidna-test MyContract.sol
```

## Security vulnerability found by Echidna

> The following security vulnerabilities were found by Echidna. If you found a security vulnerability using our tool, please submit a PR with the relevant information.

```
Project	Vulnerability	Date
0x Protocol	If an order cannot be filled, then it cannot be canceled	Oct 2019
0x Protocol	If an order can be partially filled with zero, then it can be partially filled with one token	Oct 2019
0x Protocol	The cobbdouglas function does not revert when valid input parameters are used	Oct 2019
Balancer Core	An attacker cannot steal assets from a public pool	Jan 2020
Balancer Core	An attacker cannot generate free pool tokens with joinPool	Jan 2020
Balancer Core	Calling joinPool-exitPool does not lead to free pool tokens	Jan 2020
Balancer Core	Calling exitswapExternAmountOut does not lead to free assets	Jan 2020
Liquity Dollar	Closing troves require to hold the full amount of LUSD minted	Dec 2020
Liquity Dollar	Troves can be improperly removed	Dec 2020
Liquity Dollar	Initial redeem can revert unexpectedly	Dec 2020
Liquity Dollar	Redeem without redemptions might still return success	Dec 2020
Origin Dollar	Users are allowed to transfer more tokens that they have	Nov 2020
Origin Dollar	User balances can be larger than total supply	Nov 2020
Yield Protocol	Arithmetic computation for buying and selling tokens is imprecise	Aug 2020
```

## Reference

- [Github - crytic/echidna latest version](https://github.com/crytic/echidna/pkgs/container/echidna%2Fechidna/41069885?tag=latest)
