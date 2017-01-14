/* global Vue */

const _opts = {
    clockTime: new Date(0)
};

class Transport extends Vue {
    constructor() {
        super();

        this.template = '#dd-transport-tpl';
        this.data = function () {
            return _opts;
        };
    }
}

export default Transport;