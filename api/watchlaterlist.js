const router = require('express').Router();
const { User } = require('../models/user');

// Add a movie to the watch later list
router.post('/add', async (req, res) => {
  try {
    const { userId, movieId, movieName } = req.body;

    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
	console.log("Adding movie to watchlist")
    // Add the movieId to the user's watch later list
    user.watchlist.push({movieId:movieId, movieName:movieName});
    await user.save();

    return res.json({ message: 'Movie added to watchlist' });
  } catch (err) {
	console.log(err.message);
    return res.status(500).json({ message: `oops something went wrong error: ${err.message}`});
  }
});

// Get the watch later list for a user
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Retrieve the watchlist movies for the user
    const watchlist = user.watchlist;

    return  res.json({ watchlist });
  } catch (err) {
    return  res.status(500).json({ message: 'oops something went wrong' });
  }
});

// Remove a movie from the watch later list
router.delete('/:userId/:movieId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const movieId = req.params.movieId;

    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove the movieId from the user's watch later list
    user.watchlist = user.watchlist.filter(id => id !== movieId);
    await user.save();

    res.json({ message: 'Movie removed from watchlist successfully' });
  } catch (err) {
    return  res.status(500).json({ message: 'oops something went wrong' });
  }
});

module.exports = router;
