// frontend/src/components/Globe3D.jsx
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Globe3D = ({ impactLocation, simulationResult, asteroidTrajectory, onGlobeClick, quality = 'high' }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const earthMeshRef = useRef(null);
  const impactMarkerRef = useRef(null);
  const trajectoryRef = useRef(null);
  const craterRef = useRef(null);
  const asteroidRef = useRef(null);
  const animationRef = useRef(null);
  const glowIntervalRef = useRef(null);
  const isInitializedRef = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const [textureLoadError, setTextureLoadError] = useState(false);
  const [initializationError, setInitializationError] = useState(null);

  // Add quality-based texture settings
  const textureSettings = {
    high: {
      resolution: 2048,
      cloudOpacity: 0.3,
      atmosphereQuality: 1.0,
      terrainDetail: true,
      geometrySegments: 64
    },
    medium: {
      resolution: 1024,
      cloudOpacity: 0.2,
      atmosphereQuality: 0.7,
      terrainDetail: false,
      geometrySegments: 32
    },
    low: {
      resolution: 512,
      cloudOpacity: 0.1,
      atmosphereQuality: 0.5,
      terrainDetail: false,
      geometrySegments: 16
    }
  };

  const settings = textureSettings[quality];

  // Enhanced error boundary and cleanup
  useEffect(() => {
    return () => {
      console.log('🧹 Cleaning up 3D Globe...');
      isInitializedRef.current = false;
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      if (glowIntervalRef.current) {
        clearInterval(glowIntervalRef.current);
      }
      
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current.forceContextLoss();
        if (mountRef.current && rendererRef.current.domElement) {
          mountRef.current.removeChild(rendererRef.current.domElement);
        }
      }
      
      // Clear all refs
      sceneRef.current = null;
      rendererRef.current = null;
      cameraRef.current = null;
      controlsRef.current = null;
      earthMeshRef.current = null;
      impactMarkerRef.current = null;
      trajectoryRef.current = null;
      craterRef.current = null;
      asteroidRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mountRef.current || isInitializedRef.current) return;
    
    console.log('🌍 Initializing 3D Globe...');
    setIsLoading(true);
    setInitializationError(null);
    isInitializedRef.current = true;

    try {
      // Initialize Three.js scene
      const scene = new THREE.Scene();
      sceneRef.current = scene;
      scene.background = new THREE.Color(0x000011);

      // Professional camera setup
      const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 2000);
      camera.position.set(0, 0, 3);
      cameraRef.current = camera;

      // Quality-based renderer configuration
      const rendererConfig = {
        antialias: quality !== 'low',
        alpha: true,
        powerPreference: quality === 'low' ? "default" : "high-performance",
        preserveDrawingBuffer: true
      };

      const renderer = new THREE.WebGLRenderer(rendererConfig);
      
      // Ensure container has proper size
      const containerWidth = mountRef.current.clientWidth || 800;
      const containerHeight = mountRef.current.clientHeight || 600;
      
      renderer.setSize(containerWidth, containerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, quality === 'high' ? 2 : 1));
      renderer.shadowMap.enabled = quality !== 'low';
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      mountRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // Enhanced orbit controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.rotateSpeed = 0.8;
      controls.zoomSpeed = 1.2;
      controls.panSpeed = 0.8;
      controls.minDistance = 1.5;
      controls.maxDistance = 10;
      controls.enablePan = true;
      controlsRef.current = controls;

      // Professional lighting setup
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(5, 3, 5);
      directionalLight.castShadow = quality !== 'low';
      if (quality !== 'low') {
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 500;
      }
      scene.add(directionalLight);

      // Create Earth with quality-based settings
      const createEarth = () => {
        return new Promise((resolve, reject) => {
          const geometry = new THREE.SphereGeometry(1, settings.geometrySegments, settings.geometrySegments);
          const textureLoader = new THREE.TextureLoader();
          
          // Use quality-based texture sources
          const getTextureSources = () => {
            const baseSources = [
              '/textures/earth_atmos_2048.jpg',
              '/textures/land_ocean_ice_cloud_2048.jpg',
              'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/earth_atmos_2048.jpg',
              'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg'
            ];

            // For lower quality, try smaller textures first
            if (quality === 'low') {
              return [
                '/textures/earth_atmos_512.jpg',
                '/textures/land_ocean_ice_cloud_512.jpg',
                ...baseSources
              ];
            } else if (quality === 'medium') {
              return [
                '/textures/earth_atmos_1024.jpg',
                '/textures/land_ocean_ice_cloud_1024.jpg',
                ...baseSources
              ];
            }
            return baseSources;
          };

          const textureSources = getTextureSources();
          let attempts = 0;

          const tryLoadTexture = (index = 0) => {
            if (index >= textureSources.length) {
              console.warn('⚠️ All texture sources failed, using procedural material');
              setTextureLoadError(true);
              createProceduralEarth();
              resolve();
              return;
            }

            const src = textureSources[index];
            attempts++;
            
            console.log(`🔄 Loading texture attempt ${attempts}: ${src}`);
            
            textureLoader.load(
              src,
              (texture) => {
                console.log('✅ Earth texture loaded from:', src);
                setTextureLoadError(false);
                
                texture.colorSpace = THREE.SRGBColorSpace;
                
                // Enhanced material with quality-based settings
                const materialProps = {
                  map: texture,
                  specular: new THREE.Color(0x333333),
                  shininess: quality === 'high' ? 15 : 10,
                  transparent: false
                };

                // Add terrain detail for high quality
                if (quality === 'high' && settings.terrainDetail) {
                  // Note: You would need to load additional maps for these features
                  materialProps.specularMap = texture;
                  materialProps.bumpScale = 0.05;
                }

                const material = new THREE.MeshPhongMaterial(materialProps);

                const earth = new THREE.Mesh(geometry, material);
                earth.castShadow = quality !== 'low';
                earth.receiveShadow = quality !== 'low';
                earth.name = 'earth';
                scene.add(earth);
                earthMeshRef.current = earth;
                
                resolve();
              },
              (progress) => {
                if (progress.lengthComputable && quality === 'high') {
                  console.log(`📦 Loading progress: ${(progress.loaded / progress.total * 100).toFixed(1)}%`);
                }
              },
              (err) => {
                console.warn(`❌ Failed to load texture from: ${src}`, err);
                // Try next texture source
                tryLoadTexture(index + 1);
              }
            );
          };

          const createProceduralEarth = () => {
            const material = new THREE.MeshPhongMaterial({
              color: 0x1E90FF,
              specular: 0x111111,
              shininess: 10,
              transparent: false
            });

            const earth = new THREE.Mesh(geometry, material);
            earth.castShadow = quality !== 'low';
            earth.receiveShadow = quality !== 'low';
            earth.name = 'earth-procedural';
            scene.add(earth);
            earthMeshRef.current = earth;
          };

          // Start loading textures with timeout
          tryLoadTexture();
        });
      };

      // Add atmospheric glow with quality settings
      const addAtmosphere = () => {
        const atmosphereGeometry = new THREE.SphereGeometry(1.02, 32, 32);
        const atmosphereMaterial = new THREE.MeshPhongMaterial({
          color: 0x88ccff,
          transparent: true,
          opacity: 0.1 * settings.atmosphereQuality,
          side: THREE.BackSide
        });
        const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        atmosphere.name = 'atmosphere';
        scene.add(atmosphere);

        // Add cloud layer for high quality
        if (quality === 'high' && settings.cloudOpacity > 0) {
          const cloudGeometry = new THREE.SphereGeometry(1.01, 32, 32);
          const cloudMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: settings.cloudOpacity,
            side: THREE.DoubleSide
          });
          const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
          clouds.name = 'clouds';
          scene.add(clouds);
        }
      };

      // Optimized starfield with quality-based density
      const addStars = () => {
        const starGeometry = new THREE.BufferGeometry();
        const starMaterial = new THREE.PointsMaterial({
          color: 0xFFFFFF,
          size: quality === 'high' ? 0.02 : 0.015,
          sizeAttenuation: true
        });

        const starCount = quality === 'high' ? 1000 : quality === 'medium' ? 500 : 200;
        const starVertices = [];
        
        for (let i = 0; i < starCount; i++) {
          const radius = 100 + Math.random() * 900;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          
          const x = radius * Math.sin(phi) * Math.cos(theta);
          const y = radius * Math.sin(phi) * Math.sin(theta);
          const z = radius * Math.cos(phi);
          
          starVertices.push(x, y, z);
        }

        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        const stars = new THREE.Points(starGeometry, starMaterial);
        stars.name = 'stars';
        scene.add(stars);
      };

      // Enhanced globe click detection
      const handleClick = (event) => {
        if (!earthMeshRef.current || !camera || !renderer) return;

        const mouse = new THREE.Vector2();
        const rect = renderer.domElement.getBoundingClientRect();
        
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObject(earthMeshRef.current);
        
        if (intersects.length > 0) {
          const point = intersects[0].point;
          point.normalize();
          
          // Convert 3D point to latitude/longitude
          const lat = Math.asin(point.y) * (180 / Math.PI);
          const lon = Math.atan2(point.z, point.x) * (180 / Math.PI);
          
          console.log(`📍 Globe clicked: Lat ${lat.toFixed(2)}, Lon ${lon.toFixed(2)}`);
          
          if (onGlobeClick) {
            onGlobeClick(lat, lon);
          }
        }
      };

      // Initialize scene
      const initializeScene = async () => {
        try {
          await createEarth();
          addAtmosphere();
          addStars();
          
          renderer.domElement.addEventListener('click', handleClick);
          renderer.domElement.style.cursor = 'pointer';
          
          console.log(`✅ 3D Globe initialized successfully (Quality: ${quality})`);
          setIsLoading(false);
        } catch (error) {
          console.error('❌ Error initializing globe:', error);
          setInitializationError(error.message);
          setIsLoading(false);
        }
      };

      initializeScene();

      // Enhanced animation loop
      const animate = () => {
        if (!isInitializedRef.current) return;
        
        animationRef.current = requestAnimationFrame(animate);
        
        try {
          if (earthMeshRef.current) {
            earthMeshRef.current.rotation.y += quality === 'high' ? 0.0005 : 0.0003;
          }

          // Update asteroid animation
          if (asteroidRef.current && asteroidRef.current.userData.animation) {
            asteroidRef.current.userData.animation();
          }

          if (controlsRef.current) {
            controlsRef.current.update();
          }
          
          // Render the scene
          if (renderer && scene && camera) {
            renderer.render(scene, camera);
          }
        } catch (error) {
          console.error('❌ Animation error:', error);
        }
      };

      // Start animation loop
      animate();

      // Professional resize handler
      const handleResize = () => {
        if (!mountRef.current || !camera || !renderer) return;
        
        try {
          const width = mountRef.current.clientWidth;
          const height = mountRef.current.clientHeight;
          
          if (width > 0 && height > 0) {
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
          }
        } catch (error) {
          console.error('❌ Resize error:', error);
        }
      };

      // Initial resize
      handleResize();
      window.addEventListener('resize', handleResize);

    } catch (error) {
      console.error('❌ Fatal error during globe initialization:', error);
      setInitializationError(error.message);
      setIsLoading(false);
      isInitializedRef.current = false;
    }
  }, [onGlobeClick, quality]);

  // Professional impact marker update
  useEffect(() => {
    if (!sceneRef.current || !impactLocation || !isInitializedRef.current) return;

    console.log('📍 Updating impact marker...');

    // Remove existing impact marker
    if (impactMarkerRef.current) {
      sceneRef.current.remove(impactMarkerRef.current);
      impactMarkerRef.current = null;
    }

    // Clear any existing glow intervals
    if (glowIntervalRef.current) {
      clearInterval(glowIntervalRef.current);
      glowIntervalRef.current = null;
    }

    try {
      // Convert lat/lon to 3D position
      const lat = impactLocation.lat * Math.PI / 180;
      const lon = impactLocation.lon * Math.PI / 180;
      const radius = 1.02;

      const x = radius * Math.cos(lat) * Math.cos(lon);
      const y = radius * Math.sin(lat);
      const z = radius * Math.cos(lat) * Math.sin(lon);

      // Create professional impact marker
      const markerGeometry = new THREE.SphereGeometry(0.015, quality === 'high' ? 8 : 6, quality === 'high' ? 8 : 6);
      const markerMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xff0000,
        emissive: 0xff4444,
        emissiveIntensity: 0.8
      });
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.set(x, y, z);
      marker.name = 'impact-marker';
      sceneRef.current.add(marker);
      impactMarkerRef.current = marker;

      // Enhanced glow effect with animation (only for medium/high quality)
      if (quality !== 'low') {
        const createGlowEffect = () => {
          if (!sceneRef.current) return;
          
          const glowGeometry = new THREE.SphereGeometry(0.02, 6, 6);
          const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            transparent: true,
            opacity: 0.4
          });
          const glow = new THREE.Mesh(glowGeometry, glowMaterial);
          glow.position.set(x, y, z);
          glow.name = 'impact-glow';
          sceneRef.current.add(glow);

          let scale = 1;
          const animateGlow = () => {
            if (scale < 1.5 && glow.parent) {
              scale += 0.02;
              glow.scale.set(scale, scale, scale);
              glow.material.opacity -= 0.01;
              requestAnimationFrame(animateGlow);
            } else if (glow.parent) {
              sceneRef.current.remove(glow);
            }
          };
          animateGlow();
        };

        createGlowEffect();
        // Repeat glow effect (less frequent for lower quality)
        const glowInterval = quality === 'high' ? 1000 : 1500;
        glowIntervalRef.current = setInterval(createGlowEffect, glowInterval);
      }

    } catch (error) {
      console.error('❌ Error creating impact marker:', error);
    }

    return () => {
      if (glowIntervalRef.current) {
        clearInterval(glowIntervalRef.current);
        glowIntervalRef.current = null;
      }
    };
  }, [impactLocation, quality]);

  // Enhanced crater visualization
  useEffect(() => {
    if (!sceneRef.current || !simulationResult || !impactLocation || !isInitializedRef.current) return;

    console.log('💥 Updating crater visualization...');

    // Remove existing crater
    if (craterRef.current) {
      sceneRef.current.remove(craterRef.current);
      craterRef.current = null;
    }

    try {
      const craterRadius = simulationResult.crater_radius_km || 
                          simulationResult.simulation?.crater_radius_km || 0.1;
      
      // Scale crater radius for visualization
      const visualRadius = Math.min(craterRadius * 0.008, 0.3);

      const lat = impactLocation.lat * Math.PI / 180;
      const lon = impactLocation.lon * Math.PI / 180;

      // Create professional crater geometry with quality-based segments
      const segments = quality === 'high' ? 16 : quality === 'medium' ? 12 : 8;
      const craterGeometry = new THREE.RingGeometry(visualRadius * 0.6, visualRadius, segments);
      const craterMaterial = new THREE.MeshBasicMaterial({
        color: 0xff4444,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: quality === 'high' ? 0.7 : 0.5
      });
      const crater = new THREE.Mesh(craterGeometry, craterMaterial);
      crater.name = 'crater';
      
      // Position crater on Earth surface
      crater.position.set(
        Math.cos(lat) * Math.cos(lon),
        Math.sin(lat),
        Math.cos(lat) * Math.sin(lon)
      );
      
      // Orient crater properly
      crater.lookAt(0, 0, 0);
      crater.rotateX(Math.PI / 2);
      
      sceneRef.current.add(crater);
      craterRef.current = crater;

    } catch (error) {
      console.error('❌ Error creating crater:', error);
    }
  }, [simulationResult, impactLocation, quality]);

  // Professional asteroid trajectory visualization
  useEffect(() => {
    if (!sceneRef.current || !asteroidTrajectory || !isInitializedRef.current) return;

    console.log('🛰️ Updating asteroid trajectory...');

    // Remove existing trajectory and asteroid
    if (trajectoryRef.current) {
      sceneRef.current.remove(trajectoryRef.current);
      trajectoryRef.current = null;
    }
    if (asteroidRef.current) {
      sceneRef.current.remove(asteroidRef.current);
      asteroidRef.current = null;
    }

    try {
      // Create trajectory line
      const points = [];
      const trajectoryPoints = asteroidTrajectory.points || [];
      
      trajectoryPoints.forEach(point => {
        const lat = (point.lat || 0) * Math.PI / 180;
        const lon = (point.lon || 0) * Math.PI / 180;
        const alt = (point.alt || 0) / 800; // Scale altitude
        const radius = 1 + alt;

        points.push(
          new THREE.Vector3(
            radius * Math.cos(lat) * Math.cos(lon),
            radius * Math.sin(lat),
            radius * Math.cos(lat) * Math.sin(lon)
          )
        );
      });

      if (points.length > 1) {
        const trajectoryGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const trajectoryMaterial = new THREE.LineBasicMaterial({ 
          color: 0xffff00,
          linewidth: quality === 'high' ? 2 : 1,
          transparent: true,
          opacity: quality === 'high' ? 0.8 : 0.6
        });
        const trajectory = new THREE.Line(trajectoryGeometry, trajectoryMaterial);
        trajectory.name = 'asteroid-trajectory';
        sceneRef.current.add(trajectory);
        trajectoryRef.current = trajectory;

        // Create professional asteroid with quality-based detail
        const asteroidSize = Math.min((asteroidTrajectory.diameter || 100) * 0.001, 0.05);
        const asteroidSegments = quality === 'high' ? 8 : quality === 'medium' ? 6 : 4;
        const asteroidGeometry = new THREE.SphereGeometry(asteroidSize, asteroidSegments, asteroidSegments);
        const asteroidMaterial = new THREE.MeshPhongMaterial({ 
          color: 0xffaa00,
          emissive: 0xff6600,
          emissiveIntensity: quality === 'high' ? 0.5 : 0.3
        });
        const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
        asteroid.name = 'asteroid';
        
        // Start asteroid at beginning of trajectory
        if (points.length > 0) {
          asteroid.position.copy(points[0]);
        }
        
        // Animate asteroid along trajectory
        let progress = 0;
        const totalPoints = points.length;
        
        asteroid.userData.animation = () => {
          if (progress < totalPoints - 1) {
            const currentIndex = Math.floor(progress);
            const nextIndex = currentIndex + 1;
            const localProgress = progress - currentIndex;
            
            if (points[currentIndex] && points[nextIndex]) {
              asteroid.position.lerpVectors(
                points[currentIndex],
                points[nextIndex],
                localProgress
              );
            }
            progress += 0.02 * ((asteroidTrajectory.velocity || 20) / 20);
          } else {
            asteroid.visible = false;
            asteroid.userData.animation = null;
          }
        };

        sceneRef.current.add(asteroid);
        asteroidRef.current = asteroid;
      }

    } catch (error) {
      console.error('❌ Error creating asteroid trajectory:', error);
    }
  }, [asteroidTrajectory, quality]);

  return (
    <div 
      ref={mountRef} 
      className="globe-container"
      style={{ 
        width: '100%', 
        height: '100%', 
        position: 'relative',
        background: 'linear-gradient(135deg, #000428 0%, #004e92 100%)',
        minHeight: '500px',
        borderRadius: '10px',
        overflow: 'hidden'
      }}
    >
      {/* Quality Indicator */}
      <div style={{ 
        position: 'absolute', 
        top: '10px', 
        right: '10px',
        background: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '4px 8px',
        borderRadius: '5px',
        fontSize: '10px',
        zIndex: 50,
        backdropFilter: 'blur(10px)'
      }}>
        Quality: {quality.toUpperCase()}
      </div>

      {/* Impact Location Display */}
      {impactLocation && (
        <div style={{ 
          position: 'absolute', 
          top: '10px', 
          left: '10px',
          background: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '5px',
          fontSize: '12px',
          zIndex: 50,
          backdropFilter: 'blur(10px)'
        }}>
          📍 Lat: {impactLocation.lat.toFixed(4)}, Lon: {impactLocation.lon.toFixed(4)}
        </div>
      )}

      {isLoading && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100%',
          color: 'white',
          fontSize: '16px',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10,
          background: 'linear-gradient(135deg, #000428 0%, #004e92 100%)',
          flexDirection: 'column',
          gap: '15px'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid rgba(255,255,255,0.3)',
            borderTop: '4px solid #00f2fe',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <span>Initializing 3D Globe...</span>
          <span style={{ fontSize: '12px', opacity: 0.7 }}>This may take a few seconds</span>
        </div>
      )}
      
      {initializationError && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          zIndex: 100,
          textAlign: 'center',
          padding: '20px',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{ fontSize: '24px' }}>⚠️</div>
          <div style={{ fontWeight: 'bold' }}>Failed to initialize 3D Globe</div>
          <div style={{ fontSize: '14px', opacity: 0.8 }}>{initializationError}</div>
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: '15px',
              padding: '8px 16px',
              background: '#00f2fe',
              border: 'none',
              borderRadius: '5px',
              color: 'black',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Retry
          </button>
        </div>
      )}
      
      {textureLoadError && !initializationError && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'rgba(255,165,0,0.9)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '5px',
          fontSize: '12px',
          zIndex: 50,
          maxWidth: '200px'
        }}>
          ⚠️ Using procedural Earth (textures unavailable)
        </div>
      )}
    </div>
  );
};

// Add CSS animation
if (!document.getElementById('globe-styles')) {
  const styles = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .globe-container canvas {
      border-radius: 10px;
    }
  `;
  const styleSheet = document.createElement("style");
  styleSheet.id = 'globe-styles';
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export default Globe3D;