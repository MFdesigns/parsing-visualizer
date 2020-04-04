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
      const tokenColor = data.tokenDefs[token.type].color;
      const tokenElement = document.createElement('span');
      tokenElement.style.backgroundColor = tokenColor;
      tokenElement.classList.add('token-item');
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

document.getElementsByClassName('file-input')[0].addEventListener('change', async (event) => {
  const file = event.currentTarget.files[0];
  const text = await file.text();
  const json = JSON.parse(text);
  createTokenClasses(json);
  displayTokenList();
  displayTokens(json);
});
