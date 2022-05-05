module.exports = class Transform {
    transformCollection(item) {
        return item.map(this.transform.bind(this))
    }
}