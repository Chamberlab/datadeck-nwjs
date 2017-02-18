import Vue from 'vue';

let _appRef;
const _opts = {
    channelLayout: [],
    metaData: null,
    spiketrainFiles: undefined,
    dataPath: undefined
};

class SpiketrainsLoad extends Vue {
    constructor(app) {
        super();
        _appRef = app;

        this.data = function () {
            return _opts;
        };

        this.template = '#dd-load-spiketrains-tpl';
        this.methods = {
            spiketrainsChooser(e) {
                e.preventDefault();
                document.querySelector('#spiketrains-chooser').click();
            },
            updateSpiketrains(e) {
                e.preventDefault();
                const files = e.target.files;
                if (files.length > 0) {
                    this.dataPath = files[0].path;
                }
            },
            openSpiketrains: function () {
                const _this = this,
                    loading = this.$loading({
                        text: 'Opening Spiketrains...',
                        fullscreen: true,
                        lock: true,
                        body: true
                    });
                return _appRef.service('spiketrains')
                    .find({query: {dataPath: _this.dataPath}})
                    .then(function (metaData) {
                        let channels = [];
                        Object.keys(metaData.DataSet.DataChannels).map((key) => {
                            channels.push({
                                title: metaData.DataSet.DataChannels[key].title || key,
                                data: metaData.DataSet.DataChannels[key]
                            });
                        });
                        _this.channelLayout.push({
                            title: metaData.DataSet.title,
                            data: metaData.DataSet,
                            children: channels
                        });
                        _this.metaData = metaData;
                        loading.close();
                        _this.$emit('openspiketrains', {channelLayout: _this.channelLayout, dataPath: _this.dataPath});
                    })
                    .catch(function (err) {
                        setTimeout(function () {
                            loading.close();
                        }, 100);
                        throw new Error(`Error opening spiketrains: ${err.message}`);
                    });
            }
        };
    }
}

export default SpiketrainsLoad;