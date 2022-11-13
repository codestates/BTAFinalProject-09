# Aptos daemon setup Guide
<br>

## 1. docker compose up -d 
This command will install ElasticSearch & Kibana on docker. If you haven't installed the docker, install the docker first.

<br>

## 2. Create ElasticSearch Index

```
Example) curl --location --request PUT 'http://localhost:9200/tx' \
--header 'Content-Type: application/json' \
--data-raw '{
  "mappings": {
    "properties": {
      "timestamp": {
        "type": "date",
        "format": "epoch_millis"
      }
    }
  }
}
'
```


## 3. npm install
<br>

## 4. Check ChainEndPoint in app.js 

and Change URL that you want to connect 

<br>

## 5. npm start 
<br>

## 6. Check Index through Kibana

or You can check through Postman as well. 
```
<tx 인덱스 내 트랜잭션 모두 조회> 
curl --location --request GET 'http://localhost:9200/tx/_search?size=10000'  \
--header 'Content-Type: application/json'

```
