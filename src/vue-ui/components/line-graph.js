import { Line } from 'vue-chartjs';
import moment from 'moment';

const _dataRefs = new WeakMap();

export default Line.extend({
    props: ['data', 'label', 'ymax', 'ymin', 'autoUpdate'],
    watch: {
        autoUpdate: function (val) {
            this.data.autoUpdate = val;
            if (val) {
                this.renderAll();
            }
        }
    },
    methods: {
        renderAll: function () {
            if (this.timeout) {
                clearTimeout(this.timeout);
                this.timeout = undefined;
            }
            this.needsUpdate = this.needsUpdate || this.data.dirty;
            if (!this.isUpdating && this.needsUpdate) {
                this.isUpdating = true;
                this.renderChart(this.data.chartData, this.chartConfig);
                this.needsUpdate = false;
                this.data.dirty = false;
                this.isUpdating = false;
            }
            if (this.autoUpdate) {
                const _this = this;
                this.timeout = setTimeout(function () {
                    _this.renderAll();
                }, 2000);
            }
        }
    },
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
                            },
                            min: moment.unix(0)
                        },
                        ticks: {
                            autoSkipPadding: 20,
                            beginAtZero: true,
                            suggestedMin: 0
                        }
                    }],
                    yAxes: [{
                        label: 'mV',
                        gridLines:{
                            display: true
                        },
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
                    beginAtZero: true
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
                needsUpdate: false,
                autoUpdate: this.autoUpdate
            };
            _dataRefs.set(this, _opts);
            opts = _dataRefs.get(this);
        }
        return opts;
    },
    mounted() {
        const _this = this;
        let _debounce;

        this.isUpdating = false;
        this.timeout = undefined;

        window.addEventListener('resize', function () {
            if (_debounce) {
                clearTimeout(_debounce);
            }
            _debounce = setTimeout(() => {
                _this.needsUpdate = true;
            }, 100);
        });

        window.eventBus.$on('render_plots', function () {
            _this.needsUpdate = true;
            _this.renderAll();
        });

        this.renderAll();
    }
});