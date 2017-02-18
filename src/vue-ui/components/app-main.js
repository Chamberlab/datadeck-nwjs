import Vue from 'vue';
import moment from 'moment';
import fs from 'fs';
import path from 'path';

class AppMain extends Vue {
    constructor() {
        super();

        const _opts = {
            activeName: 'spec',
            channelLayout: undefined,
            dataLayout: undefined,
            channelKey: undefined,
            dataPath: undefined,
            autoUpdate: false,
            scaleGlobal: true
        };

        this.template = '#dd-app-main-tpl';
        this.methods = {
            handleTabs(/* tab, event */) {
                /* ignored */
            },
            handleDatasetOpen(data) {
                this.channelLayout = data.channelLayout;
                this.dataPath = data.dataPath;
            },
            handleSpiketrainsOpen(data) {
                this.channelLayout = data.channelLayout;
                this.dataPath = data.dataPath;
            },
            handleDataLayout(dataLayout) {
                this.dataLayout = dataLayout;
            },
            handleChannelSelect(channel) {
                this.channelKey = channel.data.uuid || channel.title;
            },
            screenshot() {
                const _this = this,
                    gui = window.require('nw.gui'), win = gui.Window.get(),
                    scrollbox = win.window.document.querySelector('#scroll-box');

                win.window.scrollTo(0, 0);
                scrollbox.scrollTop = 0;
                scrollbox.scrollLeft = 0;

                win.capturePage((buffer) => {
                    const outfile = path.join(gui.App.dataPath, `screenshot-${moment().unix()}.png`);
                    fs.writeFile(outfile, buffer, 'binary', (err) => {
                        if (err) {
                            _this.$notify.error({
                                title: 'Screenshot failed',
                                message: err.message
                            });
                        }
                        _this.$notify.success({
                            title: 'Screenshot stored',
                            message: `PNG file saved to: ${outfile}`
                        });
                    });
                }, {format: 'png', datatype: 'buffer'});
            },
            manualUpdate() {
                window.eventBus.$emit('render_plots');
            }
        };
        this.data = function () {
            return _opts;
        };
    }
}

export default AppMain;