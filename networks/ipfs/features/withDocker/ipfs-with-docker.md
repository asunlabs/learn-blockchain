# Run IPFS inside Docker

> You can run Kubo IPFS inside Docker to simplify your deployment processes, as well as horizontally scale your IPFS infrastructure.

## Set up

1. Grab the IPFS docker image hosted at hub.docker.com/r/ipfs/kubo (opens new window).

2. To make files visible inside the container, you need to mount a host directory with the -v option to Docker. Choose a directory that you want to use to import and export files from IPFS. You should also choose a directory to store IPFS files that will persist when you restart the container.

```sh
export ipfs_staging=</absolute/path/to/somewhere/>
export ipfs_data=</absolute/path/to/somewhere_else/>
```

3. Start a container running ipfs and expose ports 4001 (P2P TCP/QUIC transports), 5001 (RPC API) and 8080 (Gateway):

```sh
docker run -d --name ipfs_host -v $ipfs_staging:/export -v $ipfs_data:/data/ipfs -p 4001:4001 -p 4001:4001/udp -p 127.0.0.1:8080:8080 -p 127.0.0.1:5001:5001 ipfs/kubo:latest
```

> NEVER EXPOSE THE RPC API TO THE PUBLIC INTERNET

> The API port provides admin-level access to your IPFS node. See RPC API docs for more information.

4. Watch the ipfs log:

```sh
docker logs -f ipfs_host
```

5. Wait for IPFS to start:

```sh
Gateway (readonly) server
listening on /ip4/0.0.0.0/tcp/8080
```

> You can now stop watching the log.

6. Run IPFS commands with docker exec ipfs_host ipfs <args...>. For example:

> To connect to peers:

```sh
docker exec ipfs_host ipfs swarm peers
```

> To add files:

```sh
cp -r <something> $ipfs_staging
docker exec ipfs_host ipfs add -r /export/<something>
```

7. Stop the running container:

```sh
docker stop ipfs_host
```

> When starting a container running ipfs for the first time with an empty data directory, it will call ipfs init to initialize configuration files and generate a new keypair. At this time, you can choose which profile to apply using the IPFS_PROFILE environment variable:

```sh
docker run -d --name ipfs_host -e IPFS_PROFILE=server -v $ipfs_staging:/export -v $ipfs_data:/data/ipfs -p 4001:4001 -p 4001:4001/udp -p 127.0.0.1:8080:8080 -p 127.0.0.1:5001:5001 ipfs/kubo:latest
```
