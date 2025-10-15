// --- IMPORT AV MODULER ---
import * as THREE from 'https://cdn.skypack.dev/three@0.128.0';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/GLTFLoader';

/**
 * ======================================================================
 * NY FUNKTION: INSTALLATION FÖR 3D-LOGGAN ("logga.glb")
 * ======================================================================
 */
function setupLogoModel() {
    let loadedModel, renderer, camera, scene;

    const holder = document.getElementById('logo-holder');
    if (!holder) return;

    // Sätt upp scenen
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, holder.clientWidth / holder.clientHeight, 0.1, 1000);
    camera.position.z = 500; 

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(holder.clientWidth, holder.clientHeight);
    holder.appendChild(renderer.domElement);

    // Ljus
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(8, 8, 8).normalize();
    scene.add(directionalLight);

    // Ladda logg-modellen
    const loader = new GLTFLoader();
    loader.load('logga.glb', (gltf) => {
        loadedModel = gltf.scene;
        scene.add(loadedModel);
        
        loadedModel.traverse((child) => {
            if (child.isMesh) {
                const newMaterial = child.material.clone();
                newMaterial.color.setHex(0xFFF000);
                newMaterial.metalness = 0;
                newMaterial.roughness = 1;
                child.material = newMaterial;
            }
        });

        // Behåll den stora storleken
        loadedModel.scale.set(3150, 3150, 3150);
        loadedModel.position.set(0, 0, 0);
        
        // Behåll startpositionen uppifrån
        loadedModel.rotation.x = Math.PI / 2;
        
        animate(); 
    });

    // Animeringsloop
    function animate() {
        requestAnimationFrame(animate);
        if (loadedModel) {
            loadedModel.rotation.z += 0.005; 
        }
        renderer.render(scene, camera);
    }

    // Uppdatera storlek om fönstret ändras
    window.addEventListener('resize', () => {
        camera.aspect = holder.clientWidth / holder.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(holder.clientWidth, holder.clientHeight);
    }, false);
}


/**
 * ======================================================================
 * INSTALLATION FÖR DEN FÖRSTA MODELLEN ("verk1.glb")
 * ======================================================================
 */
function setupFirstModel() {
    // Variabler som bara gäller för denna modell
    const SENSITIVITY = 0.5;
    // <<< Minskad höjd för mindre avstånd till texten under >>>
    const VIEW_HEIGHT = 600;
    let isDragging = false;
    let loadedModel, renderer, camera, scene, canvasElement;

    // Hämta rätt behållare
    const holder = document.getElementById('canvas-holder');
    if (!holder) return;

    // Din ursprungliga kod för att sätta upp scenen
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / VIEW_HEIGHT, 0.01, 20000);
    camera.position.z = 500;
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(window.innerWidth, VIEW_HEIGHT);
    canvasElement = renderer.domElement;
    holder.appendChild(canvasElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(8, 8, 8).normalize();
    scene.add(directionalLight);

    const loader = new GLTFLoader();
    loader.load('verk1.glb', (gltf) => {
        loadedModel = gltf.scene;
        scene.add(loadedModel);
        loadedModel.traverse((child) => {
            if (child.isMesh) {
                const newMaterial = child.material.clone();
                newMaterial.color.setHex(0xfc49ae); // Rosa färg
                child.material = newMaterial;
            }
        });
        
        // <<< Ökad storlek på modellen >>>
        loadedModel.scale.set(1700, 1400, 1600);
        // <<< Justerad position för att centrera den större modellen >>>
        loadedModel.position.set(0, -230, 0);
        loadedModel.rotation.y = Math.PI / -7;
        setupEventListeners();
        animate();
    });

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }

    function handleRotationEvent(event) {
        if (!loadedModel || !isDragging) return;
        const clientX = event.touches ? event.touches[0].clientX : event.clientX;
        const clientY = event.touches ? event.touches[0].clientY : event.clientY;
        const xNormalized = (clientX / window.innerWidth) - 0.5;
        const yNormalized = (clientY / VIEW_HEIGHT) - 0.5;
        loadedModel.rotation.y = xNormalized * SENSITIVITY * Math.PI * 2;
        loadedModel.rotation.x = yNormalized * SENSITIVITY * Math.PI * 2;
    }
    
    function setupEventListeners() {
        canvasElement.addEventListener('mousedown', () => { isDragging = true; });
        document.addEventListener('mouseup', () => { isDragging = false; });
        canvasElement.addEventListener('mousemove', handleRotationEvent);
        canvasElement.addEventListener('touchstart', (e)=>{ e.preventDefault(); isDragging=true; handleRotationEvent(e); }, {passive:false});
        document.addEventListener('touchend', () => { isDragging = false; });
        document.addEventListener('touchmove', (e)=>{ e.preventDefault(); handleRotationEvent(e); }, {passive:false});
        window.addEventListener('resize', ()=>{
            camera.aspect = window.innerWidth / VIEW_HEIGHT;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, VIEW_HEIGHT);
        }, false);
    }
}


