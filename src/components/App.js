import React from 'react'

import {
  Route,
  Link,
  Switch
} from 'react-router-dom'

import styles from './App.scss'

import px from 'assets/px.jpg'
import nx from 'assets/nx.jpg'
import py from 'assets/py.jpg'
import ny from 'assets/ny.jpg'
import pz from 'assets/pz.jpg'
import nz from 'assets/nz.jpg'
import origin from 'assets/origin.jpg'
import t1 from 'assets/t1.png'
import t2 from 'assets/t2.png'
import t3 from 'assets/t3.png'

import OribitControlsWrapper from 'scripts/OrbitControls'
const OribitControls = OribitControlsWrapper(three)

class App extends React.Component {
  state = {
    scene: null,
    camera: null,
    renderer: null
  }
  
  threeInit = () => {
    let scene = new three.Scene()
    let texture = new three.CubeTextureLoader()
      .load([
        t2,t2,
        t3,t2,
        t1,t1
      ])
    // texture.mapping = THREE.CubeRefractionMapping
    scene.background = texture
  
    let camera = new three.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100000)
    
    let ambient = new three.AmbientLight(0xffffff)
    scene.add(ambient)
    let pointLight = new three.PointLight(0xffffff, 2)
    scene.add(pointLight)
    
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
    let geometry = new three.BoxGeometry(1, 1, 1)
    let material = new three.MeshNormalMaterial()
    
    
    // geometry.applyMatrix(new three.Matrix4().makeScale(-1, 1, 1))
    
    let cube = new three.Mesh(geometry, material)
    
    this.threeAddItem(cube, 'cube')
    this.state.camera.position.set(0, 0, 1)
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

export default App