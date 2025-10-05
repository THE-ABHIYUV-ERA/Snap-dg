// frontend/src/components/Landing3D.jsx
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Text } from '@react-three/drei';
import { motion } from 'framer-motion';

const Landing3D = ({ onExploreClick, onDefendClick }) => {
  return (
    <div className="landing-container">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} />
        
        <AnimatedEarth />
        <Stars radius={100} depth={50} count={5000} factor={4} />
      </Canvas>

      <div className="landing-content">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="hero-section"
        >
          <h1 className="hero-title">NASA EYES ON ASTEROIDS</h1>
          <p className="hero-subtitle">
            Explore asteroid impacts • Defend Earth from threats
          </p>
        </motion.div>

        <div className="action-buttons">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="action-btn explore-btn"
            onClick={onExploreClick}
          >
            <span className="btn-icon">🌌</span>
            EXPLORE ASTEROIDS
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            className="action-btn defend-btn"
            onClick={onDefendClick}
          >
            <span className="btn-icon">🛡️</span>
            DEFEND EARTH
          </motion.button>
        </div>
      </div>
    </div>
  );
};

const AnimatedEarth = () => {
  const earthRef = useRef();
  
  useFrame((state, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <mesh ref={earthRef}>
      <sphereGeometry args={[2, 32, 32]} />
      <meshStandardMaterial color="#1E40AF" roughness={0.7} />
    </mesh>
  );
};

export default Landing3D;