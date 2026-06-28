const Order = require('../models/orders');
const Book = require('../models/books');

// Place order
exports.placeOrder = async (req, res) => {
  try {
    const { books } = req.body; // [{ bookId, quantity }]

    const orderBooks = [];
    let totalAmount = 0;

    for (const item of books) {
      const book = await Book.findById(item.bookId);
      if (!book) return res.status(404).send({ message: `Book not found: ${item.bookId}` });

      orderBooks.push({
        bookId: book._id,
        bookName: book.bookName,
        quantity: item.quantity,
        price: book.price,
      });
      totalAmount += book.price * item.quantity;
    }

    const order = await Order.create({
      userId: req.user.id,
      books: orderBooks,
      totalAmount,
    });

    res.status(201).send(order);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get all orders (admin)
exports.getAllOrders = async (req, res) => {
  try {
    const result = await Order.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get logged-in user's orders
exports.getUserOrders = async (req, res) => {
  try {
    const result = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update order status (admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const result = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    );
    if (!result) return res.status(404).send({ message: 'Order not found.' });
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update payment status (admin)
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const result = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true }
    );
    if (!result) return res.status(404).send({ message: 'Order not found.' });
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};
