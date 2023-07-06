<template>
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
          @input="updateTaskProperty([task.id, 'completed', !task.completed])"
        />
      </div>
      <p class="task-content" v-text="task.content"></p>
      <div class="buttons-box">
        <button
          class="edit-btn"
          :disabled="task.completed"
          @click="
            toggleUpdatePopup();
            updateUpdatedId(task.id);
          "
        >
          <font-awesome-icon icon="fa-solid fa-pen-to-square" />
        </button>
        <UpdatePopup :task="task" />
        <button class="delete-btn" @click="deleteTask(task.id)">
          <font-awesome-icon icon="fa-solid fa-xmark" />
        </button>
      </div>
    </div>
    <ListFooter />
  </div>
</template>

<script>
import UpdatePopup from "@/components/UpdatePopup.vue";
import ListFooter from "@/components/ListFooter.vue";
import { mapState, mapGetters, mapMutations } from "vuex";

export default {
  name: "AllTasks",
  data: function () {
    return {
      draggingId: 0,
      draggingOrder: 0,
      droppingId: 0,
      droppingOrder: 0,
    };
  },
  computed: {
    ...mapState(["tasks"]),
    ...mapGetters(["filteredTasks"]),
  },
  methods: {
    ...mapMutations([
      "updateTasks",
      "updateTaskProperty",
      "updateUpdatedId",
      "toggleUpdatePopup",
    ]),
    deleteTask: function (id) {
      this.updateTasks(this.tasks.filter((e) => e.id !== id));
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
  components: {
    UpdatePopup,
    ListFooter,
  },
};
</script>

<style lang="scss">
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
</style>
