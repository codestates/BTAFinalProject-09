FROM rust:1.65.0-slim

WORKDIR /usr/src/

USER root

RUN apt-get update \
    && apt-get install -y wget zip sudo
RUN wget https://github.com/aptos-labs/aptos-core/archive/refs/heads/main.zip
RUN unzip main.zip

WORKDIR /usr/src/aptos-core-main

RUN ./scripts/dev_setup.sh -b

RUN source ~/.cargo/env

CMD ["cargo", "run", "-p", "forge-cli", "--", "--suite", "run_forever", "--num-validators", "2", "test", "local-swarm"]