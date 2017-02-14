import SVGCanvas from 'svgcanvas';
import { Line } from 'vue-chartjs';
import moment from 'moment';

export default Line.extend({
    props: ['data', 'label', 'updated', 'max', 'min'],
    data: function () {
        const _this = this;
        const svgCanvas = new SVGCanvas();
        svgCanvas.width = 2000;
        svgCanvas.height = 100;
        return {
            svgContext: svgCanvas,
            makeSVG: false,
            chartSVG: undefined,
            chartConfig: {
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
                    point: {
                        radius: 0.0
                    }
                },
                animation: {
                    duration: 0
                },
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: _this.label,
                    fontStyle: 'normal',
                    position: 'left',
                    fontSize: 14
                },
                scales: {
                    xAxes: [{
                        type: 'time',
                        gridLines:{
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
                        },
                        ticks: {
                            min: _this.min,
                            max: _this.max,
                            stepSize: _this.max ? _this.max * 2 / 10 : 0.1,
                            maxTicksLimit: 10,
                            beginAtZero: false
                        }
                    }]
                }
            },
        };
    },
    mounted() {
        let isUpdating = false, timeout = null;
        const _this = this,
            _renderAll = function () {
                if (timeout) {
                    clearTimeout(timeout);
                }
                if (!isUpdating) {
                    isUpdating = true;
                    if (_this.data && _this.data.updated) {
                        _this.renderChart(_this.data.chartData, _this.chartConfig);
                        _this.makeSVG = true;
                        _this.data.updated = false;
                    } else {
                        if (_this.makeSVG) {
                            _this.makeSVG = false;
                            _this._chart.chart.ctx = _this.svgContext.getContext('2d');
                            _this.renderChart(_this.data.chartData, _this.chartConfig);
                            _this.data.chartSVG = _this.svgContext.toDataURL('image/svg+xml');
                            _this.data.svgCallback(_this.data.chartSVG);
                        }
                    }
                }
                isUpdating = false;
                timeout = setTimeout(function () {
                    _renderAll();
                }, 2000);
            };
        window.addEventListener('resize', function() {
            _this.data.updated = true;
        });
        _this.data.updated = true;
        _renderAll();
    }
});