import feathers from 'feathers';
import hooks from 'feathers-hooks';
import socketio from 'feathers-socketio';

import DataSetService from './service/data-set';

feathers()
    .configure(hooks())
    .configure(socketio())
    .use('/datasets', new DataSetService())
    .listen(8787);