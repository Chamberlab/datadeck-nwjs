import Vue from 'vue';
import moment from 'moment';

let _appRef;
const _opts = {
    clockTime: undefined,
    clockMillis: 0,
    fps: 0,
    skip: 16000,
    streamService: undefined,
    lastFrameTime: 0,
    outputUUID: undefined,
    isPlaying: false
};

class Transport extends Vue {
    constructor(app) {
        super();

        _appRef = app;

        _opts.streamService = _appRef.service('datastreams');
        _opts.streamService.on('playbackend', () => {
            _opts.isPlaying = false;
        });

        this.template = '#dd-transport-tpl';
        this.props = {
            dataPath: {
                type: String
            },
            channelKey: {
                type: String
            },
            dataLayout: {
                type: Array
            }
        };
        this.computed = {
            timeToString: function () {
                let parsed = moment(_opts.clockMillis);
                return `${parsed.format('HH:mm:ss')}:${('000' + parsed.milliseconds()).slice(-3)}`;
            }
        };
        this.data = function () {
            return _opts;
        };
        this.methods = {
            play: function () {
                if (!this.channelKey || !this.dataPath || !_opts) {
                    return;
                }
                if (!_opts.skip) {
                    _opts.skip = 0;
                }
                _opts.streamService.on('dataframe', this.handleDataFrame);
                return _opts.streamService.get(this.channelKey,
                    {
                        query: {
                            dataPath: this.dataPath,
                            fps: parseInt(_opts.fps) || 0,
                            skip: parseInt(_opts.skip) || 0
                        }
                    })
                    .then(function (outputUUID) {
                        _opts.outputUUID = outputUUID;
                        _opts.isPlaying = true;
                    });
            },
            handleDataFrame: function (frame) {
                if (frame._time) {
                    _opts.clockMillis = frame._time._value * 1000;
                }
                if (frame._lastFrameTime) {
                    _opts.lastFrameTime = frame._lastFrameTime;
                }
            },
            stop: function () {
                if (_opts.outputUUID) {
                    _opts.streamService.removeListener('dataframe', this.handleDataFrame);
                    return _opts.streamService.remove(_opts.outputUUID)
                        .then(() => {
                            _opts.outputUUID = undefined;
                            _opts.isPlaying = false;
                        });
                }
            }
        };
    }
}

export default Transport;