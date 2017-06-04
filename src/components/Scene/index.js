import React from 'react'

import styles from './Scene.scss'

import imgNx from 'assets/scene-1-nx.png'
import imgNz from 'assets/scene-1-nz.png'
import imgPz from 'assets/scene-1-pz.png'
import imgOt from 'assets/scene-1-ot.png'
import imgLeaves from 'assets/scene-1-leaves.png'

import OribitControlsWrapper from 'scripts/OrbitControls'
import DeviceOrientationControlsWrapper from 'scripts/DeviceOrientationControls'
const OribitControls = OribitControlsWrapper(three)
const DeviceOrientationControls = DeviceOrientationControlsWrapper(three)

class Scene extends React.Component {
  state = {
    scene: null,
    camera: null,
    renderer: null
  }
  
  threeInit = () => {
    let scene = new three.Scene()
    let texture = new three.CubeTextureLoader()
      .load([
        imgOt, imgNx,
        imgOt, imgOt,
        imgPz, imgNz
      ])
    scene.background = texture
    
    let camera = new three.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100000)
    
    let ambient = new three.AmbientLight(0xffffff)
    scene.add(ambient)
    
    let renderer = new three.WebGLRenderer({
      alpha: true
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    this.wrapper.appendChild(renderer.domElement)
    
    let controls = [
      new OribitControls(camera, renderer.domElement),
      // new DeviceOrientationControls(camera)
    ]
    controls[0].maxPolarAngle = 90 / 180 * Math.PI
    controls[0].minPolarAngle = 90 / 180 * Math.PI
    controls[0].minAzimuthAngle = -120 / 180 * Math.PI
    controls[0].maxAzimuthAngle = 20 / 180 * Math.PI
  
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener( 'resize', onWindowResize, false )
  
    this.setState({
      scene,
      camera,
      renderer
    })
  }
  
  threeRender = () => {
    requestAnimationFrame(this.threeRender)
    this.state.renderer.render(this.state.scene, this.state.camera)
    
    this.threeRotateCube()
  }
  
  threeAddItem = (item, name) => {
    this.state.scene.add(item)
    this.items = this.items ? {
      ...this.items,
      [name]: item
    } : {
      [name]: item
    }
  }
  
  threeCreateEle = () => {
    let loader = new three.TextureLoader()
    
    let grassGeo = new three.CylinderGeometry(5, 5, 2, 30)
    
    loader.load(imgLeaves, texture => {
      let grassMat = new three.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: three.BackSide
      })
      let grass = new three.Mesh(grassGeo, grassMat)
      grass.position.set(0, 7.8, 0)
      grass.rotateX(0.05)
      
      this.threeAddItem(grass, 'grass')
    })
    
    this.state.camera.position.set(0, 0, 10)
  }
  
  threeRotateCube = () => {
    if (this.items && this.items.cube) {
      this.items.cube.rotation.y += .02
      // this.items.cube.rotation.y += .05
    }
  }
  
  componentDidUpdate(prevProps, prevState) {
    if (!prevState.scene && this.state.scene) {
      this.threeCreateEle()
      this.threeRender()
    }
  }
  
  componentDidMount() {
    this.threeInit()
  }
  
  render() {
    return (
      <div ref={ele => this.wrapper = ele} className={styles.wrapper}>
      </div>
    )
  }
}

export default Scene