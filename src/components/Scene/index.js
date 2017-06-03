import React from 'react'

import styles from './Scene.scss'

import imgNx from 'assets/scene-1-nx.png'
import imgNz from 'assets/scene-1-nz.png'
import imgOt from 'assets/scene-1-ot.png'
import imgLeaves from 'assets/scene-1-leaves.png'

import OribitControlsWrapper from 'scripts/OrbitControls'
const OribitControls = OribitControlsWrapper(three)

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
        imgOt, imgNz
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
    
    let controls = new OribitControls(camera, renderer.domElement)
    
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
  
    let geometry = new three.BoxGeometry(1, 1, 1)
    let material = new three.MeshNormalMaterial()
    // geometry.applyMatrix(new three.Matrix4().makeScale(-1, 1, 1))
    let cube = new three.Mesh(geometry, material)
    this.threeAddItem(cube, 'cube')
    
    let grassGeo = new three.PlaneGeometry(220, 15)
    
    loader.load(imgLeaves, texture => {
      let grassMat = new three.MeshBasicMaterial({
        map: texture,
        transparent: true
      })
      let grass = new three.Mesh(grassGeo, grassMat)
      grass.position.set(0, 80, -100)
  
      let grass2 = grass.clone()
      grass2.rotateY(-90)
      grass2.position.set(70, 80, -20)
      // grass2.position.set(-100, 80, 0)
  
      this.threeAddItem(grass, 'grass')
      this.threeAddItem(grass2, 'grass2')
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