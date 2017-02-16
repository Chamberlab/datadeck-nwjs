require('babel-polyfill');

import feathers from 'feathers';
import hooks from 'feathers-hooks';
import socketio from 'feathers-socketio';

import DataSetService from './service/dataset';
import DataStreamService from './service/datastream';
import SpikeTrainService from './service/spiketrain';

feathers()
    .configure(hooks())
    .configure(socketio())
    .use('/datasets', new DataSetService())
    .use('/datastreams', new DataStreamService())
    .use('/spiketrains', new SpikeTrainService())
    .listen(8787);