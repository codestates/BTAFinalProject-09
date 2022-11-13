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
    node: "http://localhost:9200/"
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
    const ChainEndPoint = "https://fullnode.devnet.aptoslabs.com/v1"
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


// Dev Tx example
// {
//     version: '8937481',
//     hash: '0x4c1ff1fd8973cf104bc50354d36fec9f12f6cec7598c11009962c164f3d3ad19',
//     state_change_hash: '0xb1f85241d4819ba9dc163a8fdbbcc86c7a5a8dc859ac05064f8aec27f3aa51c6',
//     event_root_hash: '0x414343554d554c41544f525f504c414345484f4c4445525f4841534800000000',
//     state_checkpoint_hash: null,
//     gas_used: '19704',
//     success: true,
//     vm_status: 'Executed successfully',
//     accumulator_root_hash: '0x0af37cfa621b0005e0bde127aff4f91d4de93f85c8ea05d8f5b19e9c8f27be0d',
//     changes: [
//       {
//         address: '0xb64bd603c0c2530a6f27feb4e0e4e896874a84a2b5cf50db5f4f8425ee427793',
//         state_key_hash: '0xd92706ca51cae1d26e00f11a44bc80de1fed062e65cc0d78020f8e2e24f3b479',
//         data: [Object],
//         type: 'write_module'
//       },
//       {
//         address: '0xb64bd603c0c2530a6f27feb4e0e4e896874a84a2b5cf50db5f4f8425ee427793',
//         state_key_hash: '0xcfe1a32b3cbb42e8eda4d0f3fad69bc53011f91fac418ad5562c52c2c94be17a',
//         data: [Object],
//         type: 'write_module'
//       },
//       {
//         address: '0xb64bd603c0c2530a6f27feb4e0e4e896874a84a2b5cf50db5f4f8425ee427793',
//         state_key_hash: '0xa895663560f89602ee75489fd91d3377164641aa587c550c9ee268f6bf5214b6',
//         data: [Object],
//         type: 'write_module'
//       },
//       {
//         address: '0xb64bd603c0c2530a6f27feb4e0e4e896874a84a2b5cf50db5f4f8425ee427793',
//         state_key_hash: '0x96bce6db8b188d75ef3e8c3fe89d38b47243eac505a8fb43753dc4609a194b20',
//         data: [Object],
//         type: 'write_module'
//       },
//       {
//         address: '0xb64bd603c0c2530a6f27feb4e0e4e896874a84a2b5cf50db5f4f8425ee427793',
//         state_key_hash: '0x50b07500aa1092cf1fb7c691308ce2aef7edff04268beb34623f726f65a4171b',
//         data: [Object],
//         type: 'write_module'
//       },
//       {
//         address: '0xb64bd603c0c2530a6f27feb4e0e4e896874a84a2b5cf50db5f4f8425ee427793',
//         state_key_hash: '0x36c42750659932dd3535d23f1791b853a2ff7db68462364af04b8587ef375cc1',
//         data: [Object],
//         type: 'write_resource'
//       },
//       {
//         address: '0xb64bd603c0c2530a6f27feb4e0e4e896874a84a2b5cf50db5f4f8425ee427793',
//         state_key_hash: '0x4e8c1a2e74b27b7c593de64c2e1565b5e6a41f81cf9a943490829822a5dddd2e',
//         data: [Object],
//         type: 'write_resource'
//       },
//       {
//         address: '0xb64bd603c0c2530a6f27feb4e0e4e896874a84a2b5cf50db5f4f8425ee427793',
//         state_key_hash: '0x8e4ae534cf2d0a85fac3aaaab1c3ee6bc4102d6cf8ffd96dc8520fe5e27fb4c0',
//         data: [Object],
//         type: 'write_resource'
//       },
//       {
//         state_key_hash: '0x6e4b28d40f98a106a65163530924c0dcb40c1349d3aa915d108b4d6cfc1ddb19',
//         handle: '0x1b854694ae746cdbd8d44186ca4929b2b337df21d1c74633be19b2710552fdca',
//         key: '0x0619dc29a0aac8fa146714058e8dd6d2d0f3bdf5f6331907bf91f3acd81e6935',
//         value: '0x303dc01a439709000100000000000000',
//         data: null,
//         type: 'write_table_item'
//       }
//     ],
//     sender: '0xb64bd603c0c2530a6f27feb4e0e4e896874a84a2b5cf50db5f4f8425ee427793',
//     sequence_number: '0',
//     max_gas_amount: '25000',
//     gas_unit_price: '100',
//     expiration_timestamp_secs: '1668084183',
//     payload: {
//       function: '0x1::code::publish_package_txn',
//       type_arguments: [],
//       arguments: [
//         '0x124e696768746c794d61726b6574706c6163650100000000000000004033393943334239313743393642304130323336423135424237304545324234393332393232343342453733374530443331393634333634453041393035394531f4011f8b08000000000002ffb5903f6bc33010c5777d0aa1254b6ba76ba143a02d744886fe994c0867e96a0bcb9290ce2ea1f4bbf7445c3a246b6ebae3fddedde39a087a800ef7c2c388f241aa9ded7a72c72da401293ad0a8c48c29dbe08bbcaeeeaab51253ec12183cc4e0ac3e1641873102d9d6312f1a8311bd41af2de6bdd8440af939f185af9006a6bf6567a9b87aa298efeb9ac77e6a2b5e5243816f1db4796975485831a06e649e5a6353319ea431cc587ffe2d5ef8ff991d09e7821b9c3d92923fa72cef61407fed1c548e5ccc201a302661cee539e70f6778755889cde3f665b7f41f6f4faf4bcbf50b2e81b857b601000005057574696c730000000c637573746f6d5f6576656e740000000a636f6c6c656374696f6e000000047573657200000004636f72650000000400000000000000000000000000000000000000000000000000000000000000010e4170746f734672616d65776f726b00000000000000000000000000000000000000000000000000000000000000010b4170746f735374646c696200000000000000000000000000000000000000000000000000000000000000010a4d6f76655374646c696200000000000000000000000000000000000000000000000000000000000000030a4170746f73546f6b656e00',
//         [Array]
//       ],
//       type: 'entry_function_payload'
//     },
//     signature: {
//       public_key: '0xb34f8b8208d79285bef7dc6f3c6e8045e662163f072778f41fc5f6a2177aa4f2',
//       signature: '0xf1985805944a328f0bbd3bc425aaf11585f5344fc919fe45936de08117a01c54136be65799c8caca202e6a2aaddcc4487676e739d164968d9e82ba2f3c29fd06',
//       type: 'ed25519_signature'
//     },
//     events: [],
//     timestamp: '1668084154351337',
//     type: 'user_transaction'
//   }