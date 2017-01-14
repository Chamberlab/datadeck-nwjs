import cl from 'chamberlib';
import through2 from 'through2';

class DataStreamService {
    constructor() {
        this._lmdbNode = undefined;
        this._outputUUID = undefined;
        this._lastFrameTime = 0;
        this.events = ['dataframe'];
    }

    setup(app) {
        this._app = app;
    }

    get(dbName, params) {
        const _this = this;
        if (this._outputUUID) {
            this._lmdbNode.endOutput(this._outputUUID);
            this._outputUUID = undefined;
            this._lmdbNode = undefined;
        }
        if (!this._lmdbNode) {
            this._lmdbNode = new cl.nodes.storage.LMDBNode();
        }

        this._lmdbNode.openDataSet(params.query.dataPath, true);

        this._outputUUID = this._lmdbNode.createOutput(
            dbName,
            new cl.quantities.Time(0.0),
            new cl.quantities.Time(0.0)
        );

        this._lmdbNode.outputs[this._outputUUID].stream.pipe(through2.obj(function (chunk, enc, cb) {
            let start = Date.now();
            setTimeout(cb, 1000 / params.query.fps);
            _this.emit('dataframe', {
                _value: Array.from(chunk._value),
                _time: chunk._time,
                _lastFrameTime: _this._lastFrameTime
            });
            _this._lastFrameTime = Date.now() - start;
        }))
        .once('end', function () {
            _this.emit('playbackend');
            _this._lmdbNode.endOutput(_this._outputUUID);
        })
        .once('error', function (err) {
            console.log("Playback error:", err.message);
            _this.emit('playbackend', err);
        });

        this._lmdbNode.startOutput(this._outputUUID);

        return Promise.resolve();
    }
}

export default DataStreamService;