<template>
    <div class="row">
    <card type="chart">
          <template slot="header">
            <h3 class="card-title"><i class="tim-icons icon-coins"></i> TokenA Liquidity Pool</h3>
          </template>
          <input id="inputValue"></input>
          
          <select name="tokens" id="inputToken">
            <option v-for="token in tokens">{{token}}</option>
          </select>
          
          <div class="col-md-5 pr-md-1">
            
          </div>
          <input id="outputValue"></input>
          <select name="tokens" id="outputToken">
            <option v-for="token in tokens">{{token}}</option>
          </select>
          <br>
          <button @click="approveContract('A')" :disabled="approvePoolA">1. Approve Swap</button>
          <button @click="addLiquidity()" :disabled="!approvePoolA">2. Swap</button>

    </card>
        <card type="chart">
          <template slot="header">
            <h3 class="card-title"><i class="tim-icons icon-coins"></i> TokenB Liquidity Pool</h3>
          </template>
          <input id="inputValue"></input>
          
          <select name="tokens" id="inputToken">
            <option v-for="token in tokens">{{token}}</option>
          </select>
          
          <div class="col-md-5 pr-md-1">
            
          </div>
          <input id="outputValue"></input>
          <select name="tokens" id="outputToken">
            <option v-for="token in tokens">{{token}}</option>
          </select>
          <br>
          <button @click="approveContract('B')" :disabled="approvePoolB">1. Approve Swap</button>
          <button @click="addLiquidity()" :disabled="!approvePoolB">2. Swap</button>

    </card>
    </div>
</template>
<script>
  import LineChart from '@/components/Charts/LineChart';
  import BarChart from '@/components/Charts/BarChart';
  import * as chartConfigs from '@/components/Charts/config';
  import TaskList from './Dashboard/TaskList';
  import UserTable from './Dashboard/UserTable';
  import config from '@/config';
  import contractsInfo from './../plugins/contractsInfo.js'

  const Web3 = require("web3");
  web3 = new Web3(window.ethereum);

  export default {
    components: {
      LineChart,
      BarChart,
      TaskList,
      UserTable
    },
    watch: {
      inputValue: function(){
        console.log(this.inputToken);
        if (this.inputToken == this.tokens[0] && this.outputToken == this.tokens[1]){ //tokenA to tokenB
          this.outputValue=2*this.inputValue;
        } else if (this.inputToken == this.tokens[1] && this.outputToken == this.tokens[0]){ //tokenB to tokenA
          this.outputValue = 0.5*this.inputValue;
        }
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
      }
    },
    created: function(){
      this.tokenAContractDeployed = new web3.eth.Contract(this.tokenA.abi, this.tokenA.address.toString().toLowerCase());
      this.routerContractDeployed = new web3.eth.Contract(this.routerContract.abi, this.routerContract.address.toString().toLowerCase());

      this.routerContract.address = '0xf55c496bb1058690DB1401c4b9C19F3f44374961';
    },
    methods: {
     addLiquidity: function(){
        console.log('APROVE FUNCTION');

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
    },
    
  };
</script>
<style>
</style>
