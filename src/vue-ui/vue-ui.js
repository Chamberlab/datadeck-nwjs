require('babel-polyfill');

import feathers from 'feathers/client';
import hooks from 'feathers-hooks';
import io from 'socket.io-client';
import socketio from 'feathers-socketio/client';
import Vue from 'vue';
import ElementUI from 'element-ui';
import '../../build/theme/index.css';

import Channel from './components/channel';
import LoadDataset from './components/dataset-load';
import LoadSpiketrains from './components/spiketrains-load';
import LineGraph from './components/line-graph';
// import LineChart from './components/line-chart';
import Transport from './components/transport';
import AppMain from './components/app-main';

Vue.use(ElementUI);

// TODO: run server in a separate thread
/*
const feathersServer = new Worker('feathers-server.js');
feathersServer.onmessage = function(evt) {
    console.log(`Message from feathers worker: ${evt.data}`);
};
feathersServer.onerror = function(err) {
    console.log(`Feathers Server Error: ${err.message} File: ${err.filename} Line: ${err.lineno}`);
};
*/

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
Vue.component('dd-load-spiketrains', new LoadSpiketrains(app));
//Vue.component('dd-line-chart', new LineChart(app));
Vue.component('dd-line-graph', LineGraph);
Vue.component('dd-transport', new Transport(app));
Vue.component('dd-app-main', new AppMain());

window.eventBus = new Vue();

new Vue({
    el: '#datadeck'
});