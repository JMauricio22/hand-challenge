const MAX_BYTE = 255;
const MIN_BYTE = 0;

function checkValue (value) {
  if (value > MAX_BYTE) return MIN_BYTE;
  if (value < MIN_BYTE) return MAX_BYTE;
  return value
}

function getNextFist (instructions, index) {
  const loopStack = [];
  loopStack.push(index);
  let newIndex = index + 1;
  while (loopStack.length) {
    if (instructions[newIndex] === '🤜') {
      loopStack.push(newIndex);
    } else if (instructions[newIndex] === '🤛') {
      loopStack.pop();
      if (!loopStack.length) {
        continue;
      }
    }
    newIndex++;
  }
  return newIndex;
}
function getPrevFist (instructions, index) {
  const loopStack = [];
  loopStack.push(index);
  let newIndex = index - 1;
  while (loopStack.length) {
    if (instructions[newIndex] === '🤛') {
      loopStack.push(newIndex);
    } else if (instructions[newIndex] === '🤜') {
      loopStack.pop();
      if (!loopStack.length) {
        continue;
      }
    }
    newIndex--;
  }
  return newIndex;
}

function translate (input) {
  let index = 0;
  let pointer = 0;
  let output = '';
  const memory = [];
  const instructions = Array.from(input);
  const actions = {
    '👉': () => pointer++,
    '👈': () => pointer--,
    '👆': () => {
      const value = memory[pointer];
      memory[pointer] = checkValue((value ?? 0) + 1)
    },
    '👇': () => {
      const value = memory[pointer];
      memory[pointer] = checkValue((value ?? 0) - 1)
    },
    '🤜': () => {
      const cellValue = memory[pointer];
      if (!cellValue) {
        index = getNextFist(instructions, index);
      }
    },
    '🤛': () => {
      const cellValue = memory[pointer];
      if (cellValue) {
        index = getPrevFist(instructions, index)
      }
    },
    '👊': () => {
      output += String.fromCharCode(memory[pointer]);
    },
  };

  while (index < instructions.length) {
    actions[instructions[index]]();
    index++;
  }

  return output.replace(/\s$/g, '');
}

module.exports = translate;
