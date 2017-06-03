import React from 'react'
import * as three from 'three'

import {
  Route,
  Link,
  Switch
} from 'react-router-dom'

import styles from './App.scss'

class App extends React.Component {
  state = {
    scene: null,
    camera: null,
    renderer: null
  }
  
  threeInit = () => {
    let scene = new three.Scene()
    let camera = new three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, .1, 1000)
    
    let renderer = new three.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    this.wrapper.appendChild(renderer.domElement)
    
    this.setState({
      scene,
      camera,
      renderer
    })
  }
  
  threeRender = () => {
    requestAnimationFrame(this.threeRender)
    this.state.renderer.render(this.state.scene, this.state.camera)
    
    // this.threeRotateCube()
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
    // let geometry = new three.BoxGeometry(1,1,1)
    // let material = new three.MeshBasicMaterial({
    //   color: 0x00ff00
    // })
    // let cube = new three.Mesh(geometry, material)
    //
    // this.state.camera.position.z = 5
    //
    // this.threeAddItem(cube, 'cube')
    this.state.camera.position.set(0, 0, 100)
    this.state.camera.lookAt(new three.Vector3(0, 0, 0))
    
    let material = new three.LineBasicMaterial({
      color: 0x0000ff
    })
    let geometry = new three.Geometry()
    
    geometry.vertices.push(new three.Vector3(-10, 0, 0))
    geometry.vertices.push(new three.Vector3(0, 10, 0))
    geometry.vertices.push(new three.Vector3(10, 0, 0))
    
    let line = new three.Line(geometry, material)
    
    this.threeAddItem(line, 'line')
  }
  
  threeRotateCube = () => {
    if (this.items && this.items.cube) {
      this.items.cube.rotation.x += .1
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