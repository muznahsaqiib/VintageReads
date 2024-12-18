const express = require('express');
const router = express.Router();
const User = require('../models/user-model'); // Adjust the path as necessary

// Save or update progress
router.post('/progress', async (req, res) => {
  const { email, title, image, currentPage, percentageRead } = req.body;

  try {
    if (!email || !title || currentPage === undefined || percentageRead === undefined) {
      return res.status(400).json({ message: 'Invalid request. Missing required fields.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const bookIndex = user.user_lib.findIndex((book) => book.title === title);
    if (bookIndex !== -1) {
      user.user_lib[bookIndex].currentPage = currentPage;
      user.user_lib[bookIndex].percentageRead = percentageRead;
    } else {
      user.user_lib.push({ title, image, currentPage, percentageRead });
    }

    await user.save();
    res.json({ message: 'Progress updated successfully.' });
  } catch (error) {
    console.error('Error saving progress:', error);
    res.status(500).json({ message: 'Failed to save progress.' });
  }
});

// Get incomplete books (wishlist)
router.get('/wishlist/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const incompleteBooks = user.user_lib.filter((book) => book.percentageRead < 100);
    res.json(incompleteBooks);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ message: 'Failed to fetch wishlist.' });
  }
});

module.exports = router;
