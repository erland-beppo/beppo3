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

        // Dina senaste storleksändringar
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
    const SENSITIVITY = 0.5;
    const VIEW_HEIGHT = 600;
    let isDragging = false;
    let loadedModel, renderer, camera, scene, canvasElement;
    // Variabler för att hantera touch-scrollning
    let touchStartX = 0;
    let touchStartY = 0;

    const holder = document.getElementById('canvas-holder');
    if (!holder) return;

    scene = new THREE.Scene();
    // <<< ANVÄNDER BEHÅLLARENS BREDD ISTÄLLET FÖR FÖNSTRETS >>>
    camera = new THREE.PerspectiveCamera(75, holder.clientWidth / VIEW_HEIGHT, 0.01, 20000);
    camera.position.z = 500;
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    // <<< ANVÄNDER BEHÅLLARENS BREDD ISTÄLLET FÖR FÖNSTRETS >>>
    renderer.setSize(holder.clientWidth, VIEW_HEIGHT);
    canvasElement = renderer.domElement;
    holder.appendChild(canvasElement);

    // <<< HÄR ÄR ÄNDRINGEN: Justerad ljussättning för mer kontrast >>>
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Svagare grundljus
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5); // Starkare riktat ljus
    directionalLight.position.set(8, 8, 8).normalize();
    scene.add(directionalLight);

    const loader = new GLTFLoader();
    loader.load('verk1.glb', (gltf) => {
        loadedModel = gltf.scene;
        scene.add(loadedModel);
        loadedModel.traverse((child) => {
            if (child.isMesh) {
                // <<< HÄR ÄR ÄNDRINGEN: Tillbaka till ett material som tar emot ljus >>>
                const newMaterial = child.material.clone(); // Använder ett ljuskänsligt material
                
                // Justera egenskaperna för att få en matt och intensiv färg
                newMaterial.color.setHex(0xff92e1); // Samma intensiva rosa
                newMaterial.metalness = 0.1;       // Nästan ingen metallglans
                newMaterial.roughness = 0.9;       // En matt yta

                child.material = newMaterial;
            }
        });
        
        loadedModel.scale.set(1700, 1400, 1600);
        loadedModel.position.set(0, -230, 0);
        loadedModel.rotation.y = Math.PI / -7;
        setupEventListeners();
        animate();
    });

    function animate() {
        requestAnimationFrame(animate);
        // <<< NYTT TILLÄGG: Långsam rotation när användaren inte interagerar >>>
        if (loadedModel && !isDragging) {
            loadedModel.rotation.y += 0.002;
        }
        renderer.render(scene, camera);
    }

    function handleRotationEvent(event) {
        if (!loadedModel || !isDragging) return;
        const clientX = event.touches ? event.touches[0].clientX : event.clientX;
        const clientY = event.touches ? event.touches[0].clientY : event.clientY;
        // <<< ANVÄNDER BEHÅLLARENS BREDD FÖR KORREKT ROTATION >>>
        const xNormalized = ((clientX - holder.getBoundingClientRect().left) / holder.clientWidth) - 0.5;
        const yNormalized = (clientY / VIEW_HEIGHT) - 0.5;
        loadedModel.rotation.y = xNormalized * SENSITIVITY * Math.PI * 2;
        loadedModel.rotation.x = yNormalized * SENSITIVITY * Math.PI * 2;
    }
    
    function setupEventListeners() {
        canvasElement.addEventListener('mousedown', () => { isDragging = true; });
        document.addEventListener('mouseup', () => { isDragging = false; });
        canvasElement.addEventListener('mousemove', handleRotationEvent);

        canvasElement.addEventListener('touchstart', (e) => {
            isDragging = true;
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });
        
        document.addEventListener('touchend', () => { isDragging = false; });
        
        canvasElement.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const touchCurrentX = e.touches[0].clientX;
            const touchCurrentY = e.touches[0].clientY;
            const deltaX = Math.abs(touchStartX - touchCurrentX);
            const deltaY = Math.abs(touchStartY - touchCurrentY);
            if (deltaX > deltaY) {
                e.preventDefault();
                handleRotationEvent(e);
            }
        }, { passive: false });

        window.addEventListener('resize', () => {
            // <<< UPPDATERAR MED BEHÅLLARENS BREDD >>>
            camera.aspect = holder.clientWidth / VIEW_HEIGHT;
            camera.updateProjectionMatrix();
            renderer.setSize(holder.clientWidth, VIEW_HEIGHT);
        }, false);
    }
}


