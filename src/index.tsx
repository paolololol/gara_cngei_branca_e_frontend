import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { store } from './app/store';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import { Grommet } from 'grommet'
import './index.css'
import styled from 'styled-components';

const theme = {
  global: {
    colors: {
      brand: '#32733a'
    },
    font: {
      family: '"Baloo Chettan 2"',
      size: '14px',
      height: '20px',
    },
  },
}

const StyledGrommet = styled(Grommet)`
  height: 100vh;
`

ReactDOM.render(
  <Provider store={store}>
    <StyledGrommet theme={theme}>
      <App />
    </StyledGrommet>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
