// --- CONFIGURATION ---
const FORMSPREE_URL = "https://formspree.io/f/xdabnvaa";
const eleves = [
{ massar: "F161110881", nom: "BELAHMER Lina", date: "2010-10-15" },
{ massar: "F168074796", nom: "ALHAOUL MARWA", date: "2010-09-20" },
{ massar: "F170011181", nom: "SANANE FAROUK", date: "2012-01-19" },
{ massar: "F171068232", nom: "AIT OUSTI M.HAND YASSINE", date: "2011-10-11" },
{ massar: "F171068247", nom: "SAIDY WAFAA", date: "2011-09-29" },
{ massar: "F171068276", nom: "ERREZYQY MALAK", date: "2012-01-18" },
{ massar: "F172046836", nom: "EL KARMY GHITA", date: "2011-04-23" },
{ massar: "F172068237", nom: "EL KAMASSI HASNAA", date: "2011-07-14" },
{ massar: "F172147799", nom: "El Gazane Amira", date: "2011-08-23" },
{ massar: "F172162595", nom: "ABOUFARAH MOUAD", date: "2012-03-21" },
{ massar: "F172217513", nom: "ELKABIR ZAKARIA", date: "2012-02-18" },
{ massar: "F173068235", nom: "ASOUAR HAMZA", date: "2012-01-09" },
{ massar: "F173068246", nom: "BEL HARKATI OUISSAM", date: "2011-12-27" },
{ massar: "F173184557", nom: "EL AOUFI Hajar", date: "2011-12-09" },
{ massar: "F174068275", nom: "TAJ imad eddine", date: "2011-05-27" },
{ massar: "F174175001", nom: "CHEDDAD SALMA", date: "2011-06-02" },
{ massar: "F174180656", nom: "LAAROUSSI RIHAB", date: "2011-05-01" },
{ massar: "F175081649", nom: "EL BERHOUMI OUSSAMA", date: "2011-11-14" },
{ massar: "F175145444", nom: "BATAL YOUNES", date: "2011-12-01" },
{ massar: "F175153451", nom: "LAHKIM Ali", date: "2011-08-10" },
{ massar: "F176068229", nom: "BOUMALENE MANAR", date: "2012-03-16" },
{ massar: "F177203095", nom: "TAMIMI BADR", date: "2011-10-23" },
{ massar: "F178158357", nom: "AKHDIME MOHAMED AMINE", date: "2011-11-06" },
{ massar: "G170056145", nom: "ASBAAI NADIA", date: "2011-11-04" },
{ massar: "G171033551", nom: "LABATE MOUJAHID", date: "2011-06-02" },
{ massar: "R147157038", nom: "KRIKSH NOUR", date: "2008-11-21" },
{ massar: "R149157031", nom: "OUBEL YOUNES", date: "2008-12-10" },
{ massar: "R156070154", nom: "SEKINE MAROUANE", date: "2009-07-15" },
{ massar: "F163018645", nom: "HANBAL HAYTAM", date: "2011-02-07" },
{ massar: "F171105685", nom: "Akram RAYASS", date: "2011-05-03" },
{ massar: "F172074972", nom: "AMAAR MOHAMED AMINE", date: "2012-02-26" },
{ massar: "F173008638", nom: "DERISSI MOHAMED REDA", date: "2011-11-19" },
{ massar: "F173106875", nom: "BIYI MUSTAFA", date: "2012-02-02" },
{ massar: "F173107514", nom: "NFISSI ADAM", date: "2012-02-10" },
{ massar: "F175049220", nom: "Boutat Yasser", date: "2011-06-27" },
{ massar: "F176021647", nom: "BENJAMAA OMAR", date: "2011-04-07" },
{ massar: "F177029334", nom: "YANNARA OMAR", date: "2012-03-03" },
{ massar: "F177163607", nom: "adnane abderrahmane", date: "2012-01-14" },
{ massar: "F179011836", nom: "BAKHTAR HAYTAM", date: "2011-06-21" },
{ massar: "R148132668", nom: "SAAD HAMDI", date: "2009-01-14" },
{ massar: "R151030011", nom: "HARAJ REDA", date: "2009-04-14" },
{ massar: "F179138688", nom: "TALIBI YOUSSEF", date: "2011-09-07" },
{ massar: "F165026855", nom: "AHERTOIUCH AYOUB", date: "2010-10-26" },
{ massar: "F172073613", nom: "BOUYSFI SAAD", date: "2011-05-01" },
{ massar: "F179021214", nom: "NAKACH MOHAMED", date: "2011-01-01" }
];


const primitives = ["FTORTUE", "REMPLIS", "FPOS", "POUR", "FIN", "NETTOIE", "FCC", "FEPAIS", "ELLIPSE", "SOIT", "DONNE", "REPETE", "SOMME", "DIFF"];
let currentUser = null;
let wordsStatus = {}; 
let gridData = Array(14).fill().map(() => Array(14).fill(null));

