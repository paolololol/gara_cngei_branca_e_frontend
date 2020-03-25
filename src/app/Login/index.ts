import {login, restore} from '../../store/user'
import Login from './Login'
import { connect } from 'react-redux'
import { RootState } from '../../store/store'
import { withRouter } from 'react-router'

const mapStateToProps = (state: RootState) => ({
    user: state.login
})
const mapDispatchToProps = ({login, restore})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login))