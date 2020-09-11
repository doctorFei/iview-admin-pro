<template>
  <svg
    :width="width" :height="height"
    class="svg-wrap"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g class="bar-g" :transform="`translate(${margin.left},${margin.top})`" v-if="chartData.length>0">
      <template v-for="tickValue in yScale.ticks()">
        <g class="yAxis tick" :key="tickValue" :transform="`translate(0,${yScale(tickValue)})`">
          <line :x2="innerWidth"/>
          <text style="textAnchor: end" dx="-30" dy="5">
            {{xAxisTickFormat(tickValue)}}
          </text>
        </g>
      </template>
      <text
        v-for="(tickValue,index) in xScale.domain()"
        :key="`text${index}${tickValue}`"
        style="textAnchor:middle"
        :y="innerHeight"
        dy="15"
        :x="xScale(tickValue) + xScale.bandwidth() / 2"
      >
        {{tickValue}}
      </text>
      <rect
        v-for="(d,index) in chartData"
        className="mark"
        :key="`rect${index}${xValue(d)}`"
        :x="xScale(xValue(d))"
        :width="xScale.bandwidth()"
        :y="yScale(yValue(d))"
        :height="innerHeight-yScale(yValue(d))"
      >
        <title>{{xAxisTickFormat(yValue(d))}}</title>
      </rect>
    </g>
  </svg>
</template>

<script>
  import {
    scaleLinear,
    max,
    scaleBand,
    format
  } from 'd3'
  // const xAxisLabelOffset = 50

  export default {
    name: 'Bar',
    props: {
      margin: {
        type: Object,
        default: () => {
          return {
            top: 20,
            right: 30,
            bottom: 65,
            left: 100
          }
        }
      },
      chartData: {
        type: Array,
        default: () => {
          return [{
            country: 'China',
            population: 1415046000
          }, {
            country: 'India',
            population: 1354052000
          }, {
            country: 'US',
            population: 326767000
          }, {
            country: 'Indonesia',
            population: 266795000
          }, {
            country: 'Brazil',
            population: 210868000
          }, {
            country: 'Pakistan',
            population: 200814000
          }, {
            country: 'Nigeria',
            population: 195875000
          }, {
            country: 'Bangladesh',
            population: 166368000
          }, {
            country: 'Russia',
            population: 143965000
          }, {
            country: 'Mexico',
            population: 130759000
          }]
        }
      },
      width: {
        type: Number,
        default: 960
      },
      height: {
        type: Number,
        default: 500
      },
      xKey: {
        type: String,
        default: 'country'
      },
      yKey: {
        type: String,
        default: 'population'
      }
    },
    created () {
      this.initData()
    },

    data () {
      return {
        xScale: null,
        yScale: null,
        innerHeight: null,
        innerWidth: null,
        xAxisTickFormat: null,
        xValue: d => d[this.xKey],
        yValue: d => d[this.yKey]
      }
    },
    methods: {
      initData () {
        this.innerHeight = this.height - this.margin.top - this.margin.bottom
        this.innerWidth = this.width - this.margin.left - this.margin.right

        this.xScale = scaleBand()
          .domain(this.chartData.map(d => d[this.xKey]))
          .range([0, this.innerWidth])
          .paddingInner(0.15)
          .paddingOuter(0.15)

        this.yScale = scaleLinear()
          .domain([0, max(this.chartData, d => d[this.yKey])])
          .range([this.innerHeight, 0])

        const siFormat = format('.2s')
        this.xAxisTickFormat = tickValue => siFormat(tickValue).replace('G', 'B')
      }
    },
    watch: {
      width () {
        this.initData()
      },
      height () {
        this.initData()
      }
    }
  }
</script>

<style scoped>

  rect {
    fill: steelblue
  }

  text {
    font-family: sans-serif;
  }

  .tick text {
    font-size: 14px;
    fill: #635F5D;
  }

  .tick line {
    stroke: #C0C0BB;
  }

  .axis-label {
    font-size: 2.5em;
    fill: #8E8883;
  }

  .title {
    font-size: 3.2em;
    fill: #635F5D;
  }
</style>
