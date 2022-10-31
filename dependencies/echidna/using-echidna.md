# Using Echidna to test a smart contract library

## Libraries may import risk

> Finding bugs in individual smart contracts is critically important: A contract may manage significant economic resources, whether in the form of tokens or Ether, and damages from vulnerabilities may be measured in millions of dollars. Arguably, though, there is code on the Ethereum blockchain that’s even more important than any individual contract: `library code`.

> Libraries are potentially shared by many high-value contracts, so a subtle unknown bug in, say, SafeMath, could allow an attacker to exploit not just one, but many critical contracts. The criticality of such infrastructure code is well understood outside of blockchain contexts—bugs in widely used libraries like TLS or sqlite are contagious, infecting potentially all code that relies on the vulnerable library.

> Library testing often focuses on detecting memory safety vulnerabilities. On the blockchain, however, we’re not so worried about avoiding stack smashes or a `memcpy` from a region containing private keys; we’re worried most about the semantic correctness of the library code.

> Smart contracts operate in a financial world where `code is law` and if a library computes incorrect results under some circumstances, that `legal loophole` may propagate to a calling contract, and allow an attacker to make the contract behave badly.

> Such loopholes may have other consequences than making a library produce incorrect results; if an attacker can force library code to unexpectedly revert, they then have the key to a potential denial-of-service attack. And if the attacker can make a library function enter a runaway loop, they can combine denial of service with costly gas consumption.

> That’s the essence of a bug Trail of Bits discovered in an old version of a library for managing arrays of addresses, as described in this audit of the Set Protocol code.

## Property-based fuzzing 101

> Our job is to take the functions we’re interested in—here, all of them—and:

- Figure out what each function does, then
- Write a test that makes sure the function does it!

> One way to do this is to write a lot of unit tests, of course, but this is problematic. If we want to thoroughly test the library, it’s going to be a lot of work, and, frankly, we’re probably going to do a bad job. Are we sure we can think of every corner case? Even if we try to cover all the source code, bugs that involve missing source code, like the `hasDuplicate` bug, can easily be missed

> **Most importantly, even admirably well-done manual unit tests don’t find the kind of weird edge-case bugs attackers are looking for.**

> In Echidna, properties are just Boolean Solidity functions that usually return true if the property is satisfied (we’ll see the exception below), and fail if they either revert or return false
