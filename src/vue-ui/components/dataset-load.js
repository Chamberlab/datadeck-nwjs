import Vue from 'vue';

let _appRef;
const _opts = {
    channelLayout: [],
    metaData: null
};

class DatasetLoad extends Vue {
    constructor(app) {
        super();
        _appRef = app;

        this.props = {
            dataPath: {
                type: String
            }
        };
        this.data = function () {
            return _opts;
        };

        this.template = '#dd-load-dataset-tpl';
        this.methods = {
            openDataSet: function () {
                const _this = this,
                    loading = this.$loading({
                        text: 'Opening Dataset...',
                        fullscreen: true,
                        lock: true,
                        body: true
                    });
                return _appRef.service('datasets')
                    .find({ query: { dataPath:  _this.dataPath } })
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
                        _this.$emit('openset', _this.channelLayout);
                    })
                    .catch(function (err) {
                        setTimeout(function () {
                            loading.close();
                        }, 100);
                        throw new Error(`Error opening dataset: ${err.message}`);
                    });
            }
        };
    }
}

export default DatasetLoad;