import React, { useEffect, useMemo, useState } from 'react';
import { WORLDS, QUESTIONS_PER_LEVEL, getLevelWorld, createQuestion } from './data/gameData';

const STORAGE_KEY = 'maths-adventure-progress-v1';
const emptyProgress = { playerName: '', completed: {}, coins: 0 };

function WorldScenery({ world = 0, compact = false }) {
  const symbols = ['+', '1', '✦', '−', '2', '★'];
  return (
    <div className={`world-scenery world-scenery-${world || 'main'} ${compact ? 'compact' : ''}`} aria-hidden="true">
      <div className="scenery-sun" />
      <div className="scenery-cloud cloud-one" />
      <div className="scenery-cloud cloud-two" />
      <div className="scenery-hill hill-back" />
      <div className="scenery-hill hill-front" />
      <div className="floating-symbols">
        {symbols.map((symbol, index) => <span key={`${symbol}-${index}`} style={{ '--float-delay': `${index * -.9}s` }}>{symbol}</span>)}
      </div>
      <div className="scenery-castle">♜</div>
    </div>
  );
}

function loadProgress() {
  try {
    return { ...emptyProgress, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') };
  } catch {
    return emptyProgress;
  }
}

export default function App() {
  const [progress, setProgress] = useState(loadProgress);
  const [screen, setScreen] = useState(progress.playerName ? 'map' : 'welcome');
  const [name, setName] = useState(progress.playerName || '');
  const [level, setLevel] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [hintVisible, setHintVisible] = useState(false);
  const [earnedCoins, setEarnedCoins] = useState(0);
  const [expandedWorld, setExpandedWorld] = useState(null);
  const [mapPage, setMapPage] = useState('home');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const completedLevels = Object.keys(progress.completed).length;
  const totalStars = Object.values(progress.completed).reduce((sum, item) => sum + item.stars, 0);
  const currentQuestion = questions[questionIndex];
  const world = getLevelWorld(level);

  const unlockedLevel = useMemo(() => {
    let next = 1;
    while (next < 100 && progress.completed[next]) next += 1;
    return next;
  }, [progress.completed]);

  function startGame() {
    const playerName = name.trim() || 'Math Explorer';
    setProgress(p => ({ ...p, playerName }));
    setName(playerName);
    setMapPage('home');
    setScreen('map');
  }

  function openMap(page) {
    setMapPage(page);
    setExpandedWorld(null);
    setScreen('map');
  }

  function startLevel(levelNumber) {
    if (levelNumber > unlockedLevel && !progress.completed[levelNumber]) return;
    setLevel(levelNumber);
    setQuestions(Array.from({ length: QUESTIONS_PER_LEVEL }, () => createQuestion(levelNumber)));
    setQuestionIndex(0);
    setScore(0);
    setSelected(null);
    setFeedback('');
    setHintVisible(false);
    setEarnedCoins(0);
    setScreen('game');
  }

  function chooseAnswer(answer) {
    if (selected !== null) return;
    setSelected(answer);
    const correct = answer === currentQuestion.answer;
    if (correct) {
      setScore(s => s + 1);
      setEarnedCoins(c => c + 2);
      setFeedback('🌟 Wonderful! That is correct!');
    } else {
      setFeedback(`Good try! The correct answer is ${currentQuestion.answer}. Keep learning!`);
    }

  }

  function nextQuestion() {
    if (questionIndex + 1 < QUESTIONS_PER_LEVEL) {
      setQuestionIndex(i => i + 1);
      setSelected(null);
      setFeedback('');
      setHintVisible(false);
    } else {
      const finalScore = score;
      const stars = finalScore >= 5 ? 3 : finalScore >= 4 ? 2 : 1;
      setProgress(p => ({
        ...p,
        coins: p.coins + earnedCoins,
        completed: {
          ...p.completed,
          [level]: {
            stars: Math.max(p.completed[level]?.stars || 0, stars),
            bestScore: Math.max(p.completed[level]?.bestScore || 0, finalScore),
          },
        },
      }));
      setScreen('result');
    }
  }

  function resetProgress() {
    if (window.confirm('Are you sure you want to reset all game progress on this device?')) {
      localStorage.removeItem(STORAGE_KEY);
      setProgress(emptyProgress);
      setName('');
      setScreen('welcome');
    }
  }

  return (
    <main className={`app-shell page-${screen === 'map' ? mapPage : screen}`}>
      <WorldScenery world={screen === 'game' ? world.id : 0} compact={screen === 'game'} />
      <header className="topbar">
        <div className="brand"><span className="brand-icon">🧮</span><span>Maths Adventure</span></div>
        <div className="stats">
          <span>🪙 {progress.coins}</span>
          <span>⭐ {totalStars}</span>
        </div>
      </header>

      {screen === 'map' && (
        <nav className="main-navigation" aria-label="Adventure navigation">
          <button className={mapPage === 'home' ? 'active' : ''} onClick={() => openMap('home')}><span>⌂</span> Home</button>
          <button className={mapPage === 'worlds' ? 'active' : ''} onClick={() => openMap('worlds')}><span>◉</span> Worlds</button>
          <button className={mapPage === 'progress' ? 'active' : ''} onClick={() => openMap('progress')}><span>↗</span> Progress</button>
          <button className={mapPage === 'rewards' ? 'active' : ''} onClick={() => openMap('rewards')}><span>★</span> Rewards</button>
        </nav>
      )}

      {screen === 'welcome' && (
        <section className="welcome panel">
          <div className="hero-art" role="img" aria-label="A friendly rocket exploring a magical maths world">
            <img src="/images/welcome-adventure.svg" alt="" />
          </div>
          <p className="eyebrow">LEARN • PLAY • GROW</p>
          <h1>Welcome to<br /><span>Maths Adventure!</span></h1>
          <p className="subtext">Travel through 10 magical worlds and complete 100 fun maths levels.</p>
          <label htmlFor="playerName">What should we call you?</label>
          <input id="playerName" value={name} onChange={e => setName(e.target.value)} maxLength={20} placeholder="Enter a nickname" />
          <button className="primary" onClick={startGame}>Start my adventure →</button>
          <p className="tiny">A little practice every day makes a big difference!</p>
        </section>
      )}

      {screen === 'map' && (
        <section className="content adventure-page">
          {mapPage === 'home' && (
            <>
          <div className="welcome-line">
            <div><p className="eyebrow">READY FOR AN ADVENTURE?</p><h1>Hello, {progress.playerName || 'Math Explorer'}! 👋</h1><p className="subtext">Choose your next world and keep learning.</p></div>
            <div className="mascot" role="img" aria-label="A cheerful fox explorer">🦊</div>
          </div>
          <div className="progress-card">
            <div className="progress-heading"><strong>Your journey</strong><span>{completedLevels}/100 levels</span></div>
            <div className="progress-track"><div style={{ width: `${completedLevels}%` }} /></div>
            <div className="progress-foot"><span>⭐ {totalStars} stars</span><span>🪙 {progress.coins} coins</span></div>
          </div>
          <div className="home-grid">
            <button className="feature-card continue-card" onClick={() => openMap('worlds')}>
              <span className="feature-icon">🗺️</span>
              <span><small>CONTINUE YOUR QUEST</small><strong>Explore your next level</strong><em>Open the world map →</em></span>
            </button>
            <button className="feature-card trophy-card" onClick={() => openMap('progress')}>
              <span className="feature-icon">🏅</span>
              <span><small>YOUR JOURNEY</small><strong>{completedLevels} of 100 levels complete</strong><em>View progress →</em></span>
            </button>
            <button className="feature-card reward-card" onClick={() => openMap('rewards')}>
              <span className="feature-icon">🎁</span>
              <span><small>COLLECTED</small><strong>{progress.coins} adventure coins</strong><em>Visit rewards →</em></span>
            </button>
          </div>
            </>
          )}

          {mapPage === 'worlds' && (
            <>
          <h2>Explore the 10 worlds</h2>
          <div className="world-grid">
              {WORLDS.map(w => {
              const first = (w.id - 1) * 10 + 1;
              const last = first + 9;
              const done = Array.from({ length: 10 }, (_, i) => progress.completed[first + i]).filter(Boolean).length;
              const locked = first > unlockedLevel && !progress.completed[first];
              const worldComplete = done === 10;
              return <article className={`world-card world-card-${w.id} ${locked ? 'locked' : ''} ${worldComplete ? 'world-complete' : ''}`} key={w.id} style={{ '--world-color': w.color }}>
                <div className="world-card-scenery" aria-hidden="true"><span>{w.emoji}</span><i /><b /></div>
                <div className="world-emoji">{locked ? '🔒' : w.emoji}</div>
                <div className="world-info"><span className="world-number">WORLD {w.id}</span><h3>{w.name}</h3><p>{w.topic}</p><small>{done}/10 levels completed</small></div>
                  <button className="small-button" disabled={locked} onClick={() => setExpandedWorld(expandedWorld === w.id ? null : w.id)}>{locked ? 'Locked' : expandedWorld === w.id ? 'Close' : 'Levels'}</button>
              </article>;
            })}
          </div>
            {expandedWorld && (() => {
              const worldData = WORLDS.find(w => w.id === expandedWorld);
              const first = (expandedWorld - 1) * 10 + 1;
              return <section className="level-picker panel" aria-label={`${worldData.name} levels`}>
                <div className="level-picker-heading">
                  <div><p className="eyebrow">WORLD {expandedWorld}</p><h2>{worldData.emoji} {worldData.name}</h2></div>
                  <button className="back-button" onClick={() => setExpandedWorld(null)}>Close ×</button>
                </div>
                <div className="level-grid">
                  {Array.from({ length: 10 }, (_, i) => first + i).map(levelNumber => {
                    const result = progress.completed[levelNumber];
                    const locked = levelNumber > unlockedLevel && !result;
                    return <button key={levelNumber} className={`level-button ${result ? 'complete' : ''}`} disabled={locked} onClick={() => startLevel(levelNumber)}>
                      <span>{locked ? '🔒' : levelNumber}</span>
                      <small>{result ? `${'⭐'.repeat(result.stars)}` : locked ? 'Locked' : 'Play'}</small>
                    </button>;
                  })}
                </div>
              </section>;
            })()}
            </>
          )}
          <div className="map-actions"><button className="text-button" onClick={resetProgress}>Reset progress</button></div>

          {mapPage === 'progress' && (
            <section className="inner-page progress-page">
              <div className="page-heading"><p className="eyebrow">YOUR ADVENTURE</p><h1>Learning progress</h1><p>Every level you finish makes your maths superpowers stronger.</p></div>
              <div className="stat-grid">
                <article><span>🏁</span><strong>{completedLevels}</strong><small>Levels completed</small></article>
                <article><span>⭐</span><strong>{totalStars}</strong><small>Stars earned</small></article>
                <article><span>🪙</span><strong>{progress.coins}</strong><small>Coins collected</small></article>
              </div>
              <div className="progress-card large-progress">
                <div className="progress-heading"><strong>100-level journey</strong><span>{completedLevels}%</span></div>
                <div className="progress-track"><div style={{ width: `${completedLevels}%` }} /></div>
              </div>
            </section>
          )}

          {mapPage === 'rewards' && (
            <section className="inner-page rewards-page">
              <div className="page-heading"><p className="eyebrow">TREASURE CHEST</p><h1>Your rewards</h1><p>Collect coins and stars as you master every world.</p></div>
              <div className="reward-balance"><div><span>🪙</span><strong>{progress.coins}</strong><small>Adventure coins</small></div><div><span>⭐</span><strong>{totalStars}</strong><small>Bright stars</small></div></div>
              <h2>Explorer badges</h2>
              <div className="badge-grid">
                <article className={completedLevels >= 1 ? 'unlocked' : ''}><span>🌱</span><strong>First Step</strong><small>Complete level 1</small></article>
                <article className={completedLevels >= 10 ? 'unlocked' : ''}><span>🌍</span><strong>World Explorer</strong><small>Complete 10 levels</small></article>
                <article className={totalStars >= 15 ? 'unlocked' : ''}><span>🌟</span><strong>Star Collector</strong><small>Earn 15 stars</small></article>
                <article className={completedLevels >= 100 ? 'unlocked' : ''}><span>👑</span><strong>Math Champion</strong><small>Complete all levels</small></article>
              </div>
            </section>
          )}
        </section>
      )}

      {screen === 'game' && currentQuestion && (
        <section className={`game-panel panel world-game-${world.id}`}>
          <div className="game-top"><button className="back-button" onClick={() => setScreen('map')}>← Map</button><span>{world.emoji} {world.name}</span><span>Level {level}/100</span></div>
          <div className="question-progress"><div style={{ width: `${((questionIndex + 1) / QUESTIONS_PER_LEVEL) * 100}%` }} /></div>
          <p className="eyebrow">QUESTION {questionIndex + 1} OF {QUESTIONS_PER_LEVEL}</p>
          <h1 className="question-title">{currentQuestion.prompt}</h1>
          <div className="answer-grid">
            {currentQuestion.choices.map((choice, i) => <button key={`${questionIndex}-${i}`} className={`answer-button ${selected === choice ? (choice === currentQuestion.answer ? 'correct' : 'wrong') : ''}`} disabled={selected !== null} onClick={() => chooseAnswer(choice)}>{choice}</button>)}
          </div>
          {feedback && <div className="feedback" role="status">{feedback}</div>}
          {hintVisible && <div className="hint-box">💡 Hint: {currentQuestion.hint}</div>}
          <div className="game-actions">
            <button className="secondary" onClick={() => setHintVisible(true)} disabled={selected !== null}>💡 Show hint</button>
            <button className="primary" onClick={nextQuestion} disabled={selected === null}>{questionIndex + 1 === QUESTIONS_PER_LEVEL ? 'Finish level' : 'Next question →'}</button>
          </div>
          <p className="tiny">⭐ Score: {score} &nbsp; • &nbsp; 🪙 Coins earned: {earnedCoins}</p>
        </section>
      )}

      {screen === 'result' && (
        <section className="result panel">
          <div className="result-art">🏆</div>
          <p className="eyebrow">LEVEL {level} COMPLETE</p>
          <h1>Fantastic work, {progress.playerName || 'Math Explorer'}!</h1>
          <div className="big-stars">{'⭐'.repeat(score >= 5 ? 3 : score >= 4 ? 2 : 1)}</div>
          <p className="subtext">You answered {score} out of {QUESTIONS_PER_LEVEL} questions correctly.</p>
          <div className="result-stats"><span>⭐ {score >= 5 ? 3 : score >= 4 ? 2 : 1} stars</span><span>🪙 {earnedCoins} coins</span></div>
          <p>{score >= 4 ? 'You are doing brilliantly. Keep it up!' : 'Every try helps you learn. Practise again and grow stronger!'}</p>
          <button className="primary" onClick={() => setScreen('map')}>Back to world map</button>
          {level < 100 && <button className="secondary" onClick={() => startLevel(level + 1)}>Next level →</button>}
          {level === 100 && <h2>👑 You are a Math Champion!</h2>}
        </section>
      )}
      <footer>Made for curious minds ✨ <span>Maths Adventure · 100 Levels</span></footer>
    </main>
  );
}
