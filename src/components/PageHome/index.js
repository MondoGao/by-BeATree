import React from 'react'

import styles from './PageHome.scss'
import imgTree from 'assets/scene-1-tree@2x.png'

class PageHome extends React.Component {
  state = {
    isEntering: false
  }
  
  handleStartClick = () => {
    this.setState({
      isEntering: true
    })
    
    setTimeout(() => {
      this.props.history.push('/scene')
    }, 1000)
  }
  
  render() {
    return (
      <div className={`${styles.page}  ${this.state.isEntering ? styles.entering : ''}`}>
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
        <div className={styles['dark-side']}/>
      </div>
    )
  }
}

export default PageHome