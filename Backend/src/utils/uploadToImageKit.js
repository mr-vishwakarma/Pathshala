const ImageKit = require("imagekit");

const clearInvalidLocalProxy = () => {
  const proxyKeys = [
    "HTTP_PROXY",
    "HTTPS_PROXY",
    "http_proxy",
    "https_proxy",
  ];

  proxyKeys.forEach((key) => {
    if (process.env[key]?.includes("127.0.0.1:9")) {
      delete process.env[key];
    }
  });
};

clearInvalidLocalProxy();

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

    if (
      !process.env.IMAGEKIT_PUBLIC_KEY ||
      !process.env.IMAGEKIT_PRIVATE_KEY ||
      !process.env.IMAGEKIT_URL_ENDPOINT
    ) {
      throw new Error("ImageKit environment variables are missing");
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
