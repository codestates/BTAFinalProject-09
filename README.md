# Apcellent


## 요구 환경
- yarn v1.22
- node v14+
- docker 20.10+
- aptos cli

## Node 실행
```
# aptos key 생성
$ aptos genesis generate-keys --output-dir ./keys
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