const { AptosClient } = require("aptos");
const express = require("express");
const app = express();
const port = 3000;
const { Client } = require("@elastic/elasticsearch");
var CronJob = require('cron').CronJob;
require('events').EventEmitter.defaultMaxListeners = 0

//1.ES 설치
//2.최신 블록, Tx 가져와서 ES에 저장
//3.테스트

const ESconnectOption = {
    node: "http://elasticsearch:9200/"
}

const ESClient = new Client(ESconnectOption);

//ES에 Block 데이터 넣는 원형 함수
async function Block_to_ES( blockobj ) {
    try{
        ESClient.index({
        index: "block",
        document: blockobj
    })
    console.log("Block Data Insert to ES succeeded")
    }
    catch(err){
        console.log(err)
    }
}


//ES에 all transactions 집어넣는 함수
function Tx_to_ES( Txbunch ) {
    try{
        ESClient.index({
        index: "tx2",
        document: Txbunch
    })
    console.log("Tx Data Insert to ES Succeeded")
    }
    catch(err){
        console.log(err)
    }    
}


function Resources_to_ES(  Resources ) {
    try{
        ESClient.index({
            index: "resources",
            document: Resources
        })
        console.log("Resources Data Insert to ES Succeeded!")
    }
    catch(err){
        console.log(err)
    }
}

    //https://fullnode.devnet.aptoslabs.com/v1
    const ChainEndPoint = "http://localnode:8080/v1"
    const client = new AptosClient(ChainEndPoint)
    //console.log('client:', client)
      

    async function Execute() {

        const bunchTx = await client.getTransactions();                          //최신 20개 트랜잭션 get query > expected output == [{...}, {...}, {...}]
        //console.log('bunchTx:', bunchTx)
        const latestTx = await bunchTx[bunchTx.length-1]
        //console.log('latestTx:', latestTx)
        const latestTx_ver = await Number(latestTx.version)                            //최신 트랜잭션 version number 추출
        //console.log('latestTxverNum:', latestTx_ver)
        const latestBlock = await client.getBlockByVersion(latestTx_ver)               //추출한 version num으로 최신블록 계산 
        //console.log('lastBlockNum:', latestBlock) 
       

        try{
            //트랜잭션 집어넣기 
            for(i=0; i<bunchTx.length-1; i++) {
                //changes 필드와 payload 체크로 이체 내역 여부 체크                                           
                if(bunchTx[i].changes.length !== 0 && bunchTx[i].payload ){
                    
                    const obj = { bunchTx : bunchTx[i] }
                    //ES에 Push
                    Tx_to_ES(obj)

                    //resources 데이터 Insert 위한 address 추출
                    const senderaddr = bunchTx[i].sender
                    const receiveraddr = bunchTx[i].payload.arguments[0]
                    //account address 기반으로 resources 가져오기
                    const senderResources = await client.getAccountResources(senderaddr)
                    const receiverResources = await client.getAccountResources(receiveraddr)

                    const obj2 = { resources : senderResources}
                    const obj3 = { resources : receiverResources}
                    //ES에 Push
                    Resources_to_ES(obj2)
                    Resources_to_ES(obj3)                   
                }
            }
            //최신 블록 5개 집어넣기
            for(i=latestBlock.block_height-4; i<latestBlock.block_height+1; i++){         
                const Block = await client.getBlockByHeight(i, true)
                Block_to_ES(Block)
            }
        }catch(err){
            console.log(err)
        }
    }
    

var job = new CronJob(
	'*/7 * * * * *',
	function() {
		console.log('You will see this message every 7second');
        Execute()
	},
	null,
	true,
);

// 데몬 서버 실행
app.listen(port, async() => {

    console.log("Daemon Server is running on port:" + port);
    try{
        job  //cronjob 실행   
    }
    catch(err){
        console.log(err);
    }
})