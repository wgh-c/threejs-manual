import * as THREE from "three";

function main() {
  // 渲染容器
  const canvas = document.getElementById("c");

  // 渲染器 (如果没有给three.js传canvas，three.js会自己创建一个，但是必须手动把它添加到文档中)
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

  // 相机
  const camera = createCamera();

  // 场景
  const scene = new THREE.Scene();

  // 网格对象
  const cube = createMesh();
  scene.add(cube);

  const light = createLight();
  scene.add(light);

  function render(time) {
    time *= 0.001; // 将时间单位变为秒

    cube.rotation.x = time;
    cube.rotation.y = time;

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

function createCamera() {
  const fov = 75; // 视野范围, 垂直方向为75度
  const aspect = 2; // 相机默认值, 画布的宽高比

  // near和far代表近平面和远平面，它们限制了摄像机面朝方向的可绘区域。 任何距离小于或超过这个范围的物体都将被裁剪掉(不绘制)
  const near = 0.1;
  const far = 5;

  // 透视相机, 摄像机默认指向Z轴负方向，上方向朝向Y轴正方向, 放置在坐标原点
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

  camera.position.z = 2;

  return camera;
}

function createMesh() {
  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;

  // 几何体，包含了组成三维物体的顶点信息的几何体(物体的形状)
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  // 材质(如何绘制物体，光滑还是平整，什么颜色，什么贴图等等)
  // MeshBasicMaterial材质不会受到灯光的影响
  // const material = new THREE.MeshBasicMaterial({ color: 0x44aa88 });
  const material = new THREE.MeshPhongMaterial({ color: 0x44aa88 }); // 绿蓝色

  // 网格对象，包含几何体、材质
  const cube = new THREE.Mesh(geometry, material);

  return cube;
}

function createLight() {
  const color = 0xffffff;
  const intensity = 3;

  // 平行光， 有一个位置和目标点。默认值都为(0, 0, 0)
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-1, 2, 4);

  return light;
}

main();
