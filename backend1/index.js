const port = 5000;
const express = require('express');
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

// CORS Configuration
app.use(cors({
  origin: 'http://localhost:5173', // Allow connections from this frontend port
  methods: ['GET', 'POST'],       // Allow these methods
}));

app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb+srv://shivanesh_15:Shivanesh@cluster0.4h4pu.mongodb.net/FlexiWork-DataBase", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Failed to connect to MongoDB:", error));

// Define Mongoose Schema and Model
const JobDetails = mongoose.model("job_details", {
  job_title: { type: String, required: true },
  job_description: { type: String, required: true },
  job_requirements: { type: String, required: true },
  job_location: { type: String, required: true },
  salary: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true },
});

// API to Add a Product
app.post('/addproduct', async (req, res) => {
  try {
    const product = new JobDetails(req.body);
    await product.save();
    console.log("Saved:", product);
    res.json({ success: true, message: "Product added successfully!" });
  } catch (error) {
    console.error("Error saving product:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// API to Remove a Product
app.post('/removeproduct', async (req, res) => {
  try {
    const deletedProduct = await JobDetails.findOneAndDelete({ id: req.body.id });
    if (deletedProduct) {
      console.log("Removed:", deletedProduct);
      res.json({ success: true, message: "Product removed successfully!" });
    } else {
      res.status(404).json({ success: false, message: "Product not found." });
    }
  } catch (error) {
    console.error("Error removing product:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// API to Fetch All Products
app.get('/allproducts', async (req, res) => {
  try {
    const products = await JobDetails.find({});
    console.log("All Products Fetched");
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Start Server
app.listen(port, (error) => {
  if (!error) {
    console.log(`Server is running on http://localhost:${port}`);
  } else {
    console.error("Error starting server:", error.message);
  }
});
