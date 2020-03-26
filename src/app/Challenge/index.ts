import Challenge from './Challenge'
import { RootState } from '../../store/store'
import {getChallenges, submitChallenge, uploadFile} from '../../store/challenge'
import {logout} from '../../store/user'
import { connect } from 'react-redux'
import { StaticRouter, withRouter } from 'react-router'

const mapStateToProps = (state: RootState) => ({
    challenges: state.challenge.challenges, 
    login: state.login, 
    submitStatus: state.challenge.submit
})
const mapDispatchToProps = ({
    getChallenges,
    submitChallenge,
    uploadFile,
    logout
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Challenge))