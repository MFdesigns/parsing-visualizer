/**
 * Copyright (c) 2020 Michel Fäh
 */

const fileInput = document.getElementsByClassName('file-input')[0];
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
  const tokenList = document.querySelector('.token-list > ul');
  for (let i = 0; i < tokenDefinitons.length; i += 1) {
    const tokenLi = document.createElement('li');
    tokenLi.textContent = tokenDefinitons[i].name;

    const tokenColor = document.createElement('div');
    tokenColor.classList.add('token-list-color');
    tokenColor.style.backgroundColor = tokenDefinitons[i].color;

    tokenLi.appendChild(tokenColor);
    tokenList.appendChild(tokenLi);
  }
}

function displayLineNumbers(numberOfLines) {
  const sourceLineNumbers = document.getElementsByClassName('tokens__line-numbers')[0];
  const maxWidth = numberOfLines.toString().length;

  for (let i = 0; i < numberOfLines; i += 1) {
    const lineNumber = (i + 1).toString().padStart(maxWidth, ' ');
    sourceLineNumbers.innerHTML += `${lineNumber}\n`;
  }
}

function displayTokens(data) {
  const tokenOutput = document.getElementsByClassName('tokens__output')[0];

  let buffer = '';
  let tokenIndex = 0;
  let numberOfLines = 0;

  for (let i = 0; i < data.source.length; i += 1) {
    const char = data.source.charAt(i);
    const token = data.tokens[tokenIndex];

    if (i === token.start) {
      tokenOutput.innerHTML += buffer;
      buffer = '';
    }

    buffer += char;

    if (i + 1 === token.start + token.length) {
      const tokenColor = data.tokenDefs[token.type].color;
      const tokenElement = document.createElement('span');
      tokenElement.style.backgroundColor = tokenColor;
      tokenElement.textContent = buffer;
      tokenOutput.appendChild(tokenElement);

      if (tokenIndex < data.tokens.length - 1) {
        tokenIndex += 1;
      }
      buffer = '';
    }

    if (char === '\n') {
      numberOfLines += 1;
    }
  }

  displayLineNumbers(numberOfLines);
}

fileInput.addEventListener('change', async () => {
  const file = fileInput.files[0];
  const text = await file.text();
  const json = JSON.parse(text);
  createTokenClasses(json);
  displayTokenList();
  displayTokens(json);
});
