import PropTypes from 'prop-types';
import ReactEcharts from 'echarts-for-react';
import React, { useState, useEffect, useCallback } from 'react';

const RBarChart = ({ dataValue, uslValue, point, controlData }) => {
  // Sample data

  const [data, setData] = useState([]);
  const filterData = useCallback(() => {
    const filterOfPoint = dataValue.filter((val) => parseInt(val.POINT_NO, 10) === point);
    setData(filterOfPoint.reverse());
  }, [dataValue, point]);

  const usl = Array(30).fill(uslValue);
  const ucl = Array(30).fill(controlData[point - 1]?.R_UCL);
  const lcl = Array(30).fill(controlData[point - 1]?.R_LCL);
  const isUcl = controlData[point - 1]?.R_UCL;
  const isLcl = controlData[point - 1]?.R_LCL;
  const center = Array(30).fill(parseFloat((parseFloat(isUcl) + parseFloat(isLcl)) / 2));

  const dataRBar = data?.map((val) => parseFloat(val.RBAR));
  const maxValue = Math.max(...dataRBar);

  // Custom Tooltip 
  const formatterString = (params) => {
    if (!params.length) return '';

    const dataIndex = params[0]?.dataIndex;
    const inspector = dataValue[dataIndex]?.INSPECTOR || 'Unknown';

    let tooltipContent = `<b>${params[0].name}</b><br/>`;
     tooltipContent += `<i>Inspector: <b>${inspector}</b></i><br/> <hr/>`;

    params.forEach((item) => {
      tooltipContent += `${item.seriesName.toUpperCase()} : ${parseFloat(item.value)?.toFixed(
        2
      )} mm<br/>`;
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
      data: ['x bar', 'ucl', 'lcl', 'center'],
      show: false,
    },
    xAxis: {
      type: 'category',
      show: true,
      data: data?.map((val) => val.DATE),
      axisLabel: {
        formatter: (value, index) => value,
      },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: maxValue > ucl[0] ? maxValue : ucl[0],
      // axisLabel: {
      //   formatter: (value) => (value === limitValueLine2 ? `${value}  (MAX)` : value),
      // },
    },
    series: [
      {
        name: 'x bar',
        type: 'line',
        data: dataRBar,
        symbol: 'path://M7,0L0,7L7,14L14,7L7,0Z',
        symbolSize: 12,
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
            color: '#7030A0',
          },
        },
        color: '#7030A0',
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
        name: 'center',
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
            <div className="h-[0.2rem] w-[2rem] bg-[#7030A0] rounded-lg relative">
              <svg
                className="absolute right-[32%] -top-[120%]"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M7 0L0 7L7 14L14 7L7 0Z" fill="#7030A0" />
              </svg>
            </div>
            <p className="text-[13px]">X Bar</p>
          </div>
        </div>
      </div>
      <ReactEcharts
        option={option}
        // notMerge={true}
        // lazyUpdate={true}
        style={{ width: '100%', height: '400px' }}
      />
    </div>
  );
};

export default RBarChart;


RBarChart.propTypes = {
  dataValue: PropTypes.array,
  uslValue: PropTypes.any,
  controlData: PropTypes.array,
  point: PropTypes.number,
};
