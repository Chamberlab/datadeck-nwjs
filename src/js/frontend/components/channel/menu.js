/* global Vue */

let _appRef;

const _opts = {
    selectedChannels: [],
    dataLayout: undefined
};

class ChannelMenu extends Vue {
    constructor(app) {
        super();

        const _this = this;
        _appRef = app;

        this.template = '#dd-channel-menu-tpl';
        this.props = {
            channelLayout: {
                type: Array,
                default: function () {
                    return [];
                }
            }
        };
        this.methods = {
            handleMenu: _this.handleMenu,
            openChannel: _this.openChannel
        };
        this.data = function () {
            return _opts;
        };
    }

    handleMenu(key, keyPath) {
        if (keyPath.length === 1 || key.indexOf('channel-') !== 0) {
            return;
        }
        for (let set of this.channelLayout) {
            for (let channel of set.children) {
                if (key.indexOf(channel.data.uuid) > 0) {
                    this.$emit('channelselect', channel);
                    this.openChannel(channel);
                    break;
                }
            }
        }
    }

    openChannel(target) {
        const _this = this,
            loading = window.ELEMENT.Loading.service({ fullscreen: true }),
            type = target.data.type ? target.data.type.class : undefined;

        if (type === 'DataFrame') {
            const channels = target.data.uuids.map((uuid, i) => {
                _opts.selectedChannels.push(uuid);
                return {
                    title: target.data.labels[i],
                    timeRange: target.data.timeRange,
                    data: {
                        index: i,
                        value: 0.0,
                        label: target.data.labels[i],
                        unit: target.data.units[i],
                        uuid: uuid
                    }
                };
            });
            _opts.dataLayout = channels;
            _this.$emit('datalayout', channels);
        } else if (type === 'DataEvent') {

        } else {
            console.log(`Type not implemented: ${type}`);
        }

        loading.close();
    }
}

export default ChannelMenu;