const cloudinary = require('cloudinary').v2

const imageUploadToCloudinary = async (file , folder , height , quality) => {
    const options = {folder}
    if(height) {
        options.folder= height
    }
    if(quality) {
        options.quality = quality
    }
    options.recourse_type = "auto"

    return await cloudinary.uploader(file.tempFilePath , options);
}

module.exports = imageUploadToCloudinary;