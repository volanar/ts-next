// - Import react components
import List from '@material-ui/core/List';
import CircleComponent from '~/components/circle/CircleComponent';
import { Map } from 'immutable';
import React, { Component } from 'react';
import { withTranslation } from '~/locales/i18n';
import { connect } from 'react-redux';

import { IYourCirclesComponentProps } from './IYourCirclesComponentProps';
import { IYourCirclesComponentState } from './IYourCirclesComponentState';

// - Import app components
// - Import API

// - Import actions

/**
 * Create component class
 */
export class YourCirclesComponent extends Component<IYourCirclesComponentProps,IYourCirclesComponentState> {

  static propTypes = {

  }

  /**
   * Component constructor
   *
   */
  constructor (props: IYourCirclesComponentProps) {
    super(props)

    // Defaul state
    this.state = {

    }

    // Binding functions to `this`

  }

  circleList = () => {
    let { circles,uid } = this.props
    let parsedCircles: any[] = []

    if (circles) {
      circles.forEach((circle, key) => {
        parsedCircles.push(<CircleComponent key={key} circle={circle!} id={key!} uid={uid!} />)
      })
    }
    return parsedCircles
  }

  /**
   * Reneder component DOM
   * 
   */
  render () {
    const {t} = this.props
    let circleItems = this.circleList()
    return (

      <div style={{
        maxWidth: '800px',
        margin: '40px auto'
      }}>
      {(circleItems && circleItems.length !== 0 ) ? (<div>
        <div className='profile__title'>
          {t!('yourCircles.title')}
                        </div>
        <List>
        {circleItems}
        </List>
        <div style={{ height: '24px' }}></div>
        </div>) : ''}
      </div>

    )
  }
}

/**
 * Map dispatch to props
 */
const mapDispatchToProps = (dispatch: Function, ownProps: IYourCirclesComponentProps) => {
  return {
  }
}

/**
 * Map state to props
 */
const mapStateToProps = (state: Map<string, any>, ownProps: IYourCirclesComponentProps) => {
  const uid = state.getIn(['authorize', 'uid'])
  const circles: Map<string, Map<string, any>> = state.getIn(['circle', 'circleList'], {})
  return {
    uid,
    circles,
    
  }
}

// - Connect component to redux store
const translateWrapper = withTranslation('common')(YourCirclesComponent as any)

export default connect(mapStateToProps, mapDispatchToProps)(translateWrapper as any)
