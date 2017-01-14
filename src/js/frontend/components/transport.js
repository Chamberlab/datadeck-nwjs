/* global Vue, moment */

let _appRef;

const _opts = {
    clockTime: undefined,
    clockMillis: 0,
    fps: 100,
    streamService: undefined,
    lastFrameTime: 0,
    isPlaying: false
};

class Transport extends Vue {
    constructor(app) {
        super();

        _appRef = app;

        _opts.streamService = _appRef.service('datastreams');
        _opts.streamService.on('dataframe', (frame) => {
            if (!_opts.isPlaying) {
                _opts.isPlaying = true;
            }
            if (frame._time) {
                _opts.clockMillis = frame._time._value * 1000;
            }
            if (frame._lastFrameTime) {
                _opts.lastFrameTime = frame._lastFrameTime;
            }
        });
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
            statusToString: function () {
                let parsed = moment(_opts.clockMillis);
                return `${parsed.format('HH:mm:ss')}:${('000' + parsed.milliseconds()).slice(-3)} @ ${_opts.fps}fps (last: ~${_opts.lastFrameTime}ms)`;
            }
        };
        this.data = function () {
            return _opts;
        };
        this.methods = {
            play: function () {
                if (!this.channelKey || !this.dataPath) {
                    return;
                }
                return _opts.streamService.get(this.channelKey, { query: { dataPath: this.dataPath, fps: _opts.fps } });
            },
            stop: function () {
                return _opts.streamService.del(this.channelKey);
            }
        };
    }
}

export default Transport;