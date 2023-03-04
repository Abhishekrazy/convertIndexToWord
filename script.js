function convertIndexToWord(indexString) {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const indexArray = indexString.split(',');
  let wordArray = [];
  indexArray.forEach(index => {
    const i = parseInt(index.trim()) - 1;
    const word = alphabet.charAt(i);
    wordArray.push(word);
  });
