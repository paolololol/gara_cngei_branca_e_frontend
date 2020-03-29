import Leaderboard from './Leaderboard'
import { withRouter } from 'react-router'
import { RootState } from '../../store/store'
import { getLeaderboard } from '../../store/challenge'
import { connect } from 'react-redux'

const mapStateToProps = (state: RootState) => ({leaderboard: state.challenge.leaderboard})
const mapDispatchToProps = ({getLeaderboard})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Leaderboard))