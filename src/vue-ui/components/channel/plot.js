import Vue from 'vue';

let _appRef;
const _opts = {
    streamService: undefined,
    scrollFrameHeight: window.innerHeight - 200,
    graphWidth: window.innerWidth - 40,
    graphHeight: 0,
    dataBuffer: [],
    svg: undefined,
    yMin: undefined,
    yMax: undefined
};

class ChannelPlot extends Vue {
    constructor(app) {
        super();

        _appRef = app;

        this.template = '#dd-channel-plot-tpl';
        this.props = {
            dataLayout: {
                type: Array
            },
            scaleGlobal: {
                type: Boolean
            }
        };
        this.data = function () {
            _opts.graphHeight = this.dataLayout.length <= 16 ? 400 : 200;
            _opts.yMin = _opts.yMax = this.scaleGlobal ? 0 : undefined;
            _opts.dataBuffer = new Array(this.dataLayout.length).fill(0).map(() => {
                return {
                    chartData: {
                        labels: [],
                        datasets: [{
                            data: []
                        }]
                    },
                    updated: false,
                    svgCallback: function (url) {
                        _opts.svg = url;
                    }
                };
            });
            return _opts;
        };

        _opts.debounce = undefined;
        window.addEventListener('resize', function() {
            if (_opts.debounce) {
                clearTimeout(_opts.debounce);
            }
            _opts.debounce = setTimeout(function () {
                _opts.graphWidth = window.innerWidth - 40;
                _opts.scrollFrameHeight = window.innerHeight - 200;
                _opts.debounce = undefined;
            }, 200);
        });

        _opts.streamService = _appRef.service('datastreams');
        _opts.streamService.on('dataframe', function (frame) {
            for (let i in frame._value) {
                const bufferObj = _opts.dataBuffer[i];
                if (bufferObj.chartData.datasets.length > 0) {
                    let val = frame._value[i] * Math.pow(10, 6);
                    if (_opts.yMax && !Math.abs(val) > _opts.yMax) {
                        _opts.yMax = Math.abs(val);
                        _opts.yMin = _opts.yMax * -1.0;
                    }
                    bufferObj.chartData.datasets[0].data.push(val);
                    bufferObj.chartData.labels.push(frame._time._value);
                    bufferObj.updated = true;
                }
            }
        });
    }
}

export default ChannelPlot;