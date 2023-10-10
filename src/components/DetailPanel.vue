<template>
  <transition name="slide">
    <div class="detail-panel" v-if="pois.length > 0">
      <el-button type="danger" icon="el-icon-close" circle class="close-button" @click="closePanel"></el-button>
      <el-card v-for="(poi, index) in pois" :key="index" class="detail-item box-card" ref="cardRef">
        <el-button type="primary" icon="el-icon-location" circle class="navigation-button"></el-button>
        <h2>{{ poi.name }}</h2>
        <p><strong>地址：</strong>{{ poi.address }}</p>
        <p><strong>类型：</strong>{{ poi.type }}</p>
        <p><strong>区域：</strong>{{ poi.adname }}</p>
        <p><strong>城市：</strong>{{ poi.cityname }}</p>
        <p><strong>电话：</strong>{{ poi.tel || '无' }}</p>
        <div class="photo-container">
          <div v-for="(photo, photoIndex) in poi.photos" :key="photoIndex" class="photo-item">
            <img :src="photo.url" :alt="photo.title">
            <a :href="photo.url" target="_blank">查看详情</a>
          </div>
          
        </div>
      </el-card>
    </div>
  </transition>
</template>

<script>
import { ElCard, ElButton, nextTick } from 'vue';
export default {
  components: {
    ElCard,
    ElButton,
  },
  props: {
    pois: {
      type: Array,
      default: () => [],
    },
    selectedPoi: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    return {
      currentMarker: null, 
    };
  },
  methods: {
    closePanel() {
      this.$emit('clearPois');
    },
    scrollToPoi() {
      if (this.$refs.cardRef && this.selectedPoi) {
        const index = this.pois.findIndex((poi) => poi === this.selectedPoi);
        if (index > -1) {
          nextTick(() => {
            const cardEl = this.$refs.cardRef[index].$el;
            cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          });
        }
      }
    },
  
  
  },
  
  watch: {
    selectedPoi: {
      handler: function (newVal, oldVal) {
        if (newVal !== oldVal) {
          nextTick(() => {
            this.scrollToPoi();
          });
        }
      },
      immediate: true,
    },
  },
};
</script>

<style scoped>
.detail-panel {
  position: fixed;
  top: 10%;
  right: 8%;
  width: 20%;
  height: 80%;
  overflow-y: auto;
  background: white;
  box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  padding: 20px;
}

.detail-item {
  margin-bottom: 20px;
  padding-bottom: 10px;
}

.box-card {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.close-button {
  top: 10px;
  right: 10px;
  position: sticky;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s;
}

.slide-enter,
.slide-leave-to {
  transform: translateX(100%);
}
.photo-container {
  display: flex;
  flex-wrap: nowrap; 
  overflow-x: auto; 
  margin-top: 20px;
}

.photo-item {
  flex: 0 0 auto; 
  width: 20%;  
  margin-right: 10px;
  margin-bottom: 10px;
}

.photo-item img {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 5px;
}

.photo-item p {
  margin-top: 5px;
  font-size: 12px;
  text-align: center;
}

.photo-item a {
  display: block;
  text-align: center;
  font-size: 12px;
  color: #666;
  text-decoration: underline;
}
.navigation-button {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>