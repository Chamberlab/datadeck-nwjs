import { Line } from 'vue-chartjs';
import moment from 'moment';

export default Line.extend({
    props: ["data", "label", "updated"],
    data: function () {
        const _this = this;
        return {
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
                        ticks: {
                            maxTicksLimit: 10
                        }
                    }]
                }
            }
        };
    },
    mounted () {
        const _this = this,
            _renderAll = function () {
                if (_this.data && _this.data.updated) {
                    _this.renderChart(_this.data.chartData, _this.chartConfig);
                }
            };
        _renderAll();
        setInterval(function () {
            _renderAll();
        }, 2000);
    }
});