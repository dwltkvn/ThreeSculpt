import React from "react";
import * as THREE from "three";

class ThreeRenderer extends React.Component {
  componentDidMount() {
    const width = 100;
    const height = width;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222);

    const renderer = (this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas
    }));
    renderer.setSize(width, height);
    renderer.setClearColor(0xffffff, 1.0);

    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 1000);
    camera.position.z = 5;

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshLambertMaterial({
      color: 0xff0000
    });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const light_p = new THREE.PointLight(0xffffff);
    light_p.position.set(100, 100, 100);
    scene.add(light_p);

    const light_a = new THREE.AmbientLight(0x333333);
    scene.add(light_a);

    const animate = function() {
      requestAnimationFrame(animate);

      const f1 = Date.now() / 1000;
      cube.rotation.x = Math.sin(f1);
      cube.rotation.y = Math.cos(f1);

      renderer.render(scene, camera);
    };

    animate();

    this.cube = cube;
  }

  componentWillUnmount() {
    this.renderer.dispose();
  }

  storeRef = node => {
    this.canvas = node;
  };

  render() {
    return <canvas id="three" ref={this.storeRef} />;
  }
}

export default ThreeRenderer;
