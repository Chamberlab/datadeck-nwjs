/* global Vue */

class AppMain extends Vue {
    constructor() {
        super();

        const _opts = {
            activeName: 'spec',
            channelLayout: [],
            dataLayout: undefined,
            channelKey: undefined
        };

        this.template = '#dd-app-main-tpl';
        this.methods = {
            handleTabs(/* tab, event */) {
                /* ignored */
            },
            handleDatasetOpen(channelLayout) {
                this.channelLayout = channelLayout;
            },
            handleDataLayout(dataLayout) {
                this.dataLayout = dataLayout;
            },
            handleChannelSelect(channel) {
                this.channelKey = channel.data.uuid || channel.title;
            }
        };
        this.data = function () {
            return _opts;
        };
    }
}

export default AppMain;