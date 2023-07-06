import { createStore } from "vuex";

export default createStore({
  strict: true,
  state: {
    tasks: [],
  },
  getters: {},
  mutations: {
    updateTasks: function (state, newTasksArray) {
      state.tasks = newTasksArray;
    },
    addTask: function (state, newTask) {
      state.tasks.push(newTask);
    },
    updateTaskProperty: function (state, [id, property, value]) {
      state.tasks.filter((e) => e.id === id)[0][property] = value;
    },
  },
  actions: {},
  modules: {},
});
