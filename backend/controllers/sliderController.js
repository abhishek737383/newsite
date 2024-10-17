const cloudinary = require('../config/cloudinaryConfig');
const Slider = require('../models/sliderModel');


exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const result = await cloudinary.uploader.upload(req.file.path);
    const newSlider = new Slider({ imageUrl: result.secure_url });
    await newSlider.save();

    res.status(201).json({ message: 'Image uploaded successfully', slider: newSlider });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete slider image
exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the slider image in the database
    const slider = await Slider.findById(id);
    if (!slider) return res.status(404).json({ message: 'Image not found' });

    // Delete the image from Cloudinary using the stored public ID
    await cloudinary.uploader.destroy(slider.publicId);

    // Delete the slider record from the database
    await Slider.findByIdAndDelete(id);
    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all slider images
exports.getAllImages = async (req, res) => {
  try {
    const sliders = await Slider.find();
    res.status(200).json(sliders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
