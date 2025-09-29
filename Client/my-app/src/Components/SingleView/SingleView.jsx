import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './SingleView.css';
import { Context } from '../../Context/Context';
import toast from 'react-hot-toast';

function SingleView() {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reviews, setReviews] = useState([]); 
    const { addCart } = useContext(Context);
    const token = localStorage.getItem('token');

    const submitHandler = async (e) => {
        e.preventDefault();

        // Validate rating between 0 and 5
        if (rating < 0 || rating > 5) {
            alert('Rating must be between 0 and 5.');
            return;
        }
    
        try {
            if (!token) {
                alert('No token found. Please login first.');
                return;
            }
    
            await axios.post(`http://localhost:4000/product/${id}/reviews`, 
                { rating, comment },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
          
            toast.success('Review submitted successfully!')
            setRating(0);
            setComment('');
            // Refresh reviews after submitting
            fetchReviews();
        } catch (error) {
            if (error.response?.data?.message === 'You have already reviewed this product') {
                toast.error('You have already reviewed this product!');
            } else {
                alert(`Error submitting review: ${error.response?.data?.message || error.message}`);
            }
        }
    };

    const fetchReviews = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/product/getReviews/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            setProduct(response.data.product);
            setReviews(response.data.reviews);
            
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [id]);

    useEffect(() => {
        axios.get(`http://localhost:4000/product/${id}`)
            .then((response) => {
                setProduct(response.data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading product: {error.message}</p>;

    return (
        <div className="single-view-container">
            <div className="single-food-item">
                <div className="single-food-item-container">
                    <img src={product.image} alt={product.name} className="single-food-item-img" />
                </div>
                <div className="single-food-item-info">
                    <h2 className="single-food-item-name">
                        {product.name}
                        <button onClick={() => addCart(product._id)} className="cart-btn">Add to Cart</button>
                    </h2>
                    <p className="single-food-item-descrip">{product.description}</p>
                    <p className="single-food-item-price">${product.price}</p>
                    <div className="reviews-section">
                        {reviews.length > 0 ? (
                            reviews.map(review => (
                                <div key={review._id} className="review-itemm">
                                    <p><strong>User:</strong> {review.name}</p>
                                    <p><strong>Review:</strong> {review.comment}</p>
                                    <p><strong>Rating:</strong> {review.rating}</p>
                                </div>
                            ))
                        ) : (
                            <p className="no-reviews">No reviews yet.</p>
                        )}
                    </div>
                </div>
            </div>
            <form onSubmit={submitHandler} className="review-form">
                <div className="form-group">
                    <label htmlFor="rating">Rating 0/5 :</label>
                    <input
                        type="number"
                        id="rating"
                        value={rating}
                        onChange={(e) => {
                            const value = Number(e.target.value);
                            if (value >= 0 && value <= 5) {
                                setRating(value);
                            }
                        }}
                        required
                        min="0"
                        max="5"
                        className="review-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="comment">Comment:</label>
                    <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                        className="review-textarea"
                    ></textarea>
                </div>
                <button type="submit" className="submit-btn">Submit Review</button>
            </form>
        </div>
    );
}

export default SingleView;
