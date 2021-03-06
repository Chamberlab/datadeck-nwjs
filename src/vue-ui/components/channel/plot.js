import Vue from 'vue';

const _appRefs = new WeakMap();

class ChannelPlot extends Vue {
    constructor(app) {
        super();

        _appRefs.set(this, app);

        const _opts = {
            streamService: undefined,
            scrollFrameHeight: 0,
            graphWidth: 0,
            graphHeight: 0,
            dataBuffer: [],
            autoUpdate: undefined,
            debounce: undefined,
            yMin: undefined,
            yMax: undefined
        };

        this.template = '#dd-channel-plot-tpl';
        this.props = ['dataLayout', 'scaleGlobal', 'autoUpdate'];
        this.watch = {
            autoUpdate: function (val) {
                _opts.autoUpdate = val;
            },
            scaleGlobal: function (val) {
                if (val === true) {
                    if (typeof _opts.yMax === 'undefined') {
                        _opts.yMin = 0.0;
                        _opts.yMax = 0.0;
                    }
                    const _this = this;
                    this.dataLayout.map(channel => {
                        if (channel.data.valueRange) {
                            _this.yMax = Math.max(_this.yMax, Math.max(
                                Math.abs(channel.data.valueRange.max),
                                Math.abs(channel.data.valueRange.min)
                            ));
                            _this.yMin = _this.yMax * -1.0;
                        }
                    });
                } else {
                    _opts.yMin = undefined;
                    _opts.yMax = undefined;
                }
            }
        };
        this.data = function () {
            _opts.graphWidth = window.innerWidth - 40;
            _opts.scrollFrameHeight = window.innerHeight - 200;
            _opts.autoUpdate = this.autoUpdate;
            if (this.scaleGlobal === true) {
                if (typeof _opts.yMax === 'undefined') {
                    _opts.yMin = 0.0;
                    _opts.yMax = 0.0;
                }
            }
            _opts.graphHeight = 276; // this.dataLayout.length <= 16 ? 560 : 276;
            if (this.dataLayout.length !== _opts.dataBuffer.length) {
                _opts.dataBuffer = [];
                const _this = this;
                for (let n = 0; n < this.dataLayout.length; n += 1) {
                    _opts.dataBuffer.push({
                        chartData: {
                            labels: _this.dataLayout[n].data.events ?
                                _this.dataLayout[n].data.events.map(evt => {
                                    return evt[0];
                                }) : [],
                            datasets: [{
                                data: _this.dataLayout[n].data.events ?
                                    _this.dataLayout[n].data.events.map(evt => {
                                        return evt[1];
                                    }) : []
                            }]
                        },
                        dirty: Array.isArray(_this.dataLayout[n].data.events)
                    });
                    if (this.scaleGlobal === true && _this.dataLayout[n].data.valueRange) {
                        this.yMax = Math.max(this.yMax, Math.max(
                            Math.abs(_this.dataLayout[n].data.valueRange.max),
                            Math.abs(_this.dataLayout[n].data.valueRange.max)
                        ));
                        this.yMin = this.yMax * -1.0;
                    }
                }
            }
            return _opts;
        };

        window.addEventListener('resize', () => {
            if (this.debounce) {
                clearTimeout(this.debounce);
            }
            this.debounce = setTimeout(() => {
                _opts.graphWidth = window.innerWidth - 40;
                _opts.scrollFrameHeight = window.innerHeight - 200;
                _opts.debounce = undefined;
            }, 100);
        });

        this.streamService = _appRefs.get(this).service('datastreams');
        this.streamService.on('dataframe', function (frame) {
            if (Array.isArray(_opts.dataBuffer) && _opts.dataBuffer.length > 0) {
                for (let i in frame._value) {
                    if (i >= _opts.dataBuffer.length) {
                        return;
                    }
                    const bufferObj = _opts.dataBuffer[i];
                    if (bufferObj.chartData.datasets.length > 0) {
                        let val = frame._value[i] * Math.pow(10, 6);
                        if (typeof _opts.yMax === 'number' && val * Math.sign(val) > _opts.yMax) {
                            _opts.yMax = val * Math.sign(val);
                            _opts.yMin = _opts.yMax * -1.0;
                        }
                        bufferObj.chartData.datasets[0].data.push(val);
                        bufferObj.chartData.labels.push(frame._time._value);
                        bufferObj.dirty = true;
                    }
                }
            }
        });
    }
}

export default ChannelPlot;