/**
 * ======================================================================
 * INSTALLATION FÖR DEN ANDRA MODELLEN ("studios.glb")
 * ======================================================================
 */
function setupSecondModel() {
    const SENSITIVITY = 0.5;
    const VIEW_HEIGHT = 600;
    let isDragging = false;
    let loadedModel, renderer, camera, scene, canvasElement;
    let touchStartX = 0;
    let touchStartY = 0;

    const holder = document.getElementById('canvas-holder-2');
    if (!holder) return;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, holder.clientWidth / VIEW_HEIGHT, 0.01, 20000);
    // <<< HÄR ÄR ÄNDRING 1: Flyttar kameran längre bort >>>
    camera.position.z = 400;
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(holder.clientWidth, VIEW_HEIGHT);
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
                // <<< HÄR ÄR ÄNDRING 3: Gör materialet transparent >>>
                newMaterial.transparent = true;
                newMaterial.opacity = 0.75; // 75% synlighet
                child.material = newMaterial;
            }
        });
        
        // <<< HÄR ÄR ÄNDRING 2: Ökar storleken på modellen >>>
        loadedModel.scale.set(2800, 2800, 2800); 
        loadedModel.position.set(0, 50, 0); 
        
        loadedModel.rotation.x = Math.PI / 2;
        loadedModel.rotation.y = (Math.PI / 8) - (Math.PI / 2);

        setupEventListeners();
        animate();
    });

    function animate() {
        requestAnimationFrame(animate);
        if (loadedModel && !isDragging) {
            loadedModel.rotation.y += 0.002;
        }
        renderer.render(scene, camera);
    }
    
    function handleRotationEvent(event) {
        if (!loadedModel || !isDragging) return;
        const clientX = event.touches ? event.touches[0].clientX : event.clientX;
        const clientY = event.touches ? event.touches[0].clientY : event.clientY;
        const xNormalized = ((clientX - holder.getBoundingClientRect().left) / holder.clientWidth) - 0.5;
        const yNormalized = (clientY / VIEW_HEIGHT) - 0.5;
        loadedModel.rotation.y = xNormalized * SENSITIVITY * Math.PI * 2;
        loadedModel.rotation.x = yNormalized * SENSITIVITY * Math.PI * 2;
    }

    function setupEventListeners() {
        canvasElement.addEventListener('mousedown', () => { isDragging = true; });
        document.addEventListener('mouseup', () => { isDragging = false; });
        canvasElement.addEventListener('mousemove', handleRotationEvent);
        
        canvasElement.addEventListener('touchstart', (e) => {
            isDragging = true;
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });
        
        document.addEventListener('touchend', () => { isDragging = false; });
        
        canvasElement.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const touchCurrentX = e.touches[0].clientX;
            const touchCurrentY = e.touches[0].clientY;
            const deltaX = Math.abs(touchStartX - touchCurrentX);
            const deltaY = Math.abs(touchStartY - touchCurrentY);
            if (deltaX > deltaY) {
                e.preventDefault();
                handleRotationEvent(e);
            }
        }, { passive: false });

        window.addEventListener('resize', () => {
            camera.aspect = holder.clientWidth / VIEW_HEIGHT;
            camera.updateProjectionMatrix();
            renderer.setSize(holder.clientWidth, VIEW_HEIGHT);
        }, false);
    }
}


// --- KÖR IGÅNG ALLT ---
window.onload = () => {
    setupLogoModel();
    setupFirstModel();
    setupSecondModel();
};

