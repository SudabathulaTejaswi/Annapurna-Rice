import Offer from '../models/Offer.js';

// GET all offers
export const getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.find();
    const formattedOffers = offers.map((offer) => {
      const formatted = {
        _id: offer._id,
        title: offer.title,
        description: offer.description,
        originalPrice: offer.originalPrice,
        discountPrice: offer.discountPrice,
        store: offer.store,
      };
      if (offer.image?.data) {
        formatted.image = {
          contentType: offer.image.contentType,
          data: offer.image.data.toString('base64'), // convert buffer to base64
        };
      } else {
        formatted.image = null;
      }
      return formatted;
    });

    res.json(formattedOffers);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch offers', error: err.message });
  }
};

// CREATE offer
export const createOffer = async (req, res) => {
  try {
    const { title, description, store, originalPrice, discountPrice, image } = req.body;

    // Create offer object without image initially
    const offer = new Offer({
      title,
      description,
      store,
      originalPrice,
      discountPrice,
    });

    // Process image if present
    if (image) {
      const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
      const contentType = image.split(';')[0].split(':')[1];

      offer.image = {
        data: Buffer.from(base64Data, 'base64'),
        contentType,
      };
    }

    await offer.save();
    res.status(201).json(offer);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to create offer', error: err.message });
  }
};

// UPDATE offer by ID
// UPDATE offer by ID
export const updateOffer = async (req, res) => {
  try {
    const { title, description, store, originalPrice, discountPrice, image } = req.body;

    // Build update data object with only provided fields
    const updateData = {};

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (store) updateData.store = store;
    if (originalPrice) updateData.originalPrice = originalPrice;
    if (discountPrice) updateData.discountPrice = discountPrice;

    if (image) {
      const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
      const contentType = image.split(';')[0].split(':')[1];
      updateData.image = {
        data: Buffer.from(base64Data, 'base64'),
        contentType,
      };
    }

    const updatedOffer = await Offer.findByIdAndUpdate(req.params.id, updateData, {
      new: true, // Return the updated document
      runValidators: true,
    });

    if (!updatedOffer) {
      return res.status(404).json({ msg: 'Offer not found' });
    }

    res.json(updatedOffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to update offer', error: err.message });
  }
};


// DELETE offer by ID
export const deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndDelete(req.params.id);
    if (!offer) return res.status(404).json({ msg: 'Offer not found' });
    res.status(200).json({ msg: 'Offer deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to delete offer', error: err.message });
  }
};
