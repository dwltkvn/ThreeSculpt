import React from "react";
import * as THREE from "three";
const OrbitControls = require("three-orbit-controls")(THREE);

const canvasStyle = {
  flex: 1,
  height: "50%",
  border: "blue",
  borderStyle: "solid",
  borderWidth: "1px"
};

class ThreeRenderer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onResize = this.onResize.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onClick = this.onClick.bind(this);
    this.getIntersectedObject = this.getIntersectedObject.bind(this);
    this.mouse = { x: 0, y: 0 };
    this.prevSelectedObj = null;
  }

  componentDidMount() {
    //const width = this.div.width; //window.innerWidth;
    //const height = this.div.height; //window.innerHeight;
    const raycaster = (this.raycaster = new THREE.Raycaster());

    const scene = (this.scene = new THREE.Scene());
    scene.background = new THREE.Color(0x222222);

    const renderer = (this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas
    }));
    //this.canvas.width = this.canvas.clientWidth;
    //this.canvas.height = this.canvas.clientHeight;
    //renderer.setSize(width, height);
    renderer.setViewport(0, 0, this.canvas.width, this.canvas.height);
    renderer.setClearColor(0xffffff, 1.0);

    const camera = (this.camera = new THREE.PerspectiveCamera(
      35,
      this.canvas.clientWidth / this.canvas.clientHeight,
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
    camera.position.z = 25;

    const controls = (this.controls = new OrbitControls(this.camera));

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = (this.nonSelectedMaterial = new THREE.MeshLambertMaterial({
      color: 0xff0000
    }));

    this.selectedMaterial = new THREE.MeshLambertMaterial({
      color: 0xffffff
    });

    const cubes = new THREE.Mesh(geometry, material);

    const voxelArray = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
    voxelArray.forEach(x => {
      voxelArray.forEach(y => {
        voxelArray.forEach(z => {
          const cube = cubes.clone();
          cube.position.set(x, y, z);
          scene.add(cube);
        });
      });
    });

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

    const obj = this.getIntersectedObject();
    if (obj) obj.material = this.selectedMaterial;

    this.onResize();
    window.addEventListener("resize", this.onResize);
    window.addEventListener("mousemove", this.onTouchMove);
    this.canvas.addEventListener("touchmove", this.onTouchMove);
    window.addEventListener("click", this.onClick);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("mousemove", this.onTouchMove);
    this.canvas.removeEventListener("touchmove", this.onTouchMove);
    window.removeEventListener("click", this.onClick);
    this.renderer.dispose();
  }

  onResize(e) {
    return;
    this.camera.aspect = this.div.width / this.div.height; //window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    //this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setSize(this.div.width, this.div.height);
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

    this.mouse.x = (x / this.canvas.width) * 2 - 1;
    this.mouse.y = -(y / this.canvas.height) * 2 + 1;

    const obj = this.getIntersectedObject();
    if (obj) {
      if (this.prevSelectedObj && obj !== this.prevSelectedObj) {
        this.prevSelectedObj.material = this.nonSelectedMaterial;
      }
      obj.material = this.selectedMaterial;
      //obj.material.color.setRGB(64, 64, 64); --> doesn't work ; it will change the material, which is shared by all cubes
      this.prevSelectedObj = obj;
    }
  }

  onClick(e) {
    return;
    const x = e.clientX;
    const y = e.clientY;

    this.mouse.x = (x / window.innerWidth) * 2 - 1;
    this.mouse.y = -(y / window.innerHeight) * 2 + 1;

    const obj = this.getIntersectedObject();
    if (obj) {
      obj.visible = false;
    }
  }

  getIntersectedObject() {
    this.raycaster.setFromCamera({ x: 0, y: 0 }, this.camera);

    const intersects = this.raycaster.intersectObjects([this.scene], true);

    if (intersects.length > 0) {
      const selectedObject = intersects[0].object;
      return selectedObject;
    } else {
      return null;
    }
  }

  sculpt() {
    const obj = this.getIntersectedObject();
    if (obj) {
      obj.visible = false;
    }
  }

  storeRef = node => {
    this.canvas = node;
  };

  render() {
    return <canvas id="three" ref={this.storeRef} style={canvasStyle} />;
  }
}

export default ThreeRenderer;
