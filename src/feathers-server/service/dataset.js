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
        const _this = this;
        return new Promise(function (resolve, reject) {
            if (_this._assureDataSetOpen(params.query.dataPath)) {
                return resolve(_this._lmdbMeta);
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