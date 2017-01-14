/* global Vue */

const _opts = {
    selectedChannels: []
};

class ChannelList extends Vue {
    constructor() {
        super();

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
    }
}

export default ChannelList;