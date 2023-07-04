<template>
  <router-view />
</template>

<script>
// to enable using font awesome in pseudo elements
document.head.innerHTML +=
  '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css">';
export default {
  name: "App",
};
</script>

<style lang="scss">
#app {
}
</style>
