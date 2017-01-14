/* global Vue */

const _opts = {
    activeName: 'data',
    channelLayout: [],
    selectedChannels: [],
    dataLayout: undefined
};

class AppMain extends Vue {
    constructor() {
        super();

        this.template = '#dd-app-main-tpl';
        this.methods = {
            handleTabs(tab, event) {
                /* ignored */
            },
            handleDatasetOpen(channelLayout) {
                _opts.channelLayout = channelLayout;
            },
            handleDataLayout(dataLayout) {
                _opts.dataLayout = dataLayout;
            }
        };
        this.data = function () {
            return _opts;
        };
    }
}

export default AppMain;