const router = require("express").Router();
//We will need this variable to upload each image one by one
const cloudinary = require("cloudinary").v2;
//middleware to send image to cloudinary
const uploader = require("../middlewares/cloudinary.config.js");

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

//uploader.array will accept an array of images with the key imageUrl
router.post(
  "/multiple-uploads",
  uploader.array("imageUrl"),
  async (req, res) => {
    //the images after the uploader will be in the request . files
    const images = req.files;
    // create an array to push the urls into after we add them to the cloud
    const imageUrls = [];

    for (const image of images) {
      // await the uploader.upload from cloudinary to get the  secure url
      const result = await cloudinary.uploader.upload(image.path, {
        resource_type: "auto",
      });
      //push into the array the secure url on each iteration
      imageUrls.push(result.secure_url);
    }
    if (!imageUrls.length) {
      console.log("there is no file");
      res.status(403).json({ message: "there is no file" });
    } else {
      res.status(200).json({ message: "success!", imageUrls });
    }
  }
);

module.exports = router;
