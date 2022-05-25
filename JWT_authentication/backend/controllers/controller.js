const user = require(`${config.path.model}/user`);

module.exports = class Controller {
    constructor() {
        this.model = { user }
    }
} 