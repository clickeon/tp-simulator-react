import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';
import styled from 'styled-components';

const ChartContainer = styled.div`
  height: 500px;
  width: 100%;
  margin: 20px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
`;

const TradingViewChart = ({ pastData, futureData, showFuture, onTPLineMove }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const candlestickSeriesRef = useRef(null);
  const tpLineRef = useRef(null);
  const timeLineRef = useRef(null);

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current || chartRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 500,
      layout: {
        background: { color: '#ffffff' },
        textColor: '#333',
      },
      grid: {
        vertLines: { color: '#f0f0f0' },
        horzLines: { color: '#f0f0f0' },
      },
      crosshair: {
        mode: 'normal',
      },
      rightPriceScale: {
        borderColor: '#ddd',
        autoScale: true,
      },
      timeScale: {
        borderColor: '#ddd',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    // Create candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350'
    });

    // Store refs
    chartRef.current = chart;
    candlestickSeriesRef.current = candlestickSeries;

    // Handle window resize
    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        candlestickSeriesRef.current = null;
        tpLineRef.current = null;
        timeLineRef.current = null;
      }
    };
  }, []);

  // Update data and lines
  useEffect(() => {
    if (!chartRef.current || !candlestickSeriesRef.current || !pastData?.length || !futureData?.length) {
      return;
    }

    try {
      // Update chart data
      const allData = showFuture ? [...pastData, ...futureData] : pastData;
      candlestickSeriesRef.current.setData(allData);

      // Remove existing lines
      if (timeLineRef.current) {
        candlestickSeriesRef.current.removePriceLine(timeLineRef.current);
      }
      if (tpLineRef.current) {
        candlestickSeriesRef.current.removePriceLine(tpLineRef.current);
      }

      // Add current time marker
      timeLineRef.current = candlestickSeriesRef.current.createPriceLine({
        price: pastData[pastData.length - 1].close,
        color: '#FF0000',
        lineWidth: 2,
        lineStyle: 0, // Solid
        axisLabelVisible: true,
        title: 'Current Time',
      });

      // Add TP line
      const maxPrice = Math.max(...allData.map(d => d.high));
      tpLineRef.current = candlestickSeriesRef.current.createPriceLine({
        price: maxPrice - 1,
        color: '#2196F3',
        lineWidth: 2,
        lineStyle: 2, // Dashed
        axisLabelVisible: true,
        title: 'Take Profit',
        draggable: true,
      });

      // Handle TP line drag
      if (onTPLineMove) {
        chartRef.current.subscribeCustomPriceLineDragged(tpLineRef.current, (price) => {
          onTPLineMove(price);
        });
      }

      // Fit content
      chartRef.current.timeScale().fitContent();
    } catch (error) {
      console.error('Error updating chart:', error);
    }
  }, [pastData, futureData, showFuture, onTPLineMove]);

  return <ChartContainer ref={chartContainerRef} />;
};

export default TradingViewChart;
