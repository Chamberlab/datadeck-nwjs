/* global Vue, feathers, io */

import Channel from './components/channel';
import LoadDataset from './components/dataset-load';
import Transport from './components/transport';
import AppMain from './components/app-main';

const socket = io('http://localhost:8787'),
    app = feathers()
        .configure(feathers.hooks())
        .configure(feathers.socketio(socket));

Vue.component('dd-channel-menu', new Channel.Menu(app));
Vue.component('dd-channel-list', new Channel.List());
Vue.component('dd-channel-grid', new Channel.Grid(app));
Vue.component('dd-channel-specs', new Channel.Specs());

Vue.component('dd-load-dataset', new LoadDataset(app));
Vue.component('dd-transport', new Transport(app));
Vue.component('dd-app-main', new AppMain());

new Vue({
    el: '#datadeck'
});