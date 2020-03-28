import Victory from './Victory'
import { RootState } from '../../store/store'
import { connect } from 'react-redux'

import {logout} from '../../store/user'

const mapStateToProps = (state: RootState) => ({login: state.login})
const mapDispatchToProps = ({logout})

export default connect(mapStateToProps, mapDispatchToProps)(Victory)