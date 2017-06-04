import React from 'react'

import styles from './Scene.scss'

import imgNx from 'assets/scene-1-nx.png'
import imgNz from 'assets/scene-1-nz.png'
import imgPz from 'assets/scene-1-pz.png'
import imgOt from 'assets/scene-1-ot.png'
import imgLeaves from 'assets/scene-1-leaves.png'
import imgTip from 'assets/scene-1-tip.png'
import imgSea from 'assets/scene-1-sea.jpg'
import imgDuck from 'assets/scene-1-duck.png'
import imgShip from 'assets/scene-1-ship.png'

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
  
    scene.fog = new three.FogExp2(0xaabbbb, 0.0001)
    
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
      new DeviceOrientationControls(camera)
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
    
    this.threeMoveTip()
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
    
    // Leaves
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
    
    // Tip
    let tipGeo = new three.PlaneGeometry(10, 10)
    loader.load(imgTip, texture => {
      let mat = new three.MeshBasicMaterial({
        map: texture,
        transparent: true
      })
      let tip = new three.Mesh(tipGeo, mat)
      tip.position.set(0, 0, -10)
      
      this.threeAddItem(tip, 'tip')
    })
    
    // Sea
    let seaGeo = new three.PlaneGeometry(120,120,127,127)
    seaGeo.rotateX( - Math.PI / 2 )
    loader.load(imgSea, texture => {
      texture.wrapS = texture.wrapT = three.RepeatWrapping
      
      let mat = new three.MeshBasicMaterial({
        map: texture,
        transparent: true
      })
      let sea = new three.Mesh(seaGeo, mat)
      sea.position.set(0, -18, 0)
  
      this.seaGeo = seaGeo
      this.threeAddItem(sea, 'sea')
    })
    
    // Ornaments
    let duckGeo = new three.PlaneGeometry(5, 5)
    loader.load(imgDuck, texture => {
      let mat = new three.MeshBasicMaterial({
        map: texture,
        transparent: true
      })
      let item = new three.Mesh(duckGeo, mat)
      item.position.set(0, -8, -18)
      
      let duck1 = item.clone()
      duck1.position.set(16, -8, 0)
      duck1.rotateY(-Math.PI / 2)
      this.threeAddItem(duck1, 'duck1')
      
      let duck2 = item.clone()
      duck2.position.set(16, -8, -16)
      duck2.rotateY(-Math.PI / 4)
      this.threeAddItem(duck2, 'duck2')
      
      this.threeAddItem(item, 'duck')
    })
    
    this.state.camera.position.set(0, 0, 10)
  }
  
  threeMoveTip = () => {
    if (this.items && this.items.tip) {
      let timer = Date.now() * .001
      
      this.items.tip.position.y = .5 * Math.cos(timer)
      
      let seaGeo = this.seaGeo
      
      for ( let i = 0, l = seaGeo.vertices.length; i < l; i ++ ) {
        seaGeo.vertices[ i ].y = 1.2 * Math.sin( i / 5 + ( Date.now() * 0.01 + i ) / 7 )
      }
      
      this.items.sea.geometry.verticesNeedUpdate = true
  
      this.items.duck.translateX(.005)
      this.items.duck1.translateX(.005)
      this.items.duck2.translateX(.005)
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