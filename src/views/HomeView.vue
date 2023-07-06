<template>
  <main>
    <section>
      <AppHeader />
      <AddTask />
      <template v-if="tasks.length">
        <AllTasks />
        <FiltersBox />
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
import AllTasks from "@/components/AllTasks.vue";
import FiltersBox from "@/components/FiltersBox.vue";
import { mapState, mapGetters, mapMutations } from "vuex";
export default {
  name: "HomeView",
  computed: {
    ...mapState(["tasks", "updatePopup"]),
    ...mapGetters(["filteredTasks"]),
  },
  methods: {
    ...mapMutations(["updateTasks"]),
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
    AllTasks,
    FiltersBox,
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
</style>
