<template>
  <div id="main">
    <header class="header">头部组件</header>
    <nav class="nav">侧部菜单</nav>
    <main>
      <transition name="fade">
        <router-view></router-view>
      </transition>
    </main>
  </div>
</template>

<script>
export default {
  name: 'main'
}
</script>

<style>
#main {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#main .header{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 6rem;
  font-size: 1.4rem;
  background: orangered;
}
#main .nav{
  position: fixed;
  top: 6rem;
  left: 0;
  width: 16rem;
  height: 100%;
  font-size: 1.4rem;
  background: green;
}
</style>
