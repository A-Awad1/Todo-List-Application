<template>
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
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "ListFooter",
  computed: {
    ...mapState(["tasks"]),
    itemsLeft: function () {
      return this.tasks.filter((e) => !e.completed).length;
    },
  },
  methods: {
    ...mapMutations(["updateTasks"]),
    clearCompleted: function () {
      this.updateTasks(this.tasks.filter((e) => !e.completed));
    },
  },
};
</script>

<style lang="scss">
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
</style>
