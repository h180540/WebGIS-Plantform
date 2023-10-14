<template>
  <div ref="mapContainer" class="map-container">
    <button class="food-button" @click="showMarkers('050000')">
      <i class="fas fa-utensils"></i> 显示美食
    </button>
    <button class="tourist-button" @click="showMarkers('110000')">
      <i class="fas fa-binoculars"></i> 显示旅游景点
    </button>
    <button class="hotel-button" @click="showMarkers('100000')">
      <i class="fas fa-hotel"></i> 显示酒店
    </button>
    <button class="transport-button" @click="showMarkers('150000')">
      <i class="fas fa-bus"></i> 显示交通设施
    </button>
    <button class="red-area-button" @click="showMarkers('110210')">
      <i class="fas fa-flag"></i> 显示红色景区
    </button>
    <button class="random-map-button" @click="randomZoomAndCenter">
      <i class="fas fa-random"></i> 不知道去哪？点这个
    </button>
    <button class="navigate-button" @click="startNavigation">
      <i class="fas fa-directions"></i> 导航
    </button>
    <button class="clear-navigation-button" @click="clearNavigation">
      <i class="fas fa-eraser"></i> 清除导航
    </button>

  </div>
  <div ref="panel" class="panel"></div>

  <SearchBar @search-results="updateSearchResults" />
  <DetailPanel @start-navigation="startNavigation" :map="map" :pois="searchResults" :selectedPoi="selectedPoi"
    @clearPois="clearSearchResults" />
</template>

<script>
import { ref, onMounted, watchEffect, watch } from 'vue';
import AMapLoader from '@amap/amap-jsapi-loader';
import { shallowRef } from '@vue/reactivity'
import SearchBar from './SearchBar.vue';
import DetailPanel from './DetailPanel';
import axios from 'axios';
import '@/assets/fontawesome-free-6.4.0-web/css/all.min.css';