/**
 * ======================================================================
 * INSTALLATION FÖR DEN ANDRA MODELLEN ("studios.glb")
 * ======================================================================
 */
function setupSecondModel() {
    // Variabler som bara gäller för denna modell
    const SENSITIVITY = 0.5;
    const VIEW_HEIGHT = 600; // Kan ha en annan höjd
    let isDragging = false;
    let loadedModel, renderer, camera, scene, canvasElement;

    // Hämta den ANDRA behållaren
    const holder = document.getElementById('canvas-holder-2');
    if (!holder) return;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / VIEW_HEIGHT, 0.01, 20000);
    camera.position.z = 200;
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(window.innerWidth, VIEW_HEIGHT);
    canvasElement = renderer.domElement;
    holder.appendChild(canvasElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(8, 8, 8).normalize();
    scene.add(directionalLight);

    const loader = new GLTFLoader();
    loader.load('studios.glb', (gltf) => {
        loadedModel = gltf.scene;
        scene.add(loadedModel);
        loadedModel.traverse((child) => {
            if (child.isMesh) {
                const newMaterial = child.material.clone();
                newMaterial.color.setHex(0x498AFC); // Blå färg
                child.material = newMaterial;
            }
        });
        
        loadedModel.scale.set(1500, 1500, 1500); 
        loadedModel.position.set(0, 60, 0); 
        
        loadedModel.rotation.x = Math.PI / 2;
        loadedModel.rotation.y = (Math.PI / 8) - (Math.PI / 2);

        setupEventListeners();
        animate();
    });

    // Samma hjälpfunktioner som förut, men de är lokala för denna modell
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    
    function handleRotationEvent(event) {
        if (!loadedModel || !isDragging) return;
        const clientX = event.touches ? event.touches[0].clientX : event.clientX;
        const clientY = event.touches ? event.touches[0].clientY : event.clientY;
        const xNormalized = (clientX / window.innerWidth) - 0.5;
        const yNormalized = (clientY / VIEW_HEIGHT) - 0.5;
        loadedModel.rotation.y = xNormalized * SENSITIVITY * Math.PI * 2;
        loadedModel.rotation.x = yNormalized * SENSITIVITY * Math.PI * 2;
    }

    function setupEventListeners() {
        canvasElement.addEventListener('mousedown', () => { isDragging = true; });
        document.addEventListener('mouseup', () => { isDragging = false; });
        canvasElement.addEventListener('mousemove', handleRotationEvent);
        canvasElement.addEventListener('touchstart', (e)=>{ e.preventDefault(); isDragging=true; handleRotationEvent(e); }, {passive:false});
        document.addEventListener('touchend', () => { isDragging = false; });
        document.addEventListener('touchmove', (e)=>{ e.preventDefault(); handleRotationEvent(e); }, {passive:false});
        window.addEventListener('resize', ()=>{
            camera.aspect = window.innerWidth / VIEW_HEIGHT;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, VIEW_HEIGHT);
        }, false);
    }
}


// --- KÖR IGÅNG ALLT ---
window.onload = () => {
    setupLogoModel();
    setupFirstModel();
    setupSecondModel();
};

