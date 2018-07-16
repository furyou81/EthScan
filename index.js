const bigInt = require("big-integer");
const Web3 = require('web3');
const fs = require('fs');
const randomhex = require('randomhex');

var web3 = new Web3(Web3.givenProvider || new Web3.providers.HttpProvider('https://mainnet.infura.io/hWwFg4nxc8cYgODoi4QF'));

checkAddressBalance = (privateIndex, callback) => {
    var privateKey = new Buffer.from(privateIndex.toString(16).padStart(64, '0'), 'hex');
    var publicAddress = web3.eth.accounts.privateKeyToAccount(privateKey).address;
    web3.eth.getBalance(publicAddress)
        .then((balance)=>callback(privateIndex, balance/1000000000000000000),
                (err)=>console.error('err on ' + publicAddress)//checkAddressBalance(privateIndex, callback)
        );
};

showBalance = (privateIndex, balance) => {
//    fs.writeFileSync('state.txt', privateIndex.toString(16));
    if (balance)
        fs.appendFileSync('output.txt', privateIndex.toString(16).padStart(64, '0') + " => " + balance + "\n");
};

(async ()=>{
    //var previousIndex = (fs.readFileSync('state.txt').toString() || "1").padStart(64, '0');
    var previousIndex = randomhex(64).substr(2,64);
    
    var privateIndex = bigInt(previousIndex, 16);
    console.log("Current scan index at " + previousIndex);
    for (let i = 0; i < 1000; i++) {
        checkAddressBalance(privateIndex, showBalance);
        privateIndex = privateIndex.add(1);
    }
})();
