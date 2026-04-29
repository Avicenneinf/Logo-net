const primitivesData = [
    { mot: "FTORTUE" }, { mot: "REMPLIS" }, { mot: "FPOS" }, { mot: "POUR" }, 
    { mot: "FIN" }, { mot: "NETTOIE" }, { mot: "FCC" }, { mot: "FEPAIS" }, 
    { mot: "CONSOLE" }, { mot: "TORTUE" }, { mot: "EDITEUR" }, 
    { mot: "PROCEDURE" }, { mot: "PARAMETRE" }
];

const gridSize = 14;
const gridElement = document.getElementById('grid-container');
const listElement = document.getElementById('list-items');

let grid = Array(gridSize).fill().map(() => Array(gridSize).fill(''));
let firstCell = null;
let solvedWords = new Set(); 

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function scrambleWord(word) {
    let scrambled = shuffleArray(word.split('')).join('');
    return (scrambled === word && word.length > 1) ? scrambleWord(word) : scrambled;
}

function setupGame() {
    const shuffledForList = shuffleArray([...primitivesData]);
    shuffledForList.forEach(item => {
        let placed = false;
        let attempts = 0;
        while (!placed && attempts < 200) {
            let dir = Math.random() > 0.5 ? 'H' : 'V';
            let r = Math.floor(Math.random() * gridSize);
            let c = Math.floor(Math.random() * gridSize);
            if (canPlace(item.mot, r, c, dir)) {
                for (let i = 0; i < item.mot.length; i++) {
                    let currR = (dir === 'H') ? r : r + i;
                    let currC = (dir === 'H') ? c + i : c;
                    grid[currR][currC] = { char: item.mot[i], word: item.mot };
                }
                placed = true;
                createAnagramUI(item.mot);
            }
            attempts++;
        }
    });
    renderGridUI();
}

function canPlace(word, row, col, dir) {
    if (dir === 'H' && col + word.length > gridSize) return false;
    if (dir === 'V' && row + word.length > gridSize) return false;
    for (let i = 0; i < word.length; i++) {
        if (grid[dir === 'H' ? row : row + i][dir === 'H' ? col + i : col] !== '') return false;
    }
    return true;
}

function createAnagramUI(originalWord) {
    const container = document.createElement('li');
    container.id = `container-${originalWord}`;
    container.className = "anagram-container";
    
    const icon = document.createElement('span');
    icon.className = "status-icon";
    icon.textContent = "🔒";
    
    const lettersDiv = document.createElement('div');
    lettersDiv.className = "scrambled-letters";
    
    let currentLetters = scrambleWord(originalWord).split('');
    let selectedIdx = null;

    function renderLetters() {
        lettersDiv.innerHTML = '';
        currentLetters.forEach((char, idx) => {
            const box = document.createElement('span');
            box.className = "letter-box";
            if (selectedIdx === idx) box.classList.add('active');
            box.textContent = char;
            box.onclick = () => {
                if (solvedWords.has(originalWord)) return;
                if (selectedIdx === null) {
                    selectedIdx = idx;
                } else {
                    [currentLetters[selectedIdx], currentLetters[idx]] = [currentLetters[idx], currentLetters[selectedIdx]];
                    selectedIdx = null;
                    if (currentLetters.join('') === originalWord) {
                        solvedWords.add(originalWord);
                        container.classList.add('solved');
                        icon.textContent = "🔓";
                    }
                }
                renderLetters();
            };
            lettersDiv.appendChild(box);
        });
    }
    renderLetters();
    container.append(icon, lettersDiv);
    listElement.appendChild(container);
}

function renderGridUI() {
    gridElement.innerHTML = '';
    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            const cell = grid[r][c];
            const div = document.createElement('div');
            div.className = 'cell';
            div.textContent = cell ? cell.char : String.fromCharCode(65 + Math.floor(Math.random() * 26));
            if (cell) div.dataset.word = cell.word;
            div.onclick = () => handleGridSelection(div);
            gridElement.appendChild(div);
        }
    }
}

function handleGridSelection(el) {
    if (el.classList.contains('found')) return;
    if (!firstCell) {
        firstCell = el;
        el.classList.add('selected');
    } else {
        const word = el.dataset.word;
        if (word && word === firstCell.dataset.word && el !== firstCell) {
            if (solvedWords.has(word)) {
                validateWord(word);
                firstCell = null;
            } else {
                alert("Ordonne d'abord les lettres de ce mot à droite !");
                resetSelection();
            }
        } else {
            resetSelection();
            if (el !== firstCell) { firstCell = el; el.classList.add('selected'); }
            else { firstCell = null; }
        }
    }
}

function resetSelection() {
    document.querySelectorAll('.cell.selected').forEach(c => c.classList.remove('selected'));
}

function validateWord(word) {
    document.querySelectorAll(`.cell[data-word="${word}"]`).forEach(c => {
        c.classList.remove('selected');
        c.classList.add('found');
    });
    const container = document.getElementById(`container-${word}`);
    if (container) {
        container.classList.add('found-text');
        container.querySelector('.status-icon').textContent = "✅";
    }
    if (document.querySelectorAll('.anagram-container.found-text').length === primitivesData.length) {
        setTimeout(() => { document.getElementById('final-modal').style.display = 'block'; }, 800);
    }
}

setupGame();
