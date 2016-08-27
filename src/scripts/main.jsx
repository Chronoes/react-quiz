import { render } from 'react-dom';

import approot from './conf/approot';

require('../styles/main.scss');
require('font-awesome-webpack');

window.onload = () => render(approot, document.getElementById('content'));
