<template>
  <main>
    <section>
      <header>
        <span v-t="'appName'"></span>
        <div>
          <button class="mode-button" @click="darkMode = !darkMode">
            <font-awesome-icon icon="fa-solid fa-sun" v-if="darkMode" />
            <font-awesome-icon icon="fa-solid fa-moon" v-else />
          </button>
          <button class="lang-button" @click="changeLang">
            <font-awesome-icon icon="fa-solid fa-globe" />
          </button>
        </div>
      </header>
      <div class="add-task">
        <div class="checkbox-container">
          <input type="checkbox" />
        </div>
        <input
          type="text"
          dir="auto"
          v-model.trim="newTask"
          :placeholder="$t('addPlaceHolder')"
          @keyup.enter="addTask"
        />
        <button :disabled="!newTask" @click="addTask">
          <font-awesome-icon icon="fa-solid fa-plus" />
        </button>
      </div>
      <template v-if="tasks.length">
        <div class="all-tasks">
          <div
            :class="['task-box', { 'task-completed': task.completed }]"
            draggable="true"
            v-for="task in filteredTasks"
            :key="task.id"
          >
            <div class="checkbox-container">
              <input
                type="checkbox"
                v-model="task.completed"
                @click="completeTask(task.id, task.completed)"
              />
            </div>
            <p class="task-content" v-text="task.content"></p>
            <div class="buttons-box">
              <button
                class="edit-btn"
                :disabled="task.completed"
                @click="
                  toggleUpdatePopup();
                  updatedId = task.id;
                "
              >
                <font-awesome-icon icon="fa-solid fa-pen-to-square" />
              </button>
              <!-- start popup  -->
              <div
                class="update-popup"
                v-if="updatePopup && updatedId === task.id"
              >
                <h3></h3>
                <textarea
                  dir="auto"
                  :value="task.content"
                  ref="updatedContent"
                ></textarea>
                <div>
                  <button
                    class="save-button"
                    @click="updateTaskContent(task.id)"
                  ></button>
                  <button
                    class="cancel-button"
                    @click="toggleUpdatePopup()"
                  ></button>
                </div>
              </div>
              <!-- end popup -->
              <button class="delete-btn" @click="deleteTask(task.id)">
                <font-awesome-icon icon="fa-solid fa-xmark" />
              </button>
            </div>
          </div>
          <div class="list-footer">
            <div>
              <span class="items-left" v-text="`${itemsLeft} `"></span>
              <span v-t="'itemsLeft'"></span>
            </div>
            <button
              class="clear-completed button-text"
              v-t="'removeAll'"
              @click="clearCompleted"
            ></button>
          </div>
        </div>
        <div class="filters">
          <button
            v-for="(text, filter) in JSON.parse($t('filters'))"
            :key="filter"
            :data-filter="filter"
            v-text="text"
            :class="['button-text', { selected: filterShow === text }]"
            @click="filterShow = text"
          ></button>
        </div>
      </template>
      <div
        class="reorder-guide"
        v-text="$t('reorderGuide')"
        v-if="filteredTasks.length > 1"
      ></div>
    </section>
  </main>
  <div class="overlay" v-if="updatePopup"></div>
</template>

<script>
let filters = {
  all: (allTasks) => allTasks,
  active: (allTasks) => allTasks.filter((e) => !e.completed),
  completed: (allTasks) => allTasks.filter((e) => e.completed),
};
export default {
  name: "HomeView",
  data: function () {
    return {
      darkMode: false,
      tasks: [],
      newTask: "",
      filterShow: "all",
      updatedId: 0,
      updatePopup: false,
      updatedContent: null,
    };
  },
  computed: {
    newId: function () {
      return Math.max(...this.tasks.map((e) => e.id)) + 1;
    },
    newOrder: function () {
      return Math.max(...this.tasks.map((e) => e.order)) + 1;
    },
    filteredTasks: function () {
      return filters[this.filterShow](this.tasks);
    },
    itemsLeft: function () {
      return this.tasks.filter((e) => !e.completed).length;
    },
  },
  methods: {
    updateDir: function () {
      document.documentElement.dir = this.$t("dir");
    },
    changeLang: function () {
      this.$router
        .push({
          params: {
            lang: this.$route.params.lang === "en" ? "ar" : "en",
          },
        })
        .then(() => this.updateDir());
    },
    addTask: function () {
      this.tasks.push({
        id: this.newId,
        content: this.newTask,
        completed: false,
        order: this.newOrder,
      });
      this.newTask = "";
    },
    deleteTask: function (id) {
      this.tasks = this.tasks.filter((e) => e.id !== id);
    },
    completeTask: function (id, status) {
      this.tasks.filter((e) => e.id === id)[0].completed = !status;
    },
    clearCompleted: function () {
      this.tasks = this.tasks.filter((e) => !e.completed);
    },
    toggleUpdatePopup: function () {
      this.updatePopup = !this.updatePopup;
    },
    updateTaskContent: function (id) {
      this.tasks.filter((e) => e.id === id)[0].content =
        this.$refs.updatedContent[0].value;
      this.toggleUpdatePopup();
    },
  },
  watch: {
    darkMode: function (v) {
      localStorage.darkMode = JSON.parse(v);
      document.documentElement.dataset.darkMode = v;
    },
    tasks: {
      handler: function (v) {
        localStorage.tasks = JSON.stringify(v);
      },
      deep: true,
    },
  },
  mounted() {
    this.tasks = localStorage.tasks ? JSON.parse(localStorage.tasks) : [];
    this.darkMode = localStorage.darkMode === "true";
    this.updateDir();
  },
};
</script>

