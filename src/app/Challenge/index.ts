import Challenge from './Challenge'
import { RootState } from '../../store/store'
import {getChallenges} from '../../store/challenge'
import {logout} from '../../store/user'
import { connect } from 'react-redux'
import { StaticRouter, withRouter } from 'react-router'

const mapStateToProps = (state: RootState) => ({challenges: state.challenge, login: state.login})
const mapDispatchToProps = ({
    getChallenges,
    logout
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Challenge))