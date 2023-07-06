<template>
  <div class="update-popup" v-if="updatePopup && updatedId === task.id">
    <h3></h3>
    <textarea dir="auto" :value="task.content" ref="updatedContent"></textarea>
    <div>
      <button
        class="save-button"
        @click="
          updateTaskProperty([
            task.id,
            'content',
            this.$refs.updatedContent.value,
          ]);
          toggleUpdatePopup();
        "
      ></button>
      <button class="cancel-button" @click="toggleUpdatePopup()"></button>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "AllTasks",
  props: ["task"],
  computed: {
    ...mapState(["updatePopup", "updatedId"]),
  },
  methods: {
    ...mapMutations(["updateTaskProperty", "toggleUpdatePopup"]),
  },
};
</script>

<style lang="scss">
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