<style lang="scss">
main {
  display: flex;
  justify-content: center;
  color: var(--main-text-color);
  min-height: 100vh;
  padding: 65px 20px 0;
  user-select: none;
  @include underTablet {
    padding-top: 60px;
  }
  > section {
    @include aboveTablet {
      width: 500px;
    }
    position: relative;
    .reorder-guide {
      color: var(--second-text-color);
      font-size: 16px;
      margin: 20px auto;
      width: fit-content;
    }
  }
}
.add-task {
  background-color: var(--main-background-color);
  border-radius: $main-border-radius;
  margin: 30px 0 20px;
  min-width: 300px;
  @extend %mainTaskBox;
  > {
    .checkbox-container {
      pointer-events: none;
    }
    input[type="text"] {
      width: 100%;
      border: none;
      background-color: transparent;
      color: var(--main-text-color);
      caret-color: var(--bright-blue);
      &::placeholder {
        color: var(--second-text-color);
      }
      @include rtlStyle {
        &:placeholder-shown {
          direction: rtl;
        }
      }
    }
  }
}
.all-tasks {
  display: flex;
  flex-direction: column;
  background-color: var(--main-background-color);
  border-radius: $main-border-radius;
  box-shadow: $main-box-shadow;
  position: relative;
  .task-box {
    @extend %mainTaskBox;
    border-bottom: 1px solid var(--main-border-color);
    cursor: grab;
    &.task-completed > .task-content {
      text-decoration: line-through;
      color: var(--third-text-color);
    }
    &.dragging {
      background-color: var(--third-text-color);
      opacity: 0.5;
      &.task-completed > .task-content {
        color: var(--second-text-color);
      }
    }
    .buttons-box {
      margin-left: auto;
      @include rtlStyle {
        margin: 0 {
          right: auto;
        }
      }
      white-space: nowrap;
      display: flex;
      gap: 10px;
    }
  }
}
.filters {
  @extend %center-flex;
  gap: 20px;

  @include underTablet {
    margin: 20px 0 40px;
    padding: 15px;
    background-color: var(--main-background-color);
    border-radius: $main-border-radius;
    box-shadow: $main-box-shadow;
  }
  @include aboveTablet {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -34px);
    font-size: 14px;
  }
  button {
    font-weight: 700;
    &.selected,
    &.selected:hover {
      color: var(--bright-blue);
    }
    transition: color $main-transition;
  }
}
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--white-color);
  font-size: 25px;
  span {
    font: {
      weight: 700;
      size: 35px;
    }
    letter-spacing: 13px;
    @include underTablet {
      font-size: 30px;
    }
    @include rtlStyle {
      letter-spacing: 0;
    }
  }
  > div {
    display: flex;
    gap: 15px;
    button {
      svg {
        color: var(--white-color);
        font-size: 25px;
      }
    }
  }
}
.list-footer {
  order: 1;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  white-space: nowrap;
  color: var(--second-text-color);
  font-size: 14px;
}
.update-popup {
  color: var(--brown-color);
  background-color: var(--second-white-color);
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  min-height: 100px;
  z-index: 9;
  border-radius: $main-border-radius;
  padding: $main-padding;
  display: flex;
  flex-direction: column;
  gap: 20px;
  h3 {
    align-self: center;
    @include content("Edit", "تعديل");
  }
  textarea {
    border: none;
    padding: 10px;
    border-radius: $main-border-radius;
    min-width: 100%;
    max-width: 100%;
    max-height: 100px;
  }
  > div {
    display: flex;
    justify-content: space-evenly;
    button {
      color: var(--second-white-color);
      background-color: var(--brown-color);
      border-radius: $main-border-radius;
      padding: 10px;
    }
    .save-button {
      @include content("Save", "حفظ");
    }
    .cancel-button {
      @include content("Cancel", "الغاء");
    }
  }
}
</style>
