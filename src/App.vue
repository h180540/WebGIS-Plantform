<template>
  <div id="app">
    <SearchBar @performSearch="handleSearch"></SearchBar>
    <HeaderBar></HeaderBar>
    <MyMap></MyMap>
    <HeaderBar />
  </div>
</template>

<script>
import SearchBar from './components/SearchBar.vue';
import MyMap from './components/MyMap.vue';
import HeaderBar from './components/HeaderBar.vue';

export default {
  name: 'App',
  components: {
    SearchBar,
    MyMap,
    HeaderBar
  },
  methods: {
    handleSearch(keyword) {
      // 在这里执行搜索操作，可以将搜索关键词传递给地图组件
      console.log('Perform search:', keyword);
    }
  }
};
</script>

<style>
html, body, #app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
