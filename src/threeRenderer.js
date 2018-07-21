import React from "react";
import * as THREE from "three";
const OrbitControls = require("three-orbit-controls")(THREE);

class ThreeRenderer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onResize = this.onResize.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onClick = this.onClick.bind(this);
    this.checkIntersection = this.checkIntersection.bind(this);
    this.mouse = { x: 0, y: 0 };
  }

  componentDidMount() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const raycaster = (this.raycaster = new THREE.Raycaster());

    const scene = (this.scene = new THREE.Scene());
    scene.background = new THREE.Color(0x222222);

    const renderer = (this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas
    }));
    renderer.setSize(width, height);
    renderer.setClearColor(0xffffff, 1.0);

    const camera = (this.camera = new THREE.PerspectiveCamera(
      35,
      width / height,
      0.1,
      1000
    ));
    /*
    const camera = (this.camera = new THREE.OrthographicCamera(
      width / -2,
      width / 2,
      height / 2,
      height / -2,
      1,
      1000
    ));
    */
    camera.position.z = 2;

    const controls = (this.controls = new OrbitControls(this.camera));

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshLambertMaterial({
      color: 0xff0000
    });

    const cubes = new THREE.Mesh(geometry, material);

    const voxelArray = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
    voxelArray.map(x => {
      voxelArray.map(y => {
        voxelArray.map(z => {
          const cube = cubes.clone();
          cube.position.set(x, y, z);
          scene.add(cube);
        });
      });
    });

    const outlineMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.BackSide
    });
    const outlineMesh = (this.outlineMesh = new THREE.Mesh(
      geometry,
      outlineMaterial
    ));
    //outlineMesh.position.set(cube.position.x, cube.position.y, cube.position.z); // = cube.position;
    outlineMesh.scale.multiplyScalar(1.5);
    outlineMesh.visible = true;
    outlineMesh.position.set(0, 0, 4);

    scene.add(outlineMesh);

    const light_p = new THREE.PointLight(0xffffff);
    light_p.position.set(100, 100, 100);
    scene.add(light_p);

    const light_a = new THREE.AmbientLight(0x333333);
    scene.add(light_a);

    const animate = function() {
      requestAnimationFrame(animate);

      const f1 = Date.now() / 1000;
      //cube.rotation.x = Math.sin(f1);
      //cube.rotation.y = Math.cos(f1);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    this.onResize();
    window.addEventListener("resize", this.onResize);
    window.addEventListener("mousemove", this.onTouchMove);
    window.addEventListener("touchmove", this.onTouchMove);
    window.addEventListener("click", this.onClick);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("mousemove", this.onTouchMove);
    window.removeEventListener("touchmove", this.onTouchMove);
    window.removeEventListener("click", this.onClick);
    this.renderer.dispose();
  }

  onResize(e) {
    console.log(e);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  onTouchMove(e) {
    let x, y;

    if (e.changedTouches) {
      x = e.changedTouches[0].pageX;
      y = e.changedTouches[0].pageY;
    } else {
      x = e.clientX;
      y = e.clientY;
    }

    this.mouse.x = (x / window.innerWidth) * 2 - 1;
    this.mouse.y = -(y / window.innerHeight) * 2 + 1;

    const obj = this.checkIntersection();
    if (obj) {
      const { x, y, z } = obj.position;
      this.outlineMesh.position.set(x, y, z);
      //obj.material.color.setRGB(64, 64, 64);
    }
  }

  onClick(e) {
    const x = e.clientX;
    const y = e.clientY;

    this.mouse.x = (x / window.innerWidth) * 2 - 1;
    this.mouse.y = -(y / window.innerHeight) * 2 + 1;

    const obj = this.checkIntersection();
    if (obj) {
      obj.visible = false;
    }
  }

  checkIntersection() {
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObjects([this.scene], true);

    if (intersects.length > 0) {
      const selectedObject = intersects[0].object;
      return selectedObject;
    } else {
      return null;
    }
  }
  storeRef = node => {
    this.canvas = node;
  };

  render() {
    return <canvas id="three" ref={this.storeRef} />;
  }
}

export default ThreeRenderer;
