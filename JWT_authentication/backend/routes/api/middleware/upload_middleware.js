const multer = require('multer');
// const uploadImage = multer({dest: 'uploads/'})
const mkdirp = require('mkdirp');
// const mkdirp = require('make-dir');

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
        cb(null, Date.now() + '-' + file.originalname) 
    }
});

// const imageFilter = (req, file, cb) => {
//     if(file.mimeType === "image/png" || file.mimeType === "image/jpeg") {
//         cb(null, true)
//     } else {
//         cb(null, false)
//     } 
// }

const fileFilter = function (req, file, cb){
    
    // Set the filetypes, it is optional
    var filetypes = /jpeg|jpg|png/;
    var mimetype = filetypes.test(file.mimetype);

    var extname = filetypes.test(path.extname(
                file.originalname).toLowerCase());
    
    if (mimetype && extname) {
        return cb(null, true);
    }
  
    cb("Error: File upload only supports the "
                + "following filetypes - " + filetypes);
}

const uploadImage = multer({
    storage: imageStorage,
    // fileFilter: fileFilter,
    limits :{
        fileSize : 1024 * 1024 * 100
    }
})

module.exports = {
    uploadImage
}