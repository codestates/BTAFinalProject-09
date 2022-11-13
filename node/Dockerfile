FROM rust:1.65.0-slim

WORKDIR /usr/src/

USER root

RUN apt-get update \
    && apt-get install -y sudo git
RUN git clone https://github.com/aptos-labs/aptos-core.git

WORKDIR /usr/src/aptos-core

RUN ./scripts/dev_setup.sh -b

CMD ["cargo", "run", "-p", "forge-cli", "--", "--suite", "run_forever", "--num-validator-fullnodes", "2", "test", "local-swarm"]