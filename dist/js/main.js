let mainAPI = "http://localhost:3000/tasks/";
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
filterButtons.forEach((e) => {
  e.onclick = (e) => {
    targetFilter = e.target.dataset.filter;
    updateSelectedFilter();
    getTasks();
  };
});

// get all tasks from api
async function getTasks() {
  return await fetch(mainAPI)
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
        taskBox.dataset.taskId = e.id;
        allTasks.appendChild(taskBox);
        // task checkbox
        let checkboxContainer = document.createElement("div");
        checkboxContainer.className = "checkbox-container";
        let taskCheckBox = document.createElement("input");
        taskCheckBox.type = "checkbox";
        taskCheckBox.onclick = (event) => {
          fetch(mainAPI + e.id, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              completed: event.target.checked,
            }),
          }).then(() => getTasks());
        };
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
        deleteTask.onclick = () => {
          fetch(mainAPI + e.id, {
            method: "DELETE",
          }).then(() => getTasks());
        };
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
updateSelectedFilter();
getTasks();

document.querySelectorAll(".all-tasks input[type='checkbox']").forEach(
  (e) =>
    (e.onclick = (e) => {
      fetch(mainAPI + e.target.parentElement.parentElement.dataset.taskId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: "NNNNNNNNNN",
          completed: true,
        }),
      })
        .then(() => console.log("done"))
        .then(() => getTasks());
    })
);
