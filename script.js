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
let gridData = Array(15).fill().map(() => Array(15).fill(null));

// 1. Authentification
function authentifier() {
    const code = document.getElementById('massar-in').value.trim().toUpperCase();
    currentUser = eleves.find(e => e.massar === code);
    if (currentUser) {
        document.getElementById('login-overlay').style.display = 'none';
        document.getElementById('game-app').style.display = 'flex';
        initJeu();
    } else {
        alert("Identifiant non reconnu.");
    }
}

// 2. Préparation de l'atelier
function initJeu() {
    const container = document.getElementById('anagram-container');
    motsTexteur.forEach(word => {
        wordsStatus[word] = { unlocked: false, found: false };
        const div = document.createElement('div');
        div.className = 'anagram-item';
        
        // Mélange des lettres
        const scrambled = word.split('').sort(() => Math.random() - 0.5).join('');
        
        div.innerHTML = `
            <span class="scrambled">Lettres : ${scrambled}</span>
            <input type="text" class="word-input" id="input-${word}" 
                   placeholder="Devine le mot..." oninput="verifierAtelier('${word}')">
        `;
        container.appendChild(div);
    });
    placerMots();
    dessinerGrille();
}

// 3. Validation de l'anagramme
function verifierAtelier(original) {
    const input = document.getElementById(`input-${original}`);
    if (input.value.toUpperCase() === (original === "ENTETE" ? "EN-TÊTE" : original).replace("-", "").replace("Ê", "E")) {
        // Note : On simplifie la saisie pour l'élève (sans accent)
    }
    // Version simplifiée pour la comparaison directe :
    if (input.value.toUpperCase() === original) {
        input.disabled = true;
        input.style.borderColor = "var(--success)";
        wordsStatus[original].unlocked = true;
    }
}

// 4. Algorithme de placement avec ID UNIQUE (Anti-bug doublons)
function placerMots() {
    motsTexteur.forEach((word, idx) => {
        let placed = false;
        while (!placed) {
            let horizontal = Math.random() > 0.5;
            let r = Math.floor(Math.random() * (horizontal ? 15 : 15 - word.length));
            let c = Math.floor(Math.random() * (horizontal ? 15 - word.length : 15));
            
            let possible = true;
            for(let i=0; i<word.length; i++) {
                if (gridData[horizontal ? r : r+i][horizontal ? c+i : c]) {
                    possible = false; break;
                }
            }
            
            if (possible) {
                for(let i=0; i<word.length; i++) {
                    gridData[horizontal ? r : r+i][horizontal ? c+i : c] = { 
                        char: word[i], wordName: word, wordId: idx 
                    };
                }
                placed = true;
            }
        }
    });
}

// 5. Rendu de la grille
function dessinerGrille() {
    const container = document.getElementById('grid-container');
    container.innerHTML = "";
    for (let r = 0; r < 15; r++) {
        for (let c = 0; c < 15; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            const data = gridData[r][c];
            cell.textContent = data ? data.char : String.fromCharCode(65 + Math.floor(Math.random() * 26));
            if (data) cell.setAttribute('data-id', data.wordId);
            cell.onclick = () => cliquerCellule(cell, r, c);
            container.appendChild(cell);
        }
    }
}

// 6. Gestion du clic
function cliquerCellule(cell, r, c) {
    const data = gridData[r][c];
    if (!data || !wordsStatus[data.wordName].unlocked) return;

    cell.classList.add('selected');
    const id = data.wordId;
    const wordCells = document.querySelectorAll(`.cell[data-id="${id}"]`);
    const selectedCells = document.querySelectorAll(`.cell[data-id="${id}"].selected`);

    if (wordCells.length === selectedCells.length) {
        wordCells.forEach(el => {
            el.classList.remove('selected');
            el.classList.add('found');
        });
        wordsStatus[data.wordName].found = true;
        verifierFin();
    }
}

function verifierFin() {
    if (motsTexteur.every(w => wordsStatus[w].found)) {
        setTimeout(() => document.getElementById('feedback-overlay').style.display = 'flex', 600);
    }
}

// 7. Envoi Formspree
async function envoyerDonnees() {
    const feedback = document.getElementById('user-feedback').value;
    if (feedback.trim().length < 10) return alert("Décris un peu plus tes compétences !");
    
    const btn = document.getElementById('submit-btn');
    btn.disabled = true;
    btn.textContent = "Envoi...";

    try {
        const response = await fetch(FORMSPREE_URL, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                eleve: currentUser.nom,
                bilan: feedback,
                sujet: "Traitement de texte"
            })
        });
        if (response.ok) {
            alert("Bilan envoyé ! Bravo.");
            location.reload();
        }
    } catch (e) {
        btn.disabled = false;
        alert("Erreur de connexion.");
    }
}
