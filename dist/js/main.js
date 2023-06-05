let rootElement = document.documentElement;
let langButton = document.querySelector(".lang-button");
let modeButton = document.querySelector(".mode-button");
let addInput = document.querySelector(".add-task>input");
let addButton = document.querySelector(".add-task>button");
let allTasks = document.querySelector(".all-tasks");
let itemsLeft = document.querySelector(".items-left");
let filterButtons = document.querySelectorAll(".filters>button");

// language convert
langButton.onclick = () =>
  location.replace(rootElement.dir === "ltr" ? "index-rtl.html" : ".");

// mode convert
lightMode = () => {
  rootElement.removeAttribute("dark-mode");
  localStorage.removeItem("darkMode");
  modeButton.innerHTML = '<i class="fa-solid fa-moon">';
};
darkMode = () => {
  rootElement.setAttribute("dark-mode", true);
  localStorage.setItem("darkMode", true);
  modeButton.innerHTML = '<i class="fa-solid fa-sun">';
};
localStorage.darkMode ? darkMode() : lightMode();
modeButton.onclick = () => (localStorage.darkMode ? lightMode() : darkMode());

// add task button
addInput.oninput = () => (addButton.disabled = !addInput.value.trim());

// filters
let filters = {
  all: (allTasks) => allTasks,
  active: (allTasks) => allTasks.filter((e) => !e.completed),
  completed: (allTasks) => allTasks.filter((e) => e.completed),
};
let targetFilter = "all";
let updateSelectedFilter = () => {
  Array.from(filterButtons).forEach((e) => e.classList.remove("selected"));
  Array.from(filterButtons)
    .filter((e) => e.dataset.filter === targetFilter)[0]
    .classList.add("selected");
};
updateSelectedFilter();
filterButtons.forEach((e) => {
  e.onclick = (e) => {
    targetFilter = e.target.dataset.filter;
    updateSelectedFilter();
    getTasks();
  };
});

// get all tasks from api
function getTasks() {
  fetch("http://localhost:3000/tasks")
    .then((resolve) => resolve.json())
    .then((resolve) => {
      itemsLeft.textContent = resolve.filter((e) => !e.completed).length;
      [...document.getElementsByClassName("task-box")].forEach((e) =>
        e.remove()
      );
      return resolve;
    })
    .then((resolve) => filters[targetFilter](resolve))
    .then((resolve) => {
      resolve.forEach((e) => {
        // main task container box
        let taskBox = document.createElement("div");
        taskBox.classList.add("task-box");
        allTasks.appendChild(taskBox);
        // task checkbox
        let checkboxContainer = document.createElement("div");
        checkboxContainer.className = "checkbox-container";
        let taskCheckBox = document.createElement("input");
        taskCheckBox.type = "checkbox";
        checkboxContainer.appendChild(taskCheckBox);
        taskBox.appendChild(checkboxContainer);
        // task content
        let taskContent = document.createElement("p");
        taskContent.className = "task-content";
        taskContent.textContent = e.content;
        taskBox.appendChild(taskContent);
        // buttons box
        let buttonsBox = document.createElement("div");
        buttonsBox.className = "buttons-box";
        let editTask = document.createElement("button");
        editTask.className = "edit-btn";
        editTask.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
        let deleteTask = document.createElement("button");
        deleteTask.className = "delete-btn";
        deleteTask.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
        [editTask, deleteTask].forEach((e) => buttonsBox.appendChild(e));
        taskBox.appendChild(buttonsBox);
        // check task completed
        if (e.completed) {
          taskBox.classList.add("task-completed");
          editTask.disabled = true;
          taskCheckBox.checked = true;
        }
      });
      return resolve;
    });
}
getTasks();
