var Contract = require('web3-eth-contract');

Contract.setProvider('https://ropsten.infura.io/v3/2e37d1b588074a579b0f009e7ae4a204');

var {abi, networks} = require('../build/contracts/InternToken.json');
var InternToken = new Contract(abi, networks['3'].address);

InternToken.methods.name().call().then(console.log());
//InternToken.methods.totalSupply().call().then(console.log);


function balance(address)
{
    return InternToken.methods.balanceOf(address).call();
}
/*
function burn(value)
{
    return InternToken.methods.burn(value).send();
}

function mint(value)
{
    return InternToken.methods.mint(value).send();
}

function transfer(from, to)
{
    return InternToken.methods.transfer(from, to).send();
}*/