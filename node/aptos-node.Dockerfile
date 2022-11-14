FROM rust:1.65.0-slim

WORKDIR /usr/src

RUN apt-get update \
    && apt-get install -y sudo git
RUN git clone https://github.com/aptos-labs/aptos-core.git

WORKDIR /usr/src/aptos-core

RUN ./scripts/dev_setup.sh -b

RUN cargo build --package aptos-node