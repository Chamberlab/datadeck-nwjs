import feathers from 'feathers';
import hooks from 'feathers-hooks';
import socketio from 'feathers-socketio';

import DataSetService from './service/dataset';
import DataStreamService from './service/datastream';

feathers()
    .configure(hooks())
    .configure(socketio())
    .use('/datasets', new DataSetService())
    .use('/datastreams', new DataStreamService())
    .listen(8787);