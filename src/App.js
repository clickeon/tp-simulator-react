import React, { useState } from 'react';
import styled from 'styled-components';
import LearningPath from './components/LearningPath';
import TradingSimulator from './TradingSimulator';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 20px;
`;

const OptionContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 40px;
`;

const OptionCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 30px;
  width: 300px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  }

  h2 {
    color: #2c3e50;
    margin-bottom: 15px;
  }

  p {
    color: #666;
    line-height: 1.6;
  }
`;

const BackButton = styled.button`
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
  padding: 10px 20px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
`;

function App() {
  const [selectedOption, setSelectedOption] = useState(null);

  const renderContent = () => {
    switch (selectedOption) {
      case 'learning':
        return (
          <Container>
            <BackButton onClick={() => setSelectedOption(null)}>← Back to Menu</BackButton>
            <LearningPath />
          </Container>
        );
      case 'trading':
        return (
          <>
            <BackButton onClick={() => setSelectedOption(null)}>← Back to Menu</BackButton>
            <TradingSimulator />
          </>
        );
      default:
        return (
          <Container>
            <Header>
              <Title>Trading Platform</Title>
            </Header>
            <OptionContainer>
              <OptionCard onClick={() => setSelectedOption('learning')}>
                <h2>Learning Path</h2>
                <p>Learn the fundamentals of trading through structured courses and interactive lessons.</p>
              </OptionCard>
              <OptionCard onClick={() => setSelectedOption('trading')}>
                <h2>Trading Simulator</h2>
                <p>Practice trading in a risk-free environment with our realistic trading simulator.</p>
              </OptionCard>
            </OptionContainer>
          </Container>
        );
    }
  };

  return renderContent();
}

export default App;
