import PropTypes from 'prop-types';
import ReactEcharts from 'echarts-for-react';
import React, { useState, useEffect, useCallback } from 'react';

const XBarChart = ({ isLoad, dataValue, lslValue, uslValue, point, controlData }) => {
  // Sample data
  console.log('controlData...', controlData);
  const [data, setData] = useState([]);
  const filterData = useCallback(() => {
    const filterOfPoint = dataValue.filter((val) => parseInt(val.POINT_NO, 10) === point);
    setData(filterOfPoint.reverse());
  }, [dataValue, point]);

  const usl = Array(30).fill(uslValue);
  const lsl = Array(30).fill(lslValue);
  const ucl = Array(30).fill(controlData[point - 1]?.UCL);
  const lcl = Array(30).fill(controlData[point - 1]?.LCL);
  const isUcl = controlData[point - 1]?.UCL;
  const isLcl = controlData[point - 1]?.LCL;
  const center = Array(30).fill(parseFloat((parseFloat(isUcl) + parseFloat(isLcl)) / 2));
  console.log('center', center);
  const dataXBar = data?.map((val) => parseFloat(val.XBAR));
  const maxValue = Math.max(...dataXBar);

  const formatterString = (params) => {
  if (!params.length) return '';

  const dataIndex = params[0]?.dataIndex;
  const inspector = dataValue[dataIndex]?.INSPECTOR || 'Unknown';
  
  let tooltipContent = `<b>${params[0].name}</b><br/>`;
  tooltipContent += `<i>Inspector: <b>${inspector}</b></i><br/> <hr/>`;

  params.forEach((item) => {
    const val = parseFloat(item.value)?.toFixed(2);
    tooltipContent += `${item.seriesName.toUpperCase()}: ${val} mm<br/>`;
  });

  return tooltipContent;
};

  // Create option object for ECharts
  const option = {
    textStyle: {
      fontFamily: 'Prompt, sans-serif',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross', // Display crosshair pointer
      },
      formatter: formatterString,
    },
    toolbox: {
      show: false,
      feature: {
        dataZoom: {
          yAxisIndex: 'none',
        },
        dataView: { readOnly: false },
        magicType: { type: ['line', 'bar'] },
        restore: {},
        saveAsImage: {},
      },
    },
    legend: {
      data: ['x bar', 'usl', 'lsl', 'ucl', 'lcl', 'center'],
      show: false,
    },
    xAxis: {
      type: 'category',
      show: true,
      data: data?.map((val) => val.DATE),
      axisLabel: {
        formatter: (value) => value,
      },
    },
    yAxis: {
      type: 'value',
      min: lsl[0],
      max: maxValue > usl[0] ? maxValue : usl[0],
    },
    series: [
      {
        name: 'x bar',
        type: 'line',
        data: dataXBar,
        symbol: 'path://M7,0L0,7L7,14L14,7L7,0Z',
        symbolSize: 11,
        label: {
          show: true,
          position: 'top',
          formatter: (params) =>
            params.value > ucl[0] || params.value < lcl[0] ? `{red|${params.value}}` : '',
          rich: {
            red: {
              color: 'red',
            },
          },
        },
        lineStyle: {
          normal: {
            width: 2,
            color: '#0349fc',
          },
        },
        color: '#0349fc',
      },
      {
        name: 'usl',
        type: 'line',
        data: usl,
        symbol: 'none',
        lineStyle: {
          normal: {
            width: 2,
            color: 'red',
          },
        },
        showSymbol: false,
      },
      {
        name: 'lsl',
        type: 'line',
        data: lsl,
        symbol: 'none',
        lineStyle: {
          normal: {
            width: 2,
            color: 'red',
          },
        },
      },
      {
        name: 'ucl',
        type: 'line',
        data: ucl,
        symbol: 'none',
        lineStyle: {
          normal: {
            width: 2,
            color: '#ffd903',
          },
        },
      },
      {
        name: 'lcl',
        type: 'line',
        data: lcl,
        symbol: 'none',
        lineStyle: {
          normal: {
            width: 2,
            color: '#ffd903',
          },
        },
      },
      {
        name: 'CL',
        type: 'line',
        data: center,
        symbol: 'none',
        lineStyle: {
          normal: {
            width: 2,
            color: 'green',
          },
        },
      },
    ],
  };
  console.log(usl);
  useEffect(() => {
    filterData();
  }, [filterData, dataValue]);
  return (
    <div>
      <hr />

      <div className="px-[4rem] mt-[1rem]">
        <div className="flex gap-x-2">
          <div className="flex gap-x-2 items-center ">
            <div className="h-[0.2rem] w-[2rem] bg-[red] rounded-lg" />
            <p className="text-[13px]">USL , LSL</p>
          </div>
          <div className="flex gap-x-[1rem] items-center ">
            <div className="h-[0.2rem] w-[2rem] bg-[#ffd903] rounded-lg" />
            <p className="text-[13px]">UCL , LCL</p>
          </div>
          <div className="flex gap-x-2 items-center ">
            <div className="h-[0.2rem] w-[2rem] bg-[#0349fc] rounded-lg relative">
              <svg
                className="absolute right-[32%] -top-[140%]"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M7 0L0 7L7 14L14 7L7 0Z" fill="#0349fc" />
              </svg>
            </div>
            <p className="text-[13px]">X Bar</p>
          </div>
        </div>
      </div>
      <ReactEcharts option={option} style={{ width: '100%', height: '400px' }} />
    </div>
  );
};

export default XBarChart;
XBarChart.propTypes = {
  isLoad: PropTypes.bool,
  dataValue: PropTypes.array,
  lslValue: PropTypes.any,
  uslValue: PropTypes.any,
  controlData: PropTypes.array,
  point: PropTypes.number,
};
