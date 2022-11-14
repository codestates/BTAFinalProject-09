# Apcellent


## 요구 환경
- yarn v1.22
- node v14+
- docker 20.10+

## Node 실행
```
# 0. toolkit build
$ docker build -t aptos-toolkit -f ./node/aptos-node.Dockerfile ./node
$ docker build -t aptos-node -f ./node/aptos-node.Dockerfile ./node
$ docker build -t aptos-faucet -f ./node/aptos-faucet.Dockerfile ./node

# 1. key 생성
$ docker run -it -v //f/vscodeWorkspace/BTAFinalProject-09/node/keys:/keys -v //f/vscodeWorkspace/BTAFinalProject-09/node/genesis:/genesis aptos-toolkit /bin/bash
root@83079b3167f9:/# cargo run --package aptos -- genesis generate-keys --output-dir /keys

# 2. ValidatorConfiguration 생성
root@83079b3167f9:/# cargo run --package aptos -- \
    genesis set-validator-configuration \
    --owner-public-identity-file /keys/public-keys.yaml \
    --username apcellent \
    --validator-host validator:6180 \
    --full-node-host fullnode:6182 \
    --local-repository-dir /genesis

# 3. layout 파일 생성 (node/layout.yaml 파일 참고하여 genesis 폴더에 생성)

# 4. aptos framework 빌드
root@83079b3167f9:/# cargo run --package framework -- release
root@83079b3167f9:/# cp head.mrb /genesis/framework.mrb

# 5. genesis.blob, waypoint 생성
root@83079b3167f9:/# cargo run --package aptos -- genesis generate-genesis --local-repository-dir /genesis --output-dir /genesis

# 6. fullnode2 키 생성
$ docker run -it -v //f/vscodeWorkspace/BTAFinalProject-09/node/keys2:/keys aptoslabs/tools:devnet /bin/bash
root@83079b3167f9:/# aptos key generate --key-type x25519 --output-file /keys/private-key.txt
root@83079b3167f9:/# aptos key extract-peer --host fullnode2:6182 \
    --public-network-key-file /keys/private-key.txt.pub \
    --output-file /keys/peer-info.yaml

# 6. validator 키 생성
$ docker run -it -v //f/vscodeWorkspace/BTAFinalProject-09/node/keys3:/keys aptoslabs/tools:devnet /bin/bash
root@83079b3167f9:/# aptos key generate --key-type x25519 --output-file /keys/private-key.txt
root@83079b3167f9:/# aptos key extract-peer --host validator:6181 \
    --public-network-key-file /keys/private-key.txt.pub \
    --output-file /keys/peer-info.yaml
```

## Faucet 실행
```
docker run -it aptos-toolkit \
    cargo run --bin aptos-faucet \
        -- \
        -c 8 \
        --mint-key 0x0deed08d6fed4c586a2003552f1b3fcf7f617b3de165d62e9995d9c1b0405d71 \
        -s 0.0.0.0:8080 \
        -p 8081:8081
```

## Wallet 빌드
```
# wallet 폴더로 이동
$ cd wallet

# 의존성 설치
$ npm install

# 빌드
$ npm run build
```

## 디렉토리 구조

```bash
.
├── daemon/
│   ├── models/                - DB에서 읽어오는 객체 폴더
│   └── routes/                - API 라우팅 정의 폴더
│ 
├── explorer-frontend/
│   ├── public/                - static 파일
│   └── src/
│       ├── assets/            - 이미지 등 에셋
│       ├── components/        - 컴포넌트
│       ├── hooks/             - 커스텀 훅
│       ├── layouts/           - 레이아웃 컴포넌트
│       ├── pages/             - 페이지 컴포넌트 (Route와 1:1 관계)
│       ├── services/          - 서비스 인스턴스
│       ├── types/             - 타입 정의 모음
│       └── utils/             - 유틸리티 함수 모음
│ 
└── wallet/
    ├── public/                - static 파일
    └── src/                   - 소스 파일
```