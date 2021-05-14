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
          <br>

          <div>
            <h5><i style="color:#2dce89" v-if="this.conversionValueA" class="tim-icons icon-alert-circle-exc"></i> <span class="text-success"> <b v-if="this.conversionValueA">Actual Price: </b>{{this.conversionValueA}}{{this.conversionTokensA}}</span></h5>
          </div>
          <br>
          <div id="buttons" style="display: table;margin: 0 auto;">
            <base-button @click="approveContract('A')" type="primary" :disabled="approvePoolA" fill> 1. Approve Contract </base-button>
            <base-button @click="addLiquidity('A')" type="primary" :disabled="!approvePoolA" fill> 2. Add Liquidity </base-button>
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
          <br>

          <div>
            <h5><i style="color:#2dce89" v-if="this.conversionValueB" class="tim-icons icon-alert-circle-exc"></i> <span class="text-success"> <b v-if="this.conversionValueB" class="text-success">Actual Price: </b> {{this.conversionValueB}}{{this.conversionTokensB}}</span></h5>
          </div>
          <br>
        <div id="buttons" style="display: table;margin: 0 auto;">
          <base-button @click="approveContract('B')" type="primary" :disabled="approvePoolB" fill> 1. Approve Contract </base-button>
          <base-button @click="addLiquidity('B')" type="primary" :disabled="!approvePoolB" fill> 2. Add Liquidity </base-button>
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
        replaceValue:null,
        conversionValueB:null,
        conversionTokensA:null,
        conversionTokensB:null,
        conversionValueA:null
      }
    },
    methods: {
      calculateConversion: function(pool){
        console.log('calculateConversionFunction');
          var TOKEN2_ADDRESS;
          let stringValue;
          if (pool == this.tokens[0]) //tokenA
          {
            TOKEN2_ADDRESS = contractsInfo.tokenAContract.address;
            this.replaceValue = function(value){that.outputValueA = value; that.conversionValueA = value/that.inputValueA; that.conversionTokensA = ' RBTC per tokenA';};
            stringValue = String(this.inputValueA.toString()+'000000000000000000'); 
          } else { //tokenB
            TOKEN2_ADDRESS = contractsInfo.tokenBContract.address;
            this.replaceValue = function(value){that.outputValueB = value; that.conversionValueB = value/that.inputValueB; that.conversionTokensB = ' RBTC per tokenB';};
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
     addLiquidity: function(pool){
        var inputToken;
        var inputValue;
        var outputValue;

        var that = this;
        web3.eth.net.getId().then(x=>{
            if (x != that.routerContract.chainId){
                alert('Change metamask wallet chain and repeat');
            } else {
                if (pool == 'A'){
                  inputToken = contractsInfo.tokenAContract.address;
                  inputValue = String(that.inputValueA.toString()+'000000000000000000');
                  outputValue = String(that.outputValueA * (10**18));
                } else {
                  inputToken = contractsInfo.tokenBContract.address;
                  inputValue = String(that.inputValueB.toString()+'000000000000000000');
                  outputValue = String(that.outputValueB * (10**18));
                }
                var that2 = that;
                var defaultAccount;
                    window.ethereum.enable().then(function(){
                        web3.eth.getAccounts(function(err, result){
                            if (err){
                                alert(err);
                            } else {
                                var contractRouter = new web3.eth.Contract(contractsInfo.routerContract.abi, contractsInfo.routerContract.address.toString().toLowerCase());

                                console.log(inputToken, inputValue, outputValue, that2.defaultAccount);
                                contractRouter.methods.addLiquidityETH(inputToken, inputValue, 0, outputValue, that2.defaultAccount, '0xFFFFFFFFFF').send({
                                    from: that2.defaultAccount,
                                    value: outputValue,
                                    gasLimit: 3000000
                                }); //gasLimit = 3000000
                            }
                        })
                    })
                

                var contract = new web3.eth.Contract(this.routerContract.abi, this.routerContract.address);
                //contract.methods.addLiquidityETH(this.tokenA,)
            }
        })
    },
    approveContract: function(pool){
      
      var stringValue ='';

      if (pool == 'A'){
        var tokenContract = new web3.eth.Contract(contractsInfo.tokenAContract.abi, contractsInfo.tokenAContract.address.toString().toLowerCase());
        var approveButton = function(){that.approvePoolA = true};
        stringValue = String(this.inputValueA.toString()+'000000000000000000'); 
      } else {
        var tokenContract = new web3.eth.Contract(contractsInfo.tokenBContract.abi, contractsInfo.tokenBContract.address.toString().toLowerCase());
        var approveButton = function(){that.approvePoolB = true};
        stringValue = String(this.inputValueB.toString()+'000000000000000000'); 
      }
      
      var that = this;

      window.ethereum.enable().then(function(){
        web3.eth.getAccounts(function(err, result){
          if (!err){
              that.defaultAccount = result[0];
              //alert(that.routerContract.address);
              tokenContract.methods.approve(contractsInfo.routerContract.address.toString().toLowerCase(), stringValue).send({
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
