import cl from 'chamberlib';
import through2 from 'through2';
import TinyEmitter from 'tiny-emitter';

class DataStream extends TinyEmitter {
    constructor(dataPath) {
        super();

        this._lmdbNode = new cl.nodes.storage.LMDBNode();
        this._lmdbNode.openDataSet(dataPath, true);

        this._valueHistory = undefined;
        this._valueCount = 0;

        this._lastFrameUpdate = undefined;
        this._currentTime = undefined;
    }

    open(dbname) {
        this._outputUUID = this._lmdbNode.createOutput(
            dbname,
            new cl.quantities.Time(0.0),
            new cl.quantities.Time(0.0)
        );

        return Promise.resolve(this._outputUUID);
    }

    getStream() {
        if (this._lmdbNode.outputs[this._outputUUID]) {
            return this._lmdbNode.outputs[this._outputUUID].stream;
        }
    }

    startOutput(fps, skip, emitEvents) {
        if (!this._lmdbNode.outputs[this._outputUUID]) {
            throw new Error('No outputs');
        }

        const _this = this;
        if (emitEvents) {
            this._lmdbNode.outputs[this._outputUUID].stream.pipe(through2.obj(function (chunk, enc, cb) {
                if (!_this._valueHistory) {
                    _this._lastFrameUpdate = Date.now();
                    _this._valueHistory = new Array(chunk._value.length).fill(0);
                }
                _this._currentTime = chunk._time;
                chunk._value.map(function (val, i) {
                    _this._valueHistory[i] += val;
                });
                _this._valueCount += 1;

                if (_this._valueCount >= skip) {
                    // TODO: implement a more precise frame timing
                    _this.emitFrame();
                    const timeOut = fps > 0 ? Math.max(0, 1000 / fps - _this._lastFrameTime) : 0;
                    setTimeout(cb, timeOut);
                } else {
                    cb();
                }
            }))
            .once('end', function () {
                if (_this._valueHistory) {
                    _this.emitFrame();
                }
                _this.emit('playbackend');
                _this._lmdbNode.endOutput(_this._outputUUID);
            })
            .once('error', function (err) {
                // TODO: add alert service for errors
                _this.emit('playbackend', err);
            });
        }

        this._lmdbNode.startOutput(this._outputUUID);

        return Promise.resolve(this._outputUUID);
    }

    emitFrame() {
        const _this = this;
        _this._lastFrameTime = Date.now() - _this._lastFrameUpdate;
        _this.emit('dataframe', {
            _value: _this._valueHistory.map(function (val, i) {
                return _this._valueHistory[i] / _this._valueCount;
            }),
            _time: _this._currentTime,
            _lastFrameTime: _this._lastFrameTime
        });
        _this._valueHistory = undefined;
        _this._valueCount = 0;
    }

    destroy() {
        if (this._outputUUID) {
            this._lmdbNode.endOutput(this._outputUUID);
            this._outputUUID = undefined;
            this._lmdbNode = undefined;
        }
    }
}

export default DataStream;