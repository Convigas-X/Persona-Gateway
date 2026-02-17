import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Custom shader for the Rift effect
const riftVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const riftFragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  
  varying vec2 vUv;
  varying vec3 vPosition;
  
  // Noise function
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  
  void main() {
    vec2 uv = vUv;
    float time = uTime * 0.3;
    
    // Mouse influence on the rift center
    float mouseInfluence = (uMouse.x - 0.5) * 0.1;
    float centerX = 0.5 + mouseInfluence;
    
    // Create the rift line with noise
    float noise1 = snoise(vec2(uv.y * 3.0, time)) * 0.03;
    float noise2 = snoise(vec2(uv.y * 8.0, time * 1.5)) * 0.015;
    float noise3 = snoise(vec2(uv.y * 15.0, time * 2.0)) * 0.008;
    
    float riftLine = centerX + noise1 + noise2 + noise3;
    
    // Distance from rift
    float dist = abs(uv.x - riftLine);
    
    // Colors
    vec3 architectColor = vec3(0.039, 0.098, 0.184); // #0A192F
    vec3 architectGlow = vec3(0.392, 1.0, 0.855);    // #64FFDA
    vec3 operatorColor = vec3(0.02, 0.02, 0.02);     // #050505
    vec3 operatorGlow = vec3(1.0, 0.0, 0.235);       // #FF003C
    
    // Base color selection
    vec3 color = mix(architectColor, operatorColor, step(riftLine, uv.x));
    
    // Add glow near the rift
    float glowStrength = smoothstep(0.15, 0.0, dist);
    vec3 glowColor = mix(architectGlow, operatorGlow, step(riftLine, uv.x));
    color += glowColor * glowStrength * 0.4;
    
    // Add energy particles along the rift
    float particleNoise = snoise(vec2(uv.y * 20.0, time * 3.0));
    float particles = smoothstep(0.7, 1.0, particleNoise) * glowStrength;
    color += glowColor * particles * 0.6;
    
    // Add subtle background gradient
    float gradient = sin(uv.y * 3.14159) * 0.05;
    color += vec3(gradient * 0.1);
    
    // Vignette
    float vignette = 1.0 - length((uv - 0.5) * 1.2);
    vignette = smoothstep(0.0, 0.7, vignette);
    color *= vignette;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

function RiftMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport, size } = useThree();
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const timeRef = useRef(0);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
    }),
    [size]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: 1 - e.clientY / window.innerHeight,
      };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((_, delta) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      // Accumulate time independently to ensure animation never stops
      timeRef.current += delta;
      material.uniforms.uTime.value = timeRef.current;
      
      // Smooth mouse following
      const targetX = mouseRef.current.x;
      const currentX = material.uniforms.uMouse.value.x;
      material.uniforms.uMouse.value.x += (targetX - currentX) * 0.05;
      material.uniforms.uMouse.value.y = mouseRef.current.y;
    }
  });

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        vertexShader={riftVertexShader}
        fragmentShader={riftFragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function RiftBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75 }}
        dpr={Math.min(window.devicePixelRatio, 1.5)}
        gl={{ antialias: false, alpha: false }}
      >
        <RiftMesh />
      </Canvas>
    </div>
  );
}
