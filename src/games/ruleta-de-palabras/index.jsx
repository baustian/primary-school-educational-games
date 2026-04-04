import { useState, useEffect, useRef, useCallback } from 'react';
import { topics, gameConfig } from './data/gameData';
import { useUser } from '../../hooks/useUser';
import EducationalInfoModal from '../../components/EducationalInfoModal';
import { games } from '../../data/games';
import ModeSelector from './components/ModeSelector';
import RoundScreen from './components/RoundScreen';
import GameOverScreen from './components/GameOverScreen';

function RuletaDePalabras() {
  const { userName, addScore } = useUser();
  const gameInfo = games.find(g => g.id === 'ruleta-de-palabras')?.educationalInfo;

  const [gameState, setGameState] = useState('modeSelect'); // modeSelect, playing, gameOver
  const [gameMode, setGameMode] = useState(null); // '2players' or 'computer'
  const [currentRound, setCurrentRound] = useState(0);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [currentTopic, setCurrentTopic] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(1); // 1 or 2
  const [usedLetters, setUsedLetters] = useState([]);
  const [roundWinner, setRoundWinner] = useState(null);
  const [displayTime, setDisplayTime] = useState(gameConfig.timePerRound);
  const [isTimeRunning, setIsTimeRunning] = useState(false);
  const [computerWord, setComputerWord] = useState(null);
  const timeoutHandledRef = useRef(false);
  const computerPlayTimeoutRef = useRef(null);

  // Start a new round
  const startNewRound = useCallback(() => {
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    setCurrentTopic(randomTopic);
    setDisplayTime(gameConfig.timePerRound);
    setIsTimeRunning(true);
    setRoundWinner(null);
  }, []);

  // Handle timer countdown
  useEffect(() => {
    if (!isTimeRunning || displayTime <= 0) return;

    const timer = setInterval(() => {
      setDisplayTime((prev) => {
        const newTime = prev <= 1 ? 0 : prev - 1;

        // Handle timeout when timer reaches 0
        if (newTime === 0 && !timeoutHandledRef.current) {
          timeoutHandledRef.current = true;
          // Schedule next round after a delay
          setTimeout(() => {
            setIsTimeRunning(false);
            setRoundWinner(null);

            setCurrentRound((round) => {
              const nextRound = round + 1;
              if (nextRound < gameConfig.totalRounds) {
                // Next player's turn
                setCurrentPlayer((player) => (player === 1 ? 2 : 1));
                startNewRound();
              } else {
                setGameState('gameOver');
              }
              return nextRound;
            });
          }, 1500);
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimeRunning, displayTime, startNewRound]);

  // Initialize game with mode selection
  const initializeGame = (mode) => {
    setGameMode(mode);
    setCurrentRound(0);
    setScores({ player1: 0, player2: 0 });
    setCurrentPlayer(1);
    setUsedLetters([]);
    setGameState('playing');

    // Start first round
    setTimeout(() => {
      startNewRound();
    }, 500);
  };

  // Handle letter selection
  const handleLetterSelected = (letter) => {
    if (!isTimeRunning || usedLetters.includes(letter)) {
      return; // Can't select if time expired or letter already used
    }

    // Player scored!
    setIsTimeRunning(false);
    setRoundWinner(currentPlayer);
    setUsedLetters([...usedLetters, letter]);

    // If computer played, select and show a word
    if (gameMode === 'computer' && currentPlayer === 2) {
      const availableWords = currentTopic?.words?.filter(w => w[0].toUpperCase() === letter) || [];
      if (availableWords.length > 0) {
        const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
        setComputerWord(randomWord);
      }
    } else {
      setComputerWord(null);
    }

    // Update score
    const newScores = { ...scores };
    const playerKey = `player${currentPlayer}`;
    newScores[playerKey] = (newScores[playerKey] || 0) + 10;
    setScores(newScores);

    // Move to next round or end game
    setTimeout(() => {
      if (currentRound + 1 < gameConfig.totalRounds) {
        // Next player's turn
        const nextPlayer = currentPlayer === 1 ? 2 : 1;
        setCurrentPlayer(nextPlayer);
        setCurrentRound((prev) => prev + 1);
        setComputerWord(null);
        startNewRound();
      } else {
        setGameState('gameOver');
      }
    }, 2000);
  };

  // Reset timeout ref when round starts
  useEffect(() => {
    timeoutHandledRef.current = false;
  }, [currentRound]);

  // Auto-play computer turn
  useEffect(() => {
    if (gameMode !== 'computer' || currentPlayer !== 2 || !isTimeRunning || roundWinner !== null) {
      return;
    }

    // Computer plays after 1-2 seconds of thinking
    computerPlayTimeoutRef.current = setTimeout(() => {
      const availableLetters = [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
        'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
        'U', 'V', 'X', 'Y', 'Z',
      ].filter(letter => !usedLetters.includes(letter));

      let computerSucceeded = false;

      if (availableLetters.length > 0 && currentTopic?.words) {
        // Pick a random word from the topic
        const randomWord = currentTopic.words[
          Math.floor(Math.random() * currentTopic.words.length)
        ];
        const wordLetter = randomWord[0].toUpperCase();

        // Only select if that letter is available
        if (availableLetters.includes(wordLetter)) {
          computerSucceeded = true;

          // Inline the letter selection logic for computer
          setIsTimeRunning(false);
          setRoundWinner(2);
          setUsedLetters(prev => [...prev, wordLetter]);

          // Set the computer's word
          const availableWords = currentTopic?.words?.filter(w => w[0].toUpperCase() === wordLetter) || [];
          if (availableWords.length > 0) {
            const randomChosenWord = availableWords[Math.floor(Math.random() * availableWords.length)];
            setComputerWord(randomChosenWord);
          }

          // Update score
          setScores(prev => ({
            ...prev,
            player2: prev.player2 + 10,
          }));

          // Move to next round or end game (longer delay for computer word visibility)
          setTimeout(() => {
            setCurrentRound((round) => {
              const nextRound = round + 1;
              if (nextRound < gameConfig.totalRounds) {
                // Next player's turn
                setCurrentPlayer(1);
                setComputerWord(null);
                startNewRound();
              } else {
                setGameState('gameOver');
              }
              return nextRound;
            });
          }, 3500);
        }
      }

      // If computer couldn't find a valid letter, it loses the turn
      if (!computerSucceeded) {
        setIsTimeRunning(false);
        setRoundWinner(null); // No points awarded

        // Move to next player
        setTimeout(() => {
          setCurrentRound((round) => {
            const nextRound = round + 1;
            if (nextRound < gameConfig.totalRounds) {
              // Next player's turn
              setCurrentPlayer(1);
              setComputerWord(null);
              startNewRound();
            } else {
              setGameState('gameOver');
            }
            return nextRound;
          });
        }, 1500);
      }
    }, 1000 + Math.random() * 1000); // 1-2 seconds thinking time

    return () => {
      if (computerPlayTimeoutRef.current) {
        clearTimeout(computerPlayTimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameMode, currentPlayer, isTimeRunning, roundWinner, usedLetters, currentTopic]);

  const handleGameOver = () => {
    // Add player1's score to user's global score (only in 2-player mode or when player1 wins against computer)
    if (gameMode === '2players' && userName) {
      addScore(scores.player1);
    } else if (gameMode === 'computer' && userName) {
      // In computer mode, player1 is always the user
      addScore(scores.player1);
    }
  };

  const resetGame = () => {
    setGameState('modeSelect');
    setGameMode(null);
    setCurrentRound(0);
    setScores({ player1: 0, player2: 0 });
    setCurrentPlayer(1);
    setUsedLetters([]);
    setCurrentTopic(null);
    setRoundWinner(null);
    setDisplayTime(gameConfig.timePerRound);
    setIsTimeRunning(false);
    setComputerWord(null);
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-gradient-to-b from-blue-500 to-blue-600">
      <div className="p-4 flex-1">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-white text-center mb-8 drop-shadow-lg">
            🎡 Ruleta de Palabras
          </h1>

          {gameState === 'modeSelect' && (
            <ModeSelector onSelectMode={initializeGame} userName={userName} />
          )}

          {gameState === 'playing' && (
            <RoundScreen
              roundNumber={currentRound + 1}
              totalRounds={gameConfig.totalRounds}
              topic={currentTopic}
              currentPlayer={currentPlayer}
              gameMode={gameMode}
              scores={scores}
              roundWinner={roundWinner}
              displayTime={displayTime}
              isTimeRunning={isTimeRunning}
              usedLetters={usedLetters}
              computerWord={computerWord}
              userName={userName}
              onLetterSelected={handleLetterSelected}
            />
          )}

          {gameState === 'gameOver' && (
            <GameOverScreen
              scores={scores}
              gameMode={gameMode}
              userName={userName}
              onPlayAgain={() => {
                handleGameOver();
                resetGame();
              }}
            />
          )}
        </div>
      </div>

      <EducationalInfoModal gameInfo={gameInfo} />
    </div>
  );
}

export default RuletaDePalabras;
