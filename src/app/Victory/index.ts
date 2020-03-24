import Home from './Home'
import { RootState } from '../../store/store'
import { connect } from 'react-redux'

const mapStateToProps = (state: RootState) => ({login: state.login})

export default connect(mapStateToProps)(Home)