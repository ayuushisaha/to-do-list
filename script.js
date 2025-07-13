const addBtn = document.getElementById('addBtn');
const taskInput = document.getElementById('taskInput');
const descriptionInput = document.getElementById('descriptionInput');
const categorySelect = document.getElementById('categorySelect');
const dueDateInput = document.getElementById('dueDate');
const prioritySelect = document.getElementById('prioritySelect');
const colorToggleBtn = document.getElementById('colorToggleBtn');
const doneCountSpan = document.getElementById('doneCount');
const leftCountSpan = document.getElementById('leftCount');
const progressFill = document.getElementById('progressFill');

let totalTasks = 0;
let completedTasks = 0;

// Apply theme from localStorage on page load
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
}

// Dark/light toggle with localStorage
colorToggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Task adding logic
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTask();
});

function addTask() {
  const title = taskInput.value.trim();
  const description = descriptionInput.value.trim();
  const category = categorySelect.value;
  const dueDate = dueDateInput.value;
  const priority = prioritySelect.value.toLowerCase();

  if (!title) return;

  const li = document.createElement('li');
  li.classList.add(priority);

  const titleEl = document.createElement('div');
  titleEl.textContent = title;

  if (description) {
    const descEl = document.createElement('div');
    descEl.className = 'details';
    descEl.textContent = `Note: ${description}`;
    li.appendChild(descEl);
  }

  const info = document.createElement('span');
  info.className = 'details';
  info.textContent = `Due: ${dueDate || 'None'} | Priority: ${priority.charAt(0).toUpperCase() + priority.slice(1)}`;

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.textContent = '✕';
  deleteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (li.classList.contains('completed')) completedTasks--;
    li.remove();
    totalTasks--;
    updateProgress();
  });

  li.appendChild(titleEl);
  li.appendChild(info);
  li.appendChild(deleteBtn);

  li.addEventListener('click', () => {
    li.classList.toggle('completed');
    li.classList.contains('completed') ? completedTasks++ : completedTasks--;
    updateProgress();
  });

  document.getElementById(category).appendChild(li);

  taskInput.value = '';
  descriptionInput.value = '';
  dueDateInput.value = '';
  prioritySelect.value = 'urgent-important';

  totalTasks++;
  updateProgress();
}

function updateProgress() {
  doneCountSpan.textContent = `Done: ${completedTasks}`;
  leftCountSpan.textContent = `Left: ${totalTasks - completedTasks}`;
  const percent = totalTasks ? (completedTasks / totalTasks) * 100 : 0;
  progressFill.style.width = `${percent}%`;
}
