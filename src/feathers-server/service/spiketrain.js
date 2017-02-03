import cl from 'chamberlib';

class SpikeTrainService {
    constructor() {
        this._spikeTrainFile = null;
    }

    setup(app) {
        this._app = app;
    }

    find(params) {
        this._spikeTrainFile = new cl.io.importers.SpiketrainsOE();
        return this._spikeTrainFile.read(params.query.dataPath);
    }
}

export default SpikeTrainService;