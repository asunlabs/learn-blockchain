# How to update immutable IPFS metadata

1. Create a IPFS key

```sh
ipfs key gen test
```

2. Back up the key for production.

```sh
ipfs key export -o /path/to/save/test.key test
```

3. Create a metadata in a directory and add it to IPFS network to get CID. 

```json:metadata.json
{
    "name": "first jake"
}
```

```sh
# dir: jsonDir/metadata.json
# get CID: e.g) xx123
ipfs add -r jsonDir
```

4. Publish IPNS with the paired key.

```sh
# ipns published to : /ipns/aa00
ipfs name publish -k test xx123
```

5. Check metadata upload with IPNS CID.

```sh
# should get meatadata.json
ipfs get /ipns/aa00
```

5. Update the metadata and add the data in a new directory. 

```json:metadata_updated.json
{
    "name": "new jake"
}
```

```sh
# dir: newJsonDir/metadata_updated.json
# get CID: yy123
ipfs add -r newJsonDir
```

6. Update IPNS object.

```sh
# published to : /ipns/aa00
ipfs name publish -k test yy123
```

7. Check the updated metadata

```sh
# output: CID/metadata_updated.json
ipfs get /ipns/aa00
```

## Example

```sh
# key
k51qzi5uqu5dj01kmao45nsbdyo0ffndcwrx7l6h9x73rjcpg8a180odcgz7cz

# key paired with ipfs cid
k51qzi5uqu5dj01kmao45nsbdyo0ffndcwrx7l6h9x73rjcpg8a180odcgz7cz: /ipfs/QmarWQ2trPqnvgRVFPqz5U7ATQ8DkJyrtvwjU3m2e82qPN

# get the latest ipfs asset 
ipfs get /ipns/key
```

## IPNS in practice

> Resolving IPNS names using IPFS gateways
IPNS names can be resolved by IPFS gateways in a trusted fashion using both path resolution and subdomain resolution style:

```
Path resolution: https://ipfs.io/ipns/{ipns-name}
Subdomain resolution: https://{ipns-name}.ipns.dweb.link
```

> For example:

```
https://ipfs.io/ipns/k51qzi5uqu5dlvj2baxnqndepeb86cbk3ng7n3i46uzyxzyqj2xjonzllnv0v8
```

> Note IPNS resolution via an IPFS gateway is trusted (in the sense of trusting the gateway) which means you delegate IPNS resolution to the gateway without any means to verify the authenticity response you get, i.e the content path and signature of the IPNS record.

## Reference

- [IPFS: How to add a file to an existing folder?](https://stackoverflow.com/questions/39803954/ipfs-how-to-add-a-file-to-an-existing-folder)
- [IPFS offical docs - IPNS in practice](https://docs.ipfs.tech/concepts/ipns/#ipns-in-practice)
