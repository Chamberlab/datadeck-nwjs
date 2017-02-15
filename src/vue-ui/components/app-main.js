import Vue from 'vue';
import moment from 'moment';
import fs from 'fs';
import path from 'path';

class AppMain extends Vue {
    constructor() {
        super();

        const _opts = {
            activeName: 'spec',
            channelLayout: [],
            dataLayout: undefined,
            channelKey: undefined,
            scaleGlobal: true
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
            },
            screenshot() {
                const gui = window.require('nw.gui'),
                    win = gui.Window.get(),
                    body = win.window.document.querySelector('body'),
                    dims = {
                        width: win.window.outerWidth, height: win.window.outerHeight
                    };

                win.resizeTo(body.clientWidth, body.clientHeight);

                setTimeout(() => {
                    win.capturePage((img) => {
                        let base64Data = img.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''),
                            outfile = path.join(gui.App.dataPath, `screenshot-${moment().unix()}.png`);
                        fs.writeFile(outfile, base64Data, 'base64', (err) => {
                            if (err) {
                                alert(`Screenshot error: ${err.message}`);
                            }
                            win.resizeTo(dims.width, dims.height);
                            alert(`Screenshot saved to: ${outfile}`);
                        });
                    }, 'png');
                }, 5000);
            }
        };
        this.data = function () {
            return _opts;
        };
    }
}

export default AppMain;