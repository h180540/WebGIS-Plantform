<template>
  <div class="search-container">
    <div class="search-bar">
      <input
        v-model="searchKeyword"
        class="search-input"
        type="text"
        placeholder="搜索地点..."
      />
      <button class="search-button" @click="performSearch">
        <i class="fas fa-search"></i>
      </button>
    </div>
  </div>
</template>

<script>
import '@/assets/fontawesome-free-6.4.0-web/css/all.min.css';
import axios from 'axios';

export default {
  data() {
    return {
      searchKeyword: '',
      searchResults: [],
    };
  },
  methods: {
    performSearch() {
      const encodedKeyword = encodeURIComponent(this.searchKeyword);

      const url = `https://restapi.amap.com/v3/place/text?key=e6fdbb84116fee97e090eebd95d8c0ee&keywords=${encodedKeyword}&city=370&types=110000|050000|100000|150000|190000`;

      axios
        .get(url)
        .then((response) => {
          this.searchResults = response.data.pois;
          this.$emit('search-results', response.data.pois);
        })
        .catch((error) => {
          console.error('Error performing search:', error);
        });
        
    },data() {
  return {
    searchKeyword: '',
    searchResults: [],
  };
},
  },
  
};
</script>

<style scoped>
.search-container {
  position: fixed;
  top: 30px;
  left: 50px;
  z-index: 998;
}

.search-bar {
  display: flex;
  align-items: center;
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.search-input {
  flex: 1;
  border: none;
  padding: 6px;
  font-size: 17px;
  background-color: transparent;
  outline: none;
}

.search-button {
  border: none;
  background-color: transparent;
  cursor: pointer;
  padding: 6px;
  font-size: 20px;
  color: #333;
}
</style>