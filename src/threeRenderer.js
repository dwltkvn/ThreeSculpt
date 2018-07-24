import React from "react";
import * as THREE from "three";
const OrbitControls = require("three-orbit-controls")(THREE);

const canvasStyle = {
  flex: 1.0,
  //height: "50%",
  //width:"100%",
  border: "blue",
  borderStyle: "solid",
  borderWidth: "0px"
};

class ThreeRenderer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onResize = this.onResize.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.getIntersectedObject = this.getIntersectedObject.bind(this);
    this.prevSelectedObj = null;
    this.colorMaterial = [];
  }

  componentDidMount() {
    const raycaster = (this.raycaster = new THREE.Raycaster());

    const scene = (this.scene = new THREE.Scene());
    scene.background = new THREE.Color(0x222222);

    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;

    const renderer = (this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas
    }));

    renderer.setViewport(0, 0, this.canvas.width, this.canvas.height);
    renderer.setClearColor(0xffffff, 1.0);

    const camera = (this.camera = new THREE.PerspectiveCamera(
      35,
      this.canvas.clientWidth / this.canvas.clientHeight,
      0.1,
      1000
    ));

    camera.position.z = 25;

    const controls = (this.controls = new OrbitControls(this.camera));

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = (this.nonSelectedMaterial = new THREE.MeshLambertMaterial({
      color: 0xff0000
    }));

    this.selectedMaterial = new THREE.MeshLambertMaterial({
      color: 0xffffff
    });

    this.props.palette.forEach((c, idx) => {
      this.colorMaterial.push(new THREE.MeshLambertMaterial({ color: c }));
    });

    const cubes = new THREE.Mesh(geometry, material);

    const voxelArray = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
    voxelArray.forEach(x => {
      voxelArray.forEach(y => {
        voxelArray.forEach(z => {
          const cube = cubes.clone();
          cube.position.set(x, y, z);
          cube.currentColorMaterial = this.nonSelectedMaterial;
          scene.add(cube);
        });
      });
    });

    const light_p = new THREE.PointLight(0xffffff);
    light_p.position.set(10, 10, 10);
    scene.add(light_p);

    const light_p2 = new THREE.PointLight(0xffffff);
    light_p2.position.set(-10, -10, -10);
    scene.add(light_p2);

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
    this.highlightSelectedObject(obj);

    //this.onResize();
    window.addEventListener("resize", this.onResize);
    window.addEventListener("mousemove", this.onTouchMove);
    window.addEventListener("touchmove", this.onTouchMove, true);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("mousemove", this.onTouchMove);
    window.removeEventListener("touchmove", this.onTouchMove);
    this.renderer.dispose();
  }

  onResize(e) {
    //this.canvas.width = this.canvas.clientWidth;
    //this.canvas.height = this.canvas.clientHeight;
    this.renderer.setViewport(0, 0, this.canvas.width, this.canvas.height);
    this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    this.camera.updateProjectionMatrix();
  }

  onTouchMove(e) {
    const obj = this.getIntersectedObject();
    this.highlightSelectedObject(obj);

    // if current obj isn't the same as the previous selected obj, then un-highlight it
    if (this.prevSelectedObj && obj !== this.prevSelectedObj) {
      this.highlightSelectedObject(this.prevSelectedObj, false);
    }
    this.prevSelectedObj = obj;
  }

  getIntersectedObject() {
    this.raycaster.setFromCamera({ x: 0, y: 0 }, this.camera);

    const intersects = this.raycaster.intersectObjects([this.scene], true);
    if (intersects.length <= 0) return null;

    const selectedObject = intersects[0].object;
    return selectedObject;
  }

  highlightSelectedObject(obj, highlight = true) {
    if (obj) {
      if (highlight) obj.material = this.selectedMaterial;
      else {
        obj.material = obj.currentColorMaterial;
      }
    }
  }

  colorize() {
    const obj = this.getIntersectedObject();
    if (obj) {
      obj.currentColorMaterial = this.colorMaterial[this.props.paletteIndex];
    }
  }

  sculpt() {
    const obj = this.getIntersectedObject();
    if (obj) {
      obj.visible = false;
      // when the cube has been removed, evaluated the next selected cube
      const nextObj = this.getIntersectedObject();
      this.highlightSelectedObject(nextObj);
    }
  }

  render() {
    return (
      <canvas id="three" ref={el => (this.canvas = el)} style={canvasStyle} />
    );
  }
}

export default ThreeRenderer;
