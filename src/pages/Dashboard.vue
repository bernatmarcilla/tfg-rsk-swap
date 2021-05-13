<template>
  <div>

    <div class="row">
      <div class="col-12">
      </div>
    </div>
    <div class="row">
      <div class="col-lg-4" >
        <card type="chart">
          <template slot="header">
            <h3 style="display: table;
                        margin: 0 auto;" 
                class="card-title"><i class="tim-icons icon-coins"></i> Swap ERC20 Tokens</h3>
          </template>
          <br>
          <base-input
                  v-model="inputValue"
                  placeholder="Input Token">
          </base-input>
          <select name="tokens" v-model="inputToken" id="inputToken">
            <option v-for="token in tokens">{{token}}</option>
          </select>
          
          <h1 style="display: flex;
              font-size:20px;
              margin-top:15px;
              display: table;
              margin: 0 auto;" 
              class="swap-arroy tim-icons icon-minimal-down"></h1>

          <base-input style="margin-top:35px;" v-model="outputValue"
                  placeholder="Output Token">
          </base-input>
          <select name="tokens" v-model="outputToken" id="inputToken">
            <option v-for="token in tokens">{{token}}</option>
          </select>

          <br>
          <br>

          <div>
            <h5><i style="color:#2dce89" v-if="this.conversionValue" class="tim-icons icon-alert-circle-exc"></i> <b v-if="this.conversionValue">Actual Price: </b> <span class="text-success"> {{this.conversionValue}}{{this.conversionTokens}}</span></h5>
          </div>

          <br>
          <div id="buttons" style="display: table;margin: 0 auto;">
            <base-button @click="approveContract()" type="primary" :disabled="approveSwap" fill> 1. Approve Swap </base-button>
            <base-button @click="swapTokens()" type="primary" :disabled="!approveSwap" fill> 2. Swap </base-button>
          </div>

        </card>
      </div>
      
      </div>
    </div>
  </div>
</template>
<script>
  import config from '@/config';
  import contractsInfo from './../plugins/contractsInfo.js'

  const Web3 = require("web3");
  web3 = new Web3(window.ethereum);

  export default {
    data() {
      return {
        tokens: [
          'tokenA', 'tokenB'
        ],
        inputValue:null,
        outputValue:null,
        inputToken:null,
        outputToken:null,
        approveSwap:false,
        defaultAccount:null,
        conversionValue:null,
        conversionTokens:null,
      }
    },
    watch: {
      inputValue: function(){
        //alert(this.inputToken, );
        var contractRouter = new web3.eth.Contract(contractsInfo.routerContract.abi, contractsInfo.routerContract.address);
        var path = [];
        if (this.inputValue == ''){
          this.outputValue = '';
        } else if (this.inputToken == this.tokens[0] && this.outputToken == this.tokens[1]){ //tokenA --> tokenB
          this.conversionTokens = ' tokenB per tokenA';
          path = [contractsInfo.tokenBContract.address.toString().toLowerCase(), contractsInfo.tokenAContract.address.toString().toLowerCase()]
        } else if (this.inputToken == this.tokens[1] && this.outputToken == this.tokens[0]){ // tokenB --> tokenA
          this.conversionTokens = ' tokenA per tokenB';
          path = [contractsInfo.tokenAContract.address.toString().toLowerCase(), contractsInfo.tokenBContract.address.toString().toLowerCase()]
        }
        let stringValue = String(this.inputValue.toString()+'000000000000000000'); 
        
        var that = this;
        contractRouter.methods.getAmountsIn(stringValue, path).call(function(err, result){
          that.outputValue = result[0]/(10**18);
          that.conversionValue = (result[0]/(10**18))/that.inputValue;
            //TODO revisar aquesta conversio de divisio
        })
      }
    },
    methods: {
      approveContract: function(){
      
      var that = this;
      var approveButton = function(){that.approveSwap = true};

      window.ethereum.enable().then(function(){
        web3.eth.getAccounts(function(err, result){
          if (!err){
              that.defaultAccount = result[0];

              let stringValue = String(that.inputValue.toString()+'000000000000000000'); 

              if (that.inputToken == that.tokens[0]){ //A
                var inputContract = new web3.eth.Contract(contractsInfo.tokenAContract.abi, contractsInfo.tokenAContract.address);
                inputContract.methods.approve(contractsInfo.routerContract.address, stringValue).send({from: that.defaultAccount});
              } else {
                var inputContract = new web3.eth.Contract(contractsInfo.tokenBContract.abi, contractsInfo.tokenBContract.address);
                inputContract.methods.approve(contractsInfo.routerContract.address, stringValue).send({from: that.defaultAccount});
              }
            approveButton();
          }
        })
      })
      },
      swapTokens: function(){
        //console.log(this.inputValue, this.inputToken, this.outputValue, this.outputToken);
        var path = []

        var contractRouter = new web3.eth.Contract(contractsInfo.routerContract.abi, contractsInfo.routerContract.address);
        let stringValue = String(this.inputValue.toString()+'000000000000000000'); 

        if (this.inputToken == this.tokens[0] && this.outputToken == this.tokens[1]){ //tokenA --> tokenB
          path = [contractsInfo.tokenAContract.address.toString().toLowerCase(), contractsInfo.tokenBContract.address.toString().toLowerCase()]
        } else { //tokenB --> tokenA
          path = [contractsInfo.tokenBContract.address.toString().toLowerCase(), contractsInfo.tokenAContract.address.toString().toLowerCase()]
        }
    
        var that = this;
        contractRouter.methods.swapExactTokensForTokens(stringValue, 0, path, that.defaultAccount, '0xFFFFFFFFFF').send({from: that.defaultAccount});
      }, 
      updateConversionValue: function(){
       var contractRouter = new web3.eth.Contract(contractsInfo.routerContract.abi, contractsInfo.routerContract.address);

        if (this.inputToken == this.tokens[0] && this.outputToken == this.tokens[1]){
            const TOKEN1_ADDRESS = contractsInfo.tokenAContract.address;
            const TOKEN2_ADDRESS = contractsInfo.tokenBContract.address;
            const path = [TOKEN1_ADDRESS, TOKEN2_ADDRESS];
        } else if (this.inputToken == this.tokens[1] && this.outputToken == this.tokens[0]) {
            const TOKEN1_ADDRESS = contractsInfo.tokenBContract.address;
            const TOKEN2_ADDRESS = contractsInfo.tokenAContract.address;
            const path = [TOKEN1_ADDRESS, TOKEN2_ADDRESS];
        } 

        //The amount I would like to receive, array of addresses used to exchange [wethAddress, tokenAddress]
        this.inputValue = contractRouter.methods.getAmountsIn(this.outputValue, path)


        /*
        const txn = await uniswapV2Contract.swapExactETHForTokens(
          0,
          path,
          user.address,
          expiryDate,
          {
              gasLimit: 1000000,
              gasPrice: ethers.utils.parseUnits("10", "gwei"),
              value: ethAmount
          }
        )
        const res = await txn.wait();
        */
     }
    },
    
  };
</script>
<style>
</style>
