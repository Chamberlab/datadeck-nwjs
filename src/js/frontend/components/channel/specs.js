/* global Vue */

class ChannelSpecs extends Vue {
    constructor() {
        super();

        this.template = '#dd-channel-specs-tpl';
        this.props = {
            dataLayout: {
                type: Array
            }
        };
        this.data = function () {
            return {};
        };
    }
}

export default ChannelSpecs;