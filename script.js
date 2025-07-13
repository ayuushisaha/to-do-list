const form = document.getElementById('todo-form');
const taskInput = document.getElementById('task-input');
const categoryInput = document.getElementById('task-category');
const todoList = document.getElementById('todo-list');
const themeToggle = document.getElementById('toggle-theme');
const filters = document.querySelectorAll('.filters button');
const statsBox = document.getElementById('task-stats');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let filter = 'all';

function renderTasks() {
  todoList.innerHTML = '';
  statsBox.innerHTML = '';

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  filteredTasks.forEach((task, index) => {
    const li = document.createElement('li');
    if (task.completed) li.classList.add('completed');

    const span = document.createElement('span');
    span.textContent = `[${task.category}] ${task.text}`;
    span.onclick = () => editTask(index);

    const actions = document.createElement('div');
    actions.className = 'actions';

    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = task.completed ? '✅' : '☑️';
    toggleBtn.onclick = () => {
      tasks[index].completed = !tasks[index].completed;
      saveAndRender();
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑️';
    deleteBtn.onclick = () => {
      tasks.splice(index, 1);
      saveAndRender();
    };

    actions.appendChild(toggleBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(span);
    li.appendChild(actions);
    todoList.appendChild(li);
  });

  const total = tasks.length;
  const done = tasks.filter(t => t.completed).length;
  const remaining = total - done;

  let categoryStats = {};
  tasks.forEach(task => {
    const cat = task.category;
    if (!categoryStats[cat]) categoryStats[cat] = { total: 0, done: 0 };
    categoryStats[cat].total += 1;
    if (task.completed) categoryStats[cat].done += 1;
  });

  let statsHtml = `<p><strong>Overall:</strong> ${done} done / ${remaining} left</p>`;
  statsHtml += `<ul>`;
  for (let cat in categoryStats) {
    const { total, done } = categoryStats[cat];
    const left = total - done;
    const displayName = {
      personal: 'Personal',
      health: 'Health',
      official: 'Official',
      other: 'Other Activities'
    }[cat] || cat;

    statsHtml += `<li><strong>${displayName}</strong>: ${done} done / ${left} left</li>`;
  }
  statsHtml += `</ul>`;

  statsBox.innerHTML = statsHtml;
}

function editTask(index) {
  const newText = prompt('Edit your task:', tasks[index].text);
  if (newText !== null && newText.trim() !== '') {
    tasks[index].text = newText.trim();
    saveAndRender();
  }
}

function saveAndRender() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const taskText = taskInput.value.trim();
  const category = categoryInput.value;
  if (taskText) {
    tasks.push({ text: taskText, completed: false, category });
    taskInput.value = '';
    saveAndRender();
  }
});

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

filters.forEach(btn => {
  btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filter = btn.dataset.filter;
    renderTasks();
  });
});

renderTasks();
