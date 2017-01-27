/* global Vue */

const _opts = {
    activeName: 'spec',
    channelLayout: [],
    dataLayout: undefined,
    channelKey: undefined
};

class AppMain extends Vue {
    constructor() {
        super();

        this.template = '#dd-app-main-tpl';
        this.methods = {
            handleTabs(/* tab, event */) {
                /* ignored */
            },
            handleDatasetOpen(channelLayout) {
                _opts.channelLayout = channelLayout;
            },
            handleDataLayout(dataLayout) {
                _opts.dataLayout = dataLayout;
            },
            handleChannelSelect(channel) {
                _opts.channelKey = channel.data.uuid || channel.title;
            }
        };
        this.data = function () {
            return _opts;
        };
    }
}

export default AppMain;