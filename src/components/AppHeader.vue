<template>
  <header>
    <span>{{ $t("appName") }}</span>
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
</template>

<script>
export default {
  name: "AppHeader",
  data: function () {
    return {
      darkMode: false,
    };
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
  },
  watch: {
    darkMode: function (v) {
      localStorage.darkMode = JSON.parse(v);
      document.documentElement.dataset.darkMode = v;
    },
  },
  mounted() {
    this.darkMode = localStorage.darkMode === "true";
    this.updateDir();
  },
};
</script>

<style lang="scss">
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
</style>
