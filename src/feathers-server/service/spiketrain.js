import cl from 'chamberlib';
import math from 'mathjs';
import path from 'path';

class SpikeTrainService {
    constructor() {
        this._spikeTrainFile = null;
        this._metaData = undefined;
    }

    setup(app) {
        this._app = app;
    }

    find(params) {
        const _this = this;
        this._spikeTrainFile = new cl.io.importers.SpiketrainsOE();
        return this._spikeTrainFile.read(params.query.dataPath)
            .then(data => {
                this._metaData = {
                    DataSet: {
                        title: path.basename(params.query.dataPath, '.json'),
                        DataChannels: []
                    }
                };
                _this._metaData.DataSet.DataChannels = {};
                data.map((channel, i) => {
                    if (channel._items.length > 0) {
                        _this._metaData.DataSet.DataChannels[`spiketrain_${i + 1}`] = {
                            uuid: `spiketrain_${i + 1}`,
                            title: `spiketrain ${i + 1}`,
                            data: channel._items.map(item => {
                                return [
                                    item._time._value,
                                    item._value._value
                                ];
                            }),
                            keyUnit: 's',
                            type: {
                                class: 'DataEvent',
                                type: 'Float32',
                                unit: 'mV',
                            },
                            timeRange: {
                                start: channel._items[0]._time._value,
                                end: channel._items[channel._items.length - 1]._time._value
                            },
                            valueRange: {
                                min: math.min(channel._items.map(item => {
                                    return item._value._value;
                                })),
                                max: math.max(channel._items.map(item => {
                                    return item._value._value;
                                }))
                            }
                        };
                    }
                });
                return _this._metaData;
            });
    }
}

export default SpikeTrainService;