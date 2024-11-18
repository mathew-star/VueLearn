<template>
  <div>
    <h1 class="text-3xl font-bold underline text-blue-500">
      Hello Tailwind CSS with Vue!
    </h1>
    <h2 :id="headingId">Welcome</h2>
    <h2 :class="isPromoted && 'promoted' ">Promoted</h2>
    <p :style="{
      color:highlightcolor
    }">Highlighted </p>
    <button :disabled="isDisabled"> bind </button>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      headingId: 'heading',
      isDisabled:"false",
      isPromoted:"true",
      highlightcolor:"orange"
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.promoted{
  font-style: italic;
}
</style>
