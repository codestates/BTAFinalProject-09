const GetNetWork = (type:number)=>{
    if(type == 1)
        return "https://fullnode.devnet.aptoslabs.com";
    if(type == 2)
        return "https://fullnode.testnet.aptoslabs.com";
    if(type == 3) // 로컬 노드 
        return "http://localhost:8080";
    else
        return "https://fullnode.devnet.aptoslabs.com";
}
const GetFaucetNetWork = (type:number)=>{
    if(type == 1)
        return "https://faucet.devnet.aptoslabs.com";
    if(type == 2)
        return "https://faucet.testnet.aptoslabs.com";
    if(type == 3) // 로컬 노드 
        return "http://localhost:8000";
    else
        return "https://faucet.devnet.aptoslabs.com";
}

const common = {
    GetNetWork,
    GetFaucetNetWork
};  
export default common;
