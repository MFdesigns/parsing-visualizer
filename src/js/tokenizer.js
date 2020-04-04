/**
 * Copyright (c) 2020 Michel Fäh
 */

let tokenDefinitons = [];

function createTokenClasses(data) {
  tokenDefinitons = [];
  for (let i = 0; i < data.tokenDefs.length; i += 1) {
    const randomId = Math.floor(Math.random() * 1000 + 1000);
    const tokenDef = {
      name: data.tokenDefs[i].name,
      color: data.tokenDefs[i].color,
      class: `${data.tokenDefs[i].name.toLowerCase()}-${randomId}`,
    };
    tokenDefinitons.push(tokenDef);
  }
}

function displayTokenList() {
  const tokenList = document.getElementsByClassName('token-list')[0];
  const tokenItemTemp = document.getElementsByClassName('token-item-template')[0];

  // Clear token list
  tokenList.innerHTML = '';

  for (let i = 0; i < tokenDefinitons.length; i += 1) {
    const item = tokenItemTemp.content.cloneNode(true);
    item.querySelector('.token-list__item__text').textContent = tokenDefinitons[i].name;
    item.querySelector('.token-list__item__color').style.backgroundColor = tokenDefinitons[i].color;
    item.querySelector('.token-list__item').dataset.tokenDefId = i;
    tokenList.appendChild(item);
  }
}

function displayLineNumbers(numberOfLines) {
  const sourceLineNumbers = document.getElementsByClassName('tokens__line-numbers')[0];
  const maxWidth = numberOfLines.toString().length;

  // Clear line numbers
  sourceLineNumbers.innerHTML = '';

  for (let i = 0; i < numberOfLines; i += 1) {
    const lineNumber = (i + 1).toString().padStart(maxWidth, ' ');
    sourceLineNumbers.innerHTML += `${lineNumber}\n`;
  }
}

function displayTokens(data) {
  const tokenOutput = document.getElementsByClassName('tokens__output')[0];
  const tokenFragment = document.createDocumentFragment();

  // Clear token output
  tokenOutput.innerHTML = '';

  let buffer = '';
  let tokenIndex = 0;
  let numberOfLines = 0;

  for (let i = 0; i < data.source.length; i += 1) {
    const char = data.source.charAt(i);
    const token = data.tokens[tokenIndex];

    if (i === token.start) {
      const span = document.createElement('span');
      span.textContent = buffer;
      tokenFragment.appendChild(span);
      buffer = '';
    }

    buffer += char;

    if (i + 1 === token.start + token.length) {
      const tokenElement = document.createElement('span');
      tokenElement.classList.add('token-item', tokenDefinitons[token.type].class);
      tokenElement.style.backgroundColor = tokenDefinitons[token.type].color;
      tokenElement.textContent = buffer;
      tokenFragment.appendChild(tokenElement);

      if (tokenIndex < data.tokens.length - 1) {
        tokenIndex += 1;
      }
      buffer = '';
    }
    if (char === '\n') {
      numberOfLines += 1;
    }
    tokenOutput.appendChild(tokenFragment);
  }
  displayLineNumbers(numberOfLines);
}

function toggleTokenHighlight(tokenDefIndex, visible) {
  const targets = document.getElementsByClassName(tokenDefinitons[tokenDefIndex].class);
  const tokenColor = tokenDefinitons[tokenDefIndex].color;
  for (let i = 0; i < targets.length; i += 1) {
    if (visible) {
      targets[i].style.backgroundColor = tokenColor;
      targets[i].style.color = 'black';
    } else {
      targets[i].style.backgroundColor = 'transparent';
      targets[i].style.color = 'white';
    }
  }
}

// Token list toggle all on/off checkbox event
document.getElementById('token-list-toggle__checkbox').addEventListener('change', (event) => {
  for (let i = 0; i < tokenDefinitons.length; i += 1) {
    toggleTokenHighlight(i, event.target.checked);
  }
  // Toggle checkboxes of token list
  const checkboxes = document.getElementsByClassName('token-list__item__checkbox');
  for (let i = 0; i < checkboxes.length; i += 1) {
    checkboxes[i].checked = event.target.checked;
  }
});

// Token list checkbox events
document.getElementsByClassName('token-list')[0].addEventListener('change', (event) => {
  const isItemCheckbox = event.target.closest('.token-list__item');
  if (isItemCheckbox) {
    const { tokenDefId } = isItemCheckbox.dataset;
    toggleTokenHighlight(tokenDefId, event.target.checked);
  }
});

// File upload event
document.getElementsByClassName('file-input')[0].addEventListener('change', async (event) => {
  const file = event.currentTarget.files[0];
  const text = await file.text();
  const json = JSON.parse(text);
  createTokenClasses(json);
  displayTokenList();
  displayTokens(json);
});
