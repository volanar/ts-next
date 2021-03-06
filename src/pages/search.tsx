// - Import react components
import AppBar from '@material-ui/core/AppBar';
import withStyles from '@material-ui/core/styles/withStyles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Router from 'next/router'
import { Map } from 'immutable';
import React, { Component } from 'react';
import { withTranslation } from '~/locales/i18n';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import * as globalActions from '~/store/actions/globalActions';
import HomeComponent from '~/containers/home/HomeComponent';

import { ISearchProps } from '~/containers/search/ISearchProps';
import { ISearchState } from '~/containers/search/ISearchState';
import { searchStyles } from '~/containers/search/searchStyles';

/**
 * Create component class
 */
export class SearchComponent extends Component<ISearchProps, ISearchState> {
  static async getInitialProps() {
    return {
      namespacesRequired: ['common'],
    }
  }
  static propTypes = {

  }

  /**
   * Component constructor
   *
   */
  constructor(props: ISearchProps) {
    super(props)
    const { tab } = this.props
    // Defaul state
    this.state = {
      tabIndex: this.getTabIndexByNav(tab)
    }

    // Binding functions to `this`

  }

  /**
   * Hadle on tab change
   */
  handleChangeTab = (event: any, value: any) => {
    const { goTo, setHeaderTitle, t, location } = this.props
    this.setState({ tabIndex: value })
    switch (value) {
      case 0:
        goTo!(`/search/post${location.search}`)
        setHeaderTitle!(t!('header.peopleCaption'))
        break
      case 1:
        goTo!(`/search/user${location.search}`)
        setHeaderTitle!(t!('header.circlesCaption'))
        break
      default:
        break
    }
  }

  componentWillMount() {
    const { setHeaderTitle, t } = this.props
    const { tab } = this.props.match.params
    switch (tab) {
      case undefined:
      case '':
        setHeaderTitle!(t!('header.peopleCaption'))
        break
      case 'circles':
        setHeaderTitle!(t!('header.circlesCaption'))
        break
      case 'followers':
        setHeaderTitle!(t!('header.followersCaption'))
        break
      default:
        break
    }

  }

  /**
   * Reneder component DOM
   * 
   */
  render() {
    /**
     * Component styles
     */
    const styles = {
      people: {
        margin: '0 auto'
      },
      headline: {
        fontSize: 24,
        paddingTop: 16,
        marginBottom: 12,
        fontWeight: 400
      },
      slide: {
        padding: 10
      }
    }

    const {  t, children, classes } = this.props
    const { tabIndex } = this.state
    return (
      <HomeComponent>
      <div style={styles.people}>
        <AppBar position='static' color='default'>
          <Tabs indicatorColor={'secondary'}
            onChange={this.handleChangeTab}
            value={tabIndex} centered
            textColor='primary'
          >
            <Tab label={t!('search.posts')} />
            <Tab label={t!('search.users')} />
          </Tabs>
        </AppBar>
        <div className={classes.container}>
        {children}
        </div>
      </div>
      </HomeComponent>
    )
  }

  /**
   * Get tab index by navigation name
   */
  private getTabIndexByNav: (navName: string) => number = (navName: string) => {
  
    switch (navName) {
      case 'people':
        return 1
      default:
        return 0
    }
  }
}

/**
 * Map dispatch to props
 */
const mapDispatchToProps = (dispatch: any, ownProps: ISearchProps) => {

  return {
    goTo: (url: string) => Router.push(url),
    setHeaderTitle: (title: string) => dispatch(globalActions.setHeaderTitle(title))

  }
}

/**
 * Map state to props
 */
const mapStateToProps = (state: Map<string, any>, ownProps: ISearchProps) => {

  return {
    
    uid: state.getIn(['authorize', 'uid'], 0),
    circlesLoaded: state.getIn(['circle', 'loaded'])

  }
}

// - Connect component to redux store
const translateWrapper = withTranslation('common')(SearchComponent as any)

export default withRouter<any, any>(connect(mapStateToProps, mapDispatchToProps)(withStyles(searchStyles)(translateWrapper as any)))
