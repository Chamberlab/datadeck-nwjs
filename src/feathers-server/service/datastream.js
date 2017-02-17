import DataStream from '../../lib/datasource/datastream';

class DataStreamService {
    constructor() {
        this._dataStream = undefined;
        this.events = ['dataframe', 'playbackend'];
    }

    setup(app) {
        this._app = app;
    }

    get(dbName, params) {
        const _this = this;
        this._dataStream = new DataStream(params.query.dataPath);
        this._dataStream.open(dbName)
            .then(uuid => {
                _this._dataStream.on('playbackend', function () {
                    _this.emit('playbackend');
                });

                this._dataStream.on('dataframe', function (data) {
                    _this.emit('dataframe', data);
                });

                return _this._dataStream.startOutput(params.query.fps, params.query.skip, true);
            });
    }

    remove(outputUUID) {
        return this._dataStream.destroy(outputUUID);
    }
}

export default DataStreamService;