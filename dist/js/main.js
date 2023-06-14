let mainAPI = "http://localhost:5000/tasks/",
  rootElement = document.documentElement,
  langButton = document.querySelector(".lang-button"),
  modeButton = document.querySelector(".mode-button"),
  addInput = document.querySelector(".add-task>input"),
  addButton = document.querySelector(".add-task>button"),
  allTasks = document.querySelector(".all-tasks"),
  listFooter = document.querySelector(".list-footer"),
  filtersBox = document.querySelector(".filters"),
  itemsLeft = document.querySelector(".items-left"),
  clearCompleted = document.querySelector(".clear-completed"),
  filterButtons = document.querySelectorAll(".filters>button"),
  reorderGuide = document.querySelector(".reorder-guide"),
  allData,
  newId,
  newOrder;

// language convert
langButton.onclick = () =>
  location.replace(rootElement.dir === "ltr" ? "index-rtl.html" : ".");

// mode convert
let lightMode = () => {
  rootElement.removeAttribute("dark-mode");
  localStorage.removeItem("darkMode");
  modeButton.innerHTML = '<i class="fa-solid fa-moon">';
};
let darkMode = () => {
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
    // ItemsLeft Number
    .then((resolve) => {
      newId = Math.max(...resolve.map((e) => e.id)) + 1;
      newOrder = Math.max(...resolve.map((e) => e.order)) + 1;
      !resolve.length
        ? [listFooter, filtersBox, reorderGuide].forEach(
            (e) => (e.style.display = "none")
          )
        : null;
      itemsLeft.textContent = resolve.filter((e) => !e.completed).length;
      [...document.getElementsByClassName("task-box")].forEach((e) =>
        e.remove()
      );
      clearCompleted.onclick = () =>
        resolve.filter((e) => e.completed).forEach((e) => delTask(e.id));
      allData = resolve;
      return resolve;
    })
    .then((resolve) => resolve.sort((a, b) => (a.order > b.order ? 1 : -1)))
    .then((resolve) => filters[targetFilter](resolve))
    .then((resolve) => {
      reorderGuide.style.display = !resolve.length ? "none" : "block";
      resolve.forEach((e) => {
        // main task container box
        let taskBox = document.createElement("div");
        taskBox.classList.add("task-box");
        taskBox.dataset.id = e.id;
        taskBox.dataset.order = e.order;
        allTasks.appendChild(taskBox);
        taskBox.draggable = true;
        function allowChildrenEvents() {
          [...taskBox.children].forEach(
            (e) => (e.style.pointerEvents = "auto")
          );
        }
        function preventChildrenEvents() {
          [...taskBox.children].forEach(
            (e) => (e.style.pointerEvents = "none")
          );
        }
        taskBox.ondragstart = () => taskBox.classList.add("dragging");
        taskBox.ondragend = () => {
          taskBox.classList.remove("dragging");
          allowChildrenEvents();
        };
        taskBox.ondragenter = (e) => e.preventDefault();
        taskBox.ondragleave = () => allowChildrenEvents();
        taskBox.ondragover = (e) => {
          e.preventDefault();
          preventChildrenEvents();
        };
        taskBox.ondrop = (element) => {
          let draggingItem = allTasks.querySelector(".dragging");
          if (!taskBox.classList.contains("dragging")) {
            function updateTargets(a, b) {
              fetch(mainAPI + +draggingItem.dataset.id, {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  order: +element.target.dataset.order + a,
                }),
              }).then(() => {
                fetch(mainAPI + +element.target.dataset.id, {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    order: +element.target.dataset.order + b,
                  }),
                }).then(() => getTasks());
              });
            }
            function updateBetweenTargets(position) {
              allData
                .filter(
                  position === "top"
                    ? (e) =>
                        e.order > +draggingItem.dataset.order &&
                        e.order < +element.target.dataset.order
                    : (e) =>
                        e.order < +draggingItem.dataset.order &&
                        e.order > +element.target.dataset.order
                )
                .forEach((e) => {
                  fetch(mainAPI + e.id, {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      order: position === "top" ? e.order - 1 : e.order + 1,
                    }),
                  });
                });
            }
            function updateTasksOrders(position, a, b) {
              updateBetweenTargets(position);
              element.layerY >=
              element.target.offsetTop + element.target.offsetHeight / 2
                ? updateTargets(a, b)
                : updateTargets(b, a);
            }
            +draggingItem.dataset.order < +element.target.dataset.order
              ? updateTasksOrders("top", 0, -1)
              : updateTasksOrders("bottom", 1, 0);
          }
          allowChildrenEvents();
        };
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
        editTask.onclick = () => {
          let overlay = document.createElement("div");
          overlay.className = "overlay";
          document.body.appendChild(overlay);
          let updatePopup = document.createElement("div");
          updatePopup.className = "update-popup";
          allTasks.appendChild(updatePopup);
          let updateTitle = document.createElement("h3");
          let textArea = document.createElement("textarea");
          textArea.value = e.content;
          textArea.dir = "auto";
          let buttonsBox = document.createElement("div");
          let saveButton = document.createElement("button");
          saveButton.className = "save-button";
          let cancelButton = document.createElement("button");
          cancelButton.className = "cancel-button";
          [saveButton, cancelButton].forEach((e) => buttonsBox.appendChild(e));
          [updateTitle, textArea, buttonsBox].forEach((e) =>
            updatePopup.appendChild(e)
          );
          textArea.oninput = () => {
            saveButton.disabled = !textArea.value.trim();
          };
          destroyPopup = () =>
            [updatePopup, overlay].forEach((e) => e.remove());
          saveButton.onclick = () => {
            if (textArea.value.trim() !== e.content) {
              fetch(mainAPI + e.id, {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  content: textArea.value.trim(),
                }),
              }).then(() => getTasks());
            }
            destroyPopup();
          };
          cancelButton.onclick = () => destroyPopup();
        };
        let deleteTask = document.createElement("button");
        deleteTask.className = "delete-btn";
        deleteTask.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
        deleteTask.onclick = () => delTask(e.id);
        [editTask, deleteTask].forEach((e) => buttonsBox.appendChild(e));
        taskBox.appendChild(buttonsBox);
        // check task completed
        if (e.completed) {
          taskBox.classList.add("task-completed");
          editTask.disabled = true;
          taskCheckBox.checked = true;
        }
      });
    });
}
updateSelectedFilter();
getTasks();

// add task
async function addTask() {
  return await fetch(mainAPI, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: newId,
      content: addInput.value.trim(),
      completed: false,
      order: newOrder,
    }),
  }).then(() => {
    addInput.value = "";
    addButton.disabled = true;
    getTasks();
  });
}

// delete task
async function delTask(id) {
  return await fetch(mainAPI + id, {
    method: "DELETE",
  }).then(() => getTasks());
}

addButton.onclick = () => addTask();
addInput.onkeypress = (event) =>
  event.key === "Enter" && event.target.value.trim() ? addTask() : null;