// --- 1. AUTHENTIFICATION ---
function authentifier() {
    const m = document.getElementById('massar-in').value.trim().toUpperCase();
    currentUser = eleves.find(e => e.massar === m);
    if (currentUser) {
        document.getElementById('login-overlay').style.display = 'none';
        document.getElementById('game-app').style.display = 'flex';
        initJeu();
    } else {
        alert("Identifiant incorrect.");
    }
}

// --- 2. INITIALISATION ---
function initJeu() {
    const container = document.getElementById('anagram-container');
    container.innerHTML = "";

    primitives.forEach(word => {
        // On initialise l'état de chaque primitive
        wordsStatus[word] = { unlocked: false, found: false };
        
        const div = document.createElement('div');
        div.className = 'anagram-item';
        const scrambled = word.split('').sort(() => Math.random() - 0.5).join('');
        
        div.innerHTML = `
            <span class="scrambled">${scrambled}</span>
            <input type="text" class="word-input" id="input-${word}" 
                   placeholder="Répare le mot..." oninput="verifierAtelier('${word}')">
        `;
        container.appendChild(div);
    });
    
    placerMots();
    dessinerGrille();
}

// --- 3. ATELIER (Validation par mot) ---
function verifierAtelier(original) {
    const input = document.getElementById(`input-${original}`);
    if (input.value.toUpperCase() === original) {
        input.disabled = true;
        input.style.borderColor = "#2ecc71";
        wordsStatus[original].unlocked = true; // Le mot peut maintenant être cliqué dans la grille
    }
}

// --- 4. PLACEMENT (Gestion des IDs uniques) ---
function placerMots() {
    primitives.forEach((word, idx) => {
        let placed = false;
        while (!placed) {
            let isH = Math.random() > 0.5;
            let r = Math.floor(Math.random() * (isH ? 14 : 14 - word.length));
            let c = Math.floor(Math.random() * (isH ? 14 - word.length : 14));
            
            let canPlace = true;
            for (let i = 0; i < word.length; i++) {
                if (gridData[isH ? r : r + i][isH ? c + i : c]) {
                    canPlace = false;
                    break;
                }
            }
            
            if (canPlace) {
                for (let i = 0; i < word.length; i++) {
                    // Chaque lettre stocke le NOM du mot et son ID unique (idx)
                    gridData[isH ? r : r + i][isH ? c + i : c] = {
                        char: word[i],
                        wordName: word,
                        wordId: idx 
                    };
                }
                placed = true;
            }
        }
    });
}

// --- 5. DESSIN DE LA GRILLE ---
function dessinerGrille() {
    const container = document.getElementById('grid-container');
    container.innerHTML = "";
    
    for (let r = 0; r < 14; r++) {
        for (let c = 0; c < 14; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            const data = gridData[r][c];
            
            cell.textContent = data ? data.char : String.fromCharCode(65 + Math.floor(Math.random() * 26));
            
            if (data) {
                // On injecte l'ID unique dans le HTML pour que le clic soit précis
                cell.setAttribute('data-id', data.wordId);
            }
            
            cell.onclick = () => cliquerCellule(cell, r, c);
            container.appendChild(cell);
        }
    }
}

// --- 6. CLIC (Validation par ID) ---
function cliquerCellule(cell, r, c) {
    const data = gridData[r][c];
    
    if (!data) { // Si c'est une lettre de remplissage
        cell.classList.toggle('selected');
        return;
    }

    // Sécurité : Est-ce que l'anagramme a été résolu ?
    if (!wordsStatus[data.wordName].unlocked) {
        return; 
    }

    cell.classList.add('selected');
    
    // On vérifie si TOUTES les lettres de cet ID précis sont sélectionnées
    const currentId = data.wordId;
    const allCellsOfThisWord = document.querySelectorAll(`.cell[data-id="${currentId}"]`);
    const selectedCellsOfThisWord = document.querySelectorAll(`.cell[data-id="${currentId}"].selected`);

    if (allCellsOfThisWord.length === selectedCellsOfThisWord.length) {
        allCellsOfThisWord.forEach(el => {
            el.classList.remove('selected');
            el.classList.add('found');
        });
        wordsStatus[data.wordName].found = true;
        verifierFin();
    }
}

// --- 7. BILAN FINAL ---
function verifierFin() {
    if (primitives.every(w => wordsStatus[w].found)) {
        setTimeout(() => {
            document.getElementById('feedback-overlay').style.display = 'flex';
        }, 500);
    }
}

async function envoyerDonnees() {
    const feedback = document.getElementById('user-feedback').value;
    const btn = document.getElementById('submit-btn');

    if (feedback.trim().length < 10) {
        alert("Merci de détailler un peu plus tes compétences développées.");
        return;
    }

    btn.disabled = true;
    btn.textContent = "Transmission...";

    try {
        const response = await fetch(FORMSPREE_URL, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nom: currentUser.nom,
                bilan: feedback
            })
        });

        if (response.ok) {
            document.getElementById('status-msg').textContent = "✅ Transmis avec succès !";
            setTimeout(() => location.reload(), 3000);
        }
    } catch (e) {
        btn.disabled = false;
        alert("Erreur réseau.");
    }
}
