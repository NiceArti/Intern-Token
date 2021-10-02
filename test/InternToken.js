const InternToken = artifacts.require("InternToken");
const truffleAssert = require('truffle-assertions');



contract('InternToken', accounts =>
{
  
  describe("Initial data checking:", () => 
  {
    /**
     * check if total supply is what i set
     * so it must be 123123
     */
    it('Total supply must be: 123123', () => 
    {
      return InternToken.deployed().then( instance => 
      {
        tokenInstance = instance;
        return tokenInstance.totalSupply();
      })
      .then( totalSupply => 
        {
          assert.equal(totalSupply.toNumber(), 123123, 'the value must be 123,123');
        })
    });


    /**
     * check if the token name is deployed
     * as i need token.name = 'Intern Token'
    */
    it('Token name must be: Intern token', () => 
    {
      return InternToken.deployed().then(instance => 
      {
        tokenInstance = instance;
        return tokenInstance.name();
      })
      .then(name => 
        {
          assert.equal(name, "Intern Token", 'the name must be Intern Token');
        })
    });

    /**
     * check if the token symbol is deployed
     * as i need token.symbol = 'INT'
    */
    it('Token symbol must be: INT', () => 
      {
        return InternToken.deployed().then(instance => 
        {
          tokenInstance = instance;
          return tokenInstance.symbol();
        })
        .then(symbol => 
          {
            assert.equal(symbol, "INT", 'the symbol must be INT');
          })
    });

    /**
     * check if the balance of owner is 
     * the same as total supply
    */
    it('Token balance must be 123123', () => 
      {
        return InternToken.deployed().then(instance => 
        {
          tokenInstance = instance;

          return tokenInstance.balanceOf(accounts[0]);
        })
        .then(balance => 
          {
            assert.equal(balance, 123123, 'the balance must be 123,123');
          })
    });



    it('Token decimals must be: 0', () => 
      {
        return InternToken.deployed().then(instance => 
        {
          tokenInstance = instance;
          return tokenInstance.decimals();
        })
        .then(decimals => 
          {
            assert.equal(decimals, 0, 'decimals must be zero');
          })
    });
  });

  describe("Transfer methods: ", () => 
  {
    describe("Transfer to: ", () => 
    {
      /**
       * check if function transfer works correctly
      */
      it("Token must transfer correctly", async () => {
          // Get initial balances of first and second account.
          const account_one = accounts[0];
          const account_two = accounts[1];
          let balance;
      
          const amount = 10;
      
          const instance = await InternToken.deployed();
          const _int = instance;
      
          balance = await _int.balanceOf(account_one);
          const account_one_starting_balance = balance.toNumber();
      
          balance = await _int.balanceOf(account_two);
          const account_two_starting_balance = balance.toNumber();
          let tx = await _int.transfer(account_two, amount, { from: account_one });

          
          
          truffleAssert.eventEmitted(tx, 'Transfer', (ev) => 
          {
            return ev._from == account_one 
                  && ev._to == account_two
                  && ev._value == amount;
          });
          

          balance = await _int.balanceOf(account_one);
          const account_one_ending_balance = balance.toNumber();
      
          balance = await _int.balanceOf(account_two);
          const account_two_ending_balance = balance.toNumber();
      
          assert.equal(
            account_one_ending_balance,
            account_one_starting_balance - amount,
            "Amount wasn't correctly taken from the sender"
          );
          assert.equal(
            account_two_ending_balance,
            account_two_starting_balance + amount,
            "Amount wasn't correctly sent to the receiver"
          );
      });
    });


    describe("Transfer from: ", () => 
    {
      /**
       * check if transfer from works correctly
      */
      it("Token must allow owner send from his balance", async () =>
      {
        const account_one = accounts[0];
        const account_two = accounts[1];
        const account_three = accounts[2];
        const amount = 100;

        let balance;
      
        const instance = await InternToken.deployed();
        const _int = instance;

        
        balance = await _int.balanceOf(account_one);
        const account_one_starting_balance = balance.toNumber();

        balance = await _int.balanceOf(account_three);
        const account_three_starting_balance = balance.toNumber();

        
        
        await _int.approve(account_two, amount, { from: account_one });
        await _int.allowance(account_one, account_two);
        let tx = await _int.transferFrom(account_one, account_three, amount, {from: account_two});



        truffleAssert.eventEmitted(tx, 'Transfer', (ev) => 
        {
          return ev._from == account_one
                && ev._to == account_three
                && ev._value == amount;
        });

        

        balance = await _int.balanceOf(account_one);
        const account_one_ending_balance = balance.toNumber();
    
        balance = await _int.balanceOf(account_three);
        const account_three_ending_balance = balance.toNumber();


        assert.equal(
          account_one_ending_balance,
          account_one_starting_balance - amount,
          "Amount wasn't correctly taken from the sender"
        );
        assert.equal(
          account_three_ending_balance,
          account_three_starting_balance + amount,
          "Amount wasn't correctly sent to the receiver"
        );
      });
    });
  });

  describe("Whitelist:", () =>
    {
      describe("Add to whitelist:", () =>
      {
        it("Whitelisted account must add into whitelist", async () =>
        {
          const instance = await InternToken.deployed();

          let userToWL = await instance.addToWhitelist(accounts[1]);
          
          truffleAssert.eventEmitted(userToWL, 'AddToWhitelist', (ev) => {
            return ev.account == accounts[1];
          });
          

          const wl_user = await instance.whitelisted.call(accounts[1]);

          assert.equal(wl_user, true, `${accounts[1]} is ${wl_user}`);
        });


        it("Check if only whitelisted can add to whitelist", async () => 
        {
          const instance = await InternToken.deployed();

          await truffleAssert.reverts
          (
            instance.addToWhitelist(accounts[4], {from: accounts[9]}),
            "Whitelist: only whitelisted can do this operation!"
          );
        });
      });

      describe("Remove from whitelist:", () =>
      {
        it("Whitelisted account must remove from whitelist", async () =>
        {
          const instance = await InternToken.deployed();

          let userFromWL = await instance.removeFromWhitelist(accounts[0], {from: accounts[1]});

          truffleAssert.eventEmitted(userFromWL, 'RemoveFromWhitelist', (ev) => {
            return ev.account == accounts[0];
          });
        
          const wl_user = await instance.whitelisted.call(accounts[0]);

          assert.equal(wl_user, false, `${accounts[1]} is ${wl_user}`);
        });


        it("Check if only whitelisted can remove from whitelist", async () => 
        {
          const instance = await InternToken.deployed();

          await truffleAssert.reverts
          (
            instance.removeFromWhitelist(accounts[4], {from: accounts[9]}),
            "Whitelist: only whitelisted can do this operation!"
          );
        });
      });


  });

  describe("InternToken main contract:", () =>
  {
    describe("Whitelisted accounts have access to burn tokens:", () =>
    {
      it("Token's total supply must be: 123000", async () =>
      {
          const instance = await InternToken.deployed();
          const amount = 123;

          let acc_one = accounts[0];
          let acc_null = "0x0000000000000000000000000000000000000000";
          await instance.addToWhitelist(accounts[0], {from: accounts[1]});


          let totalSupplyBefore = await instance.totalSupply();


          truffleAssert.eventEmitted(
            await instance.burn(amount, {from: accounts[0]}), 'Burn', (ev) => {
            
            return ev.account == acc_one 
                && ev.zero_address == acc_null
                && ev.value == amount;
          });


          let totalSupplyAfter = await instance.totalSupply();

          assert.equal(totalSupplyAfter, totalSupplyBefore - amount, `Total suply is ${totalSupplyAfter}`);
      });

      it("Check if only whitelisted can burn tokens", async () => 
      {
        const instance = await InternToken.deployed();
        await truffleAssert.reverts
        (
          instance.burn(100, {from: accounts[9]}),
          "Whitelist: only whitelisted can do this operation!"
        );
      });

    });

    describe("Whitelisted accounts have access to mint tokens:", () =>
    {
      it("Token's total supply must be: 123100", async () =>
      {
          const instance = await InternToken.deployed();
          const amount = 100;
          let acc_one = accounts[0];

          
          let totalSupplyBefore = await instance.totalSupply();


          truffleAssert.eventEmitted(
            await instance.mint(amount, {from: accounts[0]}), 'Mint', (ev) => {
            
            return ev.account == acc_one 
                && ev.value == amount;
          });


          let totalSupplyAfter = await instance.totalSupply();

          let end_val = parseInt(totalSupplyBefore) + amount;

          assert.equal(totalSupplyAfter, end_val, `Total suply is ${end_val}`);
      });

      it("Check if only whitelisted can mint tokens", async () => 
      {
        const instance = await InternToken.deployed();
        await truffleAssert.reverts
        (
          instance.mint(100, {from: accounts[9]}),
          "Whitelist: only whitelisted can do this operation!"
        );
      });

    });

  });




});