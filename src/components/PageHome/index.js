import React from 'react'

import styles from './PageHome.scss'
import imgTree from 'assets/scene-1-tree@2x.png'

class PageHome extends React.Component {
  state = {
    isEntering: false,
    paras: []
  }
  
  handleStartClick = () => {
    this.setState({
      isEntering: true
    })
    
    setTimeout(() => {
      this.showText()
    }, 2000)
  }
  
  showText = () => {
    let texts = [
      '从现在起',
      '你是在扎根在',
      '山坡上的一棵树',
      '你能看到天气的变幻',
      '城镇/田野/河流的变迁',
      '有时',
      '也会有恶劣的天气',
      '或糟糕的环境发生',
      '比如此刻',
      '......',
    ]
  
    const producePara = () => {
      const text = texts.shift()
    
      const p = <p key={text}>{text}</p>
      this.setState({
        paras: [
          ...this.state.paras,
          p
        ]
      })
      
      if (texts.length > 0) {
        setTimeout(producePara, 1400)
      } else {
        setTimeout(() => {
          this.props.history.push('/scene')
        }, 3000)
      }
    }
    
    producePara()
  }
  
  render() {
    return (
      <div className={`${styles.page}  ${this.state.isEntering ? styles.entering : ''}`}>
        <div className={styles.text} ref={ele => this.textWrap = ele}>
          {this.state.paras}
        </div>
        <div className={styles.wrapper}>
          <div>
            <img
              src={imgTree}
              alt="Tree"
              className={styles.tree}/>
          </div>
          <span
            className={styles['btn-start']}
            onClick={this.handleStartClick}>be a tree</span>
        </div>
        {/*<div className={styles['dark-side']}/>*/}
      </div>
    )
  }
}

export default PageHome