const { AptosClient } = require("aptos");
const express = require("express");
const app = express();
const port = 3000;
const { Client } = require("@elastic/elasticsearch");
var CronJob = require('cron').CronJob;

//1.ES 설치
//2.최신 블록, Tx 가져와서 ES에 저장
//3.테스트

const ESconnectOption = {
    node: "http://localhost:9200/"
}

//ES 연결
function generateESClient() {
    try{
        const ESClient = new Client(ESconnectOption);
        ESClient;
        console.log("ES connection Succeeded")
    }
    catch(err){
        console.log(err)
    }
}

//ES에 Block 데이터 넣는 원형 함수
async function Block_to_ES( blockobj ) {
    await client.index({
        index: "block",
        document: blockobj
    })
}

//최신 블록-5개 ES에 집어넣는 함수
async function InsertLatest5Blocks() {

    for(let i=latestBlock-4; i<latestBlock+1; i++) {

        const Block = client.getBlockByHeight(i)

        // 블록 안 트랜잭션 빈값인지 체크하고 채워져있으면 Insert
        if(Block.transactions !== null) {
            try{
                Block_to_ES(Block)
            }
            catch(err){
                console.log(err)
            }
        }
    }
}


//ES에 all transactions 집어넣는 함수
async function Tx_to_ES( Txbunch ) {
    await client.index({
        index: "tx",
        document: Txbunch
    })
}


    const ChainEndPoint = "http://127.0.0.1:49877"
    const client = new AptosClient(ChainEndPoint)
    console.log(client)

    async function getBunchTx() {
        const bunchTx = await client.getTransactions()
        return bunchTx
        
    }
    getBunchTx()                                    //모든 트랜잭션 get query > expected output == [{...}, {...}, {...}]
    console.log("bunchTx:", getBunchTx() )
    
    const latestTx = client.getTransactions[client.getTransactions.length-1] //최신 트랜잭션 1개 추출
    const latestTx_ver = Number(latestTx.version)                            //최신 트랜잭션 version number 추출
    const latestBlock = client.getBlockByVersion(latestTx_ver)               //추출한 version num으로 최신블록 계산


// 매주기마다 callback func 실행하는 Cronjob 
var job = new CronJob(
    '******',   
    function(){
        //console.log("CronJob Started!")

        try{
            ConnectChain()
            // ES에 1초? 마다 모든 트랜잭션 Insert
            Tx_to_ES(bunchTx)
            // ES에 1초? 마다 최신 5개 블록 Insert
            InsertLatest5Blocks()
            console.log("Insert Tx&Block Data into ES Succeeded!")
        } catch(err){
            console.log(err)
        }
    },
    null,
    true,
    'Asia/Seoul'
)


// 데몬 서버 실행
app.listen(port, async() => {

    console.log("Daemon Server is running on port:" + port);
    try{
        //ES 연결
        const esclient = generateESClient()
        esclient
        //cronjob 실행
        job     
    }
    catch(err){
        console.log(err);
    }
})



//Block Example
// {"block_height":"10",
// "block_hash":"0x24f9dbc9dce49699fe36fd8725dcef32a08828e616cbf9865745233375e85552",
// "block_timestamp":"1667714463027440",
// "first_version":"18",
// "last_version":"19",
// "transactions":null...



// Tx Example
// {"version":"208",
// "hash":"0xa85341cff5eef4d42d493a5198ca5856dfe0eee3150cae4085061f7264b19a14",
// "state_change_hash":"0x7e8c4789050c7027ae653694900fd584beaa0e7dcb8c3bd9bebe5c51fee832c5",
// "event_root_hash":"0x9c65a899fdbb0523736a896a4c1d5581b7088f40fb522dfb3647c9f5e9e87f57",
// "state_checkpoint_hash":null,
// "gas_used":"0"
// "success":true,
// "vm_status":"Executed successfully",
// "accumulator_root_hash":"0xfb264673522bf1dba90b536e230ba6873a2e52788d4e53e0e38fe3c2893909cd,
// "changes":[
// {"address":"0x1",
// "state_key_hash":"0x5ddf404c60e96e9485beafcabb95609fed8e38e941a725cae4dcec8296fb32d7",
// "data":{"type":"0x1::block::BlockResource","data":{"epoch_interval":"86400000000","height":"105","new_block_events":{"counter":"106","guid":{"id":{"addr":"0x1","creation_num":"3"}}},
// "update_epoch_interval_events":{"counter":"0","guid":{"id":{"addr":"0x1","creation_num":"4"}}}}},
// "type":"write_resource"},
// {"address":"0x1",
// "state_key_hash":"0x8048c954221814b04533a9f0a9946c3a8d472ac62df5accb9f47c097e256e8b6",
// "data":{"type":"0x1::stake::ValidatorPerformance",
// "data":{"validators":[{"failed_proposals":"1","successful_proposals":"103"}]}},
// "type":"write_resource"},
// {"address":"0x1",
// "state_key_hash":"0x7b1615bf012d3c94223f3f76287ee2f7bdf31d364071128b256aeff0841b626d",
// "data":{"type":"0x1::timestamp::CurrentTimeMicroseconds",
// "data":{"microseconds":"1667707877587929"}},"type":"write_resource"}],
// "id":"0xebc62e7c7de60e91a57391c3d0273bcb24d6fb33ef9abef8906b050b12a620d1",
// "epoch":"2",
// "round":"104",
// "events":[{"guid":{"creation_number":"3","account_address":"0x1"},
// "sequence_number":"105","type":"0x1::block::NewBlockEvent",
// "data":{"epoch":"2","failed_proposer_indices":[],
// "hash":"0xebc62e7c7de60e91a57391c3d0273bcb24d6fb33ef9abef8906b050b12a620d1",
// "height":"105",
// "previous_block_votes_bitvec":"0x80",
// "proposer":"0x9fb990a45f2b358283b0a8cfb7b9350ef705c35d978661c169a0543a8e71b384",
// "round":"104",
// "time_microseconds":"1667707877587929"}}],
// "previous_block_votes_bitvec":[128],
// "proposer":"0x9fb990a45f2b358283b0a8cfb7b9350ef705c35d978661c169a0543a8e71b384",
// "failed_proposer_indices":[],
// "timestamp":"1667707877587929",
// "type":"block_metadata_transaction"}