import feathers from 'feathers/client';
import hooks from 'feathers-hooks';
import io from 'socket.io-client';
import socketio from 'feathers-socketio/client';
import Vue from 'vue';
import ElementUI from 'element-ui';
import '../../build/theme/index.css';

Vue.use(ElementUI);

import Channel from './components/channel';
import LoadDataset from './components/dataset-load';
import LineGraph from './components/line-graph';
import Transport from './components/transport';
import AppMain from './components/app-main';

const socket = io('http://localhost:8787'),
    app = feathers()
        .configure(hooks())
        .configure(socketio(socket));

Vue.component('dd-channel-menu', Channel.Menu);
Vue.component('dd-channel-list', new Channel.List(app));
Vue.component('dd-channel-grid', new Channel.Grid(app));
Vue.component('dd-channel-specs', new Channel.Specs());
Vue.component('dd-channel-plot', new Channel.Plot(app));

Vue.component('dd-load-dataset', new LoadDataset(app));
Vue.component('dd-line-graph', LineGraph);
Vue.component('dd-transport', new Transport(app));
Vue.component('dd-app-main', new AppMain());

new Vue({
    el: '#datadeck'
});