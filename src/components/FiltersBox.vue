<template>
  <div class="filters">
    <button
      v-for="(text, filter) in JSON.parse($t('filters'))"
      :key="filter"
      :data-filter="filter"
      v-text="text"
      :class="['button-text', { selected: filterShow === text }]"
      @click="updateFilterShow(text)"
    ></button>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "FiltersBox",
  computed: {
    ...mapState(["filterShow"]),
  },
  methods: {
    ...mapMutations(["updateFilterShow"]),
  },
};
</script>

<style lang="scss">
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
</style>
