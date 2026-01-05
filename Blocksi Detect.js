(function() {
    const blocksiID = "ghlpmldmjjhmdgmneoaibbegkjjbonbk";


    // --- Styles de l'alerte ---
    const style = document.createElement('style');
    style.textContent = `
        .blocksi-alert {
            position: fixed; 
            top: 30px; 
            right: 30px;
            background: rgba(231, 76, 60, 0.5); 
            color: white; 
            padding: 20px 40px; 
            border-radius: 12px; 
            font-family: 'Segoe UI', sans-serif;
            font-size: 22px; 
            font-weight: 800; 
            z-index: 10005;
            box-shadow: 0 8px 25px rgba(0,0,0,0.2);
            backdrop-filter: blur(4px);
            animation: slideIn 0.4s ease-out;
            border: 2px solid rgba(255, 255, 255, 0.2);
            pointer-events: none;
            text-transform: uppercase;
        }
        @keyframes slideIn {
            from { transform: translateX(120%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        .fade-out {
            transition: 0.4s !important;
            opacity: 0 !important;
            transform: translateX(50px) !important;
        }
    `;
    document.head.appendChild(style);


    // --- Fonction de gestion de l'alerte ---
    window.sendBlocksiAlert = function(msg, isSafe = false) {
        const existingAlert = document.querySelector('.blocksi-alert');
        
        // SI UNE ALERTE EXISTE DÉJÀ : On la retire (Toggle)
        if (existingAlert) {
            existingAlert.classList.add('fade-out');
            setTimeout(() => existingAlert.remove(), 400);
            return; 
        }


        // SINON : On la crée
        const alertDiv = document.createElement('div');
        alertDiv.className = 'blocksi-alert';
        
        if (isSafe) {
            alertDiv.style.background = "rgba(52, 152, 219, 0.5)";
        }


        alertDiv.innerText = msg;
        document.body.appendChild(alertDiv);


        // Disparition automatique après 5s (sauf si fermée manuellement avant)
        alertDiv.autoTimer = setTimeout(() => {
            if (document.body.contains(alertDiv)) {
                alertDiv.classList.add('fade-out');
                setTimeout(() => alertDiv.remove(), 400);
            }
        }, 5000);
    };


    // --- Détection ---
    const checkBlocksi = () => {
        const elements = document.querySelectorAll('*');
        for (let el of elements) {
            if (el.outerHTML && (el.outerHTML.includes(blocksiID) || el.id.toLowerCase().includes('blocksi'))) {
                sendBlocksiAlert("Blocksi Actif");
                return true;
            }
        }
        return false;
    };


    // --- Raccourci Toggle : # + B ---
    let keys = {};
    document.addEventListener('keydown', (e) => {
        keys[e.key] = true;
        if (keys['#'] && (e.key.toLowerCase() === 'b')) {
            const existingAlert = document.querySelector('.blocksi-alert');
            
            if (existingAlert) {
                // Si elle est là, on l'enlève direct
                sendBlocksiAlert(); 
            } else {
                // Sinon on check
                if (!checkBlocksi()) {
                    sendBlocksiAlert("Blocksi Désactivé", true);
                }
            }
        }
    });
    document.addEventListener('keyup', (e) => delete keys[e.key]);


    // Test Console
    window.testBlocksi = () => sendBlocksiAlert("Blocksi Actif");


    console.log("Système Toggle Blocksi configuré [#+b]");
})();