import {render} from 'react-dom';
// Patch ImmutableJS for extensible destructuring
import {Iterable} from 'immutable';
Iterable.prototype[Symbol.for('get')] = value => this.get(value);

require('../styles/main.scss');
require('font-awesome-webpack');
import approot from './conf/approot';

window.onload = () => render(approot, document.getElementById('content'));
