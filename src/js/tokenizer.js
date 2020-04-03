/**
 * Copyright (c) 2020 Michel Fäh
 */

const fileInput = document.getElementById('file-input');

function displayTokens(data) {
  const tokenOutput = document.getElementById('token-output');

  let buffer = '';
  let tokenIndex = 0;
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
  }
}

fileInput.addEventListener('change', async () => {
  const file = fileInput.files[0];
  const text = await file.text();
  const json = JSON.parse(text);
  displayTokens(json);
});
