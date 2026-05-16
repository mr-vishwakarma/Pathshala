const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const uploadToImageKit = async (file) => {
  try {
    if (!file) {
      throw new Error("No file provided");
    }

    const response = await imagekit.upload({
      file: file.buffer,
      fileName: `profile_${Date.now()}_${file.originalname}`,
      folder: "/pathshala/profiles",
      isPrivateFile: false,
      useUniqueFileName: true,
    });

    return {
      url: response.url,
      fileId: response.fileId,
      name: response.name,
    };
  } catch (error) {
    throw new Error(`ImageKit upload failed: ${error.message}`);
  }
};

module.exports = uploadToImageKit;
