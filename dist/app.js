const form = document.querySelector("form");
const input = document.querySelector("form input");
const todoList = document.querySelector(".todo__list");
const counterElement = document.querySelector(".count");
const clearButton = document.querySelector(".todo__clear-btn");
const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = document.querySelector(".theme-toggle img");
const allFilter = document.querySelector(".filters__item--all");
const activeFilter = document.querySelector(".filter__item--active");
const completedFilter = document.querySelector(".filter__item--completed");
let todos = [];
let currentFilter = "all";
let currentTheme = "light";
function loadFromStorage() {
  const savedTodos = localStorage.getItem("todos");
  const savedTheme = localStorage.getItem("theme");
  if (savedTodos) {
    todos = JSON.parse(savedTodos);
  }
  if (savedTheme) {
    currentTheme = savedTheme;
  }
}
function saveToStorage() {
  localStorage.setItem("todos", JSON.stringify(todos));
  localStorage.setItem("theme", currentTheme);
}
function getFilteredTodos() {
  if (currentFilter === "active") {
    return todos.filter((todo) => !todo.completed);
  } else if (currentFilter === "completed") {
    return todos.filter((todo) => todo.completed);
  }
  return todos;
}
function getActiveCount() {
  return todos.filter((todo) => !todo.completed).length;
}
function updateFilterButtons() {
  allFilter.classList.remove("active");
  activeFilter.classList.remove("active");
  completedFilter.classList.remove("active");
  if (currentFilter === "all") {
    allFilter.classList.add("active");
  } else if (currentFilter === "active") {
    activeFilter.classList.add("active");
  } else if (currentFilter === "completed") {
    completedFilter.classList.add("active");
  }
}
function updateAddButton() {
  const button = form.querySelector("button");
  const hasText = input.value.trim().length > 0;
  if (hasText) {
    button.style.visibility = "visible";
    button.style.opacity = "1";
  } else {
    button.style.visibility = "hidden";
    button.style.opacity = "0";
  }
}
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
function renderTodos() {
  const filteredTodos = getFilteredTodos();
  todoList.innerHTML = "";
  filteredTodos.forEach((todo) => {
    const li = document.createElement("li");
    if (todo.completed) {
      li.classList.add("completed");
    }
    li.dataset.id = todo.id.toString();
    li.innerHTML = `
      <div class="checkbox"></div>
      <span class="task-text">${escapeHtml(todo.text)}</span>
      <button class="delete-btn"></button>
    `;
    const checkbox = li.querySelector(".checkbox");
    const deleteBtn = li.querySelector(".delete-btn");
    checkbox.addEventListener("click", () => {
      const todoItem = todos.find((t) => t.id === todo.id);
      if (todoItem) {
        todoItem.completed = !todoItem.completed;
        saveToStorage();
        renderTodos();
      }
    });
    deleteBtn.addEventListener("click", () => {
      todos = todos.filter((t) => t.id !== todo.id);
      saveToStorage();
      renderTodos();
    });
    todoList.appendChild(li);
  });
  counterElement.textContent = getActiveCount().toString();
  updateFilterButtons();
}
function applyTheme() {
  document.body.setAttribute("data-theme", currentTheme);
  const iconSrc =
    currentTheme === "light"
      ? "../images/icon-moon.svg"
      : "../images/icon-sun.svg";
  themeIcon.src = iconSrc;
}
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  todos.unshift({
    id: Date.now() + Math.random(),
    text: text,
    completed: false,
  });
  input.value = "";
  updateAddButton();
  saveToStorage();
  renderTodos();
});
clearButton.addEventListener("click", () => {
  todos = todos.filter((todo) => !todo.completed);
  saveToStorage();
  renderTodos();
});
themeToggle.addEventListener("click", () => {
  currentTheme = currentTheme === "light" ? "dark" : "light";
  applyTheme();
  saveToStorage();
});
allFilter.addEventListener("click", (e) => {
  e.preventDefault();
  currentFilter = "all";
  renderTodos();
});
activeFilter.addEventListener("click", (e) => {
  e.preventDefault();
  currentFilter = "active";
  renderTodos();
});
completedFilter.addEventListener("click", (e) => {
  e.preventDefault();
  currentFilter = "completed";
  renderTodos();
});
input.addEventListener("input", updateAddButton);
document.addEventListener("DOMContentLoaded", () => {
  loadFromStorage();
  applyTheme();
  renderTodos();
});
export {};
//# sourceMappingURL=app.js.map
