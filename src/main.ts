import { SCRIPT_CONTENT } from './list';
import './style.css'

const WORDS = {
  allowed: new Set<string>(),
  solutions: new Set<string>()
};

function getInputFields() {

  const inputLetter1 = (document.querySelector('.letter-1') as HTMLInputElement);
  const inputLetter2 = (document.querySelector('.letter-2') as HTMLInputElement);
  const inputLetter3 = (document.querySelector('.letter-3') as HTMLInputElement);
  const inputLetter4 = (document.querySelector('.letter-4') as HTMLInputElement);
  const inputLetter5 = (document.querySelector('.letter-5') as HTMLInputElement);

  return [inputLetter1, inputLetter2, inputLetter3, inputLetter4, inputLetter5];
}

function getMatches() {

  const [inputLetter1, inputLetter2, inputLetter3, inputLetter4, inputLetter5] = getInputFields();
  
  const word = [
    inputLetter1.value.slice(0, 1).toUpperCase() || '_',
    inputLetter2.value.slice(0, 1).toUpperCase() || '_',
    inputLetter3.value.slice(0, 1).toUpperCase() || '_',
    inputLetter4.value.slice(0, 1).toUpperCase() || '_',
    inputLetter5.value.slice(0, 1).toUpperCase() || '_'
  ].join('');

  const greysTextArea = (document.querySelector('.grey-letters') as HTMLTextAreaElement);

  const greys = (greysTextArea.value || '');

  const matches: string[] = [];

  WORDS.solutions.forEach(sol => {
    if (wordMatches(sol, word, greys)) {
      matches.push(sol);
    }
  });

  console.log('get words =>', word, greys, matches);

  return matches;

}

function wordMatches(word: string, input: string, greys = '') {
  if (typeof word !== 'string' || typeof input !== 'string') {
    return false;
  }

  if (
    (input[0] === '_' && !greys.includes(word[0]) || input[0] === word[0]) &&
    (input[1] === '_' && !greys.includes(word[1])  || input[1] === word[1]) &&
    (input[2] === '_' && !greys.includes(word[2])  || input[2] === word[2]) &&
    (input[3] === '_' && !greys.includes(word[3])  || input[3] === word[3]) &&
    (input[4] === '_' && !greys.includes(word[4])  || input[4] === word[4])
  ) {
    return true;
  }

  return false;
}

function setStatus(state?: 'ready' | 'loading' | 'error') {

  const sp = document.body.querySelector('.status-text') as HTMLSpanElement;
  
  if (state === 'loading') {
    sp.classList.remove('error');
    sp.classList.remove('ready');
    sp.classList.add('loading');
  }

  if (state === 'error') {
    sp.classList.remove('loading');
    sp.classList.remove('ready');
    sp.classList.add('error');
  }

  if (state === 'ready') {
    sp.classList.remove('error');
    sp.classList.remove('loading');
    sp.classList.add('ready');
  }

  if (state) {
    sp.innerText = state;
  }

  const asp = document.body.querySelector('.allowed-text') as HTMLSpanElement;
  const ssp = document.body.querySelector('.solutions-text') as HTMLSpanElement;

  asp.innerText = WORDS.allowed.size + '';
  ssp.innerText = WORDS.solutions.size + '';

}

// called on startup
function updateStatus() {
  setStatus('loading');
  updateScriptContent()
  setStatus('ready');
}

function updateScriptContent() {

  const scriptContent = SCRIPT_CONTENT;

  const allowListStartI = scriptContent.indexOf('[');
  const allowListEndI = scriptContent.indexOf(']');
  const allowListString = scriptContent.substring(allowListStartI, allowListEndI) + ']';

  const allowList = JSON.parse(allowListString);

  const solutionsStartI = scriptContent.indexOf('[', allowListEndI + 1);
  const solutionsEndI = scriptContent.indexOf(']', allowListEndI + 1);

  const solutionsString = scriptContent.substring(solutionsStartI, solutionsEndI) + ']';

  const solutions = JSON.parse(solutionsString);
  

  WORDS.allowed.clear();
  WORDS.solutions.clear();

  if (Array.isArray(solutions)) {
    solutions.sort();
    solutions.forEach(word => {
      WORDS.solutions.add(word);
    });
  }

  if (Array.isArray(allowList)) {
    allowList.sort();
    allowList.forEach(word => {
      if (!WORDS.solutions.has(word)) {
        WORDS.allowed.add(word);
      }
    });
  }


}


document.addEventListener('DOMContentLoaded', () => {

  updateStatus();

  const b = document.querySelector('#GET_WORDS') as HTMLButtonElement;

  b.addEventListener('click', () => {
    const matches = getMatches();
    const div = document.body.querySelector('.matches-container') as HTMLDivElement;
    div.innerText = matches.join(', ');
  });

  const inputLetters = getInputFields();

  inputLetters.forEach(inp => {
    
    inp.addEventListener('input', e => {
      let letter = typeof e.data === 'string' ? e.data.toUpperCase() : '_';

      if (!/^[A-Z_]$/.test(letter)) {
        letter = '_';
      }

      inp.value = letter;
      
      if (letter !== '_') {
        const ind = Math.max(0, inputLetters.indexOf(inp!));
        inputLetters[Math.min(4, ind + 1)].focus();
      }    
    });


  });

  document.body.addEventListener('keyup', e => {

    if (e.key === 'Delete' || e.key === 'Backspace') {
      const selectedInputLetter = inputLetters.find(inp => document.activeElement === inp);
      const ind = inputLetters.indexOf(selectedInputLetter!);

      if (selectedInputLetter) {
        selectedInputLetter.value = '_';
        inputLetters[Math.max(0, ind - 1)].focus();
      }
    }

  });

  const greysTA = document.body.querySelector('.grey-letters') as HTMLTextAreaElement;

  greysTA.addEventListener('input', e => {
    
    const upperText = greysTA.value.toUpperCase();
    const cc = (e.data || '').charCodeAt(0);
    console.log('input ', e.data, cc);

    const [min, max] = ['A'.charCodeAt(0), 'Z'.charCodeAt(0)];

    let finalText = upperText.split('').filter(c => c.charCodeAt(0) >= min && c.charCodeAt(0) <= max).join('');
    
    greysTA.value = finalText;
  });

});