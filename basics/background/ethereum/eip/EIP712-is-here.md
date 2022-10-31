# EIP712 is here: What to expect and how to use it

> Ethereum wallets like MetaMask will soon introduce the EIP712 standard for typed message signing. **This standard allows wallets to display data in signing prompts** in a structured and readable format.

> EIP712 is a great step forward for security and usability because **users will no longer need to sign off on inscrutable hexadecimal strings**, which is a practice that can be confusing and insecure.

> Smart contract and dApp developers should adopt this new standard as it has already been merged into the Ethereum Improvement Proposal repository, and major wallet providers will soon support it. This blog post aims to help developers to do so. It includes a description of what it does, sample JavaScript and Solidity code, and a working demonstration.

**before EIP712**

![image](https://user-images.githubusercontent.com/83855174/199014411-b84c475c-7b49-4593-845a-bd61f8a4024d.png)

> Unfortunately, as this hash is a hexadecimal string, users without significant technical expertise cannot easily verify that it is truly the hash of their intended order. ... This is bad for security.

**with EIP712**

![image](https://user-images.githubusercontent.com/83855174/199014450-c79d544a-ba80-4dd1-badd-baefb9a4f58a.png)

> when an EIP712-enabled dApp requests a signature, the user’s wallet shows them the pre-hashed raw data which they may then choose to sign. This makes it much easier for a user to verify it.

## Domain separator

> As EIP712 explains: It is possible that two DApps come up with an identical structure like `Transfer(address from,address to,uint256 amount)` that should not be compatible. By introducing a domain separator the dApp developers are **guaranteed that there can be no signature collision**.

> The domain separator requires careful thought and effort at the architectural and implementation level. Developers and designers must decide which of the following fields to include or exclude based on what makes sense for their use case.

```
<!-- domain separator fields -->
name
version
chainId
verifyingContract
```

> In practice, a domain separator which uses all the above fields could look like this:

```json
{
  "name": "My amazing dApp",
  "version": "2",
  "chainId": "1",
  "verifyingContract": "0x1c56346cd2a2bf3202f771f50d3d14a367b48070",
  "salt": "0x43efba6b4ccb1b6faa2625fe562bdd9a23260359" // A unique 32-byte value hardcoded into both the contract and the dApp meant as a last-resort means to distinguish the dApp from others.
}
```

> In sum, EIP712 support is coming and developers should take advantage of it. It significantly improves usability and helps to prevents phishing. While it is currently a little tricky to implement, we hope that this article and sample code will help developers to adopt it for their own dApps and contracts.
