import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TradingViewChart from './components/TradingViewChart/TradingViewChart';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #121212;
  color: #FFFFFF;
  font-family: 'Inter', sans-serif;
`;

const Header = styled.div`
  padding: 20px;
  text-align: center;
  background: linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%);
`;

const Balance = styled.div`
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 4px;
`;

const Disclaimer = styled.div`
  font-size: 12px;
  color: #B3B3B3;
`;

const AssetSelector = styled.div`
  display: flex;
  overflow-x: auto;
  padding: 15px;
  background: rgba(255,255,255,0.02);
  gap: 15px;
`;

const Asset = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  opacity: ${props => props.active ? 1 : 0.7};
`;

const AssetIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  color: ${props => props.textColor || 'white'};
  font-weight: 600;
  font-size: ${props => props.fontSize || '16px'};
  position: relative;
  overflow: hidden;
`;

const IconImage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
`;

const AssetName = styled.div`
  font-size: 12px;
  color: #B3B3B3;
  margin-bottom: 4px;
  white-space: nowrap;
`;

const AssetPrice = styled.div`
  font-size: 14px;
  color: #FFFFFF;
  margin-bottom: 2px;
`;

const AssetChange = styled.div`
  font-size: 12px;
  color: ${props => props.positive ? '#00C853' : '#FF3D57'};
`;

const ChartContainer = styled.div`
  flex: 1;
  background: #121212;
  padding: 20px;
  position: relative;
  min-height: 400px;
`;

const TimeIntervals = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  padding: 15px;
`;

const IntervalButton = styled.button`
  background: ${props => props.active ? 'rgba(255,255,255,0.1)' : 'transparent'};
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 20px;
  color: #FFFFFF;
  padding: 8px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background: rgba(255,255,255,0.05);
  }
`;

const TradingControls = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  padding: 15px;
`;

const TradeButton = styled.button`
  padding: 15px;
  border-radius: 8px;
  border: none;
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${props => props.type === 'buy' 
    ? 'linear-gradient(135deg, #00C853 0%, #009624 100%)'
    : 'linear-gradient(135deg, #FF3D57 0%, #D50000 100%)'};

  &:hover {
    opacity: 0.9;
  }
`;

const ButtonPrice = styled.div`
  font-size: 12px;
  opacity: 0.8;
  margin-top: 4px;
`;

const Navigation = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: 15px;
  background: rgba(255,255,255,0.02);
  border-top: 1px solid rgba(255,255,255,0.05);
`;

const NavButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.active ? '#FFFFFF' : '#B3B3B3'};
  font-size: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
`;

function TradingSimulator() {
  const [activeAsset, setActiveAsset] = useState('BTC/USD');
  const [activeInterval, setActiveInterval] = useState('1MIN');
  const [activeTab, setActiveTab] = useState('chart');
  const [chartData, setChartData] = useState([]);

  const assets = [
    { 
      id: 'GOLD', 
      name: 'Gold', 
      displayName: 'Gold',
      price: '2024.50', 
      change: '+1.2', 
      color: '#FFD700',
      icon: '🪙',
      symbol: 'XAU/USD'
    },
    { 
      id: 'BTC/USD', 
      name: 'Bitcoin', 
      displayName: 'BTC/USD',
      price: '52,145', 
      change: '+0.8', 
      color: '#F7931A',
      icon: '₿',
      fontSize: '28px'
    },
    { 
      id: 'AAPL', 
      name: 'Apple', 
      displayName: 'Apple',
      price: '180.25', 
      change: '+2.1', 
      color: '#000000',
      icon: '🍎'
    },
    { 
      id: 'OIL', 
      name: 'Oil', 
      displayName: 'Oil',
      price: '78.35', 
      change: '-0.5', 
      color: '#4A4A4A',
      icon: '🛢️',
      symbol: 'CL/USD'
    },
    { 
      id: 'EUR/USD', 
      name: 'EUR/USD', 
      displayName: 'EUR/USD',
      price: '1.0845', 
      change: '-0.3', 
      color: '#0052B4',
      icon: '€',
      fontSize: '28px'
    },
    { 
      id: 'NATGAS', 
      name: 'Natural Gas', 
      displayName: 'Natural Gas',
      price: '1.642', 
      change: '+1.5', 
      color: '#60A5FA',
      icon: '🔥',
      symbol: 'NG/USD'
    }
  ];

  const intervals = ['1MIN', '5MIN', '10MIN', '30MIN', '1H', '1D', '1W', '1M'];

  useEffect(() => {
    setChartData([]); 
  }, [activeAsset, activeInterval]);

  const getDisplayPrice = (price) => {
    return price.includes('.') ? price : `${price}.00`;
  };

  return (
    <Container>
      <Header>
        <Balance>$ -9,236.34</Balance>
        <Disclaimer>This is not real money</Disclaimer>
      </Header>

      <AssetSelector>
        {assets.map(asset => (
          <Asset 
            key={asset.id}
            active={activeAsset === asset.id}
            onClick={() => setActiveAsset(asset.id)}
          >
            <AssetIcon 
              color={asset.color}
              textColor={asset.color === '#000000' ? 'white' : undefined}
              fontSize={asset.fontSize}
            >
              <IconImage>{asset.icon}</IconImage>
            </AssetIcon>
            <AssetName>{asset.displayName}</AssetName>
            <AssetPrice>${getDisplayPrice(asset.price)}</AssetPrice>
            <AssetChange positive={asset.change.startsWith('+')}>
              {asset.change}%
            </AssetChange>
          </Asset>
        ))}
      </AssetSelector>

      <ChartContainer>
        <TradingViewChart 
          data={chartData} 
          containerHeight={400}
          symbol={assets.find(a => a.id === activeAsset)?.symbol || activeAsset}
        />
      </ChartContainer>

      <TimeIntervals>
        {intervals.map(interval => (
          <IntervalButton
            key={interval}
            active={activeInterval === interval}
            onClick={() => setActiveInterval(interval)}
          >
            {interval}
          </IntervalButton>
        ))}
      </TimeIntervals>

      <TradingControls>
        <TradeButton type="sell">
          SELL
          <ButtonPrice>$9,566</ButtonPrice>
        </TradeButton>
        <TradeButton type="buy">
          BUY
          <ButtonPrice>$9,568</ButtonPrice>
        </TradeButton>
      </TradingControls>

      <Navigation>
        <NavButton 
          active={activeTab === 'home'}
          onClick={() => setActiveTab('home')}
        >
          ⌂
          <span>Home</span>
        </NavButton>
        <NavButton 
          active={activeTab === 'chart'}
          onClick={() => setActiveTab('chart')}
        >
          📈
          <span>Chart</span>
        </NavButton>
        <NavButton 
          active={activeTab === 'settings'}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️
          <span>Settings</span>
        </NavButton>
      </Navigation>
    </Container>
  );
}

export default TradingSimulator;
