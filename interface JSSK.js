(function() {
    // --- Styles ---
    const style = document.createElement('style');
    style.textContent = `
        #custom-dashboard {
            position: fixed; top: 20px; right: 20px; width: 300px;
            background: #2c3e50; border-radius: 12px; padding: 15px;
            z-index: 10001; display: none; /* Caché au départ */
            grid-template-columns: 1fr 1fr;
            gap: 10px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); font-family: sans-serif;
            cursor: move; user-select: none;
        }
        .dash-btn {
            border: none; border-radius: 8px; padding: 15px 5px;
            color: white; cursor: pointer; font-weight: bold; transition: 0.2s;
        }
        .dash-btn:hover { transform: scale(1.05); }
        .bottom-bar { grid-column: span 2; display: flex; gap: 10px; }
        #btn-config { width: 25%; background: #7f8c8d; }
        #btn-close-ui { width: 75%; background: #95a5a6; }
        .config-panel {
            grid-column: span 2; background: #ecf0f1; padding: 10px;
            border-radius: 8px; display: none; color: #333; font-size: 12px;
            cursor: default;
        }
        #floating-container {
            position: fixed; top: 100px; left: 100px; width: 500px; height: 400px;
            background: white; border: 4px solid #3498db; z-index: 9999;
            resize: both; overflow: auto; display: none; border-radius: 8px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.4);
        }
        #iframe-header {
            width: 100%; height: 30px; background: #3498db; cursor: move;
            display: flex; justify-content: flex-end; align-items: center;
        }
        #close-iframe { color: white; margin-right: 10px; cursor: pointer; font-weight: bold; }
        iframe { width: 100%; height: calc(100% - 30px); border: none; }
    `;
    document.head.appendChild(style);


    // --- HTML ---
    const dash = document.createElement('div');
    dash.id = 'custom-dashboard';
    dash.innerHTML = `
        <button id="btn-1" class="dash-btn" style="background: #3498db;">Iframe</button>
        <button id="btn-2" class="dash-btn" style="background: #e67e22;">Titre/Logo</button>
        <button id="btn-3" class="dash-btn" style="background: #2ecc71;">Couleur Texte</button>
        <button id="btn-4" class="dash-btn" style="background: #e74c3c;">Exec JS</button>
        <div class="bottom-bar">
            <button id="btn-config" class="dash-btn">✏️</button>
            <button id="btn-close-ui" class="dash-btn">Fermer</button>
        </div>
        <div id="config-panel" class="config-panel" onmousedown="event.stopPropagation()">
            Bouton (1-4): <input type="number" id="cfg-id" min="1" max="4" value="1" style="width:35px">
            Texte: <input type="text" id="cfg-text" style="width:80px">
            Couleur: <input type="color" id="cfg-color"><br><br>
            <button id="cfg-apply" style="width:100%">Appliquer</button>
        </div>
    `;
    document.body.appendChild(dash);


    const floatContainer = document.createElement('div');
    floatContainer.id = 'floating-container';
    floatContainer.innerHTML = `<div id="iframe-header"><span id="close-iframe">✖</span></div><iframe id="my-iframe"></iframe>`;
    document.body.appendChild(floatContainer);


    // --- Drag Logic ---
    let isDragging = false, offX, offY;
    dash.onmousedown = (e) => {
        if (e.target.closest('.dash-btn') || e.target.closest('.config-panel')) return;
        isDragging = true;
        offX = e.clientX - dash.getBoundingClientRect().left;
        offY = e.clientY - dash.getBoundingClientRect().top;
    };
    document.onmousemove = (e) => {
        if (!isDragging) return;
        dash.style.left = (e.clientX - offX) + 'px';
        dash.style.top = (e.clientY - offY) + 'px';
        dash.style.right = 'auto';
    };
    document.onmouseup = () => isDragging = false;


    // --- Actions ---
    const setFav = (u) => {
        let l = document.querySelector("link[rel*='icon']") || document.createElement('link');
        l.type='image/x-icon'; l.rel='shortcut icon'; l.href=u;
        document.head.appendChild(l);
    };


    document.getElementById('btn-1').onclick = () => {
        const u = prompt("URL :");
        if(u) { document.getElementById('my-iframe').src = u; floatContainer.style.display = 'block'; }
    };
    document.getElementById('close-iframe').onclick = () => floatContainer.style.display = 'none';


    // Drag Iframe
    const head = document.getElementById('iframe-header');
    head.onmousedown = (e) => {
        let sX = e.clientX - floatContainer.getBoundingClientRect().left;
        let sY = e.clientY - floatContainer.getBoundingClientRect().top;
        const mv = (ev) => { floatContainer.style.left = ev.pageX - sX + 'px'; floatContainer.style.top = ev.pageY - sY + 'px'; };
        document.addEventListener('mousemove', mv);
        document.onmouseup = () => document.removeEventListener('mousemove', mv);
    };


    document.getElementById('btn-2').onclick = () => {
        const c = prompt("1:Titre, 2:Classroom, 3:Pluriportail, 4:Studyo, 5:Fichier");
        if(c==="1"){const t=prompt("Titre :"); if(t) document.title=t;}
        else if(c==="2") setFav("https://www.gstatic.com/classroom/ic_product_classroom_32.png");
        else if(c==="3") setFav("https://portail.reine-marie.qc.ca/pluriportail/favicon.ico");
        else if(c==="4") setFav("https://studyo.app/apple-touch-icon.png?v=jwE6mErELGg");
        else if(c==="5"){
            const i=document.createElement('input'); i.type='file'; i.accept='image/*';
            i.onchange=(e)=>{const r=new FileReader(); r.onload=(ev)=>setFav(ev.target.result); r.readAsDataURL(e.target.files[0]);};
            i.click();
        }
    };


    document.getElementById('btn-3').onclick = () => { const c = prompt("Couleur :"); if(c) document.body.style.color = c; };
    document.getElementById('btn-4').onclick = () => { const j = prompt("JS :"); if(j) try{eval(j)}catch(e){alert(e)} };


    // --- Raccourci # + m (Toggle) ---
    let keys = {};
    document.onkeydown = (e) => {
        keys[e.key] = true;
        if (keys['#'] && (keys['q'] || keys['Q'])) {
            dash.style.display = (getComputedStyle(dash).display === 'none') ? 'grid' : 'none';
        }
    };
    document.onkeyup = (e) => delete keys[e.key];
    document.getElementById('btn-close-ui').onclick = () => dash.style.display = 'none';


    // Config
    document.getElementById('btn-config').onclick = () => {
        const p = document.getElementById('config-panel');
        p.style.display = (p.style.display === 'block') ? 'none' : 'block';
    };
    document.getElementById('cfg-apply').onclick = () => {
        const b = document.getElementById(`btn-${document.getElementById('cfg-id').value}`);
        const t = document.getElementById('cfg-text').value;
        if(t) b.innerText = t;
        b.style.background = document.getElementById('cfg-color').value;
    };


    console.log("Activé ! Appuyez sur # + m pour voir l'interface.");
})();