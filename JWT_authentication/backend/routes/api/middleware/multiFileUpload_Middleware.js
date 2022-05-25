const multer = require("multer");
const mkdirp = require('mkdirp');

const imagesStorage = multer.diskStorage({
    
    destination: (req, file, cb) => {
        const { project_name } = req.body;
        const today = new Date();
        const day = today.getDate();
        const month = today.getMonth()+1;
        const year = today.getFullYear();
        let dirImagesGargot = `./public/uploads/images_gargot/${year}/${month}/${day}`; // Gargot project files are stored in this path
        let dirImagesHp = `./public/uploads/images_hp/${year}/${month}/${day}`; // hp project files are stored in this path
        let dirImagesNahalito = `./public/uploads/images_nahalito/${year}/${month}/${day}`;  // nahalito project files are stored in this path
        let dirAssetBundles = `./public/uploads/AssetBundles/${year}/${month}/${day}`; //  AssetBundles files are stored in this path
        if (file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/png" ) {
            if ( (project_name == 'gargot_web') || (project_name == 'gargot_app')) {
                mkdirp(dirImagesGargot, err => cb(err, dirImagesGargot)) 
            } else if ((project_name == 'HP_app') || (project_name == 'HP_web')) {
                mkdirp(dirImagesHp, err => cb(err, dirImagesHp))
            } else if ((project_name == 'nahalito_app')) {
                mkdirp(dirImagesNahalito, err => cb(err, dirImagesNahalito))
            } else {
                return cb(new Error('not found project'));
            }    
        } else if (file.mimetype == "application/octet-stream") {
            (dirAssetBundles, err => cb(err, dirAssetBundles))
        } else {
            cb({ error: 'Mime type not supported' })
        }
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname) 
    }
});

const fileFilter = function (req, file, cb) {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "application/pdf" || file.mimetype == "application/octet-stream") {
        cb(null, true);
    } else {
        cb(null, false);
        return cb(new Error('File types allowed .jpeg, .jpg and .png .octet-stream!'));
    }
}

const uploadImages = multer({
    storage: imagesStorage,
    fileFilter: fileFilter,
    limits:{
        fileSize : 1024 * 1024 * 5
    }
})

module.exports = {
    uploadImages                                                                        
}
