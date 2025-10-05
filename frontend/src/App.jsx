import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ImpactMap from './components/ImpactMap';
import Globe3D from './components/Globe3D';
import MitigationPanel from './components/MitigationPanel';
import DefendEarthGame from './components/DefendEarthGame';
import './index.css';

const API_BASE = 'http://localhost:8000';
axios.defaults.baseURL = API_BASE;

// VR Experience Page Component
const VRExperiencePage = ({ onBackClick }) => {
  const vrExperiences = [
    {
      id: 1,
      title: "VR Earth Explore & Learn",
      description: "Immerse yourself in a breathtaking 360° journey around our planet. Experience Earth's beauty from space and learn about its atmospheric layers, weather patterns, and orbital mechanics.",
      youtubeId: "6lyIcTlgACA",
      icon: "🌍",
      duration: "6:45 min",
      category: "Educational",
      features: ["Orbital view of Earth", "Atmospheric layers", "Weather systems", "Educational narration"]
    },
    {
      id: 2,
      title: "VR Asteroid View", 
      description: "Get up close with asteroids in deep space. Witness the scale, composition, and movement of these celestial objects in an immersive 360° environment perfect for students.",
      youtubeId: "0v89pNqS_tE",
      icon: "🪐",
      duration: "5:20 min",
      category: "Exploration",
      features: ["Close asteroid encounters", "Surface details", "Orbital mechanics", "Size comparisons"]
    },
    {
      id: 3,
      title: "VR Impact View",
      description: "Experience the power of asteroid impacts from a safe virtual perspective. Witness cosmic collisions and understand the physics behind these incredible events.",
      youtubeId: "JKm3uzL_A4c",
      icon: "💥",
      duration: "4:30 min",
      category: "Simulation",
      features: ["Impact simulations", "Crater formation", "Energy visualization", "Safety education"]
    }
  ];

  const [selectedExperience, setSelectedExperience] = useState(null);

  return (
    <div className="vr-experience-page">
      <div className="bg-stars"></div>
      <div className="bg-particles"></div>
      
      {/* Header */}
      <header className="vr-header">
        <div className="container">
          <button onClick={onBackClick} className="back-button">
            ← Back to Home
          </button>
          <div className="vr-header-content">
            <div className="vr-logo">🥽</div>
            <div className="vr-title">
              <h1>VR Explore & Learn</h1>
              <p>Immersive 360° Space Experiences for Education</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container">
        {!selectedExperience ? (
          /* VR Experience Selection Grid */
          <div className="vr-selection-section">
            <div className="section-header">
              <h2>Choose Your VR Experience</h2>
              <p>Select from our collection of immersive 360° space education videos</p>
            </div>

            <div className="vr-grid">
              {vrExperiences.map((experience) => (
                <div 
                  key={experience.id} 
                  className="vr-card"
                  onClick={() => setSelectedExperience(experience)}
                >
                  <div className="vr-card-header">
                    <div className="vr-icon">{experience.icon}</div>
                    <div className="vr-badge">{experience.category}</div>
                  </div>
                  
                  <div className="vr-card-content">
                    <h3>{experience.title}</h3>
                    <p>{experience.description}</p>
                    
                    <div className="vr-features">
                      {experience.features.map((feature, index) => (
                        <span key={index} className="vr-feature">✓ {feature}</span>
                      ))}
                    </div>
                    
                    <div className="vr-meta">
                      <span className="duration">🕓 {experience.duration}</span>
                      <span className="type">360° Video</span>
                    </div>
                  </div>
                  
                  <div className="vr-card-footer">
                    <button className="vr-play-button">
                      <span>▶️ Start Experience</span>
                    </button>
                  </div>
                  
                  <div className="vr-card-glow"></div>
                </div>
              ))}
            </div>

            <div className="vr-instructions">
              <div className="instruction-card">
                <h4>🎯 How to Experience VR</h4>
                <div className="instructions-grid">
                  <div className="instruction">
                    <div className="instruction-icon">🖱️</div>
                    <div className="instruction-text">
                      <strong>Desktop:</strong> Click and drag to look around
                    </div>
                  </div>
                  <div className="instruction">
                    <div className="instruction-icon">📱</div>
                    <div className="instruction-text">
                      <strong>Mobile:</strong> Move your device to explore
                    </div>
                  </div>
                  <div className="instruction">
                    <div className="instruction-icon">🥽</div>
                    <div className="instruction-text">
                      <strong>VR Headset:</strong> For full immersion
                    </div>
                  </div>
                  <div className="instruction">
                    <div className="instruction-icon">🔊</div>
                    <div className="instruction-text">
                      <strong>Audio:</strong> Use headphones for best experience
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* VR Video Player */
          <div className="vr-player-section">
            <div className="player-header">
              <button 
                className="back-to-selection"
                onClick={() => setSelectedExperience(null)}
              >
                ← Back to VR Experiences
              </button>
              <h2>{selectedExperience.title}</h2>
              <p>{selectedExperience.description}</p>
            </div>

            <div className="vr-player-container">
              <div className="youtube-vr-player">
                <iframe
                  width="100%"
                  height="500"
                  src={`https://www.youtube.com/embed/${selectedExperience.youtubeId}?rel=0&modestbranding=1&autoplay=1&iv_load_policy=3&enablejsapi=1&playsinline=1&fs=1&vr=1&gyroscope=1&accelerometer=1&mute=0&controls=1&widget_referrer=app&origin=${window.location.origin}`}
                  title={selectedExperience.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; vr; fullscreen; xr-spatial-tracking"
                  allowFullScreen
                ></iframe>
              </div>
              
              <div className="vr-controls">
                <div className="control-info">
                  <span className="control-icon">🖱️</span>
                  <span>Click and drag to look around in 360°</span>
                </div>
                <div className="control-info">
                  <span className="control-icon">📱</span>
                  <span>Move your phone to explore the environment</span>
                </div>
                <div className="control-info">
                  <span className="control-icon">🥽</span>
                  <span>Use VR headset for full immersion</span>
                </div>
                <div className="control-info">
                  <span className="control-icon">🔊</span>
                  <span>Headphones recommended for spatial audio</span>
                </div>
                <div className="control-info">
                  <span className="control-icon">🎮</span>
                  <span>Look for VR icon in YouTube player to enter VR mode</span>
                </div>
              </div>
            </div>

            <div className="vr-experience-details">
              <div className="detail-card">
                <h4>Educational Value</h4>
                <p>This immersive 360° experience is designed specifically for students and educators. It provides a unique perspective that traditional videos cannot offer, making complex space concepts more accessible and engaging.</p>
                
                <div className="experience-stats">
                  <div className="stat">
                    <span className="stat-value">360°</span>
                    <span className="stat-label">Full Sphere</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">4K</span>
                    <span className="stat-label">Resolution</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">VR</span>
                    <span className="stat-label">Ready</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">🎓</span>
                    <span className="stat-label">Educational</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [activeNav, setActiveNav] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);

  // Check URL for direct navigation
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/simulator') {
      setCurrentView('simulator');
    } else if (path === '/game') {
      setCurrentView('game');
    } else if (path === '/vr') {
      setCurrentView('vr-experience');
    } else {
      setCurrentView('landing');
    }
  }, []);

  // Handle scroll for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Team Members Data
  const teamMembers = [
    {
      id: 1,
      name: "Shivam Chaudhary",
      specialty: "Full-Stack Devloper",
      role: "Lead Role ",
      avatar: "🔭",
      description: "Btech in Computer Science and NASA SPACEAPPS CHALLANGE Selected For GLOBAL NOMINEE 2024 HALDWANI"
    },
    {
      id: 2,
      name: "Abhishek Kumar",
      specialty: "3D Visualization & UI/UX",
      role: "Visualization Engineer",
      avatar: "🎨",
      description: "Expert in WebGL and interactive data visualization & Btech in Computer Science and NASA SPACEAPPS CHALLANGE Selected For GLOBAL NOMINEE 2024 HALDWANI"
    },
    {
      id: 3,
      name: "Nitish Kumar",
      specialty: "REST API & NASA API",
      role: "Systems Architect",
      avatar: "⚙️",
      description: "Specialized in real-time data processing and API integration & Btech in Computer Science and NASA SPACEAPPS CHALLANGE Selected For GLOBAL NOMINEE 2024 HALDWANI"
    },
    {
      id: 4,
      name: "Abhishek Kumar",
      specialty: "Impact Physics & Simulation",
      role: "Simulation Specialist",
      avatar: "💥",
      description: "Research focus on asteroid impact modeling and risk assessment & Btech in Computer Science and NASA SPACEAPPS CHALLANGE Selected For GLOBAL NOMINEE 2024 HALDWANI"
    }
  ];

  // Features Data
  const features = [
    {
      icon: "🛰️",
      title: "Real NASA Data",
      description: "Access real orbital data from NASA's Eyes on Asteroids program"
    },
    {
      icon: "🌍",
      title: "3D Visualization",
      description: "Interactive 3D globe with realistic orbital trajectories"
    },
    {
      icon: "💥",
      title: "Impact Analysis",
      description: "Detailed impact consequences and mitigation strategies"
    },
    {
      icon: "🎮",
      title: "Defense Game",
      description: "Interactive game to learn planetary defense techniques"
    },
    {
      icon: "🥽",
      title: "VR Experiences",
      description: "Immersive 360° space education videos"
    }
  ];

  // Landing Page Component
  const LandingPage = () => (
    <div className="landing-page">
      {/* Animated Background Elements */}
      <div className="bg-stars"></div>
      <div className="bg-particles"></div>
      
      {/* Navigation Header */}
      <nav className={`landing-nav ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <div className="nav-logo">
            <div className="logo">🌌</div>
            <span className="logo-text">IMPACTOR-25</span>
          </div>
          
          <ul className="nav-links">
            {['home', 'features', 'team', 'about', 'contact'].map((item) => (
              <li key={item}>
                <a 
                  href={`#${item}`}
                  className={activeNav === item ? 'active' : ''}
                  onClick={() => setActiveNav(item)}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </a>
              </li>
            ))}
          </ul>
          
          <div className="nav-actions">
            <button 
              className="nav-btn primary"
              onClick={() => setCurrentView('simulator')}
            >
              🚀 Launch Simulator
            </button>
            <button 
              className="nav-btn secondary"
              onClick={() => setCurrentView('game')}
            >
              🎮 Play Game
            </button>
            <button 
              className="nav-btn vr"
              onClick={() => setCurrentView('vr-experience')}
            >
              🥽 VR Experience
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span>🌍 Planetary Defense Initiative</span>
            </div>
            <h1 className="hero-title">
              ALL EYES ON 
              <span className="gradient-text"> ASTEROIDS</span>
            </h1>
            <h2 className="hero-subtitle">
              3D Asteroid Impact Simulator & Planetary Defense System
            </h2>
            <p className="hero-description">
              Experience real orbital mechanics and asteroid impact simulations using NASA data. 
              Explore cosmic impacts through advanced 3D visualization and interactive simulations.
              Atmospheric and planet impact simulations, 3D orbit simulation is a key element of planetary defense.
            </p>
            
            <div className="hero-actions">
              <button 
                className="hero-btn primary"
                onClick={() => setCurrentView('simulator')}
              >
                <span className="btn-icon">🚀</span>
                <span className="btn-text">Launch Impact Simulator</span>
                <span className="btn-arrow">→</span>
              </button>
              
              <button 
                className="hero-btn secondary"
                onClick={() => setCurrentView('game')}
              >
                <span className="btn-icon">🎮</span>
                <span className="btn-text">Play Defense Game</span>
              </button>

              {/* NEW VR BUTTON IN HERO SECTION */}
              <button 
                className="hero-btn vr"
                onClick={() => setCurrentView('vr-experience')}
              >
                <span className="btn-icon">🥽</span>
                <span className="btn-text">VR Explore & Learn</span>
                <span className="btn-arrow">⟳</span>
              </button>
            </div>
            
            <div className="hero-stats">
              <div className="stat">
                <div className="stat-number">1.5K+</div>
                <div className="stat-label">Tracked Asteroids</div>
              </div>
              <div className="stat">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Real-time Monitoring</div>
              </div>
              <div className="stat">
                <div className="stat-number">3D</div>
                <div className="stat-label">Orbital Visualization</div>
              </div>
              <div className="stat">
                <div className="stat-number">360°</div>
                <div className="stat-label">VR Experiences</div>
              </div>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="floating-globe">
              <div className="globe-container">
                <div className="orbit-ring"></div>
                <div className="orbit-ring"></div>
                <div className="earth-globe">🌍</div>
                <div className="asteroid-trail">🪐</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Advanced Features</h2>
            <p>Powered by NASA data and cutting-edge simulation technology</p>
          </div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <div className="feature-decoration"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="team-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Expert Team</h2>
            <p>Dedicated professionals working on planetary defense</p>
          </div>
          
          <div className="team-grid">
            {teamMembers.map((member) => (
              <div key={member.id} className="team-card">
                <div className="team-avatar">{member.avatar}</div>
                <div className="team-content">
                  <h3>{member.name}</h3>
                  <div className="team-role">{member.role}</div>
                  <div className="team-specialty">
                    <strong>Specialty:</strong> {member.specialty}
                  </div>
                  <p className="team-description">{member.description}</p>
                </div>
                <div className="team-decoration"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>About Our Mission</h2>
              <p>
                NASA Eyes on Asteroids is an educational and research platform dedicated to 
                planetary defense awareness. We combine real NASA data with advanced simulation 
                technology to help understand and visualize asteroid impacts.
              </p>
              <p>
                Our mission is to educate the public about near-Earth objects and demonstrate 
                the importance of ongoing planetary defense efforts through interactive 
                simulations and engaging visualizations.
              </p>
              <div className="about-features">
                <div className="about-feature">
                  <span className="feature-check">✅</span>
                  Real-time NASA NEO data integration
                </div>
                <div className="about-feature">
                  <span className="feature-check">✅</span>
                  Advanced 3D orbital mechanics visualization
                </div>
                <div className="about-feature">
                  <span className="feature-check">✅</span>
                  Scientific impact simulation algorithms
                </div>
                <div className="about-feature">
                  <span className="feature-check">✅</span>
                  Immersive VR educational experiences
                </div>
              </div>
            </div>
            <div className="about-visual">
              <div className="data-flow">
                <div className="data-node">NASA API</div>
                <div className="data-arrow">→</div>
                <div className="data-node">Processing</div>
                <div className="data-arrow">→</div>
                <div className="data-node">3D Visualization</div>
                <div className="data-arrow">→</div>
                <div className="data-node">VR Experiences</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="container">
          <div className="section-header">
            <h2>Get In Touch</h2>
            <p>Have questions about planetary defense or our simulations?</p>
          </div>
          
          <div className="contact-content">
            <div className="contact-info">
              <div className="contact-item">
                <div className="contact-icon">📧</div>
                <div className="contact-details">
                  <h4>Email Us</h4>
                  <p>snapdg@proton.me</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">🌐</div>
                <div className="contact-details">
                  <h4>NASA Data</h4>
                  <p>NASA API</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">🚀</div>
                <div className="contact-details">
                  <h4>Collaborate</h4>
                  <p>Research partnerships welcome</p>
                </div>
              </div>
            </div>
            
            <div className="contact-actions">
              <button className="contact-btn">
                📋 Request Research Access
              </button>
              <button className="contact-btn">
                📚 Educational Resources
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">🌌</div>
              <div className="footer-text">
                <h3>COSMIC DEFENDERS</h3>
                <p>Planetary Defense Simulation Platform</p>
              </div>
            </div>
            
            <div className="footer-links">
              <div className="footer-column">
                <h4>Platform</h4>
                <a href="#simulator">Impact Simulator</a>
                <a href="#game">Defense Game</a>
                <a href="#vr">VR Experiences</a>
                <a href="#data">NASA Data</a>
              </div>
              <div className="footer-column">
                <h4>Resources</h4>
                <a href="#education">Education</a>
                <a href="#research">Research</a>
                <a href="#api">API Docs</a>
              </div>
              <div className="footer-column">
                <h4>Organization</h4>
                <a href="#about">About</a>
                <a href="#team">Team</a>
                <a href="#contact">Contact</a>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2025 NASA All Eyes on Asteroids. Educational platform using NASA data.</p>
            <p>This is an independent educational project and not officially affiliated with NASA.</p>
          </div>
        </div>
      </footer>
    </div>
  );

  // Render based on current view
  switch(currentView) {
    case 'game':
      return <DefendEarthGame onBackClick={() => setCurrentView('landing')} />;
    case 'simulator':
      return <ImpactSimulator onBackClick={() => setCurrentView('landing')} />;
    case 'vr-experience':
      return <VRExperiencePage onBackClick={() => setCurrentView('landing')} />;
    case 'landing':
    default:
      return <LandingPage />;
  }
}

// Your existing ImpactSimulator component
const ImpactSimulator = ({ onBackClick }) => {
  const [parameters, setParameters] = useState({
    diameter: 100,
    velocity: 20,
    density: 3000,
  });

  const [impactLocation, setImpactLocation] = useState(null);
  const [simulationResult, setSimulationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('impact');
  
  // NASA asteroids state
  const [asteroids, setAsteroids] = useState([]);
  const [selectedAsteroid, setSelectedAsteroid] = useState(null);

  // 3D Globe state
  const [viewMode, setViewMode] = useState('3d');
  const [asteroidTrajectory, setAsteroidTrajectory] = useState(null);

  // Fetch NASA asteroids
  useEffect(() => {
    const fetchAsteroids = async () => {
      try {
        const res = await axios.get('/nasa-asteroids');
        console.log("🌌 NASA Asteroids:", res.data.neos);
        setAsteroids(res.data.neos || []);
      } catch (err) {
        console.error("❌ Failed to fetch asteroids:", err);
        try {
          const fallbackRes = await axios.get('/nasa-neo-feed');
          setAsteroids(fallbackRes.data.neos || []);
        } catch (fallbackErr) {
          console.error("❌ Both endpoints failed, using demo data");
          setAsteroids(generateNASADemoAsteroids());
        }
      }
    };

    const generateNASADemoAsteroids = () => {
      return [
        {
          id: '2000433',
          name: '433 Eros',
          diameter: 16800,
          diameter_min: 16000,
          diameter_max: 16800,
          velocity: 24.36,
          hazardous: false,
          miss_distance: 26400000,
          approach_date: '2024-12-15',
          orbital_data: {
            eccentricity: '.222',
            semi_major_axis: '1.458',
            inclination: '10.8',
            orbital_period: '643',
            perihelion_distance: '1.133'
          }
        },
        {
          id: '2001862',
          name: '1862 Apollo',
          diameter: 1700,
          diameter_min: 1500,
          diameter_max: 1700,
          velocity: 26.84,
          hazardous: true,
          miss_distance: 38400000,
          approach_date: '2024-11-20',
          orbital_data: {
            eccentricity: '.560',
            semi_major_axis: '1.471',
            inclination: '6.4',
            orbital_period: '651',
            perihelion_distance: '.647'
          }
        },
        {
          id: '2001221',
          name: '1221 Amor',
          diameter: 1000,
          diameter_min: 800,
          diameter_max: 1000,
          velocity: 22.15,
          hazardous: false,
          miss_distance: 29400000,
          approach_date: '2024-10-10',
          orbital_data: {
            eccentricity: '.434',
            semi_major_axis: '1.920',
            inclination: '11.9',
            orbital_period: '972',
            perihelion_distance: '1.087'
          }
        },
        {
          id: '2004179',
          name: '4179 Toutatis',
          diameter: 4500,
          diameter_min: 4000,
          diameter_max: 4500,
          velocity: 18.45,
          hazardous: true,
          miss_distance: 18500000,
          approach_date: '2024-09-05',
          orbital_data: {
            eccentricity: '.634',
            semi_major_axis: '2.532',
            inclination: '0.45',
            orbital_period: '1463',
            perihelion_distance: '0.925'
          }
        }
      ];
    };

    fetchAsteroids();
  }, []);

  // Debug state changes
  useEffect(() => {
    console.log('📍 Impact Location Updated:', impactLocation);
  }, [impactLocation]);

  useEffect(() => {
    console.log('🔄 Loading State:', loading);
  }, [loading]);

  const handleParameterChange = (param, value) => {
    const numValue = parseFloat(value) || 0;
    setParameters(prev => ({
      ...prev,
      [param]: numValue
    }));
  };

  const handleMapClick = (lat, lon) => {
    console.log('🗺️ Map clicked - setting location:', lat, lon);
    setImpactLocation({ lat, lon });
    setError(null);
  };

  const handleGlobeClick = (lat, lon) => {
    console.log('🌍 Globe clicked - setting location:', lat, lon);
    setImpactLocation({ lat, lon });
    setError(null);
  };

  const generateTrajectory = (asteroidData) => {
    if (!impactLocation) return null;
    
    if (asteroidData && asteroidData.orbital_data) {
      return generateOrbitalTrajectory(asteroidData, impactLocation);
    }
    
    return generateSimpleTrajectory(impactLocation);
  };

  const generateOrbitalTrajectory = (asteroidData, impactLoc) => {
    try {
      const orbitalData = asteroidData.orbital_data;
      const eccentricity = parseFloat(orbitalData.eccentricity) || 0.1;
      const inclination = parseFloat(orbitalData.inclination) || 10;
      const perihelionDistance = parseFloat(orbitalData.perihelion_distance) || 1.0;

      const trajectory = {
        name: asteroidData.name,
        points: [],
        orbital_elements: orbitalData,
        impact_point: impactLoc,
        type: 'orbital'
      };

      const numPoints = 30;
      for (let i = 0; i <= numPoints; i++) {
        const trueAnomaly = (i / numPoints) * 2 * Math.PI;
        
        const distance = perihelionDistance * (1 + eccentricity) / (1 + eccentricity * Math.cos(trueAnomaly));
        const x = distance * Math.cos(trueAnomaly);
        const z = distance * Math.sin(trueAnomaly) * Math.cos(inclination * Math.PI / 180);
        const y = distance * Math.sin(trueAnomaly) * Math.sin(inclination * Math.PI / 180);

        const scale = 0.3;
        const lat = impactLoc.lat + (y * scale);
        const lon = impactLoc.lon + (x * scale);
        const alt = Math.max(0, z * scale * 800);

        trajectory.points.push({
          lat: lat,
          lon: lon,
          alt: alt,
          distance: distance
        });
      }

      return trajectory;

    } catch (error) {
      console.error('❌ Error generating orbital trajectory:', error);
      return generateSimpleTrajectory(impactLoc);
    }
  };

  const generateSimpleTrajectory = (impactLoc) => {
    const trajectory = {
      points: [],
      impact_point: impactLoc,
      type: 'simple'
    };

    for (let i = 0; i <= 15; i++) {
      const t = i / 15;
      const curve = Math.sin(t * Math.PI) * 0.3;
      
      trajectory.points.push({
        lat: impactLoc.lat + 25 - (25 * t) + curve,
        lon: impactLoc.lon - 35 + (35 * t),
        alt: 800 * (1 - t),
        distance: 1 - t
      });
    }

    return trajectory;
  };

  const runSimulation = async () => {
    console.log('🚀 Starting simulation with location:', impactLocation);
    
    if (selectedAsteroid) {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.post('/simulate-impact-nasa', {
          id: selectedAsteroid.id,
          name: selectedAsteroid.name,
          diameter: Math.round(selectedAsteroid.diameter_max || selectedAsteroid.diameter),
          velocity: selectedAsteroid.velocity,
          miss_distance: selectedAsteroid.miss_distance,
          date: selectedAsteroid.date || selectedAsteroid.approach_date,
          orbital_data: selectedAsteroid.orbital_data
        });

        setSimulationResult(response.data);
        setAsteroidTrajectory(generateTrajectory(selectedAsteroid));
        setActiveTab('results');
        setLoading(false);
        return;
        
      } catch (err) {
        console.error("❌ NASA simulation error:", err);
        try {
          const fallbackResponse = await axios.get(`/simulate-impact-nasa/${selectedAsteroid.id}`);
          setSimulationResult(fallbackResponse.data);
          setAsteroidTrajectory(generateTrajectory(selectedAsteroid));
          setActiveTab('results');
        } catch (fallbackErr) {
          setError(`NASA simulation failed: ${err.response?.data?.detail || err.message}`);
        } finally {
          setLoading(false);
        }
        return;
      }
    }

    if (!impactLocation) {
      const errorMsg = 'Please select an impact location on the map first!';
      setError(errorMsg);
      console.error(errorMsg);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/simulate', {
        diameter: parameters.diameter,
        velocity: parameters.velocity,
        density: parameters.density,
        lat: impactLocation.lat,
        lon: impactLocation.lon
      });

      setSimulationResult(response.data);
      setAsteroidTrajectory(generateSimpleTrajectory(impactLocation));
      setActiveTab('results');

    } catch (err) {
      console.error('❌ Simulation error:', err);
      const errorMsg = err.response?.data?.detail || err.message || 'Unknown error';
      setError(`Simulation failed: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num === undefined || num === null) return 'N/A';
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num?.toFixed(2) || '0';
  };

  const resetSimulation = () => {
    setSimulationResult(null);
    setImpactLocation(null);
    setSelectedAsteroid(null);
    setAsteroidTrajectory(null);
    setActiveTab('impact');
    setError(null);
  };

  const isSimulateDisabled = loading || (!selectedAsteroid && !impactLocation);

  return (
    <div className="app">
      <div className="bg-stars"></div>
      <div className="bg-particles"></div>
      
      <header className="header">
        <div className="header-content">
          <div className="logo-container">
            <button onClick={onBackClick} className="back-button">
              ← Back to Home
            </button>
            <div className="logo">🌌</div>
            <div className="title-container">
              <h1>NASA EYES ON ASTEROIDS</h1>
              <p>3D Asteroid Impact Simulator with Real Orbital Paths</p>
            </div>
          </div>
          <div className="header-controls">
            <div className="status-indicator">
              <div className={`status-dot ${impactLocation || selectedAsteroid ? 'active' : 'inactive'}`}></div>
              <span>
                {selectedAsteroid ? 
                  `🛰️ ${selectedAsteroid.name}` :
                  impactLocation ? 
                  `📍 ${impactLocation.lat.toFixed(4)}°, ${impactLocation.lon.toFixed(4)}°` : 
                  '❌ Select Impact Location'
                }
              </span>
            </div>
            <div className="view-mode-toggle">
              <button 
                className={`view-btn ${viewMode === '3d' ? 'active' : ''}`}
                onClick={() => setViewMode('3d')}
              >
                🌍 3D Orbital View
              </button>
              <button 
                className={`view-btn ${viewMode === '2d' ? 'active' : ''}`}
                onClick={() => setViewMode('2d')}
              >
                🗺️ 2D Map View
              </button>
            </div>
            <button 
              className="game-button"
              onClick={() => window.location.href = '/game'}
            >
              🎮 Defend Earth Game
            </button>
            <button 
              className="vr-button"
              onClick={() => window.location.href = '/vr'}
            >
              🥽 VR Experience
            </button>
          </div>
        </div>
      </header>

      <div className="main-content">
        <div className="controls-panel">
          <div className="tabs-container">
            <div className="tabs">
              <button 
                className={`tab ${activeTab === 'impact' ? 'active' : ''}`}
                onClick={() => setActiveTab('impact')}
              >
                <span className="tab-icon">🚀</span>
                <span className="tab-text">Orbital Simulation</span>
              </button>
              <button 
                className={`tab ${activeTab === 'results' ? 'active' : ''}`}
                onClick={() => setActiveTab('results')}
                disabled={!simulationResult}
              >
                <span className="tab-icon">📊</span>
                <span className="tab-text">Impact Analysis</span>
              </button>
            </div>
          </div>

          {activeTab === 'impact' && (
            <div className="tab-content">
              <div className="section-card">
                <div className="section-header">
                  <span className="section-icon">🛰️</span>
                  <h3>NASA Eyes on Asteroids</h3>
                  <span className="asteroid-count">{asteroids.length} NEOs</span>
                </div>
                
                <div className="input-group">
                  <label>Select Near-Earth Object</label>
                  <select
                    value={selectedAsteroid?.id || ""}
                    onChange={(e) => {
                      const chosen = asteroids.find(a => a.id === e.target.value);
                      setSelectedAsteroid(chosen || null);
                      setError(null);
                    }}
                    className="modern-select"
                  >
                    <option value="">-- Select Asteroid --</option>
                    {asteroids.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} | ⌀{parseFloat(a.diameter_min || a.diameter_min_m || 0).toFixed(0)}-
                        {parseFloat(a.diameter_max || a.diameter_max_m || a.diameter || 0).toFixed(0)}m | 
                        🚀{parseFloat(a.velocity || a.relative_velocity_km_s || 0).toFixed(1)}km/s
                        {a.hazardous ? ' | ⚠️ HAZARDOUS' : ''}
                        {a.orbital_data ? ' | 🛸 ORBITAL DATA' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedAsteroid && (
                  <div className="asteroid-details-card">
                    <div className="card-header">
                      <h4>🛰️ {selectedAsteroid.name}</h4>
                      {selectedAsteroid.hazardous ? (
                        <span className="hazard-badge hazardous">⚠️ POTENTIALLY HAZARDOUS</span>
                      ) : (
                        <span className="hazard-badge safe">🟢 NON-HAZARDOUS</span>
                      )}
                    </div>
                    <div className="details-grid">
                      <div className="detail-item">
                        <span className="detail-label">Diameter</span>
                        <span className="detail-value">
                          {parseFloat(selectedAsteroid.diameter_min || selectedAsteroid.diameter_min_m || 0).toFixed(0)} - {parseFloat(selectedAsteroid.diameter_max || selectedAsteroid.diameter_max_m || selectedAsteroid.diameter || 0).toFixed(0)} m
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Velocity</span>
                        <span className="detail-value">
                          {parseFloat(selectedAsteroid.velocity || selectedAsteroid.relative_velocity_km_s || 0).toFixed(2)} km/s
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Miss Distance</span>
                        <span className="detail-value">
                          {parseFloat(selectedAsteroid.miss_distance || selectedAsteroid.miss_distance_km || 0).toLocaleString()} km
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Close Approach</span>
                        <span className="detail-value">
                          {selectedAsteroid.approach_date || selectedAsteroid.date || selectedAsteroid.close_approach_date || 'N/A'}
                        </span>
                      </div>
                      {selectedAsteroid.orbital_data && (
                        <>
                          <div className="detail-item">
                            <span className="detail-label">Orbital Eccentricity</span>
                            <span className="detail-value">
                              {parseFloat(selectedAsteroid.orbital_data.eccentricity || 0).toFixed(3)}
                            </span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Orbital Inclination</span>
                            <span className="detail-value">
                              {parseFloat(selectedAsteroid.orbital_data.inclination || 0).toFixed(1)}°
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                    {selectedAsteroid.orbital_data && (
                      <div className="orbital-notice">
                        🛸 <strong>Real Orbital Data Available:</strong> 3D view will show actual orbital path
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="section-card">
                <div className="section-header">
                  <span className="section-icon">🎯</span>
                  <h3>Manual Parameters</h3>
                  <span className="section-subtitle">
                    {selectedAsteroid ? `Using ${selectedAsteroid.name} Data` : 'Custom Simulation'}
                  </span>
                </div>

                <div className="parameters-grid">
                  <div className="parameter-card">
                    <div className="parameter-header">
                      <label>Diameter</label>
                      <span className="parameter-value">{parameters.diameter} m</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="5000"
                      step="10"
                      value={parameters.diameter}
                      onChange={(e) => handleParameterChange('diameter', e.target.value)}
                      disabled={!!selectedAsteroid}
                      className="modern-slider"
                    />
                    <div className="parameter-help">
                      {selectedAsteroid ? '🔒 Using NASA measured data' : '10m (small) to 1000m (city-killer)'}
                    </div>
                  </div>

                  <div className="parameter-card">
                    <div className="parameter-header">
                      <label>Velocity</label>
                      <span className="parameter-value">{parameters.velocity} km/s</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="30"
                      step="0.5"
                      value={parameters.velocity}
                      onChange={(e) => handleParameterChange('velocity', e.target.value)}
                      disabled={!!selectedAsteroid}
                      className="modern-slider"
                    />
                    <div className="parameter-help">
                      {selectedAsteroid ? '🔒 Using NASA orbital data' : 'Earth impact: 11-30 km/s'}
                    </div>
                  </div>

                  <div className="parameter-card">
                    <div className="parameter-header">
                      <label>Density</label>
                      <span className="parameter-value">{parameters.density} kg/m³</span>
                    </div>
                    <input
                      type="range"
                      min="1000"
                      max="8000"
                      step="100"
                      value={parameters.density}
                      onChange={(e) => handleParameterChange('density', e.target.value)}
                      disabled={!!selectedAsteroid}
                      className="modern-slider"
                    />
                    <div className="parameter-help">
                      {selectedAsteroid ? '🔒 Assumed rocky composition' : 'Ice: 1000, Rock: 3000, Iron: 8000 kg/m³'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="action-section">
                <div className="instructions-card">
                  <h4>🎯 Simulation Protocol</h4>
                  <ol>
                    <li><strong>Select</strong> NASA-tracked asteroid with orbital data</li>
                    <li><strong>Click</strong> on the {viewMode === '3d' ? '3D globe' : '2D map'} for impact location</li>
                    <li><strong>Execute</strong> to see real orbital path and impact simulation</li>
                  </ol>
                  {selectedAsteroid?.orbital_data && (
                    <div className="orbital-notice">
                      🛸 <strong>Real Orbital Data Available:</strong> 3D view will show actual orbital path
                    </div>
                  )}
                </div>

                <button 
                  className={`simulate-button ${isSimulateDisabled ? 'disabled' : ''}`}
                  onClick={runSimulation}
                  disabled={isSimulateDisabled}
                >
                  <span className="button-icon">💥</span>
                  <span className="button-text">
                    {loading ? 'Simulating Orbital Impact...' : 'Simulate Orbital Impact'}
                  </span>
                  <span className="button-badge">
                    {!selectedAsteroid && !impactLocation && 'Select Location'}
                  </span>
                </button>

                {impactLocation && !selectedAsteroid && (
                  <div className="status-card success">
                    <div className="status-icon">📍</div>
                    <div className="status-content">
                      <h5>Impact Coordinates Set</h5>
                      <p>Latitude: {impactLocation.lat.toFixed(4)}° | Longitude: {impactLocation.lon.toFixed(4)}°</p>
                    </div>
                  </div>
                )}

                {selectedAsteroid && (
                  <div className="status-card nasa">
                    <div className="status-icon">🛰️</div>
                    <div className="status-content">
                      <h5>NASA Asteroid Selected</h5>
                      <p>Using {selectedAsteroid.orbital_data ? 'real orbital data' : 'tracking data'} for {selectedAsteroid.name}</p>
                      {selectedAsteroid.orbital_data && (
                        <div className="orbital-badge">
                          🛸 Real Orbital Path Available
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {asteroidTrajectory && (
                  <div className="status-card info">
                    <div className="status-icon">🛸</div>
                    <div className="status-content">
                      <h5>Orbital Path Generated</h5>
                      <p>{asteroidTrajectory.points?.length || 0} trajectory points calculated</p>
                      {asteroidTrajectory.type === 'orbital' && (
                        <div className="trajectory-type">Real Orbital Mechanics</div>
                      )}
                    </div>
                  </div>
                )}

                {error && (
                  <div className="status-card error">
                    <div className="status-icon">⚠️</div>
                    <div className="status-content">
                      <h5>Simulation Alert</h5>
                      <p>{error}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'results' && simulationResult && (
            <div className="tab-content">
              <div className="results-header">
                <h3>Impact Analysis Report</h3>
                <button className="reset-button" onClick={resetSimulation}>
                  <span>🔄</span>
                  New Simulation
                </button>
              </div>

              {simulationResult.source && (
                <div className="data-source-card">
                  <span className="source-badge">
                    📡 {simulationResult.source === 'NASA' ? 'NASA NEO API' : 'User Input'}
                  </span>
                  {simulationResult.asteroid && (
                    <span className="asteroid-name">{simulationResult.asteroid.name}</span>
                  )}
                </div>
              )}

              {simulationResult.comparisons && (
                <div className="severity-scale">
                  <div className={`severity-card ${simulationResult.comparisons.risk_level?.toLowerCase()}`}>
                    <div className="severity-header">
                      <h4>🚨 IMPACT SEVERITY ASSESSMENT</h4>
                      <span className="risk-level">{simulationResult.comparisons.risk_level} RISK</span>
                    </div>
                    <div className="severity-content">
                      <div className="severity-level">{simulationResult.comparisons.severity_level}</div>
                      <div className="severity-description">
                        {simulationResult.comparisons.description}
                      </div>
                      <div className="energy-comparison">
                        💣 Equivalent to <strong>{formatNumber(simulationResult.comparisons.hiroshima_bombs)} Hiroshima bombs</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="results-dashboard">
                <h4>Impact Metrics</h4>
                <div className="metrics-grid">
                  {simulationResult.simulation ? (
                    <>
                      <div className="metric-card primary">
                        <div className="metric-icon">💥</div>
                        <div className="metric-content">
                          <div className="metric-value">{formatNumber(simulationResult.simulation.energy_megatons)}</div>
                          <div className="metric-label">Megatons TNT</div>
                          <div className="metric-subtitle">Kinetic Energy</div>
                        </div>
                      </div>
                      <div className="metric-card">
                        <div className="metric-icon">🕳️</div>
                        <div className="metric-content">
                          <div className="metric-value">{simulationResult.simulation.crater_diameter_km?.toFixed(2)}</div>
                          <div className="metric-label">Kilometers</div>
                          <div className="metric-subtitle">Crater Diameter</div>
                        </div>
                      </div>
                      <div className="metric-card">
                        <div className="metric-icon">🌋</div>
                        <div className="metric-content">
                          <div className="metric-value">M{simulationResult.simulation.seismic_magnitude}</div>
                          <div className="metric-label">Magnitude</div>
                          <div className="metric-subtitle">Seismic Event</div>
                        </div>
                      </div>
                      <div className="metric-card">
                        <div className="metric-icon">⛰️</div>
                        <div className="metric-content">
                          <div className="metric-value">{simulationResult.simulation.crater_depth_km?.toFixed(2)}</div>
                          <div className="metric-label">Kilometers</div>
                          <div className="metric-subtitle">Crater Depth</div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="metric-card primary">
                        <div className="metric-icon">💥</div>
                        <div className="metric-content">
                          <div className="metric-value">{formatNumber(simulationResult.kinetic_energy_megatons)}</div>
                          <div className="metric-label">Megatons TNT</div>
                          <div className="metric-subtitle">Kinetic Energy</div>
                        </div>
                      </div>
                      <div className="metric-card">
                        <div className="metric-icon">🕳️</div>
                        <div className="metric-content">
                          <div className="metric-value">{simulationResult.crater_diameter_km?.toFixed(2)}</div>
                          <div className="metric-label">Kilometers</div>
                          <div className="metric-subtitle">Crater Diameter</div>
                        </div>
                      </div>
                      <div className="metric-card">
                        <div className="metric-icon">🌋</div>
                        <div className="metric-content">
                          <div className="metric-value">M{simulationResult.seismic_magnitude}</div>
                          <div className="metric-label">Magnitude</div>
                          <div className="metric-subtitle">Seismic Event</div>
                        </div>
                      </div>
                      <div className="metric-card">
                        <div className="metric-icon">⛰️</div>
                        <div className="metric-content">
                          <div className="metric-value">{simulationResult.crater_depth_km?.toFixed(2)}</div>
                          <div className="metric-label">Kilometers</div>
                          <div className="metric-subtitle">Crater Depth</div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {(simulationResult.comparisons || simulationResult.simulation?.comparisons) && (
                <div className="comparisons-section">
                  <h4>💥 Energy Equivalents</h4>
                  <div className="comparisons-grid">
                    <div className="comparison-item">
                      <span className="comparison-icon">💣</span>
                      <div className="comparison-content">
                        <span className="comparison-label">Hiroshima Bombs</span>
                        <span className="comparison-value">
                          {formatNumber(
                            simulationResult.comparisons?.hiroshima_bombs || 
                            simulationResult.simulation?.comparisons?.hiroshima_bombs
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="comparison-item">
                      <span className="comparison-icon">☢️</span>
                      <div className="comparison-content">
                        <span className="comparison-label">Megaton Bombs</span>
                        <span className="comparison-value">
                          {formatNumber(
                            simulationResult.comparisons?.megaton_bombs || 
                            simulationResult.simulation?.comparisons?.megaton_bombs
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="comparison-item">
                      <span className="comparison-icon">🌋</span>
                      <div className="comparison-content">
                        <span className="comparison-label">Krakatoa Eruptions</span>
                        <span className="comparison-value">
                          {(
                            simulationResult.comparisons?.krakatoa_eruptions || 
                            simulationResult.simulation?.comparisons?.krakatoa_eruptions || 0
                          )?.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <MitigationPanel
                parameters={parameters}
                impactLocation={impactLocation}
                onDeflectionCalculated={setSimulationResult}
              />
            </div>
          )}
        </div>

        <div className="visualization-panel">
          <div className="visualization-header">
            <h3>
              {viewMode === '3d' ? '3D Orbital Impact Visualization' : '2D Impact Map'}
            </h3>
            <div className="map-controls">
              <span className="control-info">
                {viewMode === '3d' ? 'Click globe for impact • Real orbital paths shown' : 'Click map for impact location'}
              </span>
              <div className="impact-legend">
                <div className="legend-item">
                  <div className="legend-color impact-marker"></div>
                  <span>Impact Point</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color trajectory"></div>
                  <span>Orbital Path</span>
                </div>
                {simulationResult && (
                  <div className="legend-item">
                    <div className="legend-color crater-zone"></div>
                    <span>Crater Zone</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {viewMode === '3d' ? (
            <Globe3D
              impactLocation={impactLocation}
              simulationResult={simulationResult}
              asteroidTrajectory={asteroidTrajectory}
              onGlobeClick={handleGlobeClick}
            />
          ) : (
            <ImpactMap
              impactLocation={impactLocation}
              craterRadius={simulationResult?.crater_radius_km || simulationResult?.simulation?.crater_radius_km}
              onMapClick={handleMapClick}
              impactZones={simulationResult?.impact_zones || simulationResult?.simulation?.impact_zones}
            />
          )} 
        </div>
      </div>
    </div>
  );
};

export default App;