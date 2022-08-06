FROM golang:latest

# Set the working directory for any subsequent ADD, COPY, CMD, ENTRYPOINT
WORKDIR /build

COPY . .

RUN cd /build

RUN go build

# Define the network ports that this container will listen on at runtime.
EXPOSE 3000

CMD [ "/build/go-api" ]