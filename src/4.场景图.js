/**
 * 场景图在 3D 引擎是一个图中节点的层次结构，其中每个节点代表了一个局部空间（local space）
 * 
 *  Object3D像 Mesh 一样，它也是场景图中的一个节点；
 *  但与 Mesh 不同的是，它没有材质（material）和几何体（geometry）。它只是代表一个局部空间。
 */

import * as THREE from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

function main() {
  // 渲染容器
  const canvas = document.getElementById("c");

  // 渲染器 (如果没有给three.js传canvas，three.js会自己创建一个，但是必须手动把它添加到文档中)
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

  // 相机
  const camera = createCamera();

  // 场景
  const scene = new THREE.Scene();
  scene.add(createPointLight());

  const gui = new GUI();

  // 要更新旋转角度的对象数组
  const objects = [];

  // 行星系
  const solarSystem = new THREE.Object3D();
  objects.push(solarSystem);
  scene.add(solarSystem);

  const radius = 1;
  const widthSegments = 6;
  const heightSegments = 6;
  const sphereGeometry = new THREE.SphereGeometry(
    radius,
    widthSegments,
    heightSegments
  );

  const sunMaterial = new THREE.MeshPhongMaterial({ emissive: 0xffff00 });

  // 太阳
  const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
  sunMesh.scale.set(5, 5, 5); // 扩大太阳的大小
  // scene.add(sunMesh);
  solarSystem.add(sunMesh);
  objects.push(sunMesh);

  // 地球轨道
  const earthOrbit = new THREE.Object3D();
  earthOrbit.position.x = 10;
  solarSystem.add(earthOrbit);
  objects.push(earthOrbit);

  const earthMaterial = new THREE.MeshPhongMaterial({
    color: 0x2233ff,
    emissive: 0x112244,
  });

  // 地球
  const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
  // earthMesh.position.x = 10;
  // scene.add(earthMesh);
  // sunMesh.add(earthMesh)
  // solarSystem.add(earthMesh);
  earthOrbit.add(earthMesh);
  objects.push(earthMesh);

  // 月球
  const moonMaterial = new THREE.MeshPhongMaterial({
    color: 0x888888,
    emissive: 0x222222,
  });
  const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
  moonMesh.position.x = 2;
  moonMesh.scale.set(0.5, 0.5, 0.5);
  earthOrbit.add(moonMesh);
  // moonOrbit.add(moonMesh);
  objects.push(moonMesh);

  // objects.forEach((node) => {
  //   const axes = new THREE.AxesHelper();
  //   axes.material.depthTest = false;
  //   axes.renderOrder = 1;
  //   node.add(axes);
  // });

  function makeAxisGrid(node, label, units) {
    const helper = new AxisGridHelper(node, units);
    gui.add(helper, "visible").name(label);
  }

  makeAxisGrid(solarSystem, "solarSystem", 25);
  makeAxisGrid(sunMesh, "sunMesh");
  makeAxisGrid(earthOrbit, "earthOrbit");
  makeAxisGrid(earthMesh, "earthMesh");
  // makeAxisGrid(moonOrbit, 'moonOrbit');
  makeAxisGrid(moonMesh, "moonMesh");

  function render(time) {
    time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
      // 相机的宽高比设置为canvas的宽高比，解决响应式拉伸问题
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    objects.forEach((obj) => {
      obj.rotation.y = time;
    });

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
  const far = 1000;

  // 透视相机, 摄像机默认指向Z轴负方向，上方向朝向Y轴正方向, 放置在坐标原点
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

  camera.position.set(0, 50, 0);
  camera.up.set(0, 0, 1);
  camera.lookAt(0, 0, 0);

  return camera;
}

function createPointLight() {
  const color = 0xffffff;
  const intensity = 500;
  const pointLight = new THREE.PointLight(color, intensity);

  return pointLight;
}

function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const pixelRatio = window.devicePixelRatio;
  const width = Math.floor(canvas.clientWidth * pixelRatio);
  const height = Math.floor(canvas.clientHeight * pixelRatio);
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    // 高度不一致，重新设置内部尺寸
    renderer.setSize(width, height, false);
  }
  return needResize;
}

// 打开/关闭轴和网格的可见性
// lil-gui 要求一个返回类型为bool型的属性
// 来创建一个复选框，所以我们为 `visible`属性
// 绑定了一个setter 和 getter。 从而让lil-gui
// 去操作该属性.
class AxisGridHelper {
  constructor(node, units = 10) {
    const axes = new THREE.AxesHelper();
    axes.material.depthTest = false;
    axes.renderOrder = 2; // 在网格渲染之后再渲染
    node.add(axes);

    const grid = new THREE.GridHelper(units, units);
    grid.material.depthTest = false;
    grid.renderOrder = 1;
    node.add(grid);

    this.grid = grid;
    this.axes = axes;
    this.visible = false;
  }
  get visible() {
    return this._visible;
  }
  set visible(v) {
    this._visible = v;
    this.grid.visible = v;
    this.axes.visible = v;
  }
}

main();
