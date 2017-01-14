import cl from 'chamberlib';

class DataSetService {
    constructor() {
        this._lmdbNode = null;
        this._lmdbMeta = null;
    }

    setup(app) {
        this._app = app;
        if (!this._lmdbNode) {
            this._lmdbNode = new cl.nodes.storage.LMDBNode();
        }
    }

    find(params) {
        return new Promise((resolve, reject) => {
            if (this._assureDataSetOpen(params.query.dataPath)) {
                return resolve(this._lmdbMeta);
            }
            reject();
        });
    }

    get(dbName, params) {
        return new Promise((resolve, reject) => {
            if (this._assureDataSetOpen(params.query.dataPath)) {
                let outputUuid = this._lmdbNode.createOutput(
                    dbName,
                    new cl.quantities.Time(0.0),
                    new cl.quantities.Time(0.0)
                );
                //lmdbOut.outputs[outputUuid].stream.pipe(osc.input);
                resolve(outputUuid);
            }
            reject();
        });
    }

    _assureDataSetOpen(dataPath) {
        if (!this._lmdbMeta) {
            this._lmdbNode.openDataSet(dataPath, true);
            this._lmdbMeta = this._lmdbNode._lmdb.meta;
        }
        return true;
    }
}

export default DataSetService;