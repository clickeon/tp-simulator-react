import React from 'react';
import styled from 'styled-components';

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  justify-content: center;
`;

const ChallengeButton = styled.button`
  padding: 10px 20px;
  background-color: ${props => props.active ? '#1976D2' : '#2196F3'};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 16px;

  &:hover {
    background-color: #1565C0;
  }
`;

const Description = styled.div`
  text-align: center;
  margin-bottom: 20px;
  color: #333;
  font-size: 16px;
  line-height: 1.5;

  strong {
    color: #1976D2;
  }
`;

const ChallengeSelector = ({ currentChallenge, onChallengeChange }) => {
  return (
    <>
      <ButtonGroup>
        <ChallengeButton
          active={currentChallenge === 1}
          onClick={() => onChallengeChange(1)}
        >
          Challenge 1: Set TP Based on Future Data
        </ChallengeButton>
        <ChallengeButton
          active={currentChallenge === 2}
          onClick={() => onChallengeChange(2)}
        >
          Challenge 2: Predict Future and Set TP
        </ChallengeButton>
      </ButtonGroup>

      <Description>
        {currentChallenge === 1 ? (
          <>
            <strong>Challenge:</strong> Look at the complete price chart below. Your task is to set a Take Profit (TP) 
            that is within 2 price units below the highest point in the future data. This tests your ability to identify optimal exit points!
          </>
        ) : (
          <>
            <strong>Challenge:</strong> Study the chart below. The vertical line shows the current time. 
            Looking at the pattern on the left (past data), try to predict where the price will go and set your Take Profit (TP) level.
            After you submit your TP, you'll see if you were right!
          </>
        )}
      </Description>
    </>
  );
};

export default ChallengeSelector;
