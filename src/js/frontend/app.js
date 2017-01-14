/* global Vue, feathers, io */

import LoadDataset from './components/load-dataset';
import ChannelMenu from './components/channel-menu';
import Transport from './components/transport';
import AppMain from './components/app-main';

const socket = io('http://localhost:8787'),
    app = feathers()
        .configure(feathers.hooks())
        .configure(feathers.socketio(socket));

Vue.component('dd-load-dataset', new LoadDataset(app));
Vue.component('dd-channel-menu', new ChannelMenu(app));
Vue.component('dd-transport', new Transport());
Vue.component('dd-app-main', new AppMain());

new Vue({
    el: '#datadeck'
});