import React from "react";
import * as THREE from "three";
const OrbitControls = require("three-orbit-controls")(THREE);

class ThreeRenderer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onResize = this.onResize.bind(this);
  }

  componentDidMount() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
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

    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const material = new THREE.MeshLambertMaterial({
      color: 0xff0000
    });
    const cube = new THREE.Mesh(geometry, material);

    const outlineMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.BackSide
    });
    const outlineMesh = new THREE.Mesh(geometry, outlineMaterial);
    outlineMesh.position.set(cube.position.x, cube.position.y, cube.position.z); // = cube.position;
    outlineMesh.scale.multiplyScalar(1.05);

    scene.add(cube);
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

    this.cube = cube;

    this.onResize();
    window.addEventListener("resize", this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize);
    this.renderer.dispose();
  }

  onResize(e) {
    console.log(e);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  storeRef = node => {
    this.canvas = node;
  };

  render() {
    return <canvas id="three" ref={this.storeRef} />;
  }
}

export default ThreeRenderer;
