<template>
    <div class="row">
    <card type="chart">
        <template slot="header">
          <h3 style="display: table;
                      margin: 0 auto;"
              class="card-title"><i class="tim-icons icon-coins"></i> TokenA Liquidity Pool</h3>
        </template>
        <base-input v-model="inputValueA"
                placeholder="Input">
        </base-input>
        <select name="tokens" id="inputToken">
          <option>{{tokens[0]}}</option>
        </select>

        <h1 style="display: flex;
            font-size:20px;
            margin-top:15px;
            display: table;
            margin: 0 auto;" 
            class="swap-arroy tim-icons icon-simple-add"></h1>

        <base-input Style="margin-top:35px; font-size:17px;" v-model="outputValueA"
                placeholder="Input">
        </base-input>

        <select name="tokens" id="outputToken">
          <option>RBTC</option>
        </select>
          <br>
          <div id="buttons" style="display: table;margin: 0 auto;">
            <base-button @click="approveContract('A')" type="primary" :disabled="approvePoolA" fill> 1. Approve Contract </base-button>
            <base-button @click="swapTokens()" type="primary" :disabled="!approvePoolA" fill> 2. Add Liquidity </base-button>
          </div>

    </card>
    
    <card type="chart">
        <template slot="header">
          <h3 style="display: table;
                      margin: 0 auto;"
              class="card-title"><i class="tim-icons icon-coins"></i> TokenB Liquidity Pool</h3>
        </template>
        <base-input v-model="inputValueB"
                placeholder="Input">
        </base-input>
        <select name="tokens" id="inputToken">
          <option>{{tokens[1]}}</option>
        </select>
        
        <h1 style="display: flex;
            font-size:20px;
            margin-bottom:20px;
            margin-top:15px;
            display: table;
            margin: 0 auto;" 
            class="swap-arroy tim-icons icon-simple-add"></h1>

        <base-input Style="margin-top:35px; font-size:17px;" v-model="outputValueB"
                placeholder="Input">
        </base-input>

        <select name="tokens" id="outputToken">
          <option>RBTC</option>
        </select>

        <br>
        <div id="buttons" style="display: table;margin: 0 auto;">
          <base-button @click="approveContract('B')" type="primary" :disabled="approvePoolB" fill> 1. Approve Contract </base-button>
          <base-button @click="swapTokens()" type="primary" :disabled="!approvePoolB" fill> 2. Add Liquidity </base-button>
        </div>
    </card>
    </div>
</template>
<script>
  import config from '@/config';
  import contractsInfo from './../plugins/contractsInfo.js'

  const Web3 = require("web3");
  web3 = new Web3(window.ethereum);

  export default {
    components: {
    },
    watch: {
      inputValueA: function(){
        this.calculateConversion(this.tokens[0]);
      },
      inputValueB: function(){
        this.calculateConversion(this.tokens[1]);
      }
    },
    data() {
      return {
        tokens: [
          'tokenA', 'tokenB'
        ],
        routerContractDeployed:null,
        tokenAContractDeployed:null,
        defaultAccount:null,

        routerContract:{
            chainId: 31,
            address: contractsInfo.routerContract.address,
            abi: contractsInfo.routerContract.address
        },
        tokenA: {
            chainId: 31,
            address: contractsInfo.tokenAContract.address,
            abi: contractsInfo.tokenAContract.abi,
        },
        outputValue:null,
        approvePoolA: false,
        approvePoolB: false,
        inputValueA:null,
        outputValueA:null,
        inputValueB:null,
        outputValueB:null,
        replaceValue:null
      }
    },
    methods: {
      calculateConversion: function(pool){
        console.log('calculateConversionFunction');
          var TOKEN2_ADDRESS='';
          let stringValue='';
          if (pool == this.tokens[0]) //tokenA
          {
            TOKEN2_ADDRESS = contractsInfo.tokenAContract.address;
            this.replaceValue = function(value){that.outputValueA = value;};
            stringValue = String(this.inputValueA.toString()+'000000000000000000'); 
          } else { //tokenB
            TOKEN2_ADDRESS = contractsInfo.tokenBContract.address;
            this.replaceValue = function(value){that.outputValueB = value;};
            stringValue = String(this.inputValueB.toString()+'000000000000000000'); 
          }

          const WRBTC_ADDRESS = "0x09B6Ca5E4496238a1F176aEA6bB607db96C2286E";
          const path = [WRBTC_ADDRESS, TOKEN2_ADDRESS];
          var contractRouter = new web3.eth.Contract(contractsInfo.routerContract.abi, contractsInfo.routerContract.address);

          var that = this;
          contractRouter.methods.getAmountsIn(stringValue, path).call(function(err, result){
            if (!err){
              var new_res = result[0]/(10**18);
              console.log(new_res);
              that.replaceValue(new_res);
            //TODO revisar aquesta conversio de divisio
            }
          })
      },
     addLiquidity: function(){

        if (window.ethereum) {
            
            web3.eth.net.getId().then(x=>{
                if (x != this.routerContract.chainId){
                    alert('Change metamask wallet chain and repeat');
                } else {
                    this.routerContract.address = '0xf55c496bb1058690DB1401c4b9C19F3f44374961';


                    var that = this;
                    var defaultAccount;
                        window.ethereum.enable().then(function(){
                            web3.eth.getAccounts(function(err, result){
                                if (err){
                                    alert(err);
                                } else {
                                    that.defaultAccount = result[0];
                                    var contractTokenA = new web3.eth.Contract(that.tokenA.abi, that.tokenA.address.toString().toLowerCase());
                                    var contractRouter = new web3.eth.Contract(that.routerContract.abi, that.routerContract.address);
                    
                                    //approve(spender, amount) 100000000000000000000 == 100 tokensA
                                    //contractTokenA.methods.approve(that.routerContract.address, 100000000000000000000).call().then(function(result){
                                    //if (result){ //  token, amountTokenDesired, amountTokenMi, amountEthMin, to, deadline
                                        contractRouter.methods.addLiquidityETH(that.tokenA.address, '100000000000000000000', '100000000000000000000', '1000000000000000', defaultAccount, '1620395772').send({
                                            from: defaultAccount,
                                            value: 1000000000000000
                                        });
                                    //}
                                    //});
                                }
                            })
                        })
                    

                    var contract = new web3.eth.Contract(this.routerContract.abi, this.routerContract.address);
                    //contract.methods.addLiquidityETH(this.tokenA,)
                }
            })
        } else {
        alert('No web3? You should consider trying MetaMask!');
        }
    },
    approveContract: function(pool){
      
      if (pool == 'A'){
        var tokenContract = new web3.eth.Contract(this.tokenA.abi, this.tokenA.address.toString().toLowerCase());
        var approveButton = function(){that.approvePoolA = true};
      } else {
        //var tokenContract = new web3.eth.Contract(this.tokenB.abi, this.tokenA.address.toString().toLowerCase());
      }
      
      var that = this;

      window.ethereum.enable().then(function(){
        web3.eth.getAccounts(function(err, result){
          if (!err){
              that.defaultAccount = result[0];
              //alert(that.routerContract.address);
              tokenContract.methods.approve('0xf55c496bb1058690DB1401c4b9C19F3f44374961', '100000000000000000000').send({
                from: that.defaultAccount
            });
            approveButton();
          }
        })
      })
    },
    estimatedOutputValue: function(pool){
      //var contractRouter = new web3.eth.Contract(this.routerContract.abi, this.routerContract.address);

      if (pool == this.tokens[0]) //tokenA
      alert(value);
      //contractRouter.methods.getAmountsIn()

    }
    },
    
  };
</script>
<style>
</style>
