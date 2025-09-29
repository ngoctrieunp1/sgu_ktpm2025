const productslCollection = require("../models/productModels")
const mongoose = require('mongoose');

// Add products
const create=async (req, res) => {
    try {
      const { name, price, description, category, image } = req.body;

      console.log("Authenticated user:", req.user);
      if (!req.user || !req.user._id) {
        console.log("Authenticated user:", req.user);
        return res.status(401).send({ success: false, message: "Unauthorized, user not found" });
    }
        const product = new productslCollection ({
        name,
        restaurantId: req.user.id, // assuming the user ID is in req.user
        price,
        description,
        category,
        image,
        postedBy: req.user.id,
      });
      await product.save();
      res.status(201).json({ message: 'Product created', product });
    } catch (err) {
      res.status(400).json({ message: 'Error creating product', error: err.message });
    }
}
// view products
const view=async(req,res)=>{
    try{
        const response=await productslCollection.find()
        res.status(201).send(response)
    }catch(err){
        res.status(500).send({message:"internal server error"})
    }
}
// get product by id 
const getproducts=async(req,res)=>{
    try{
        const {id}=req.params
        const getproducts=await productslCollection.findById(id)
        res.status(201).send(getproducts)
    }catch(err){
        res.status(500).send({message:"internal server error"})
    }
}
// update  products details
const update=async (req,res)=>{
    try{
         const {id}=req.params;
         const body=req.body;
         const product=await  productslCollection.findById(id)
         if(!product){
          return res.status(400).send("oops job not found")
         }
        const updatedproduct=await  productslCollection.findByIdAndUpdate({_id:id},req.body,{new:true,runValidators:true})
         return res.status(200).send({success:true,message:"job updated!",updatedproduct})
    }catch(err){
      return res.status(500).send("internal server error")
    }
}
// delete  products
const remove=async (req,res)=>{
    try{
         const {id}=req.params;
         const deleteproduct=await productslCollection.findByIdAndDelete({_id:id})
         return res.status(200).send({deleteproduct,success:true,message:"product deleted"})
    }catch(err){
      return res.status(500).send("internal server error")
    }
}
// search f products
const searchproduct = async (req, res) => {
    const { q, category, minPrice, maxPrice } = req.query;

    try {
        let query = {
            name: { $regex: q, $options: 'i' }
        };

        // Add category filter if provided
        if (category) {
            query.category = category;
        }

        // Add price range filter if provided
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = minPrice;
            if (maxPrice) query.price.$lte = maxPrice;
        }

        const products = await productslCollection.find(query);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching search results', error });
    }
};

// single view for product
const productview=async(req,res)=>{
    try {
        const { id } = req.params;
        console.log('Product ID:', id);
        const product = await productslCollection.findById(id);
        if (!product) {
          return res.status(404).send('Product not found');
        }
        res.json(product);
      } catch (err) {
        res.status(500).send({ message: 'Internal server error' });
      }
}
// get  products by restuarent 
const getproductByRestuarent = async (req, res) => {
    try {
        const product =await productslCollection.find({postedBy: req.user._id})
        return res.status(200).send(product )
    } catch (err) {
      console.log(err.message);
      return res.status(500).send("Internal server error");
    }
  };
  // get  reviwed products by restuarent 
  const getProductsWithReviewsByRestaurant = async (req, res) => {
    try {
        const restaurantId = req.user._id;
        console.log('Fetching products for restaurant ID:', restaurantId);

        const products = await productslCollection.find({ postedBy: restaurantId }).populate('reviews.user', 'name');

        if (!products) {
            console.log('No products found for the restaurant');
            return res.status(404).json({ message: 'No products found for the restaurant' });
        }

        console.log('Fetched products:', products);

        res.status(200).json(products);
    } catch (err) {
        console.error('Error fetching products with reviews:', err.message);
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};
// Add review for products
const addReview = async (req, res) => {
    const { id } = req.params;
    const { rating, comment } = req.body;

    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const product = await productslCollection.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if the user has already reviewed the product
        const alreadyReviewed = product.reviews.find(review => review.user.toString() === req.user._id.toString());

        if (alreadyReviewed) {
            return res.status(400).json({ message: 'You have already reviewed this product' });
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        };

        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

        await product.save();

        res.status(201).json({ message: 'Review added' });
    } catch (error) {
        console.error('Error adding review:', error.message);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
// view review of products
const getReviews = async (req, res) => {
    const { id } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid Product ID' });
    }
  
    try {
        const product = await productslCollection.findById(id).populate('reviews.user', 'name');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
  
        const userHasReviewed = product.reviews.some(review => review.user.toString() === req.user._id.toString());
  
        res.json({
            product: {
                _id: product._id,
                name: product.name,
                image: product.image,
                description: product.description,
                price: product.price
            },
            reviews: product.reviews,
            userHasReviewed
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reviews', error });
    }
  };
  
// get all  review of products
const getAllProductsAndReviews = async (req, res) => {
  try {
      const products = await productslCollection.find()
          .populate('reviews.user', 'name'); // Assuming reviews reference a user model

      res.status(200).json(products);
  } catch (err) {
      res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

// restuarent can disble their products
const toggleproduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productslCollection.findById(id);
        if (!product) {
            return res.status(400).send({ success: false, message: "Product not found" });
        }
        product.disabled = !product.disabled;
        await product.save();
        return res.status(200).send({ success: true, message: `${product.disabled ? 'disabled' : 'enabled'} successfully` });
    } catch (err) {
        console.log(err.message);
        return res.status(500).send("Internal server error");
    }
};
// total product count
const productcount=async (req,res)=>{
    try{
      const productcount=await productslCollection.countDocuments();
      res.json({ count: productcount });
  
    }catch(err){
      return res.status(500).send("intenral server error");
    }
  }

module.exports={
    create,
    view,
    getproducts,
    update,
    remove,
    productview,
    addReview,
    getReviews,
    getproductByRestuarent,
    searchproduct,
    getProductsWithReviewsByRestaurant,
    getAllProductsAndReviews,
    toggleproduct,
    productcount
}