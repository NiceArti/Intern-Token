import React, { Component } from "react";
import InternToken from "./contracts/InternToken.json";
import getWeb3 from "./getWeb3";
import "./App.css";

class App extends Component {
  state = { 
    totalSupply: 0,
    web3: null,
    accounts: null,
    contract: null, 
    balanceOfMsgSender: 0,
    anotherAccount: null,
    amount: 0,
    //isWhitelisted: false
  };

  componentDidMount = async () => 
  {
    try {
      this.to = this.to.bind(this);
      this.amount = this.amount.bind(this);
      this.transfer = this.transfer.bind(this);
      this.burn = this.burn.bind(this);
      this.mint = this.mint.bind(this);
      this.addToWhitelist = this.addToWhitelist.bind(this);


      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = InternToken.networks[networkId];
      const instance = new web3.eth.Contract(
        InternToken.abi,
        deployedNetwork && deployedNetwork.address,
      );
      const balanceOfMsgSender = await instance.methods.balanceOf(accounts[0]).call();
      //const isWhitelisted = await instance.methods.whitelisted().call(accounts[0]);

      console.log(instance);
      

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ 
        web3, 
        accounts,
        contract: instance,
        balanceOfMsgSender,
        //isWhitelisted
      });
    } 
    catch (error) 
    {
      // Catch any errors for any of the above operations.
      alert(`Failed to load web3, accounts, or contract. Check console for details.`);
      
      console.error(error);
    }
  };


  enableMint()
  {
    var mint = document.getElementById("mint");
    var mintVal = document.getElementById("mintVal");

    if(mintVal.value.length !== 0)
      mint.disabled = false;
    else
      mint.disabled = true;
  }


  enableBurn()
  {
    var burn = document.getElementById("burn");
    var burnVal = document.getElementById("burnVal");

    if(burnVal.value.length !== 0)
        burn.disabled = false;
    else 
        burn.disabled = true;
  }

  async transfer(e)
  {
    e.preventDefault();
    const {anotherAccount, amount, contract, accounts} = this.state;
    await contract.methods.transfer(anotherAccount, amount).send({from: accounts[0]});
  }

  async burn(e)
  {
    e.preventDefault();
    const {amount, contract, accounts} = this.state;
    await contract.methods.burn(amount).send({from: accounts[0]});
  }

  async mint(e)
  {
    e.preventDefault();
    const {amount, contract, accounts} = this.state;
    await contract.methods.mint(amount).send({from: accounts[0]});
  }
//!=
  async addToWhitelist(e)
  {
    e.preventDefault();
    const {anotherAccount, contract, accounts} = this.state;
    await contract.methods.addToWhitelist(anotherAccount).send({from: accounts[0]});
  }


  to(e)
  {
    this.setState({anotherAccount: e.target.value})
  }

  amount(e)
  {
    this.setState({amount: e.target.value})
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div class="container">
        <div id="header">
          <h1 align="center">Intern Token</h1>
          <span id="balance" >Balance: {this.state.balanceOfMsgSender} INT</span>
          <span id="account" >Account: {this.state.accounts}</span>
        </div>
        <hr width="99%"/>

        <form name="TransferForm" onSubmit={this.transfer}>
          <input type="submit" id="transfer" value="Transfer"/>
          <input type="text" placeholder="0x38HG4NO..." id="address" onChange={this.to}/>
          <input type="text" placeholder="10" id="value" class="amount" onChange={this.amount}/>
        </form>
        
        <form name="MintForm" onSubmit={this.mint}>
          <input type="submit" id="mint" disabled="true" value="Mint"/>
          <input type="text" placeholder="10" id="mintVal" class="amount" onKeyUp={this.enableMint} onChange={this.amount}/>
        </form>

        <form name="BurnForm" onSubmit={this.burn}>
          <input type="submit" id="burn" disabled="true" value="Burn"/>
          <input type="text" placeholder="10" id="burnVal" class="amount" onChange={this.amount} onKeyUp={this.enableBurn}/>
        </form>

        <form name="WhiteListForm" onSubmit={this.addToWhitelist}>
          <input type="submit" id="addToWhitelist" value="Add in whitelist"/>
          <input type="text" placeholder="0x38HG4NO..." id="address" onChange={this.to}/>
        </form>

        <br/><br/><br/><br/><br/><br/>
        <div id="content" align="center">
          <table>
            <thead>
              <tr>
                <th>Telegram</th>
                <th>Name</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody> 
              <tr>
                <th>@flexxxbob</th>
                <th>Alexander</th>
                <th>0xF0802b38060acF11823d1d3870f0775F454e14B2</th>
              </tr>
              <tr>
                <th>@Valdemar1337</th>
                <th>Vladimir</th>
                <th>...</th>
              </tr>
              <tr>
                <th>@Nektarines</th>
                <th>Nichita</th>
                <th>...</th>
              </tr>
              <tr>
                <th>@zhaukenove</th>
                <th>Yerkebulan</th>
                <th>...</th>
              </tr>
              <tr>
                <th>@Igorterzi</th>
                <th>Igor</th>
                <th>...</th>
              </tr>
              <tr>
                <th>@vadim_peev</th>
                <th>Vadim</th>
                <th>...</th>
              </tr>
              <tr>
                <th>@sweetbubalehj</th>
                <th>Egor</th>
                <th>...</th>
              </tr>
              <tr>
                <th>@Kcintes</th>
                <th>Nicolai</th>
                <th>...</th>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default App;
