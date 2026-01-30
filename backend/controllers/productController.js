import Product from '../models/Product.js';

// CREATE product
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, quantities, store, image } = req.body;

    const product = new Product({
      name,
      description,
      price,          // still supported
      quantities,     // NEW FIELD
      store,
    });

    if (image) {
      const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
      const contentType = image.split(';')[0].split(':')[1];

      product.image = {
        data: Buffer.from(base64Data, 'base64'),
        contentType,
      };
    }

    await product.save();
    res.status(201).json({ message: 'Product created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

// GET all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    const formattedProducts = products.map((product) => {
      const formatted = {
        _id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,           // kept
        quantities: product.quantities, // NEW
        store: product.store,
      };

      if (product.image?.data) {
        formatted.image = {
          contentType: product.image.contentType,
          data: product.image.data.toString('base64'),
        };
      } else {
        formatted.image = null;
      }

      return formatted;
    });

    res.json(formattedProducts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// UPDATE product
export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, quantities, store, image } = req.body;

    const updateData = {
      name,
      description,
      price,       // still supported
      quantities,  // NEW
      store,
    };

    if (image) {
      const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
      const contentType = image.split(';')[0].split(':')[1];

      updateData.image = {
        data: Buffer.from(base64Data, 'base64'),
        contentType,
      };
    }

    await Product.findByIdAndUpdate(req.params.id, updateData);
    res.json({ message: 'Product updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

// DELETE product
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};
