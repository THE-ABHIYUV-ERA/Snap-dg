// frontend/src/components/DefendEarthGame.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const DefendEarthGame = ({ onBackClick }) => {
  const [gameState, setGameState] = useState('playing'); // 'playing', 'success', 'failed'
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [asteroidsDestroyed, setAsteroidsDestroyed] = useState(0);
  const [currentWave, setCurrentWave] = useState(1);
  const [defenseSystems, setDefenseSystems] = useState([
    { id: 1, type: 'rocket', position: 50, cooldown: 0, active: false },
    { id: 2, type: 'laser', position: 25, cooldown: 0, active: false },
    { id: 3, type: 'gravity', position: 75, cooldown: 0, active: false }
  ]);
  
  const [asteroids, setAsteroids] = useState([]);
  const [projectiles, setProjectiles] = useState([]);
  const gameAreaRef = useRef(null);
  const gameLoopRef = useRef(null);

  // Initialize game
  useEffect(() => {
    startGame();
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, []);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setLives(3);
    setAsteroidsDestroyed(0);
    setCurrentWave(1);
    setAsteroids([]);
    setProjectiles([]);
    gameLoop();
  };

  const spawnAsteroid = () => {
    if (gameState !== 'playing') return;
    
    const size = 20 + Math.random() * 30;
    const speed = 1 + Math.random() * 2 + currentWave * 0.5;
    
    const newAsteroid = {
      id: Math.random(),
      x: Math.random() * 100,
      y: -10,
      size,
      speed,
      health: Math.ceil(size / 10)
    };
    
    setAsteroids(prev => [...prev, newAsteroid]);
  };

  const fireProjectile = (systemId, type) => {
    if (gameState !== 'playing') return;
    
    const system = defenseSystems.find(s => s.id === systemId);
    if (system && system.cooldown === 0) {
      const newProjectile = {
        id: Math.random(),
        x: system.position,
        y: 90,
        type,
        speed: type === 'rocket' ? 4 : 6,
        damage: type === 'rocket' ? 3 : 1
      };
      
      setProjectiles(prev => [...prev, newProjectile]);
      
      // Set cooldown
      setDefenseSystems(prev => 
        prev.map(s => 
          s.id === systemId 
            ? { ...s, cooldown: type === 'rocket' ? 60 : 20, active: true }
            : s
        )
      );
      
      // Reset active state after animation
      setTimeout(() => {
        setDefenseSystems(prev => 
          prev.map(s => 
            s.id === systemId ? { ...s, active: false } : s
          )
        );
      }, 500);
    }
  };

  const gameLoop = () => {
    if (gameState !== 'playing') return;

    // Spawn asteroids randomly
    if (Math.random() < 0.05 + currentWave * 0.01) {
      spawnAsteroid();
    }

    // Update asteroids
    setAsteroids(prev => 
      prev.map(asteroid => ({
        ...asteroid,
        y: asteroid.y + asteroid.speed * 0.5
      })).filter(asteroid => {
        // Check if asteroid reached Earth
        if (asteroid.y > 95) {
          setLives(prev => {
            const newLives = prev - 1;
            if (newLives <= 0) {
              setGameState('failed');
            }
            return newLives;
          });
          return false;
        }
        return asteroid.health > 0;
      })
    );

    // Update projectiles
    setProjectiles(prev => 
      prev.map(projectile => ({
        ...projectile,
        y: projectile.y - projectile.speed
      })).filter(projectile => projectile.y > 0)
    );

    // Check collisions
    setProjectiles(prev => 
      prev.filter(projectile => {
        const hitAsteroidIndex = asteroids.findIndex(asteroid => {
          const distance = Math.sqrt(
            Math.pow(asteroid.x - projectile.x, 2) + 
            Math.pow(asteroid.y - projectile.y, 2)
          );
          return distance < (asteroid.size / 2 + 5);
        });

        if (hitAsteroidIndex !== -1) {
          const hitAsteroid = asteroids[hitAsteroidIndex];
          const newHealth = hitAsteroid.health - projectile.damage;
          
          if (newHealth <= 0) {
            setAsteroidsDestroyed(prev => prev + 1);
            setScore(prev => prev + 100);
          }
          
          setAsteroids(prev => 
            prev.map((a, index) => 
              index === hitAsteroidIndex 
                ? { ...a, health: newHealth }
                : a
            )
          );
          return false; // Remove projectile
        }
        return true;
      })
    );

    // Update cooldowns
    setDefenseSystems(prev => 
      prev.map(system => ({
        ...system,
        cooldown: Math.max(0, system.cooldown - 1)
      }))
    );

    // Increase wave
    if (asteroidsDestroyed >= currentWave * 5) {
      setCurrentWave(prev => prev + 1);
      setAsteroidsDestroyed(0);
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  };

  // Start game loop
  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    } else {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    }
  }, [gameState]);

  return (
    <div className="game-container" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      overflow: 'hidden'
    }}>
      {/* Game UI Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: '20px',
        background: 'rgba(0, 0, 0, 0.8)',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <button 
          onClick={onBackClick}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)'
          }}
        >
          ← Back to Simulator
        </button>
        
        <div style={{ display: 'flex', gap: '30px' }}>
          <div className="stat">
            <div style={{ fontSize: '12px', opacity: 0.8 }}>LIVES</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>🛡️ {lives}</div>
          </div>
          <div className="stat">
            <div style={{ fontSize: '12px', opacity: 0.8 }}>SCORE</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>⭐ {score}</div>
          </div>
          <div className="stat">
            <div style={{ fontSize: '12px', opacity: 0.8 }}>WAVE</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>🌊 {currentWave}</div>
          </div>
          <div className="stat">
            <div style={{ fontSize: '12px', opacity: 0.8 }}>DESTROYED</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>💥 {asteroidsDestroyed}</div>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div 
        ref={gameAreaRef}
        style={{
          position: 'absolute',
          top: '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90%',
          height: 'calc(100% - 200px)',
          background: 'rgba(0, 0, 0, 0.3)',
          border: '2px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '10px',
          overflow: 'hidden'
        }}
      >
        {/* Stars Background */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}></div>

        {/* Earth */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100px',
          height: '100px',
          background: 'radial-gradient(circle at 30% 30%, #1e40af, #1e3a8a)',
          borderRadius: '50%',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 0 50px rgba(59, 130, 246, 0.5)'
        }}></div>

        {/* Defense Systems */}
        {defenseSystems.map(system => (
          <div key={system.id} style={{
            position: 'absolute',
            bottom: '130px',
            left: `${system.position}%`,
            transform: 'translateX(-50%)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: system.active 
                ? system.type === 'rocket' ? 'rgba(245, 158, 11, 0.8)' 
                  : system.type === 'laser' ? 'rgba(239, 68, 68, 0.8)' 
                  : 'rgba(139, 92, 246, 0.8)'
                : 'rgba(255, 255, 255, 0.1)',
              border: `2px solid ${
                system.type === 'rocket' ? '#f59e0b' 
                : system.type === 'laser' ? '#ef4444' 
                : '#8b5cf6'
              }`,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              cursor: system.cooldown === 0 ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease'
            }}
            onClick={() => fireProjectile(system.id, system.type)}
            >
              {system.type === 'rocket' && '🚀'}
              {system.type === 'laser' && '🔫'}
              {system.type === 'gravity' && '🌌'}
            </div>
            <div style={{
              fontSize: '10px',
              marginTop: '5px',
              opacity: 0.8
            }}>
              {system.cooldown > 0 ? `🔄 ${system.cooldown}` : 'READY'}
            </div>
          </div>
        ))}

        {/* Asteroids */}
        {asteroids.map(asteroid => (
          <motion.div
            key={asteroid.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              position: 'absolute',
              left: `${asteroid.x}%`,
              top: `${asteroid.y}%`,
              width: `${asteroid.size}px`,
              height: `${asteroid.size}px`,
              background: 'radial-gradient(circle at 30% 30%, #666, #333)',
              borderRadius: '50%',
              border: '1px solid #555',
              transform: 'translate(-50%, -50%)'
            }}
          />
        ))}

        {/* Projectiles */}
        {projectiles.map(projectile => (
          <div
            key={projectile.id}
            style={{
              position: 'absolute',
              left: `${projectile.x}%`,
              top: `${projectile.y}%`,
              width: '10px',
              height: '20px',
              background: projectile.type === 'rocket' 
                ? 'linear-gradient(to top, #f59e0b, #fbbf24)' 
                : 'linear-gradient(to top, #ef4444, #f87171)',
              borderRadius: '2px',
              transform: 'translate(-50%, -50%)'
            }}
          />
        ))}
      </div>

      {/* Game Controls */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '20px',
        alignItems: 'center'
      }}>
        <div style={{
          background: 'rgba(0, 0, 0, 0.7)',
          padding: '20px',
          borderRadius: '10px',
          backdropFilter: 'blur(10px)'
        }}>
          <h4 style={{ margin: '0 0 10px 0', textAlign: 'center' }}>🎮 HOW TO PLAY</h4>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
            <li>🚀 Click rocket to destroy large asteroids (3 damage)</li>
            <li>🔫 Click laser for rapid fire (1 damage)</li>
            <li>🌌 Gravity field slows nearby asteroids</li>
            <li>🛡️ Protect Earth - you have 3 lives!</li>
          </ul>
        </div>
      </div>

      {/* Game Over Overlay */}
      {gameState === 'failed' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          <h2 style={{ fontSize: '48px', marginBottom: '20px', color: '#ef4444' }}>
            💥 EARTH DESTROYED!
          </h2>
          <p style={{ fontSize: '24px', marginBottom: '30px' }}>
            Final Score: {score} | Wave: {currentWave}
          </p>
          <button 
            onClick={startGame}
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              border: 'none',
              color: 'white',
              padding: '15px 30px',
              fontSize: '18px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            🔄 RESTART MISSION
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default DefendEarthGame;