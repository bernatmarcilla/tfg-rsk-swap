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
          <button @click="approveContract()">1. Approve Swap</button><button>2. Swap</button>

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
          <button @click="approveContract()">1. Approve Swap</button><button>2. Swap</button>

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

  const Web3 = require("web3");

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
        inputValue:null,
        outputValue:null,
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
    
    methods: {
     approveContract: function(){
       console.log('APROVE FUNCTION');

        if (typeof web3 !== 'undefined') {
        web3 = new Web3(window.ethereum);
    } else {
        console.log('No web3? You should consider trying MetaMask!');
        web3 = new Web3(new window.ethereum.HttpProvider('http://localhost:8080'));
    }
     },

    },
    
  };
</script>
<style>
</style>
