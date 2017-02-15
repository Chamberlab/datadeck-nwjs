import { Line } from 'vue-chartjs';
import moment from 'moment';

const _dataRefs = new WeakMap();

export default Line.extend({
    props: ['data', 'label', 'ymax', 'ymin'],
    computed: {
        chartConfig: function () {
            const _conf = {
                responsive: false,
                maintainAspectRatio: false,
                events: [],
                elements: {
                    line: {
                        fill: false,
                        tension: 0,
                        borderWidth: 1.0,
                        borderColor: '#000000',
                    },
                    point: false
                },
                animation: false,
                legend: false,
                title: {
                    display: true,
                    text: this.label,
                    fontStyle: 'normal',
                    position: 'left',
                    fontSize: 14
                },
                scales: {
                    xAxes: [{
                        type: 'time',
                        gridLines: {
                            display: true
                        },
                        time: {
                            displayFormats: {
                                second: 'hh:mm:ss'
                            },
                            unit: 'second',
                            unitStepSize: 10,
                            parser: function (val) {
                                return moment.unix(val);
                            }
                        },
                        ticks: {
                            autoSkipPadding: 20
                        }
                    }],
                    yAxes: [{
                        label: 'mV',
                        gridLines:{
                            display: true
                        }
                    }]
                }
            };
            if (typeof this.ymax === 'number') {
                _conf.scales.yAxes[0].ticks = {
                    min: this.ymin,
                    max: this.ymax,
                    fixedStepSize: typeof this.ymax === 'number' ? Math.abs(this.ymax) * 0.2 : undefined,
                    beginAtZero: false
                };
            } else {
                _conf.scales.yAxes[0].ticks = {
                    maxTicksLimit: 10,
                    stepSize: 0.1,
                    beginAtZero: false
                };
            }
            return _conf;
        }
    },
    data: function () {
        let opts = _dataRefs.get(this);
        if (!opts) {
            const _opts = {
                timeout: undefined,
                isUpdating: false,
                needsUpdate: false
            };
            _dataRefs.set(this, _opts);
            opts = _dataRefs.get(this);
        }
        return opts;
    },
    mounted() {
        const _this = this;
        this.isUpdating = false;
        this.timeout = undefined;

        window.addEventListener('resize', function () {
            _this.needsUpdate = true;
        });

        const _renderAll = function () {
            if (_this.timeout) {
                clearTimeout(_this.timeout);
                _this.timeout = undefined;
            }
            _this.needsUpdate = _this.needsUpdate || _this.data.dirty;
            if (!_this.isUpdating && _this.needsUpdate) {
                _this.isUpdating = true;
                _this.renderChart(_this.data.chartData, _this.chartConfig);
                _this.needsUpdate = false;
                _this.data.dirty = false;
                _this.isUpdating = false;
            }
            _this.timeout = setTimeout(function () {
                _renderAll();
            }, 2000);
        };

        _renderAll();
    }
});