export const WORLDS = [
  { id: 1, name: 'Number Land', topic: 'Counting & number recognition', emoji: '🔢', color: '#ffe6a7' },
  { id: 2, name: 'Addition Island', topic: 'Addition', emoji: '➕', color: '#c9f2df' },
  { id: 3, name: 'Subtraction Valley', topic: 'Subtraction', emoji: '➖', color: '#d9e9ff' },
  { id: 4, name: 'Multiplication Mountain', topic: 'Multiplication', emoji: '✖️', color: '#f7d9ef' },
  { id: 5, name: 'Division Desert', topic: 'Division', emoji: '➗', color: '#ffe0c2' },
  { id: 6, name: 'Fraction Forest', topic: 'Fractions', emoji: '🍰', color: '#dceec7' },
  { id: 7, name: 'Geometry City', topic: 'Shapes & geometry', emoji: '🔺', color: '#e7ddff' },
  { id: 8, name: 'Measurement World', topic: 'Time, length & weight', emoji: '📏', color: '#cceff2' },
  { id: 9, name: 'Math Challenge Castle', topic: 'Mixed operations & word problems', emoji: '🏰', color: '#f9d8d5' },
  { id: 10, name: 'Math Champion Kingdom', topic: 'Mixed challenges', emoji: '👑', color: '#f8edb8' },
];

export const QUESTIONS_PER_LEVEL = 5;

export function getLevelWorld(level) {
  return WORLDS[Math.floor((level - 1) / 10)];
}

const makeQuestion = (prompt, answer, hint) => {
  const choices = new Set([answer]);
  let distance = 1;
  while (choices.size < 4) {
    const candidates = [answer - distance, answer + distance, answer + distance * 2];
    candidates.forEach(candidate => {
      if (choices.size < 4 && candidate !== answer && candidate >= 0) choices.add(candidate);
    });
    distance += 1;
  }
  return {
    prompt,
    answer,
    hint,
    choices: [...choices].sort(() => Math.random() - 0.5),
  };
};

export function createQuestion(level) {
  const world = getLevelWorld(level);
  const withinWorld = ((level - 1) % 10) + 1;
  const n = Math.max(5, withinWorld * 3);
  let a, b, answer;

  switch (world.id) {
    case 1:
      a = Math.floor(Math.random() * (withinWorld + 5));
      return makeQuestion(`What number comes after ${a}?`, a + 1, 'Count one step forward.');
    case 2:
      a = Math.floor(Math.random() * n);
      b = Math.floor(Math.random() * n);
      return makeQuestion(`${a} + ${b} = ?`, a + b, 'Put the two groups together.');
    case 3:
      a = Math.floor(Math.random() * n) + 1;
      b = Math.floor(Math.random() * (a + 1));
      return makeQuestion(`${a} − ${b} = ?`, a - b, 'Start with the first number and take away.');
    case 4:
      a = Math.floor(Math.random() * Math.min(12, withinWorld + 2)) + 1;
      b = Math.floor(Math.random() * 10) + 1;
      return makeQuestion(`${a} × ${b} = ?`, a * b, 'Think of equal groups.');
    case 5:
      b = Math.floor(Math.random() * 9) + 1;
      answer = Math.floor(Math.random() * 10) + 1;
      a = b * answer;
      return makeQuestion(`${a} ÷ ${b} = ?`, answer, 'How many equal groups can you make?');
    case 6:
      if (withinWorld <= 5) {
        const whole = (withinWorld + 1) * 2;
        return makeQuestion(`What is half of ${whole}?`, withinWorld + 1, 'Half means divide into two equal parts.');
      }
      return makeQuestion('One whole pizza is divided into 4 equal slices. How many slices make 1/2?', 2, 'Two quarter-slices make one half.');
    case 7: {
      const shapes = [
        ['How many sides does a triangle have?', 3],
        ['How many sides does a square have?', 4],
        ['How many sides does a pentagon have?', 5],
        ['How many corners does a rectangle have?', 4],
        ['How many sides does a hexagon have?', 6],
      ];
      const item = shapes[Math.floor(Math.random() * shapes.length)];
      return makeQuestion(item[0], item[1], 'Think about the outline of the shape.');
    }
    case 8: {
      const questions = [
        ['How many centimetres are in 1 metre?', 100],
        ['How many minutes are in 1 hour?', 60],
        ['How many days are in 1 week?', 7],
        ['How many months are in 1 year?', 12],
      ];
      const item = questions[Math.floor(Math.random() * questions.length)];
      return makeQuestion(item[0], item[1], 'Remember the common measurement units.');
    }
    case 9: {
      const operation = Math.floor(Math.random() * 3);
      if (operation === 0) {
        a = Math.floor(Math.random() * 20) + 5;
        b = Math.floor(Math.random() * 8) + 2;
        return makeQuestion(`${a} + ${b} − 3 = ?`, a + b - 3, 'Work from left to right.');
      }
      if (operation === 1) {
        a = Math.floor(Math.random() * 8) + 3;
        b = Math.floor(Math.random() * 5) + 2;
        return makeQuestion(`${a} × ${b} + 4 = ?`, a * b + 4, 'Multiply before adding.');
      }
      a = Math.floor(Math.random() * 5) + 3;
      return makeQuestion(`Sam has ${a} bags with 4 apples in each. How many apples are there?`, a * 4, 'Multiply the number of bags by apples in each bag.');
    }
    default:
      a = Math.floor(Math.random() * 12) + 2;
      b = Math.floor(Math.random() * 10) + 1;
      return makeQuestion(`${a} + ${b} × 2 = ?`, a + b * 2, 'Do multiplication before addition.');
  }
}
