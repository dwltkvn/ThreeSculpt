import React from "react";
import * as THREE from "three";
const OrbitControls = require("three-orbit-controls")(THREE);

class ThreeRenderer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.onResize = this.onResize.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.getIntersectedObject = this.getIntersectedObject.bind(this);

    this.prevSelectedObj = null;
    this.colorMaterial = [];
    this.undoActionArray = [];
    this.intersectableObjects = [];
  }

  componentDidMount() {
    const raycaster = (this.raycaster = new THREE.Raycaster());

    const scene = (this.scene = new THREE.Scene());
    scene.background = new THREE.Color(0xf0f0f0);

    // RENDERER creation and configuration
    const renderer = (this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true
    }));
    renderer.setClearColor(0xffffff, 1.0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // CAMERA creation and configuraiton
    const camera = (this.camera = new THREE.PerspectiveCamera(
      35,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    ));

    camera.position.set(100, 100, 100);
    camera.lookAt(0, 0, 0);

    // add Orital Controler
    const controls = (this.controls = new OrbitControls(this.camera));

    const gridHelper = new THREE.GridHelper(50, 50);
    gridHelper.position.y = -4;
    scene.add(gridHelper);

    // GEOMETRY - Create our only geometry: a cube.
    //const geometry = new THREE.BoxGeometry(1, 1, 1);
    const geometry = new THREE.BoxBufferGeometry(1, 1, 1);

    // MATERIAL - create the default material (red cube) and selected material (white cube) + create a material for each color of the palette passed via props.
    const material = (this.nonSelectedMaterial = new THREE.MeshLambertMaterial({
      color: 0xff0000
    }));

    this.selectedMaterial = new THREE.MeshLambertMaterial({
      color: 0xffffff
    });

    //
    this.props.palette.forEach((c, idx) => {
      this.colorMaterial.push(new THREE.MeshLambertMaterial({ color: c }));
    });

    // MESH - create the model cube that will be cloned to create its others siblings
    //const cubes = new THREE.Mesh(geometry, material);

    // create a big cube composed of 9 x 9 x 9 cubes.
    const voxelArray = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
    //const voxelArray = [0];
    voxelArray.forEach(x => {
      voxelArray.forEach(y => {
        voxelArray.forEach(z => {
          const cube = new THREE.Mesh(geometry, material); //cubes.clone();
          cube.position.set(x, y, z);
          cube.currentColorMaterial = this.nonSelectedMaterial; // additionnal field, which is used to store the current color material.
          scene.add(cube);
          this.intersectableObjects.push(cube);
        });
      });
    });

    // LIGHT - use two light at opposed position and at cube corner.
    const light_p = new THREE.PointLight(0xffffff);
    light_p.position.set(10, 10, 10);
    scene.add(light_p);

    const light_p2 = new THREE.PointLight(0xffffff);
    light_p2.position.set(-10, -10, -10);
    scene.add(light_p2);

    const light_a = new THREE.AmbientLight(0x333333);
    scene.add(light_a);

    // ANIMATION FRAME - initiate the request animation frame and call it a first time to start the loop.
    const animate = function() {
      requestAnimationFrame(animate);

      const f1 = Date.now() / 1000;
      //cube.rotation.x = Math.sin(f1);
      //cube.rotation.y = Math.cos(f1);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // the scene has been rendered, the use didn't interacted yet with the scene.
    // Highlight the cube which is in camera line view.
    const obj = this.getIntersectedObject();
    this.highlightSelectedObject(obj);

    // EVENT LISTENER - connect event to their respective slots.
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
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // When the user interact (orbital controller) with the scene, update the currently selected cube.
  onTouchMove(e) {
    const obj = this.getIntersectedObject();
    this.highlightSelectedObject(obj);

    // if current obj isn't the same as the previous selected obj, then un-highlight it
    if (this.prevSelectedObj && obj !== this.prevSelectedObj) {
      this.highlightSelectedObject(this.prevSelectedObj, false);
    }
    this.prevSelectedObj = obj;
  }

  // cast a ray-line from the center of the screen (0,0), return the first interescted cube.
  getIntersectedObject() {
    this.raycaster.setFromCamera({ x: 0, y: 0 }, this.camera);

    //const intersects = this.raycaster.intersectObjects([this.scene], true);
    const intersects = this.raycaster.intersectObjects(
      this.intersectableObjects,
      true
    );
    if (intersects.length <= 0) return null;

    const selectedObject = intersects[0].object;
    return selectedObject;
  }

  // update obj cube to selected material, if pHighlight param is true (default value) ; otherwise the cube is un-highlighted and we restore it's current material color.
  highlightSelectedObject(obj, pHighlight = true) {
    if (obj) {
      if (pHighlight) obj.material = this.selectedMaterial;
      else {
        obj.material = obj.currentColorMaterial;
      }
    }
  }

  // update the currently selected cube color to the color the user selected.
  colorize() {
    const obj = this.getIntersectedObject();
    if (obj) {
      const prevColor = obj.currentColorMaterial;
      obj.currentColorMaterial = this.colorMaterial[this.props.paletteIndex];
      let undoObj = {
        target: obj,
        undo: ThreeRenderer.UndoStates.UNDO_COLOR,
        color: prevColor
      };
      this.undoActionArray.push(undoObj);
      this.props.cbUndoAvailable(true); // tell the parent that undo action are available
    }
  }

  // hide the currently selected cube, then highlight the new cube that may be selected now.
  sculpt() {
    const obj = this.getIntersectedObject();
    if (obj) {
      obj.visible = false;
      obj.material = obj.currentColorMaterial;
      let undoObj = {
        target: obj,
        undo: ThreeRenderer.UndoStates.UNDO_SCULPT
      };
      this.undoActionArray.push(undoObj);
      this.props.cbUndoAvailable(true); // tell the parent that undo action are available

      // when the cube has been removed, evaluated the next selected cube
      const nextObj = this.getIntersectedObject();
      this.highlightSelectedObject(nextObj);
    }
  }

  undo() {
    if (this.undoActionArray.length === 0) return;

    const undoObj = this.undoActionArray.pop();
    if (undoObj.undo === ThreeRenderer.UndoStates.UNDO_SCULPT)
      this.undoSculpt(undoObj.target);
    else if (undoObj.undo === ThreeRenderer.UndoStates.UNDO_COLOR)
      this.undoColorize(undoObj.target, undoObj.color);

    this.props.cbUndoAvailable(this.undoActionArray.length > 0); // tell the parent that undo action are still available
  }

  undoSculpt(lastObj) {
    const obj = this.getIntersectedObject();
    if (obj) obj.material = obj.currentColorMaterial;

    // actually undo

    if (lastObj) {
      lastObj.visible = true;
      lastObj.material = lastObj.currentColorMaterial;
    }

    // when the cube has been added, evaluated the next selected cube
    const nextObj = this.getIntersectedObject();
    this.highlightSelectedObject(nextObj);
  }

  undoColorize(lastObj, lastColor) {
    console.log(lastObj);
    console.log(lastColor);
    const obj = this.getIntersectedObject();
    if (obj) obj.material = obj.currentColorMaterial;

    // actually undo
    if (lastObj) {
      lastObj.currentColorMaterial = lastColor;
      lastObj.material = lastColor;
    }

    // when the cube has been added, evaluated the next selected cube
    const nextObj = this.getIntersectedObject();
    this.highlightSelectedObject(nextObj);
  }

  render() {
    return <canvas ref={el => (this.canvas = el)} />;
  }
}

ThreeRenderer.UndoStates = Object.freeze({
  UNDO_SCULPT: Symbol("undosculpt"),
  UNDO_COLOR: Symbol("undocolor")
});

export default ThreeRenderer;
