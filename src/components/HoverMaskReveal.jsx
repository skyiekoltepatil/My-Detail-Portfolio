import{jsx as _jsx,jsxs as _jsxs}from"react/jsx-runtime";import{useRef,useEffect,useState,useCallback}from"react";import { Scene, PerspectiveCamera, WebGLRenderer, PlaneGeometry, Mesh, ShaderMaterial, Vector2, LinearFilter, Clock, TextureLoader } from "three";import { WebGLRenderTarget, OrthographicCamera, HalfFloatType, RGBAFormat } from "three";const RenderTarget = { current: () => false, canvas: "canvas" };
const addPropertyControls = () => {};
const ControlType = {};const ComponentMessage = ({title, description}) => <div>{title} - {description}</div>;/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 * @framerIntrinsicWidth 300
 * @framerIntrinsicHeight 400
 * @framerDisableUnlink
 */export default function LiquidMask(props){const{imageBase,imageHover,borderRadius=0,radius=100,blur=.5,circleBoost=.6,texture=.7,timeSpeed=5,splatRadius=.08,velocityDissipation=.99,shrinkTimeSeconds=2.4,curl=30,pressureIterations=25,parallax=true,parallaxAmount=100,parallaxSmoothing=0,preview=true}=props;// Check if base image is missing
const hasBaseImage=imageBase&&imageBase.src;const canvasRef=useRef(null);const imgRef=useRef(null);const containerRef=useRef(null);const uniformsRef=useRef(null);const zoomProbeRef=useRef(null);// Track last known size/zoom for Canvas resize detection
const lastSizeRef=useRef({width:0,height:0,zoom:0});// Hide blob while Canvas resize is in progress; show again after debounced remount
const hideBlobForResizeRef=useRef(false);// When this changes in Canvas, the WebGL effect fully remounts (clean init at new size = centered blob, correct aspect)
const[canvasRemountKey,setCanvasRemountKey]=useState(0);// Detect mobile: disable effect and show base image only
const[isMobile,setIsMobile]=useState(false);useEffect(()=>{const checkMobile=()=>{const coarse=typeof window!=="undefined"&&window.matchMedia?window.matchMedia("(pointer: coarse)").matches:false;const small=typeof window!=="undefined"&&window.matchMedia?window.matchMedia("(max-width: 768px)").matches:false;setIsMobile(coarse||small);};checkMobile();window.addEventListener("resize",checkMobile);return()=>window.removeEventListener("resize",checkMobile);},[]);// Debounced prop values to prevent excessive re-renders
const[debouncedProps,setDebouncedProps]=useState({radius,blur,circleBoost,texture,timeSpeed,splatRadius,velocityDissipation,shrinkTimeSeconds,curl,pressureIterations,preview,parallax,parallaxAmount,parallaxSmoothing});// Debounce prop changes to improve performance
useEffect(()=>{const timeoutId=setTimeout(()=>{setDebouncedProps({radius,blur,circleBoost,texture,timeSpeed,splatRadius,velocityDissipation,shrinkTimeSeconds,curl,pressureIterations,preview,parallax,parallaxAmount,parallaxSmoothing});},100)// 100ms debounce
;return()=>clearTimeout(timeoutId);},[radius,blur,circleBoost,texture,timeSpeed,splatRadius,velocityDissipation,shrinkTimeSeconds,curl,pressureIterations,preview,parallax,parallaxAmount,parallaxSmoothing]);// Value mapping functions to convert normalized property values to internal shader values
const mapRadius=useCallback(normalizedRadius=>{// Map 10-1000px to 10-200px (current internal range)
return 10+(normalizedRadius-10)*(190/990);},[]);const mapBlur=useCallback(normalizedBlur=>{// Map 0-1 to 0.2-3.0 (current internal range)
return .2+normalizedBlur*2.8;},[]);const mapCircleBoost=useCallback(normalizedCircleBoost=>{// Map 0-1 to 0.5-4.0 (current internal range)
return .5+normalizedCircleBoost*3.5;},[]);const mapTimeSpeed=useCallback(normalizedTimeSpeed=>{// Map 0-10 to 0.0-1.0 for true linear mapping from static to fast
return normalizedTimeSpeed*.1;},[]);// Single texture mapping that controls the overall graininess/texture of the effect
const mapTexture=useCallback(normalizedTexture=>{// Map 0-1 texture control to appropriate noise parameters
// 0 = smooth/minimal texture, 1 = very textured/grainy
const freq=2+normalizedTexture*12// frequency range 2-14 (more dramatic)
;const strength=normalizedTexture*3// strength range 0-3 (stronger effect)
;const size=1-normalizedTexture*.7// size range 1.0-0.3 (smaller = finer grain at high texture)
;return{freq,strength,size};},[]);useEffect(()=>{if(isMobile)return;const canvas=canvasRef.current;const imgEl=imgRef.current;const container=containerRef.current;if(!canvas||!imgEl||!container)return;// Show blob when effect runs (initial mount or after debounced remount)
if(RenderTarget.current()===RenderTarget.canvas){hideBlobForResizeRef.current=false;}// Animation state variable
let isAnimating=false;// Scene setup
const scene=new Scene;const perspective=800;const renderer=new WebGLRenderer({canvas,alpha:true,antialias:true});renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));// Transparent clear so the back image (DOM) shows through; avoids darkening
renderer.setClearColor(0,0);// Use clientWidth/clientHeight for more reliable initial sizing
const initialWidth=Math.max(container.clientWidth,300)// Fallback minimum
;const initialHeight=Math.max(container.clientHeight,200)// Fallback minimum
;renderer.setSize(initialWidth,initialHeight);const computeFov=()=>{// Use clientHeight for consistent field of view calculation
return 180*(2*Math.atan(container.clientHeight/2/perspective))/Math.PI;};const camera=new PerspectiveCamera(computeFov(),initialWidth/initialHeight,1,5e3);camera.position.set(0,0,perspective);// Load front image texture for the canvas (revealed by liquid mask, no parallax)
const loader=new TextureLoader;const frontSrc=imageHover?.src||imageBase?.src||"/random-assets/blue-profile-image.png";const frontTexture=loader.load(frontSrc,()=>{// Update aspect ratio when texture loads
if(frontTexture.image){const imageAspect=frontTexture.image.width/frontTexture.image.height;uniforms.u_frontImageAspect.value=imageAspect;// Force a re-render to update the effect with new aspect ratio
if(isAnimating){renderer.render(scene,camera);}}});// Don't set colorSpace so we sample the texture as-is (sRGB passthrough)
// This avoids gamma issues when outputColorSpace is not set on the renderer
frontTexture.minFilter=LinearFilter;const textureParams=mapTexture(debouncedProps.texture);// --- Fluid simulation at full aspect ratio (not forced square) ---
// Blob circularity is achieved by using elliptical splats that compensate for aspect ratio
const simScale=.5;let simWidth=Math.max(1,Math.floor(initialWidth*simScale));let simHeight=Math.max(1,Math.floor(initialHeight*simScale));const fboOptions={type:HalfFloatType,minFilter:LinearFilter,magFilter:LinearFilter,format:RGBAFormat,generateMipmaps:false,depthBuffer:false,stencilBuffer:false};const createFluidFBO=(w,h)=>new WebGLRenderTarget(w,h,fboOptions);let velFBO0=createFluidFBO(simWidth,simHeight);let velFBO1=createFluidFBO(simWidth,simHeight);let divFBO=createFluidFBO(simWidth,simHeight);let pressureFBO0=createFluidFBO(simWidth,simHeight);let pressureFBO1=createFluidFBO(simWidth,simHeight);let densityFBO0=createFluidFBO(simWidth,simHeight);let densityFBO1=createFluidFBO(simWidth,simHeight);const disposeFluidFBOs=()=>{velFBO0.dispose();velFBO1.dispose();divFBO.dispose();pressureFBO0.dispose();pressureFBO1.dispose();densityFBO0.dispose();densityFBO1.dispose();};const resizeFluidFBOs=(w,h)=>{const newSimWidth=Math.max(1,Math.floor(w*simScale));const newSimHeight=Math.max(1,Math.floor(h*simScale));if(newSimWidth===simWidth&&newSimHeight===simHeight)return;simWidth=newSimWidth;simHeight=newSimHeight;disposeFluidFBOs();velFBO0=createFluidFBO(simWidth,simHeight);velFBO1=createFluidFBO(simWidth,simHeight);divFBO=createFluidFBO(simWidth,simHeight);pressureFBO0=createFluidFBO(simWidth,simHeight);pressureFBO1=createFluidFBO(simWidth,simHeight);densityFBO0=createFluidFBO(simWidth,simHeight);densityFBO1=createFluidFBO(simWidth,simHeight);};// Orthographic camera for full-screen quad passes (-1 to 1 NDC)
const orthoCamera=new OrthographicCamera(-1,1,1,-1,0,1);const quadGeometry=new PlaneGeometry(2,2,1,1);// Mouse velocity for splat (UV per frame)
let lastMouseUV={x:.5,y:.5};const mouseVelocity={x:0,y:0};const uniforms={u_time:{value:0},u_mouse:{value:new Vector2(.5,.5)},u_progress:{value:0},u_planeRes:{value:new Vector2(1,1)},u_radius:{value:mapRadius(debouncedProps.radius)},u_blur:{value:mapBlur(debouncedProps.blur)},u_circleBoost:{value:mapCircleBoost(debouncedProps.circleBoost)},u_noiseFreq:{value:textureParams.freq},u_noiseStrength:{value:textureParams.strength},u_noiseSize:{value:textureParams.size},u_timeSpeed:{value:mapTimeSpeed(debouncedProps.timeSpeed)},u_frontImage:{value:frontTexture},u_frontImageAspect:{value:1},u_containerAspect:{value:1},u_parallaxOffset:{value:new Vector2(0,0)},u_parallaxMax:{value:debouncedProps.parallax?Math.max(0,Math.min(200,debouncedProps.parallaxAmount??0)):0},u_windowSize:{value:new Vector2(window.innerWidth,window.innerHeight)},u_containerOffset:{value:new Vector2(0,0)},u_simResolution:{value:new Vector2(simWidth,simHeight)},u_densityTex:{value:densityFBO0.texture}};uniformsRef.current=uniforms;const vertexShader=`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;const vertexShaderQuad=`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position.xy, 0.0, 1.0);
      }
    `;// --- Fluid pass: Splat (add velocity and density at cursor)
// Splats are elliptical to compensate for container aspect ratio, making blobs appear circular
// The FBO has the same aspect ratio as the container. A circular splat in UV space
// appears as an ellipse in pixel space (stretched along the longer axis).
// To make a circular blob in PIXEL space, we compress the splat along the longer UV axis.
const splatFrag=`
      precision highp float;
      varying vec2 vUv;
      uniform vec2 u_point;
      uniform vec2 u_splatColor;
      uniform float u_radius;
      uniform float u_aspectRatio;
      uniform sampler2D u_target;
      void main() {
        vec2 p = vUv - u_point;
        // Correct for aspect ratio so blob appears circular in pixel space
        // aspectRatio = width/height
        // Wide (aspect > 1): UV-X maps to more pixels, so compress X to compensate
        // Tall (aspect < 1): UV-Y maps to more pixels, so compress Y to compensate  
        p.x *= max(u_aspectRatio, 1.0);
        p.y *= max(1.0 / u_aspectRatio, 1.0);
        float splat = exp(-dot(p, p) / (u_radius * u_radius));
        vec4 base = texture2D(u_target, vUv);
        base.xy += splat * u_splatColor;
        gl_FragColor = base;
      }
    `;const splatDensityFrag=`
      precision highp float;
      varying vec2 vUv;
      uniform vec2 u_point;
      uniform float u_radius;
      uniform float u_aspectRatio;
      uniform float u_densityAmount;
      uniform sampler2D u_target;
      void main() {
        vec2 p = vUv - u_point;
        // Correct for aspect ratio so blob appears circular in pixel space
        p.x *= max(u_aspectRatio, 1.0);
        p.y *= max(1.0 / u_aspectRatio, 1.0);
        float splat = exp(-dot(p, p) / (u_radius * u_radius));
        float base = texture2D(u_target, vUv).r;
        gl_FragColor = vec4(base + splat * u_densityAmount, 0.0, 0.0, 1.0);
      }
    `;// --- Advection (semi-Lagrangian). u_dissipationMultiply fades density each frame (1.0 for velocity).
const advectFrag=`
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D u_velocity;
      uniform sampler2D u_source;
      uniform vec2 u_texelSize;
      uniform float u_dt;
      uniform float u_dissipationMultiply;
      void main() {
        vec2 vel = texture2D(u_velocity, vUv).xy;
        vec2 pos = vUv - vel * u_texelSize * u_dt;
        gl_FragColor = texture2D(u_source, pos) * u_dissipationMultiply;
      }
    `;// --- Divergence
const divergenceFrag=`
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D u_velocity;
      uniform vec2 u_texelSize;
      void main() {
        float L = texture2D(u_velocity, vUv - vec2(u_texelSize.x, 0.0)).x;
        float R = texture2D(u_velocity, vUv + vec2(u_texelSize.x, 0.0)).x;
        float T = texture2D(u_velocity, vUv + vec2(0.0, u_texelSize.y)).y;
        float B = texture2D(u_velocity, vUv - vec2(0.0, u_texelSize.y)).y;
        float div = 0.5 * ((R - L) + (T - B));
        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }
    `;// --- Pressure (Jacobi)
const pressureFrag=`
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D u_pressure;
      uniform sampler2D u_divergence;
      uniform vec2 u_texelSize;
      void main() {
        float L = texture2D(u_pressure, vUv - vec2(u_texelSize.x, 0.0)).r;
        float R = texture2D(u_pressure, vUv + vec2(u_texelSize.x, 0.0)).r;
        float T = texture2D(u_pressure, vUv + vec2(0.0, u_texelSize.y)).r;
        float B = texture2D(u_pressure, vUv - vec2(0.0, u_texelSize.y)).r;
        float C = texture2D(u_divergence, vUv).r;
        float p = (L + R + T + B - C) * 0.25;
        gl_FragColor = vec4(p, 0.0, 0.0, 1.0);
      }
    `;// --- Curl (vorticity confinement) for swirl
const curlFrag=`
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D u_velocity;
      uniform vec2 u_texelSize;
      uniform float u_curl;
      void main() {
        float vL = texture2D(u_velocity, vUv - vec2(u_texelSize.x, 0.0)).y;
        float vR = texture2D(u_velocity, vUv + vec2(u_texelSize.x, 0.0)).y;
        float vT = texture2D(u_velocity, vUv + vec2(0.0, u_texelSize.y)).x;
        float vB = texture2D(u_velocity, vUv - vec2(0.0, u_texelSize.y)).x;
        float curl = (vR - vL) - (vT - vB);
        vec2 vel = texture2D(u_velocity, vUv).xy;
        float strength = u_curl * 0.00015;
        vel.x += strength * (vT - vB);
        vel.y += strength * (vL - vR);
        gl_FragColor = vec4(vel, 0.0, 1.0);
      }
    `;// --- Subtract pressure gradient from velocity
const gradientFrag=`
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D u_velocity;
      uniform sampler2D u_pressure;
      uniform vec2 u_texelSize;
      void main() {
        float L = texture2D(u_pressure, vUv - vec2(u_texelSize.x, 0.0)).r;
        float R = texture2D(u_pressure, vUv + vec2(u_texelSize.x, 0.0)).r;
        float T = texture2D(u_pressure, vUv + vec2(0.0, u_texelSize.y)).r;
        float B = texture2D(u_pressure, vUv - vec2(0.0, u_texelSize.y)).r;
        vec2 vel = texture2D(u_velocity, vUv).xy;
        vel.x -= 0.5 * (R - L);
        vel.y -= 0.5 * (T - B);
        gl_FragColor = vec4(vel, 0.0, 1.0);
      }
    `;// Shader that renders the front (revealed) image masked by the fluid density, with parallax on the revealed image
const fragmentShader=`
      precision highp float;
      varying vec2 vUv;
      uniform float u_time;
      uniform vec2 u_mouse;
      uniform float u_progress;
      uniform vec2 u_planeRes;
      uniform float u_radius;
      uniform float u_blur;
      uniform float u_circleBoost;
      uniform float u_noiseFreq;
      uniform float u_noiseStrength;
      uniform float u_noiseSize;
      uniform float u_timeSpeed;
      uniform sampler2D u_frontImage;
      uniform float u_frontImageAspect;
      uniform float u_containerAspect;
      uniform vec2 u_windowSize;
      uniform vec2 u_containerOffset;
      uniform vec2 u_parallaxOffset;
      uniform float u_parallaxMax;

              // Simplex noise 3D from https://github.com/ashima/webgl-noise
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
      float snoise(vec3 v) {
        const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
        const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
        // First corner
        vec3 i  = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);

        // Other corners
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min( g.xyz, l.zxy );
        vec3 i2 = max( g.xyz, l.zxy );

        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
        vec3 x3 = x0 - D.yyy;      // -1.0 + 3.0 * C.x = -0.5 = -D.y

        // Permutations
        i = mod289(i);
        vec4 p = permute( permute( permute(
                   i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                 + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                 + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

        // Gradients: 7x7 points over a square, mapped onto an octahedron.
        float n_ = 0.142857142857; // 1.0/7.0
        vec3  ns = n_ * D.wyz - D.xzx;

        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  // mod(p,7*7)

        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_ );

        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);

        vec4 b0 = vec4( x.xy, y.xy );
        vec4 b1 = vec4( x.zw, y.zw );

        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));

        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);

        // Normalise gradients
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;

        // Mix final noise value
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                      dot(p2,x2), dot(p3,x3) ) );
      }

      uniform sampler2D u_densityTex;

      void main() {
        vec2 uv = vUv;

        // Sample density directly - blob circularity is achieved via elliptical splats
        float density = texture2D(u_densityTex, uv).r * u_circleBoost * u_progress;

        // Noise for liquid texture edges
        float offx = uv.x + (u_time * u_timeSpeed * 0.1) + sin(uv.y + u_time * u_timeSpeed * 0.1);
        float offy = uv.y - cos(u_time * u_timeSpeed * 0.001) * 0.01;
        float effectiveNoiseFreq = u_noiseFreq / u_noiseSize;
        float n1 = snoise(vec3(offx * effectiveNoiseFreq, offy * effectiveNoiseFreq, u_time * u_timeSpeed)) - 1.0;
        float n2 = snoise(vec3(offx * effectiveNoiseFreq * 0.5, offy * effectiveNoiseFreq * 0.5, u_time * u_timeSpeed * 0.7)) - 1.0;
        float n = (n1 + n2 * 0.5) * 0.7;

        float finalMask = smoothstep(0.35, 0.55, (n * u_noiseStrength) + pow(density, 1.5));

        // Responsive UV mapping for front image (maintains aspect ratio like object-fit: cover)
        // For "cover": scale up so the image fills the container, cropping excess
        vec2 responsiveUV = uv;
        
        if (u_frontImageAspect > 0.0 && u_containerAspect > 0.0) {
            if (u_frontImageAspect > u_containerAspect) {
              // Image is wider than container - fit height, crop width
              float scale = u_frontImageAspect / u_containerAspect;
              responsiveUV.x = (uv.x - 0.5) / scale + 0.5;
            } else {
              // Image is taller than container - fit width, crop height
              float scale = u_containerAspect / u_frontImageAspect;
              responsiveUV.y = (uv.y - 0.5) / scale + 0.5;
            }
        }

        // Parallax the REVEALED (front) image: move opposite to cursor (add offset so image shifts away from cursor)
        vec2 inset = u_parallaxMax / u_planeRes;
        vec2 baseUV = inset + responsiveUV * (1.0 - 2.0 * inset);
        vec2 parallaxUV = u_parallaxOffset / u_planeRes;
        vec2 sampleUV = baseUV + parallaxUV;

        // Sample the front image with parallax and apply the mask
        vec4 frontColor = texture2D(u_frontImage, sampleUV);
        float outAlpha = frontColor.a * finalMask;
        // Hard cutoff: fully transparent where mask is negligible
        if (outAlpha < 0.01) outAlpha = 0.0;

        // Output straight alpha - THREE's default blend (SRC_ALPHA, ONE_MINUS_SRC_ALPHA) 
        // produces correct premultiplied result for canvas compositing
        gl_FragColor = vec4(frontColor.rgb, outAlpha);
      }
    `;const geometry=new PlaneGeometry(1,1,1,1);const material=new ShaderMaterial({uniforms,vertexShader,fragmentShader,transparent:true});const mesh=new Mesh(geometry,material);scene.add(mesh);// --- Fluid simulation scene (full-screen quad, ortho camera) ---
const fluidScene=new Scene;const texelSize=new Vector2(1/simWidth,1/simHeight);const splatVelMaterial=new ShaderMaterial({vertexShader:vertexShaderQuad,fragmentShader:splatFrag,uniforms:{u_point:{value:new Vector2(.5,.5)},u_splatColor:{value:new Vector2(0,0)},u_radius:{value:.02},u_aspectRatio:{value:1},u_target:{value:velFBO0.texture}},depthWrite:false});const quadMesh=new Mesh(quadGeometry,splatVelMaterial);fluidScene.add(quadMesh);const splatDensityMaterial=new ShaderMaterial({vertexShader:vertexShaderQuad,fragmentShader:splatDensityFrag,uniforms:{u_point:{value:new Vector2(.5,.5)},u_radius:{value:.02},u_aspectRatio:{value:1},u_densityAmount:{value:1},u_target:{value:densityFBO0.texture}},depthWrite:false});const advectMaterial=new ShaderMaterial({vertexShader:vertexShaderQuad,fragmentShader:advectFrag,uniforms:{u_velocity:{value:velFBO0.texture},u_source:{value:velFBO0.texture},u_texelSize:{value:texelSize.clone()},u_dt:{value:1},u_dissipationMultiply:{value:.99}},depthWrite:false});const divergenceMaterial=new ShaderMaterial({vertexShader:vertexShaderQuad,fragmentShader:divergenceFrag,uniforms:{u_velocity:{value:velFBO0.texture},u_texelSize:{value:texelSize.clone()}},depthWrite:false});const pressureMaterial=new ShaderMaterial({vertexShader:vertexShaderQuad,fragmentShader:pressureFrag,uniforms:{u_pressure:{value:pressureFBO0.texture},u_divergence:{value:divFBO.texture},u_texelSize:{value:texelSize.clone()}},depthWrite:false});const gradientMaterial=new ShaderMaterial({vertexShader:vertexShaderQuad,fragmentShader:gradientFrag,uniforms:{u_velocity:{value:velFBO0.texture},u_pressure:{value:pressureFBO0.texture},u_texelSize:{value:texelSize.clone()}},depthWrite:false});const curlMaterial=new ShaderMaterial({vertexShader:vertexShaderQuad,fragmentShader:curlFrag,uniforms:{u_velocity:{value:velFBO0.texture},u_texelSize:{value:texelSize.clone()},u_curl:{value:30}},depthWrite:false});const advectDensityMaterial=new ShaderMaterial({vertexShader:vertexShaderQuad,fragmentShader:advectFrag,uniforms:{u_velocity:{value:velFBO0.texture},u_source:{value:densityFBO0.texture},u_texelSize:{value:texelSize.clone()},u_dt:{value:1},u_dissipationMultiply:{value:.93}},depthWrite:false});const sizes=new Vector2;const offset=new Vector2;const updateFromDOM=()=>{// Use clientWidth/clientHeight for more reliable sizing
const actualWidth=Math.max(container.clientWidth,2);const actualHeight=Math.max(container.clientHeight,2);// Make the mesh fill the entire container (not just the image)
sizes.set(actualWidth,actualHeight);offset.set(0,0)// Center in container
;mesh.position.set(0,0,0);mesh.scale.set(actualWidth,actualHeight,1);// Update renderer size to match container exactly
renderer.setSize(actualWidth,actualHeight,false);// Update camera to match new dimensions
camera.aspect=actualWidth/actualHeight;camera.updateProjectionMatrix();// Ensure camera is positioned correctly for the new dimensions
camera.position.z=perspective;camera.lookAt(0,0,0);uniforms.u_planeRes.value.set(actualWidth,actualHeight);// Update window size and container offset for consistent noise scaling
uniforms.u_windowSize.value.set(window.innerWidth,window.innerHeight);// Get container position for offset calculations
const containerRect=container.getBoundingClientRect();uniforms.u_containerOffset.value.set(containerRect.left,containerRect.top);// Update aspect ratio uniforms for responsive front image
const containerAspect=actualWidth/actualHeight;uniforms.u_containerAspect.value=containerAspect;// Calculate front image aspect ratio when texture is loaded
if(frontTexture.image){const imageAspect=frontTexture.image.width/frontTexture.image.height;uniforms.u_frontImageAspect.value=imageAspect;}// Resize fluid simulation buffers when container size changes
resizeFluidFBOs(actualWidth,actualHeight);texelSize.set(1/simWidth,1/simHeight);uniforms.u_simResolution.value.set(simWidth,simHeight);// Force a re-render to update the effect
if(isAnimating){renderer.render(scene,camera);}};// Initial setup
updateFromDOM();let targetProgress=0;let rafId=0;const clock=new Clock;const targetParallaxOffset=new Vector2(0,0);// Function to determine if we should animate
const shouldAnimate=()=>{const isCanvasMode=RenderTarget.current()===RenderTarget.canvas;const isInView=container.getBoundingClientRect().top<window.innerHeight&&container.getBoundingClientRect().bottom>0;// Only animate if:
// 1. We're in Canvas mode AND preview is enabled, OR
// 2. We're not in Canvas mode (live website) AND component is in view
return isCanvasMode&&debouncedProps.preview||!isCanvasMode&&isInView;};const render=()=>{if(!shouldAnimate()){isAnimating=false;return;}isAnimating=true;rafId=requestAnimationFrame(render);const dt=clock.getDelta();uniforms.u_time.value+=dt;// Parallax: when disabled keep offset at 0; when enabled apply smoothing
if(!debouncedProps.parallax){uniforms.u_parallaxOffset.value.set(0,0);targetParallaxOffset.set(0,0);}else{const s=Math.max(0,Math.min(1,debouncedProps.parallaxSmoothing??0));if(s===0){uniforms.u_parallaxOffset.value.copy(targetParallaxOffset);}else{const tauMin=.04;const tauMax=.25;const tau=tauMin+(tauMax-tauMin)*s;const alpha=1-Math.exp(-dt/Math.max(1e-6,tau));uniforms.u_parallaxOffset.value.lerp(targetParallaxOffset,alpha);}}const mouseTarget=uniforms.u_mouse.value;mouseVelocity.x=mouseTarget.x-lastMouseUV.x;mouseVelocity.y=mouseTarget.y-lastMouseUV.y;lastMouseUV.x=mouseTarget.x;lastMouseUV.y=mouseTarget.y;const isCanvasMode=RenderTarget.current()===RenderTarget.canvas;// Always recompute container aspect to handle live resizing (especially in Canvas mode)
const actualW=Math.max(container.clientWidth,2);const actualH=Math.max(container.clientHeight,2);const containerAspect=actualW/actualH;uniforms.u_containerAspect.value=containerAspect;uniforms.u_planeRes.value.set(actualW,actualH);// Update renderer/camera if size changed
if(renderer.getSize(new Vector2).x!==actualW||renderer.getSize(new Vector2).y!==actualH){renderer.setSize(actualW,actualH,false);camera.aspect=containerAspect;camera.updateProjectionMatrix();mesh.scale.set(actualW,actualH,1);}// Also update sim resolution if needed (handles Canvas resizing)
resizeFluidFBOs(actualW,actualH);// Mouse position for splatting (direct UV, no aspect correction needed)
// Blob circularity is achieved via elliptical splats in the shader
let simMouseX,simMouseY;if(isCanvasMode&&debouncedProps.preview){simMouseX=.5;simMouseY=.5;}else{simMouseX=mouseTarget.x;simMouseY=mouseTarget.y;}const splatRad=Math.max(.005,debouncedProps.splatRadius);const velDiss=Math.max(.9,Math.min(1,debouncedProps.velocityDissipation));// Return time in seconds → per-frame dissipation so density ~1% after that time at 60fps
const T=Math.max(.5,Math.min(10,debouncedProps.shrinkTimeSeconds));const denDiss=Math.pow(.01,1/(60*T));const pressureIters=Math.max(10,Math.min(50,Math.round(debouncedProps.pressureIterations)));texelSize.set(1/simWidth,1/simHeight);advectMaterial.uniforms.u_texelSize.value.copy(texelSize);divergenceMaterial.uniforms.u_texelSize.value.copy(texelSize);pressureMaterial.uniforms.u_texelSize.value.copy(texelSize);gradientMaterial.uniforms.u_texelSize.value.copy(texelSize);advectDensityMaterial.uniforms.u_texelSize.value.copy(texelSize);const gl=renderer.getContext();gl.disable(gl.BLEND);// 1) Splat velocity - use elliptical splats for circular appearance
splatVelMaterial.uniforms.u_point.value.set(simMouseX,simMouseY);splatVelMaterial.uniforms.u_aspectRatio.value=containerAspect;splatVelMaterial.uniforms.u_splatColor.value.set(mouseVelocity.x*30,mouseVelocity.y*30);splatVelMaterial.uniforms.u_radius.value=splatRad;splatVelMaterial.uniforms.u_target.value=velFBO0.texture;quadMesh.material=splatVelMaterial;renderer.setRenderTarget(velFBO1);renderer.render(fluidScene,orthoCamera);// 2) Splat density - use elliptical splats for circular appearance
splatDensityMaterial.uniforms.u_point.value.set(simMouseX,simMouseY);splatDensityMaterial.uniforms.u_aspectRatio.value=containerAspect;splatDensityMaterial.uniforms.u_radius.value=splatRad;const densityAmt=isCanvasMode&&debouncedProps.preview?.15:1;splatDensityMaterial.uniforms.u_densityAmount.value=densityAmt;splatDensityMaterial.uniforms.u_target.value=densityFBO0.texture;quadMesh.material=splatDensityMaterial;renderer.setRenderTarget(densityFBO1);renderer.render(fluidScene,orthoCamera);// 3) Advect velocity
advectMaterial.uniforms.u_velocity.value=velFBO1.texture;advectMaterial.uniforms.u_source.value=velFBO1.texture;advectMaterial.uniforms.u_dt.value=1;advectMaterial.uniforms.u_dissipationMultiply.value=velDiss;quadMesh.material=advectMaterial;renderer.setRenderTarget(velFBO0);renderer.render(fluidScene,orthoCamera);// 3b) Curl (vorticity) for fluid swirl
if(debouncedProps.curl>0){curlMaterial.uniforms.u_velocity.value=velFBO0.texture;curlMaterial.uniforms.u_curl.value=debouncedProps.curl;quadMesh.material=curlMaterial;renderer.setRenderTarget(velFBO1);renderer.render(fluidScene,orthoCamera);}// 4) Divergence (use velFBO1 if curl ran, else velFBO0)
const velForDiv=debouncedProps.curl>0?velFBO1.texture:velFBO0.texture;divergenceMaterial.uniforms.u_velocity.value=velForDiv;quadMesh.material=divergenceMaterial;renderer.setRenderTarget(divFBO);renderer.render(fluidScene,orthoCamera);// 5) Pressure (Jacobi)
pressureMaterial.uniforms.u_divergence.value=divFBO.texture;let pressureRead=pressureFBO0;let pressureWrite=pressureFBO1;for(let i=0;i<pressureIters;i++){pressureMaterial.uniforms.u_pressure.value=pressureRead.texture;quadMesh.material=pressureMaterial;renderer.setRenderTarget(pressureWrite);renderer.render(fluidScene,orthoCamera);const tmp=pressureRead;pressureRead=pressureWrite;pressureWrite=tmp;}// 6) Subtract pressure gradient from velocity
const velForGradientRead=debouncedProps.curl>0?velFBO1:velFBO0;const velForGradientWrite=debouncedProps.curl>0?velFBO0:velFBO1;gradientMaterial.uniforms.u_velocity.value=velForGradientRead.texture;gradientMaterial.uniforms.u_pressure.value=pressureRead.texture;quadMesh.material=gradientMaterial;renderer.setRenderTarget(velForGradientWrite);renderer.render(fluidScene,orthoCamera);// 7) Advect density (use velocity after gradient)
advectDensityMaterial.uniforms.u_velocity.value=velForGradientWrite.texture;advectDensityMaterial.uniforms.u_source.value=densityFBO1.texture;advectDensityMaterial.uniforms.u_dt.value=1;advectDensityMaterial.uniforms.u_dissipationMultiply.value=denDiss;quadMesh.material=advectDensityMaterial;renderer.setRenderTarget(densityFBO0);renderer.render(fluidScene,orthoCamera);// Ping-pong swap: gradient output must be in velFBO0 for next frame's splat
if(debouncedProps.curl<=0){const tmp=velFBO0;velFBO0=velFBO1;velFBO1=tmp;}renderer.setRenderTarget(null);// Explicitly clear to transparent before drawing the main scene
renderer.clear();gl.enable(gl.BLEND);uniforms.u_densityTex.value=densityFBO0.texture;uniforms.u_parallaxMax.value=debouncedProps.parallax?Math.max(0,Math.min(200,debouncedProps.parallaxAmount??0)):0;uniforms.u_blur.value=mapBlur(debouncedProps.blur);uniforms.u_circleBoost.value=mapCircleBoost(debouncedProps.circleBoost);const currentTextureParams=mapTexture(debouncedProps.texture);uniforms.u_noiseFreq.value=currentTextureParams.freq;uniforms.u_noiseStrength.value=currentTextureParams.strength;uniforms.u_noiseSize.value=currentTextureParams.size;uniforms.u_timeSpeed.value=mapTimeSpeed(debouncedProps.timeSpeed);uniforms.u_radius.value=mapRadius(debouncedProps.radius);if(isCanvasMode&&debouncedProps.preview){targetProgress=1;uniforms.u_mouse.value.set(.5,.5);uniforms.u_noiseFreq.value=currentTextureParams.freq*1.25;}else{uniforms.u_noiseStrength.value=currentTextureParams.strength;}if(hideBlobForResizeRef.current){uniforms.u_progress.value=0;}else{uniforms.u_progress.value+=(targetProgress-uniforms.u_progress.value)*.08;}renderer.render(scene,camera);};// Start animation if needed
if(shouldAnimate()){render();}// Throttled resize handler
let resizeTimeout=null;const throttledResize=()=>{if(resizeTimeout)return;resizeTimeout=setTimeout(()=>{// Update DOM and force re-render
updateFromDOM();// Ensure the effect is properly updated
if(isAnimating){renderer.render(scene,camera);}resizeTimeout=null;},100)// 100ms throttle
;};// Use ResizeObserver for container changes
const resizeObserver=new ResizeObserver(entries=>{// Immediate update for critical dimension changes
entries.forEach(entry=>{const{width,height}=entry.contentRect;// Update if dimensions have changed
if(width!==sizes.x||height!==sizes.y){updateFromDOM();}});// Also use throttled resize for performance
throttledResize();});resizeObserver.observe(container);// Also listen to window resize for global changes
window.addEventListener("resize",throttledResize);// Canvas mode: use zoom probe polling to detect resize/zoom changes (debounced remount)
let canvasResizeRafId=0;let remountDebounceId=null;const REMOUNT_DEBOUNCE_MS=350;const isCanvasMode=RenderTarget.current()===RenderTarget.canvas;if(isCanvasMode){const POLL_INTERVAL_MS=150;let lastPollTime=0;const pollCanvasResize=now=>{canvasResizeRafId=requestAnimationFrame(pollCanvasResize);if(now-lastPollTime<POLL_INTERVAL_MS)return;lastPollTime=now;const probe=zoomProbeRef.current;if(!probe)return;const probeRect=probe.getBoundingClientRect();const currentZoom=probeRect.width;const currentWidth=container.clientWidth;const currentHeight=container.clientHeight;const last=lastSizeRef.current;const zoomChanged=Math.abs(currentZoom-last.zoom)>.5;const sizeChanged=currentWidth!==last.width||currentHeight!==last.height;if(zoomChanged||sizeChanged){last.zoom=currentZoom;last.width=currentWidth;last.height=currentHeight;hideBlobForResizeRef.current=true;if(remountDebounceId)clearTimeout(remountDebounceId);remountDebounceId=setTimeout(()=>{remountDebounceId=null;setCanvasRemountKey(k=>k+1);},REMOUNT_DEBOUNCE_MS);}};canvasResizeRafId=requestAnimationFrame(pollCanvasResize);}// Intersection Observer to pause rendering when out of view
const intersectionObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting&&!isAnimating&&shouldAnimate()){// Component came into view and should animate
render();}});},{root:null,rootMargin:"50px",threshold:.01});intersectionObserver.observe(container);const parallaxPx=debouncedProps.parallax?Math.max(0,Math.min(200,debouncedProps.parallaxAmount??0)):0;const onMove=e=>{const isCanvasMode=RenderTarget.current()===RenderTarget.canvas;if(isCanvasMode&&debouncedProps.preview)return;const containerRect=container.getBoundingClientRect();// Calculate position relative to this component
const x=(e.clientX-containerRect.left)/containerRect.width;const y=1-(e.clientY-containerRect.top)/containerRect.height;// Check if the mouse is currently inside the bounds of this component
const isInside=x>=0&&x<=1&&y>=0&&y<=1;if(isInside){// This acts as your "onEnter"
targetProgress=1;if(!isAnimating&&shouldAnimate())render();const nx=Math.max(0,Math.min(1,x));const ny=Math.max(0,Math.min(1,y));uniforms.u_mouse.value.set(nx,ny);if(debouncedProps.parallax&&parallaxPx>0){targetParallaxOffset.set((nx-.5)*2*parallaxPx,(ny-.5)*2*parallaxPx);}}else{// This acts as your "onLeave"
targetProgress=0;targetParallaxOffset.set(0,0);}};window.addEventListener("mousemove",onMove);return()=>{if(rafId){cancelAnimationFrame(rafId);}if(canvasResizeRafId){cancelAnimationFrame(canvasResizeRafId);}if(remountDebounceId){clearTimeout(remountDebounceId);}resizeObserver.disconnect();intersectionObserver.disconnect();window.removeEventListener("resize",throttledResize);if(resizeTimeout){clearTimeout(resizeTimeout);}window.removeEventListener("mousemove",onMove);disposeFluidFBOs();quadGeometry.dispose();splatVelMaterial.dispose();splatDensityMaterial.dispose();advectMaterial.dispose();divergenceMaterial.dispose();pressureMaterial.dispose();gradientMaterial.dispose();curlMaterial.dispose();advectDensityMaterial.dispose();geometry.dispose();material.dispose();renderer.dispose();};},[canvasRemountKey,debouncedProps.radius,debouncedProps.blur,debouncedProps.circleBoost,debouncedProps.texture,debouncedProps.timeSpeed,debouncedProps.splatRadius,debouncedProps.velocityDissipation,debouncedProps.shrinkTimeSeconds,debouncedProps.curl,debouncedProps.pressureIterations,debouncedProps.preview,imageBase?.positionX,imageBase?.positionY,imageHover?.positionX,imageHover?.positionY,imageHover?.src,debouncedProps.parallax,debouncedProps.parallaxAmount,debouncedProps.parallaxSmoothing,mapRadius,mapBlur,mapCircleBoost,mapTexture,mapTimeSpeed,isMobile]);if(!hasBaseImage){return /*#__PURE__*/_jsx("div",{style:{height:"100%",width:"100%",position:"relative",borderRadius:borderRadius},children:/*#__PURE__*/_jsx("div",{style:{height:"100%",width:"100%",position:"relative",display:"flex",justifyContent:"center",alignItems:"center"},children:/*#__PURE__*/_jsx(ComponentMessage,{style:{position:"relative",width:"100%",height:"100%",minWidth:0,minHeight:0},title:"Liquid Mask Effect",description:"Add a base image to create stunning liquid mask effects with gooey animations"})})});}return /*#__PURE__*/_jsxs("div",{ref:containerRef,style:{width:"100%",height:"100%",position:"relative",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:borderRadius,overflow:"clip",...props.style},children:[/*#__PURE__*/_jsx("figure",{style:{position:"absolute",inset:0,margin:0,padding:0,zIndex:1},children:/*#__PURE__*/_jsx("img",{ref:imgRef,src:imageBase?.src,srcSet:imageBase?.srcSet,alt:imageBase?.alt||"Back image",draggable:false,style:{width:"100%",height:"100%",objectFit:"cover",objectPosition:`${imageBase?.positionX||"50%"} ${imageBase?.positionY||"50%"}`,margin:0,padding:0,userSelect:"none",pointerEvents:"none"}})}),!isMobile&&/*#__PURE__*/_jsx("canvas",{ref:canvasRef,id:"stage",style:{position:"absolute",inset:0,width:"100%",height:"100%",zIndex:3,pointerEvents:"none",mixBlendMode:"normal",background:"transparent"}}),/*#__PURE__*/_jsx("div",{ref:zoomProbeRef,style:{position:"absolute",width:20,height:20,opacity:0,pointerEvents:"none"}})]});}addPropertyControls(LiquidMask,{preview:{type:ControlType.Boolean,title:"Preview",defaultValue:true,enabledTitle:"On",disabledTitle:"Off"},imageBase:{type:ControlType.ResponsiveImage,title:"Front"},imageHover:{type:ControlType.ResponsiveImage,title:"Back"},parallax:{type:ControlType.Boolean,title:"Parallax",defaultValue:true,enabledTitle:"On",disabledTitle:"Off"},parallaxAmount:{type:ControlType.Number,title:"Amount",min:0,max:100,step:5,defaultValue:100,unit:"px",hidden:props=>!props.parallax},parallaxSmoothing:{type:ControlType.Number,title:"Smoothing",min:0,max:1,step:.05,defaultValue:0,unit:"",hidden:props=>!props.parallax},borderRadius:{//@ts-ignore
type:ControlType.BorderRadius,title:"Radius",min:0,max:100,step:1,defaultValue:0,unit:"px"},splatRadius:{type:ControlType.Number,title:"Size",min:.02,max:.2,step:.01,defaultValue:.08,unit:""},circleBoost:{type:ControlType.Number,title:"Strength",min:.2,max:1,step:.05,defaultValue:.6,unit:""},shrinkTimeSeconds:{type:ControlType.Number,title:"Return time",min:.5,max:10,step:.1,defaultValue:2.4,unit:"s"},texture:{type:ControlType.Number,title:"Edge grain",min:0,max:1,step:.1,defaultValue:.7,unit:""},curl:{type:ControlType.Number,title:"Swirl",min:0,max:100,step:5,defaultValue:30,unit:"",description:"More components at [Framer University](https://frameruni.link/cc)."}});LiquidMask.displayName="Hover Mask Reveal";
