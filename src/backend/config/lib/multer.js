const multer  = require("multer");

module.exports = multer({
    dest: "wwwroot/uploads/",
    limits: {
        fileSize: 2000000
    }
});
