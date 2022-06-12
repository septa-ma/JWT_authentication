const multer = require('multer');
const mkdirp = require('mkdirp');

const imageStorage = multer.diskStorage({
    // distination ke mikhaim ax ha tosh save beshe ro inja minevisim
    destination : (req, res, cb) => {
        let year = new Date().getFullYear();
        let month = new Date().getMonth() + 1;
        let day = new Date().getDay();
        let dir = `./public/uploads/images/${year}/${month}/${day}`;

        mkdirp(dir, err => cb(err, dir))
    },
    // ba in harekat migim bia file ro ba hamon esmi ke dare zakhire kon
    // date vase ine ke age hamnam vojod dasht esmesho avaz kon
    filename: (req, file, cb) => {
        const { userName } = req.body;
        cb( null, userName + '-' +  Date.now() ) 
    }
});

const uploadImage = multer({
    storage: imageStorage,
    limits :{
        fileSize : 1024 * 1024 * 100
    }
})

module.exports = {
    uploadImage
}