/* global Vue */

let _appRef;
const _opts = {
    selectedChannels: [],
    streamService: undefined,
    currentFrame: undefined
};

class ChannelList extends Vue {
    constructor(app) {
        super();

        _appRef = app;

        this.template = '#dd-channel-list-tpl';
        this.props = {
            channelLayout: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            dataLayout: {
                type: Array
            }
        };

        this.data = function () {
            return _opts;
        };

        _opts.streamService = _appRef.service('datastreams');
        _opts.streamService.on('dataframe', function (frame) {
            if (_appRef.activeName === 'list') {
                _opts.currentFrame = frame;
            }
        });
    }
}

export default ChannelList;