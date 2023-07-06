<template>
  <div class="add-task">
    <div class="checkbox-container">
      <input type="checkbox" />
    </div>
    <input
      type="text"
      dir="auto"
      v-model.trim="newTask"
      :placeholder="$t('addPlaceHolder')"
      @keyup.enter="addNewTask"
    />
    <button :disabled="!newTask" @click="addNewTask">
      <font-awesome-icon icon="fa-solid fa-plus" />
    </button>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "HomeView",
  data: function () {
    return {
      newTask: "",
    };
  },
  computed: {
    ...mapState(["tasks"]),
    newId: function () {
      return this.tasks.length
        ? Math.max(...this.tasks.map((e) => e.id)) + 1
        : 1;
    },
    newOrder: function () {
      return this.tasks.length
        ? Math.max(...this.tasks.map((e) => e.order)) + 1
        : 1;
    },
  },
  methods: {
    ...mapMutations(["addTask"]),
    addNewTask: function () {
      this.addTask({
        id: this.newId,
        content: this.newTask,
        completed: false,
        order: this.newOrder,
      });
      this.newTask = "";
    },
  },
  watch: {},
  mounted() {},
};
</script>

<style lang="scss">
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
</style>
