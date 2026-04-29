<template>
  <div ref="threeContainer" class="three-container" @dblclick="onDoubleClick">
    <div v-if="isLoading" class="loading-text">正在潜入案发现场...</div>

    <div v-show="!isLoading" class="hotspot-layer">
      <button 
        v-for="(spot, index) in hotspots" 
        :key="index"
        class="clue-hotspot"
        :style="{ 
          left: spot.screenPos.x + 'px', 
          top: spot.screenPos.y + 'px',
          display: (spot.isVisible && spot.isOccluded) ? 'block' : 'none' 
        }"
        @click="$emit('find-clue', spot.name)"
      >
        <div class="hotspot-label">{{ spot.name }}</div>
      </button>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default {
  name: 'ModelViewer',
  props: {
    modelPath: {
      type: String,
      default: '/S003.glb'
    }
  },
  data() {
    return {
      isLoading: true,
      isMoving: false,
      targetCameraPos: new THREE.Vector3(),
      targetLookAt: new THREE.Vector3(),
      reqId: null,
      hotspots: [
        { name: '绿伞下的杂物', pos: new THREE.Vector3(-2.9637610441730073, -0.008544994214409029, -2.9663520875541405), screenPos: { x: 0, y: 0 }, isVisible: false, isOccluded: true },
        { name: '红伞旁的脚印', pos: new THREE.Vector3(-0.724751585481722,0.07088003644618399,1.2393499071785776), screenPos: { x: 0, y: 0 }, isVisible: false, isOccluded: true },
        { name: '巷口的血迹', pos: new THREE.Vector3(-6.0867345333099365,0.0015874463664249383,-4.814651961140886), screenPos: { x: 0, y: 0 }, isVisible: false, isOccluded: true },
        { name: '远处遗落的证物', pos: new THREE.Vector3(1.1500849319531774,0.005522446782673069,-6.479376834173252), screenPos: { x: 0, y: 0 }, isVisible: false, isOccluded: true }
      ]
    };
  },
  mounted() {
    this.initThreeJS();
  },
  beforeUnmount() {
    cancelAnimationFrame(this.reqId);
    window.removeEventListener('resize', this.onResize);
    if (this.renderer) this.renderer.dispose();
  },
  methods: {
    initThreeJS() {
      const container = this.$refs.threeContainer;
      this.scene = new THREE.Scene();
      
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;
      container.appendChild(this.renderer.domElement);

      this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 10000);
      this.raycaster = new THREE.Raycaster();
      this.mouse = new THREE.Vector2();

      const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
      this.scene.add(ambientLight);
      
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);

      const loader = new GLTFLoader();
      loader.load(this.modelPath, (gltf) => {
        this.model = gltf.scene; // 存到 this 方便后续射线检测
        this.scene.add(this.model);

        this.camera.position.set(-20, 10, 20);
        this.camera.lookAt(0, 0, 0);
        this.isLoading = false;
      }, undefined, (error) => {
        console.error('模型加载失败:', error);
      });

      this.animate();
      window.addEventListener('resize', this.onResize);
    },

    updateHotspots() {
      if (!this.camera || this.isLoading || !this.model) return;
      
      const container = this.$refs.threeContainer;
      const widthHalf = container.clientWidth / 2;
      const heightHalf = container.clientHeight / 2;

      this.hotspots.forEach(spot => {
        // 1. 计算投影位置
        const vector = spot.pos.clone().project(this.camera);
        
        // 2. 基本可视性检查（是否在相机视野内）
        spot.isVisible = vector.z < 1 && Math.abs(vector.x) <= 1 && Math.abs(vector.y) <= 1;

        if (spot.isVisible) {
          // 3. 遮挡检测（射线检测）
          // 从相机位置发射射线到热点 3D 坐标
          const rayDirection = new THREE.Vector3().subVectors(spot.pos, this.camera.position).normalize();
          this.raycaster.set(this.camera.position, rayDirection);
          
          // 检测射线与模型中所有物体的交点
          const intersects = this.raycaster.intersectObjects(this.model.children, true);
          
          if (intersects.length > 0) {
            const distanceToHit = intersects[0].distance;
            const distanceToSpot = this.camera.position.distanceTo(spot.pos);
            
            // 如果交点距离小于热点距离（且差值超过微小误差），说明被遮挡了
            // 这里减去 0.1 是为了防止热点刚好在物体表面时发生错误的自我遮挡
            spot.isOccluded = distanceToHit >= (distanceToSpot - 0.1);
          } else {
            spot.isOccluded = true;
          }

          // 4. 更新 2D 屏幕位置
          spot.screenPos.x = (vector.x * widthHalf) + widthHalf;
          spot.screenPos.y = -(vector.y * heightHalf) + heightHalf;
        }
      });
    },

    animate() {
      this.reqId = requestAnimationFrame(this.animate);
      if (this.isMoving) {
        this.camera.position.lerp(this.targetCameraPos, 0.05);
        this.controls.target.lerp(this.targetLookAt, 0.05);
        if (this.camera.position.distanceTo(this.targetCameraPos) < 0.1) {
          this.isMoving = false;
        }
      }
      this.controls.update();
      this.updateHotspots();
      this.renderer.render(this.scene, this.camera);
    },

    onDoubleClick(event) {
      const container = this.$refs.threeContainer;
      const rect = container.getBoundingClientRect();
      this.mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
      this.mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.scene.children, true);

      if (intersects.length > 0) {
        const hitPoint = intersects[0].point;
        this.targetLookAt.copy(hitPoint);
        const direction = new THREE.Vector3().subVectors(this.camera.position, hitPoint).normalize();
        this.targetCameraPos.copy(hitPoint).add(direction.multiplyScalar(5));
        this.isMoving = true;
      }
    },
    
    onResize() {
      const container = this.$refs.threeContainer;
      if (!container) return;
      this.camera.aspect = container.clientWidth / container.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(container.clientWidth, container.clientHeight);
    }
  }
}
</script>

<style scoped>
.three-container { width: 100%; height: 100%; position: relative; overflow: hidden; background: #000; }
.loading-text { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #a93226; z-index: 10; font-weight: bold; }

.hotspot-layer { position: absolute; inset: 0; pointer-events: none; z-index: 5; }
.clue-hotspot {
  position: absolute;
  pointer-events: auto;
  width: 24px;
  height: 24px;
  background: rgba(169, 50, 38, 0.9);
  border: 2px solid #fff;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  box-shadow: 0 0 15px #a93226;
  animation: pulse 2s infinite;
  transition: opacity 0.3s; /* 让显隐更平滑 */
}

.hotspot-label {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(30, 27, 24, 0.9);
  color: #cbb497;
  padding: 4px 10px;
  border: 1px solid #3c2a21;
  font-size: 12px;
  white-space: nowrap;
  display: none;
  pointer-events: none;
}

.clue-hotspot:hover .hotspot-label { display: block; }

@keyframes pulse {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  50% { transform: translate(-50%, -50%) scale(1.3); opacity: 0.7; }
  100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
}
</style>