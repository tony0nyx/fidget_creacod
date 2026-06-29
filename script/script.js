const input = document.getElementById('todo-input');
const addButton = document.getElementById('add-button');
const todoList = document.getElementById('todo-list');
const completedCountEl = document.getElementById('completed-count');
const goalInput = document.getElementById('goal-input');
const setGoalButton = document.getElementById('set-goal-button');
const goalCountEl = document.getElementById('goal-count');
const goalTargetEl = document.getElementById('goal-target');
const expFill = document.getElementById('exp-fill');
const currentLevelEl = document.getElementById('current-level');
const nextLevelEl = document.getElementById('next-level');
const starsContainers = [
  document.getElementById('stars-container'),
  document.getElementById('stars-container2'),
  document.getElementById('stars-container3')
];
const feedbackContainer = document.getElementById('feedback-container');
const starClasses = ['star', 'star2', 'star3'];
const starEmojis = ['⭐', '🌟', '✨'];

let completedCount = 0;
let goalTarget = 5;
let goalProgress = 0;
let currentLevel = 0;

function updateGoalUI() {
  const percent = Math.round((goalProgress / goalTarget) * 100);

  currentLevelEl.textContent = currentLevel;
  nextLevelEl.textContent = currentLevel + 1;
  goalCountEl.textContent = goalProgress;
  goalTargetEl.textContent = goalTarget;
  expFill.style.width = `${percent}%`;
}

function setGoal(value) {
  goalTarget = Math.max(1, value);
  goalInput.value = goalTarget;
  goalProgress = 0;
  updateGoalUI();
}

setGoalButton.addEventListener('click', () => {
  const value = parseInt(goalInput.value, 10);
  if (!Number.isFinite(value) || value < 1) {
    return;
  }
  setGoal(value);
});

updateGoalUI();

function createStarAnimation() {
  const container = starsContainers[Math.floor(Math.random() * starsContainers.length)];
  const star = document.createElement('div');
  star.className = starClasses[Math.floor(Math.random() * starClasses.length)];
  star.textContent = starEmojis[Math.floor(Math.random() * starEmojis.length)];
  container.appendChild(star);

  star.addEventListener('animationend', () => {
    star.remove();
  });
}

function showLevelUpFeedback() {
  if (!feedbackContainer) return;

  const badge = document.createElement('div');
  badge.className = 'feedback-badge';
  badge.textContent = 'Level Up!';
  feedbackContainer.appendChild(badge);

  requestAnimationFrame(() => badge.classList.add('visible'));
  setTimeout(() => badge.remove(), 2200);

  const expSection = document.querySelector('.exp');
  if (expSection) {
    expSection.classList.add('jiggle');
    setTimeout(() => expSection.classList.remove('jiggle'), 900);
  }
}

function updateCompletedCount(delta) {
  completedCount = Math.max(0, completedCount + delta);
  let leveledUp = false;

  if (delta > 0) {
    goalProgress += delta;
    if (goalProgress >= goalTarget) {
      leveledUp = true;
      goalProgress = 0;
      currentLevel += 1;
    }
  }

  completedCountEl.textContent = completedCount;
  updateGoalUI();

  if (delta > 0) {
    for (let i = 0; i < delta; i++) {
      setTimeout(createStarAnimation, i * 100);
    }
  }

  if (leveledUp) {
    showLevelUpFeedback();
  }
}

function createTodoItem(text) {
  const item = document.createElement('li');
  item.className = 'todo-item';

  const task = document.createElement('p');
  task.className = 'task-text';
  task.textContent = text;
  task.addEventListener('click', () => {
    updateCompletedCount(1);
    todoList.removeChild(item);
  });

  const removeButton = document.createElement('button');
  removeButton.className = 'remove-button';
  removeButton.type = 'button';
  removeButton.textContent = 'Remove';
  removeButton.addEventListener('click', () => {
    if (item.classList.contains('completed')) {
      updateCompletedCount(-1);
    }
    todoList.removeChild(item);
  });

  item.appendChild(task);
  item.appendChild(removeButton);
  return item;
}

function addTodo() {
  const value = input.value.trim();
  if (!value) return;
  todoList.appendChild(createTodoItem(value));
  input.value = '';
  input.focus();
}

addButton.addEventListener('click', addTodo);
input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    addTodo();
  }
});
