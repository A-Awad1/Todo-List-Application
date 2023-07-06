import { createStore } from "vuex";

let filters = {
  all: (allTasks) => allTasks,
  active: (allTasks) => allTasks.filter((e) => !e.completed),
  completed: (allTasks) => allTasks.filter((e) => e.completed),
};

export default createStore({
  strict: true,
  state: {
    tasks: [],
    filterShow: "all",
    updatePopup: false,
    updatedId: 0,
  },
  getters: {
    sortedTasks: function (state) {
      return state.tasks.slice(0).sort((a, b) => (a.order > b.order ? 1 : -1));
    },
    filteredTasks: function (state, getters) {
      return filters[state.filterShow](getters.sortedTasks);
    },
  },
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
    updateFilterShow: function (state, newValue) {
      state.filterShow = newValue;
    },
    updateUpdatedId: function (state, newValue) {
      state.updatedId = newValue;
    },
    toggleUpdatePopup: function (state) {
      state.updatePopup = !state.updatePopup;
    },
  },
  actions: {},
  modules: {},
});
