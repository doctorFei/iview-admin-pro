<template>
  <svg
    :width="width" :height="height"
    class="svg-wrap"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g class="bar-g" :transform="`translate(${margin.left},${margin.top})`">
      <template v-for="tickValue in xScale.ticks()">
        <g class="xAxis tick" :key="tickValue" :transform="`translate(${xScale(tickValue)},0)`">
          <line :y2="innerHeight"/>
          <text style="textAnchor: middle" dy="" :y="innerHeight + 3">
            {{xAxisTickFormat(tickValue)}}
          </text>
        </g>
      </template>
      <template v-for="tickValue in yScale.domain()">
        <g class="yAxis tick">
          <text
            :key="tickValue"
            style="textAnchor:end"
            :x="-3"
            dy="0.32em"
            :y="yScale(tickValue) + yScale.bandwidth() / 2"
          >
            {{tickValue}}
          </text>
        </g>
      </template>
      <rect
        v-for="d in chartData"
        className="mark"
        :key="yValue(d)"
        :x="0"
        :y="yScale(yValue(d))"
        :width="xScale(xValue(d))"
        :height="yScale.bandwidth()"
      >
        <title>{{xAxisTickFormat(xValue(d))}}</title>
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
            left: 220
          }
        }
      },
      width: {
        type: Number,
        default: 960
      },
      height: {
        type: Number,
        default: 500
      }
    },
    data () {
      const chartData = [
        {
          'country': 'China',
          'population': 1415046000
        }, {
          'country': 'India',
          'population': 1354052000
        }, {
          'country': 'United States',
          'population': 326767000
        }, {
          'country': 'Indonesia',
          'population': 266795000
        }, {
          'country': 'Brazil',
          'population': 210868000
        }, {
          'country': 'Pakistan',
          'population': 200814000
        }, {
          'country': 'Nigeria',
          'population': 195875000
        }, {
          'country': 'Bangladesh',
          'population': 166368000
        }, {
          'country': 'Russia',
          'population': 143965000
        }, {
          'country': 'Mexico',
          'population': 130759000
        }
      ]
      const innerHeight = this.height - this.margin.top - this.margin.bottom
      const innerWidth = this.width - this.margin.left - this.margin.right

      const xScale = scaleLinear()
        .domain([0, max(chartData, d => d.population)])
        .range([0, innerWidth])

      const yScale = scaleBand()
        .domain(chartData.map(d => d.country))
        .range([0, innerHeight])
        .paddingInner(0.15)

      const siFormat = format('.2s')
      const xAxisTickFormat = tickValue => siFormat(tickValue).replace('G', 'B')

      return {
        xScale: xScale,
        yScale: yScale,
        innerHeight: innerHeight,
        innerWidth: innerWidth,
        xAxisTickFormat: xAxisTickFormat,
        xValue: d => d['population'],
        yValue: d => d.country,
        chartData: [{
          'country': 'China',
          'population': 1415046000
        }, {
          'country': 'India',
          'population': 1354052000
        }, {
          'country': 'United States',
          'population': 326767000
        }, {
          'country': 'Indonesia',
          'population': 266795000
        }, {
          'country': 'Brazil',
          'population': 210868000
        }, {
          'country': 'Pakistan',
          'population': 200814000
        }, {
          'country': 'Nigeria',
          'population': 195875000
        }, {
          'country': 'Bangladesh',
          'population': 166368000
        }, {
          'country': 'Russia',
          'population': 143965000
        }, {
          'country': 'Mexico',
          'population': 130759000
        }]
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
