const cloudinary = require('../config/cloudinaryConfig');
const Product = require('../models/Product');

// Upload product image to Cloudinary
exports.uploadImage = async (req, res) => {
  try {
    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);
    res.json({ url: result.secure_url });  // Return the Cloudinary URL
  } catch (error) {
    res.status(500).json({ message: 'Image upload failed', error });
  }
};

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { name, price, description, stock, image, category, isFeatured } = req.body; // Include isFeatured

    // Ensure 'image' contains the Cloudinary URL (should be passed from the frontend)
    const product = new Product({
      name,
      price,
      description,
      image,   // Cloudinary image URL is stored here
      stock,
      category,
      isFeatured
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Get all products, optionally filtered by category
exports.getProducts = async (req, res) => {
  try {
    const category = req.query.category;
    let filter = {};
    if (category) {
      filter.category = category;
    }
    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

// Get a product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (error) {
    res.status(404).json({ message: 'Product not found' });
  }
};

// Delete a product (does not delete from Cloudinary, just the database)
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
};

// Update a product's details
exports.updateProduct = async (req, res) => {
  try {
    const { name, price, description, stock, image, category, isFeatured } = req.body; // Include isFeatured
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name;
      product.price = price;
      product.description = description;
      product.image = image;   // Ensure this is the Cloudinary URL
      product.stock = stock;
      product.category = category;  // Update category
      product.isFeatured = isFeatured;  // Update isFeatured

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
};
