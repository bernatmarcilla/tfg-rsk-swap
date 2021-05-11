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
            <h5 class="card-category">{{$t('dashboard.dailySales')}}</h5>
            <h3 class="card-title"><i class="tim-icons icon-delivery-fast text-info "></i> 3,500€</h3>
          </template>
          <div class="chart-area">
            <bar-chart style="height: 100%"
                       chart-id="blue-bar-chart"
                       :chart-data="blueBarChart.chartData"
                       :gradient-stops="blueBarChart.gradientStops"
                       :extra-options="blueBarChart.extraOptions">
            </bar-chart>
          </div>
        </card>
        <card type="chart">
          <template slot="header">
            <h3 class="card-title"><i class="tim-icons icon-coins"></i> Swap ERC20 Tokens</h3>
          </template>
          <input v-model="inputValue" id="inputValue"></input>
          
          <select name="tokens" v-model="inputToken" id="inputToken">
            <option v-for="token in tokens">{{token}}</option>
          </select>
          
          <div class="col-md-5 pr-md-1">
            
          </div>
          <input @change="updateConversionValue()" v-model="outputValue" id="outputValue"></input>
          <select name="tokens" v-model="outputToken" id="outputToken">
            <option v-for="token in tokens">{{token}}</option>
          </select>
          <br>
          <br>
          <h5> 0 tokenA per tokenB </h5>

          <button @click="approveContract()" :disabled="approveSwap">1. Approve Swap</button>
          <button @click="swapTokens()" :disabled="!approveSwap">2. Swap</button>

        </card>
      </div>
      
      </div>
    </div>
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
      /*
      inputValue: function(){
        console.log(this.inputToken);
        if (this.inputToken == this.tokens[0] && this.outputToken == this.tokens[1]){ //tokenA to tokenB
          this.outputValue=2*this.inputValue;
        } else if (this.inputToken == this.tokens[1] && this.outputToken == this.tokens[0]){ //tokenB to tokenA
          this.outputValue = 0.5*this.inputValue;
        }
      }
      */
    },
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
        blueBarChart: {
          extraOptions: chartConfigs.barChartOptions,
          chartData: {
            labels: ['USA', 'GER', 'AUS', 'UK', 'RO', 'BR'],
            datasets: [{
              label: "Countries",
              fill: true,
              borderColor: config.colors.info,
              borderWidth: 2,
              borderDash: [],
              borderDashOffset: 0.0,
              data: [53, 20, 10, 80, 100, 45],
            }]
          },
          gradientColors: config.colors.primaryGradient,
          gradientStops: [1, 0.4, 0],
        }
      }
    },
    watch: {
      inputValue: function(){
        //alert(this.inputToken, );
        var contractRouter = new web3.eth.Contract(contractsInfo.routerContract.abi, contractsInfo.routerContract.address);
        var path = [];
        if (this.inputToken == this.tokens[0] && this.outputToken == this.tokens[1]){ //tokenA --> tokenB
          var inputTokenContract = new web3.eth.Contract(contractsInfo.tokenAContract.abi, contractsInfo.tokenAContract.address.toString().toLowerCase());
          var outputTokenContract = new web3.eth.Contract(contractsInfo.tokenBContract.abi, contractsInfo.tokenBContract.address.toString().toLowerCase());
          path = [contractsInfo.tokenAContract.address.toString().toLowerCase(), contractsInfo.tokenBContract.address.toString().toLowerCase()]
        
          let stringValue = String(this.inputValue.toString()+'000000000000000000'); 
        
          var that = this;
          contractRouter.methods.getAmountsIn(stringValue, path).call(function(err, result){
            that.outputValue = result[0]/(10**18);
            //TODO revisar aquesta conversio de divisio
          })
        }
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
              var fullValue = that.inputValue * 10^18;

              if (that.inputToken == that.tokens[0]){ //A
                var inputContract = new web3.eth.Contract(contractsInfo.tokenAContract.abi, contractsInfo.tokenAContract.address);
                inputContract.methods.approve(contractsInfo.routerContract.address, fullValue).send({from: that.defaultAccount});
              } else {
                var inputContract = new web3.eth.Contract(contractsInfo.tokenBContract.abi, contractsInfo.tokenBContract.address);
                inputContract.methods.approve(contractsInfo.routerContract.address, fullValue).send({from: that.defaultAccount});
              }
            approveButton();
          }
        })
      })
      },
      swapTokens: function(){
        console.log(this.inputValue, this.inputToken, this.outputValue, this.outputToken);
        var path = []

        var contractRouter = new web3.eth.Contract(contractsInfo.routerContract.abi, contractsInfo.routerContract.address);

        if (this.inputToken == this.tokens[0] && this.outputValue == this.tokens[1]){ //tokenA --> tokenB
          var inputTokenContract = new web3.eth.Contract(contractsInfo.tokenAContract.abi, contractsInfo.tokenAContract.address.toString().toLowerCase());
          var outputTokenContract = new web3.eth.Contract(contractsInfo.tokenBContract.abi, contractsInfo.tokenBContract.address.toString().toLowerCase());
          path = [contractsInfo.tokenAContract.address.toString().toLowerCase(), contractsInfo.tokenBContract.address.toString().toLowerCase()]
        
          let stringValue = String(this.inputValue.toString()+'000000000000000000'); 
        
          var that = this;
          contractRouter.methods.getAmountsIn(stringValue, path).call(function(err, result){
            that.outputValue = result[0]/(10**18);
            //TODO revisar aquesta conversio de divisio
          })
        
        } else { //tokenB --> tokenA
          var inputTokenContract = new web3.eth.Contract(contractsInfo.tokenBContract.abi, contractsInfo.tokenBContract.address.toString().toLowerCase());
          var outputTokenContract = new web3.eth.Contract(contractsInfo.tokenAContract.abi, contractsInfo.tokenAContract.address.toString().toLowerCase());
          path = [contractsInfo.tokenBContract.address.toString().toLowerCase(), contractsInfo.tokenAContract.address.toString().toLowerCase()]
        }
    
        /*
        contractRouter.methods.swapExactTokensForTokens(this.inputValue, 0, path, this.defaultAccount, "0xFFFFFFFFFFFFFFFFFFF").send({
              from: this.defaultAccount,
        });
        */
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
