import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';
import styled from 'styled-components';

const ChartContainer = styled.div`
  width: 100%;
  height: 100%;
`;

function TradingViewChart({ data, containerHeight, symbol = 'BTC/USD' }) {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create the chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#121212' },
        textColor: '#d1d4dc',
      },
      grid: {
        vertLines: { color: 'rgba(42, 46, 57, 0.5)' },
        horzLines: { color: 'rgba(42, 46, 57, 0.5)' },
      },
      rightPriceScale: {
        borderColor: 'rgba(197, 203, 206, 0.5)',
      },
      timeScale: {
        borderColor: 'rgba(197, 203, 206, 0.5)',
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        mode: 0,
      },
      width: chartContainerRef.current.clientWidth,
      height: containerHeight || 400,
    });

    // Create the main series (candlesticks)
    const mainSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    // Add the data
    if (data && data.length > 0) {
      mainSeries.setData(data);
    } else {
      // Generate sample data based on the symbol
      const sampleData = generateSampleData(symbol);
      mainSeries.setData(sampleData);
    }

    // Fit the chart content
    chart.timeScale().fitContent();

    // Handle resize
    const handleResize = () => {
      chart.applyOptions({
        width: chartContainerRef.current.clientWidth,
      });
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data, containerHeight, symbol]);

  return <ChartContainer ref={chartContainerRef} />;
}

// Helper function to generate sample data based on symbol
function generateSampleData(symbol) {
  const currentDate = new Date();
  const data = [];
  
  // Define base prices and volatility for different symbols
  const symbolConfig = {
    'BTC/USD': { base: 52000, volatility: 1000 },
    'GOLD': { base: 2024, volatility: 10 },
    'AAPL': { base: 180, volatility: 2 },
    'OIL': { base: 78, volatility: 1 },
    'EUR/USD': { base: 1.0845, volatility: 0.002 },
    'NATGAS': { base: 1.642, volatility: 0.05 },
    'XAU/USD': { base: 2024, volatility: 10 },
    'CL/USD': { base: 78, volatility: 1 },
    'NG/USD': { base: 1.642, volatility: 0.05 }
  };

  const config = symbolConfig[symbol] || { base: 100, volatility: 2 };
  let basePrice = config.base;

  for (let i = 0; i < 100; i++) {
    const time = new Date(currentDate);
    time.setMinutes(time.getMinutes() - i);

    const volatility = config.volatility;
    const open = basePrice + (Math.random() - 0.5) * volatility;
    const high = open + Math.random() * volatility;
    const low = open - Math.random() * volatility;
    const close = (high + low) / 2;

    basePrice = close;

    data.unshift({
      time: time.getTime() / 1000,
      open,
      high,
      low,
      close,
    });
  }

  return data;
}

export default TradingViewChart;
