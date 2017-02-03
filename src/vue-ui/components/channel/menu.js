import Vue from 'vue';

const ChannelMenu = Vue.extend({
    template: '#dd-channel-menu-tpl',
    props: {
        channelLayout: {
            type: Array,
            default: function () {
                return [];
            }
        }
    },
    data: function () {
        return {
            selectedChannels: [],
            dataLayout: undefined
        };
    },
    methods: {
        handleMenu: function (key, keyPath) {
            if (keyPath.length === 1 || key.indexOf('channel-') !== 0) {
                return;
            }
            let loading = this.$loading({
                text: 'Opening Channel...',
                fullscreen: true,
                lock: true,
                body: true
            });
            for (let set of this.channelLayout) {
                for (let channel of set.children) {
                    if (key.indexOf(channel.data.uuid) > 0) {
                        this.openChannel(channel);
                        this.$emit('channelselect', channel);
                        break;
                    }
                }
            }
            setTimeout(function () {
                loading.close();
            }, 100);
        },
        openChannel: function (target) {
            const _this = this,
                type = target.data.type ? target.data.type.class : undefined;
            if (type === 'DataFrame') {
                _this.dataLayout = target.data.uuids.map(function (uuid, i) {
                    _this.selectedChannels.push(uuid);
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
                _this.$emit('datalayout', _this.dataLayout);
            } else {
                throw new Error(`Type not implemented: ${type}`);
            }
        }
    }
});

export default ChannelMenu;