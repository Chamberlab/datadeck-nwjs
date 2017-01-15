import cl from 'chamberlib';
import through2 from 'through2';

class DataStreamService {
    constructor() {
        this._lmdbNode = undefined;
        this._outputUUID = undefined;
        this._lastFrameTime = 0;
        this.events = ['dataframe', 'playbackend'];
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

        this._valueHistory = undefined;
        this._valueCount = 0;

        this._lmdbNode.outputs[this._outputUUID].stream.pipe(through2.obj(function (chunk, enc, cb) {
            let start = Date.now();
            setTimeout(cb, 1000 / params.query.fps);
            if (this._valueCount === params.query.skip) {
                _this.emit('dataframe', {
                    _value: _this._valueHistory.map(function (val, i) {
                        return _this._valueHistory[i] / _this._valueCount;
                    }),
                    _time: chunk._time,
                    _lastFrameTime: _this._lastFrameTime
                });
                _this._valueHistory = undefined;
                _this._valueCount = 0;
            } else {
                if (!_this._valueHistory) {
                    _this._valueHistory = new Array(chunk._value.length).fill(0);
                }
                chunk._value.map(function (val, i) {
                    _this._valueHistory[i] += val;
                });
                _this._valueCount += 1;
            }
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

        return Promise.resolve(this._outputUUID);
    }

    remove(outputUUID) {
        if (this._lmdbNode) {
            this._lmdbNode.endOutput(outputUUID);
            this._outputUUID = undefined;
        }
        return Promise.resolve();
    }
}

export default DataStreamService;