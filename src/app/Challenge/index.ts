import Challenge from './Challenge'
import { RootState } from '../../store/store'
import {getChallenge} from '../../store/challenge'
import { connect } from 'react-redux'
import { StaticRouter, withRouter } from 'react-router'

const mapStateToProps = (state: RootState) => ({challenge: state.challenge, login: state.login})
const mapDispatchToProps = ({
    getChallenge
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Challenge))