let allTasks = document.querySelector(".all-tasks");
let itemsLeft = document.querySelector(".items-left");

let addInput = document.querySelector(".add-task>input");
let addButton = document.querySelector(".add-task>button");

addInput.oninput = (v) => {
  !v.target.value.trim()
    ? addButton.classList.add("prevent-click")
    : addButton.classList.remove("prevent-click");
};

fetch("http://localhost:3000/tasks")
  .then((resolve) => resolve.json())
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
        taskCheckBox.checked = true;
      }
    });
    return resolve;
  })
  .then((resolve) => {
    itemsLeft.textContent = resolve.filter((e) => e.completed === false).length;
  });
