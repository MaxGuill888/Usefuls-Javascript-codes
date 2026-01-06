(function() {
    // --- CONFIGURATION ---
    const BLOCKSI_ID = "ghlpmldmjjhmdgmneoaibbegkjjbonbk";
    // Mets ton lien d'image ici (Ex: Image de système verrouillé)
    const IMAGE_URL = "https://i.imgur.com/3wn9N1W.png"; 
    
    // --- ÉTAT ---
    let userHidden = false; // Est-ce que l'utilisateur a forcé la fermeture ?

    // --- CRÉATION DE L'IMAGE PLEIN ÉCRAN ---
    const overlay = document.createElement('div');
    overlay.id = 'security-overlay';
    Object.assign(overlay.style, {
        position: 'fixed',
        top: '0', left: '0',
        width: '100vw', height: '100vh',
        background: `url('${IMAGE_URL}') no-repeat center center / cover`,
        backgroundColor: 'black',
        zIndex: '2147483647', // Maximum possible
        display: 'none', // Caché au départ
        pointerEvents: 'all' // Empêche de cliquer derrière
    });
    // Ajout d'un message discret pour dire comment sortir
    overlay.innerHTML = '<div style="position:absolute; bottom:10px; right:10px; color:rgba(255,255,255,0.3); font-family:sans-serif; font-size:12px;"># + b pour déverrouiller</div>';
    document.body.appendChild(overlay);

    // --- FONCTION SUPPRESSION + ALERTE ---
    const scanAndDestroy = () => {
        const elements = document.querySelectorAll('*');
        let detected = false;

        elements.forEach(el => {
            // Si l'élément contient l'ID Blocksi (dans son HTML ou ID)
            if (el.outerHTML && (el.outerHTML.includes(BLOCKSI_ID) || el.id.toLowerCase().includes('blocksi'))) {
                // On ne supprime pas notre propre overlay ou le script
                if (el.id !== 'security-overlay' && el.tagName !== 'SCRIPT') {
                    el.remove(); // 🗑️ SUPPRESSION
                    detected = true;
                }
            }
        });

        // Si détecté et que l'utilisateur n'a pas forcé la fermeture
        if (detected && !userHidden) {
            overlay.style.display = 'block';
        }
    };

    // --- BOUCLE INFINIE (10 fois par seconde) ---
    setInterval(scanAndDestroy, 100);

    // --- RACCOURCI CLAVIER (# + b) ---
    let keys = {};
    document.addEventListener('keydown', (e) => {
        keys[e.key] = true;
        
        if (keys['#'] && (e.key.toLowerCase() === 'b')) {
            // Logique de bascule (Toggle)
            if (overlay.style.display === 'block') {
                // Si c'est ouvert -> on ferme et on retient que l'utilisateur veut que ça reste fermé
                overlay.style.display = 'none';
                userHidden = true;
                console.log("🔓 Déverrouillé manuellement.");
            } else {
                // Si c'est fermé -> on ouvre (Force Show)
                overlay.style.display = 'block';
                userHidden = false; // On réactive la protection auto
                console.log("🔒 Verrouillé manuellement.");
            }
        }
    });
    document.addEventListener('keyup', (e) => delete keys[e.key]);

    // --- COMMANDE DE TEST ---
    window.testBlocksi = function() {
        console.log("⚠️ Simulation d'une injection Blocksi...");
        const fake = document.createElement('div');
        fake.id = 'blocksi-element-test';
        fake.setAttribute('data-id', BLOCKSI_ID); // Ça va déclencher le scanAndDestroy
        fake.style.display = 'none';
        document.body.appendChild(fake);
    };

    console.log("🛡️ Système Anti-Blocksi Prêt.");
    console.log("⌨️ Raccourci : # + b pour afficher/cacher l'écran.");
    console.log("🧪 Test : tapez testBlocksi() dans la console.");
})();
