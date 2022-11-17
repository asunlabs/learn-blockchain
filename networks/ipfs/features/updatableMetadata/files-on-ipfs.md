# Update Files on IPFS using IPNS

## Prerequisites

> This tutorial is tested with go-ipfs version 0.4.3-rc1. Please update this file on github to reflect any other versions that have been tested.

1. You should have some familiarity with the commandline.
1. You should have ipfs installed: this tutorial will use go-ipfs, version 0.4.3-rc1.
1. You should know how to add files and access files in IPFS.

## System Requirements

## Goals

1. Use IPNS to point to a file in IPFS and update that pointer over time as the file changes
1. Use IPNS to track an entire website as it changes over time
1. Map DNS to IPNS

## Conceptual Framework

> Normally, updating content means replacing a file - for instance, if I update a blog post, then people will see the edited file, and not the new one. However, with IPFS, both verisons of the file will be accessible in the network. It’s not a matter of replacing: you add the new one, too. This raises the question: how do we actually update our links, so that people will see the new version of a file? They can’t go to the file’s location, because IPFS locates files by looking for their hashes (that’s what content-addressed means). So, you need to have a way of pointing people to the new hash easily.

> The trick is to add new the content, and then update a pointer to that content. So, there needs to be a way of having a mutable pointer.

> This is where IPNS comes in, the InterPlanetary Naming System (Name Service?). IPNS is a simple service that uses your peer ID to point to a particular hash. This hash can change, but your peer ID doesn’t. That means that you can point to content in IPFS that may also change, and people can still access it without needing to know the new hash before hand.

> Author Question: Does IPNS point to a constant hash that is in your config, or does it just use your peerId? Does your IPNS hash ever change?

## Steps

> Here’s where you list links to the activities in this module.

1. Add a file to IPFS
1. Set up IPNS on your node
1. Create an IPNS entry that points to your file
1. Modify your File and add the modified version to IPFS
1. Update the IPNS entry to point to the new version

1. (maybe put in another tutorial) 6. Map DNS to IPNS

1. (maybe put in another tutorial) 7. add multiple files (ie. an entire website) to IPFS 8. Use IPNS to link to the entire website, or any file in the website
