<template>
  <main>
    <section>
      <AppHeader />
      <AddTask />
      <template v-if="tasks.length">
        <div class="all-tasks">
          <div
            :class="['task-box', { 'task-completed': task.completed }]"
            v-for="task in filteredTasks"
            :key="task.id"
            draggable="true"
            @dragstart="
              $event.target.classList.add('dragging');
              draggingId = task.id;
              draggingOrder = task.order;
            "
            @dragend="
              $event.target.classList.remove('dragging');
              allowChildrenEvents($event);
            "
            @dragleave="allowChildrenEvents"
            @dragover.prevent="preventChildrenEvents"
            @dragenter.prevent
            @drop="
              droppingId = task.id;
              droppingOrder = task.order;
              draggingDrop($event);
            "
          >
            <div class="checkbox-container">
              <input
                type="checkbox"
                :checked="task.completed"
                @input="
                  updateTaskProperty([task.id, 'completed', !task.completed])
                "
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
                    @click="
                      updateTaskProperty([
                        task.id,
                        'content',
                        this.$refs.updatedContent[0].value,
                      ]);
                      toggleUpdatePopup();
                    "
                  ></button>
                  <button
                    class="cancel-button"
                    @click="toggleUpdatePopup()"
                  ></button>
                </div>
              </div>
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
import AppHeader from "@/components/AppHeader.vue";
import AddTask from "@/components/AddTask.vue";
import { mapMutations, mapState } from "vuex";

let filters = {
  all: (allTasks) => allTasks,
  active: (allTasks) => allTasks.filter((e) => !e.completed),
  completed: (allTasks) => allTasks.filter((e) => e.completed),
};
export default {
  name: "HomeView",
  data: function () {
    return {
      filterShow: "all",
      updatedId: 0,
      updatePopup: false,
      updatedContent: null,
      draggingId: 0,
      draggingOrder: 0,
      droppingId: 0,
      droppingOrder: 0,
    };
  },
  computed: {
    ...mapState(["tasks"]),
    sortedTasks: function () {
      return this.tasks.slice(0).sort((a, b) => (a.order > b.order ? 1 : -1));
    },
    filteredTasks: function () {
      return filters[this.filterShow](this.sortedTasks);
    },
    itemsLeft: function () {
      return this.tasks.filter((e) => !e.completed).length;
    },
  },
  methods: {
    ...mapMutations(["updateTasks", "updateTaskProperty"]),
    deleteTask: function (id) {
      this.updateTasks(this.tasks.filter((e) => e.id !== id));
    },
    clearCompleted: function () {
      this.updateTasks(this.tasks.filter((e) => !e.completed));
    },
    toggleUpdatePopup: function () {
      this.updatePopup = !this.updatePopup;
    },
    allowChildrenEvents: function (event) {
      [...event.target.children].forEach(
        (e) => (e.style.pointerEvents = "auto")
      );
    },
    preventChildrenEvents: function (event) {
      [...event.target.children].forEach(
        (e) => (e.style.pointerEvents = "none")
      );
    },
    updateTargets: function (a, b) {
      this.updateTaskProperty([
        this.draggingId,
        "order",
        this.droppingOrder + a,
      ]);
      this.updateTaskProperty([
        this.droppingId,
        "order",
        this.droppingOrder + b,
      ]);
    },
    updateBetweenTargets: function (position) {
      let tasks = JSON.parse(JSON.stringify(this.tasks));
      tasks
        .filter(
          position === "top"
            ? (e) =>
                e.order > this.draggingOrder && e.order < this.droppingOrder
            : (e) =>
                e.order < this.draggingOrder && e.order > this.droppingOrder
        )
        .forEach((e) => {
          e.order = position === "top" ? e.order - 1 : e.order + 1;
        });
      this.updateTasks(tasks);
    },
    updateTasksOrders: function (event, position, a, b) {
      this.updateBetweenTargets(position);
      event.layerY >= event.target.offsetTop + event.target.offsetHeight / 2
        ? this.updateTargets(a, b)
        : this.updateTargets(b, a);
    },
    draggingDrop: function (event) {
      if (!event.target.classList.contains("dragging")) {
        this.draggingOrder < this.droppingOrder
          ? this.updateTasksOrders(event, "top", 0, -1)
          : this.updateTasksOrders(event, "bottom", 1, 0);
      }
      this.allowChildrenEvents(event);
    },
  },
  watch: {
    tasks: {
      handler: function (v) {
        localStorage.tasks = JSON.stringify(v);
      },
      deep: true,
    },
  },
  mounted() {
    this.updateTasks(localStorage.tasks ? JSON.parse(localStorage.tasks) : []);
  },
  components: {
    AppHeader,
    AddTask,
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
