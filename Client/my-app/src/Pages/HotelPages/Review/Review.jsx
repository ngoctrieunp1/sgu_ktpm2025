import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../../../Components/FoodItem/FoodItem.css'; // Ensure this CSS file has styles for cart items

function Review() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchProductsWithReviews();
    }, []);

    const fetchProductsWithReviews = async () => {
        try {
            const response = await axios.get('http://localhost:4000/restaurant/products-with-reviews', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setProducts(response.data);
            setLoading(false);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading reviews: {error.message}</p>;

    return (
        <div className='food-disp'>
            <h2>Product Reviews</h2>
            <div className="food-disp-list">
                {products.length > 0 ? (
                    products.map(product => (
                        <div key={product._id} className='food-item'>
                            <div className="food-item-container">
                                <Link to={`/product/getReviews/${product._id}`}>
                                    <img src={product.image} alt={product.name} className='food-item-img' />
                                </Link>
                            </div>
                            <div className="food-item-info">
                                <div className="food-item-name-rating">
                                    <p>{product.name}</p>
                                </div>
                                <div className='food-item-descrip'>
                                    {product.reviews.length > 0 ? (
                                        product.reviews.map(review => (
                                            <div key={review._id} className="review-itemmm">
                                                <p><strong>User:</strong> {review.name} <strong>Review:</strong> {review.comment} <strong>Rating:</strong> {review.rating}</p>
                                                <p></p>
                                                <p></p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No reviews.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No products with reviews found.</p>
                )}
            </div>
        </div>
    );
}

export default Review;





