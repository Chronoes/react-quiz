import {render} from 'react-dom';
import patchDestructuring from 'extensible-polyfill';

// Patch ImmutableJS for extensible destructuring
patchDestructuring('safe');

require('../styles/main.scss');
require('font-awesome-webpack');
import approot from './conf/approot';

window.onload = () => render(approot, document.getElementById('content'));