export default {
  components: {
    SearchBar,
    DetailPanel,
  },
  setup() {
    const mapContainer = ref(null);
    const map = shallowRef(null);
    const searchResults = ref([]);
    const selectedPoi = ref(null);
    const navigation = ref({
      start: null,
      end: null,
    });
    const navigating = ref(false);
    const route = ref(null);



    onMounted(() => {
      AMapLoader.load({
        key: '',
        version: '2.0',
        plugins: ['AMap.ToolBar', 'AMap.Scale', 'AMap.HawkEye', 'AMap.MapType', 'AMap.DragRoute'],
      }).then((AMap) => {
        map.value = new AMap.Map(mapContainer.value, {
          resizeEnable: true,
          zoom: 8.5,
          center: [118, 36.5],
        });
        
        map.value.on('click', function (event) {
          if (!navigating.value) return;

          if (!navigation.value.start) {
            // 移除旧的起始图标
            if (navigation.value.startMarker) {
              map.value.remove(navigation.value.startMarker);
            }
            navigation.value.start = [event.lnglat.getLng(), event.lnglat.getLat()];

          } else if (!navigation.value.end) {
            // 移除旧的终点图标
            if (navigation.value.endMarker) {
              map.value.remove(navigation.value.endMarker);
            }

            navigation.value.end = [event.lnglat.getLng(), event.lnglat.getLat()];
            navigating.value = false;


          }
        });


        watch(navigation, () => {
         
          const dragRoute = new AMap.DragRoute(map.value, [navigation.value.start, navigation.value.end],
            AMap.DrivingPolicy.REAL_TRAFFIC);//AMap.DrivingPolicy.LEAST_TIME最快捷模式AMap.DrivingPolicy.LEAST_FEE最经济模式AMap.DrivingPolicy.LEAST_DISTANCE最短距离模式AMap.DrivingPolicy.REAL_TRAFFIC考虑实时路况

          dragRoute.search();
          dragRoute.on('complete', function (e) {
            // 存储路径到 `route` ref 中，在路线搜索完成后更新
            route.value = e.route;
            navigation.value = { start: null, end: null };
            navigating.value = false;
          });

        }, { deep: true });
        const scale = new AMap.Scale();
        map.value.addControl(scale);

        const hawkEye = new AMap.HawkEye();
        map.value.addControl(hawkEye);

        const toolbar = new AMap.ToolBar({
          position: {
            bottom: '200px',
            right: '40px'
          }
        });

        const mapType = new AMap.MapType({
          position: {
            bottom: '210px',
            left: '120px'
          }
        });

        map.value.addControl(mapType);
        map.value.addControl(toolbar);

        watchEffect(() => {
          map.value.clearMap();

          searchResults.value.forEach((result) => {
            const [lng, lat] = result.location.split(",");

            const marker = new AMap.Marker({
              position: [parseFloat(lng), parseFloat(lat)],
              map: map.value,
            });

            const infoWindow = new AMap.InfoWindow({
              content: `<div class="info-window">
                          <h1>${result.name}</h1>
                          <p>${result.address}</p>
                        </div>`,
              offset: new AMap.Pixel(0, -30),
            });

            marker.on('mouseover', function () {
              infoWindow.open(map.value, marker.getPosition());
            });

            marker.on('mouseout', function () {
              setTimeout(() => {
                infoWindow.close();
              }, );
            });

            marker.on('click', function () {
              selectedPoi.value = result;
              map.value.setZoomAndCenter(15, marker.getPosition());
            });
          });
        });
      }).catch((error) => {
        console.error('Failed to load AMap:', error);
      });
    });

    const updateSearchResults = (results) => {
      searchResults.value = results;
    };

    const clearSearchResults = () => {
      searchResults.value = [];
      selectedPoi.value = null;
    };

    const showMarkers = (type) => {
      if (map.value) {
        const bounds = map.value.getBounds();
        const northeast = bounds.getNorthEast();
        const southwest = bounds.getSouthWest();

        const centerLng = (northeast.lng + southwest.lng) / 2;
        const centerLat = (northeast.lat + southwest.lat) / 2;

        const radius = Math.sqrt(Math.pow(northeast.lng - centerLng, 2) + Math.pow(northeast.lat - centerLat, 2));

        const url = `https://restapi.amap.com/v3/place/around?key=&location=${centerLng},${centerLat}&radius=${radius}&types=${type}&offset=20`;

        axios.get(url)
          .then((response) => {
            searchResults.value = response.data.pois;
          })
          .catch((error) => {
            console.error('Error performing search:', error);
          });
      }
    };

    const randomZoomAndCenter = () => {
      if (map.value) {

        const zoom = Math.floor(Math.random() * 6) + 9; // 计算9到14的随机数
        const bounds = {
          southwest: [114.8, 35], // 左下角经纬度
          northeast: [122, 38], // 右上角经纬度
        };
        const centerLng = bounds.southwest[0] + Math.random() * (bounds.northeast[0] - bounds.southwest[0]);
        const centerLat = bounds.northeast[1] + Math.random() * (bounds.southwest[1] - bounds.northeast[1]);
        map.value.setZoomAndCenter(zoom, [centerLng, centerLat]);
      }
    };
    const startNavigation = () => {
      navigating.value = true;
      navigation.value = { start: null, end: null };
    };



    const clearNavigation = () => {
      if (route.value) {
        route.value.clear(); // 清除搜索结果
        route.value = null;
      }

      navigating.value = false;
      navigation.value = { start: null, end: null };
    };



    return {
      mapContainer,
      searchResults,
      updateSearchResults,
      clearSearchResults,
      selectedPoi,
      showMarkers,
      randomZoomAndCenter,
      map,
      startNavigation,
      clearNavigation,
    };
  },
};
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
}

.info-window {
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 10px;
  width: 200px;
  opacity: 0;
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}

.info-window h1 {
  font-size: 16px;
  color: #333;
}

.info-window p {
  font-size: 12px;
  color: #666;
}

.info-window:hover {
  transform: scale(1.1);
  opacity: 1;
}

.food-button,
.tourist-button,
.hotel-button,
.transport-button,
.red-area-button,
.random-map-button {
  position: fixed;
  top: 40px;
  left: 1200px;
  z-index: 998;
  background-color: #67C23A;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.tourist-button {
  left: 650px;
}

.hotel-button {
  left: 820px;
}

.transport-button {
  left: 960px;
}

.red-area-button {
  left: 1130px;
}

.food-button {
  left: 1300px;
}

.random-map-button {
  position: fixed;
  top: 85%;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 998;
  background-color: #67C23A;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.food-button:hover,
.tourist-button:hover,
.hotel-button:hover,
.transport-button:hover,
.red-area-button:hover,
.random-map-button:hover {
  background-color: #5C9E31;
}

.food-button:active,
.tourist-button:active,
.hotel-button:active,
.transport-button:active,
.red-area-button:active,
.random-map-button:active {
  background-color: #54902E;
}

.navigate-button {
  position: fixed;
  top: 40px;
  left: 350px;
  z-index: 998;
  background-color: #409EFF;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.navigate-button:hover {
  background-color: #3481E3;
}

.navigate-button:active {
  background-color: #2C6ACD;
}

.clear-navigation-button {
  position: fixed;
  top: 40px;
  left: 450px;
  z-index: 998;
  background-color: #FF4949;

  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.clear-navigation-button:hover {
  background-color: #C0392B;

}

.clear-navigation-button:active {
  background-color: #E74C3C;

}
</style>