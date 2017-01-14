/* global Vue */

let _appRef;

const _opts = {
    channelLayout: [],
    metaData: null
};

class DatasetLoad extends Vue {
    constructor(app) {
        super();

        const _this = this;
        _appRef = app;

        this.template = '#dd-load-dataset-tpl';
        this.methods = {
            openDataSet: _this.openDataSet
        };
        this.props = {
            dataPath: {
                type: String
            }
        };
        this.data = function () {
            return _opts;
        };
    }

    openDataSet() {
        const _this = this,
            loading = window.ELEMENT.Loading.service({ fullscreen: true }),
            dsService = _appRef.service('datasets');
        return dsService.find({ query: { dataPath:  _this.dataPath } })
            .then(function (metaData) {
                let channels = [];
                Object.keys(metaData.DataSet.DataChannels).map((key) => {
                    channels.push({
                        title: metaData.DataSet.DataChannels[key].title || key,
                        data: metaData.DataSet.DataChannels[key]
                    });
                });
                _opts.channelLayout.push({
                    title: metaData.DataSet.title,
                    data: metaData.DataSet,
                    children: channels
                });
                _opts.metaData = metaData;
                _this.$emit('openset', _opts.channelLayout);
                loading.close();
            })
            .catch((err) => {
                loading.close();
                console.log(err);
                throw err;
            });
    }
}

export default DatasetLoad;