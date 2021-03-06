import Vue from 'vue';

let _appRef;
const _opts = {
    streamService: undefined,
    currentFrame: undefined
};

class ChannelGrid extends Vue {
    constructor(app) {
        super();

        _appRef = app;

        this.template = '#dd-channel-grid-tpl';
        this.props = {
            dataLayout: {
                type: Array
            }
        };

        this.data = function () {
            return _opts;
        };

        _opts.streamService = _appRef.service('datastreams');
        _opts.streamService.on('dataframe', function (frame) {
            if (_appRef.activeName === 'grid') {
                _opts.currentFrame = frame;
            }
        });
    }
}

export default ChannelGrid;