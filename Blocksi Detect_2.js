(function() {
    // --- CONFIGURATION ---
    const BLOCKSI_ID = "ghlpmldmjjhmdgmneoaibbegkjjbonbk";
    // Remplace le lien ci-dessous par l'URL de TON image
    const IMAGE_URL = "https://i.imgur.com/lXxXyJU.png"; 
    
    // --- ETAT DU SYSTÈME ---
    let detectionActive = false; // Est-ce que Blocksi a été vu ?
    let overlayLocked = false;   // Est-ce que l'utilisateur a caché l'image manuellement ?

    // --- CRÉATION DE L'INTERFACE (OVERLAY) ---
    const overlay = document.createElement('div');
    overlay.id = 'security-overlay';
    Object.assign(overlay.style, {
        position: 'fixed',
        top: '0', left: '0',
        width: '100vw', height: '100vh',
        background: `url('${IMAGE_URL}') no-repeat center center / cover`,
        backgroundColor: 'black', // Au cas où l'image ne charge pas
        zIndex: '2147483647', // Le maximum possible en CSS
        display: 'none', // Caché au départ
        pointerEvents: 'all' // Bloque les clics sur la page
    });
    document.body.appendChild(overlay);

    // --- FONCTION DE NETTOYAGE (KILL SWITCH) ---
    const nukeBlocksi = () => {
        let found = false;
        
        // 1. Chercher par attributs, ID, Classes
        const elements = document.querySelectorAll('*');
        elements.forEach(el => {
            // On vérifie si le HTML de l'élément contient l'ID maudit
            if (el.outerHTML && (el.outerHTML.includes(BLOCKSI_ID) || el.id.toLowerCase().includes('blocksi'))) {
                // EXCEPTION : On ne se supprime pas soi-même (notre script)
                if (el.id !== 'security-overlay') {
                    el.remove(); // SUPPRESSION IMMÉDIATE
                    found = true;
                }
            }
        });

        return found;
    };

    // --- BOUCLE PRINCIPALE (100ms) ---
    setInterval(() => {
        // 1. Tenter de supprimer Blocksi
        const detectedNow = nukeBlocksi();

        // 2. Gestion de l'image Plein Écran
        if (detectedNow) {
            detectionActive = true; // On sait qu'il est là
        }

        // Si Blocksi est là (ou a été vu) ET que l'utilisateur n'a pas désactivé l'image
        if (detectionActive && !overlayLocked) {
            overlay.style.display = 'block';
        } else {
            overlay.style.display = 'none';
        }

    }, 100); // 1/10ème de seconde

    // --- RACCOURCI CLAVIER (# + b) ---
    let keys = {};
    document.addEventListener('keydown', (e) => {
        keys[e.key] = true;
        
        // Combinaison # + b
        if (keys['#'] && (e.key.toLowerCase() === 'b')) {
            // Basculer l'état "verrouillé"
            overlayLocked = !overlayLocked;
            
            // Feedback visuel immédiat
            if (overlayLocked) {
                overlay.style.display = 'none';
                console.log("Bouclier désactivé manuellement.");
            } else {
                // On remet l'image seulement si Blocksi a été détecté par le passé
                if (detectionActive) overlay.style.display = 'block';
                console.log("Bouclier réactivé.");
            }
        }
    });

    document.addEventListener('keyup', (e) => delete keys[e.key]);

    // --- TESTS ---
    // Pour tester sans Blocksi, tape : simulationBlocksi() dans la console
    window.simulationBlocksi = () => {
        const fake = document.createElement('div');
        fake.id = 'blocksi-test-element';
        fake.setAttribute('data-extension-id', BLOCKSI_ID);
        document.body.appendChild(fake);
        console.log("Faux Blocksi injecté pour test.");
    };

    console.log(`Système de défense actif.`);
    console.log(`Intervalle : 100ms. Image prête.`);
    console.log(`Raccourci Toggle : # + b`);
})();
