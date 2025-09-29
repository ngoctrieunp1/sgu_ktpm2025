import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../../../Components/SingleView/SingleView.css'; // Ensure you have the necessary styles

function ReviewSingleView() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        axios.get(`http://localhost:4000/product/getReviews/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            if (response.data) {
                setProduct(response.data.product);
                setReviews(response.data.reviews);
            }
            setLoading(false);
        }).catch((error) => {
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
                    <div className="single-food-item-name-rating">
                        <h2 className="single-food-item-name">{product.name}</h2>
                        {/* Cart button can be positioned here if needed */}
                    </div>
                    <p className="single-food-item-descrip">{product.description}</p>
                    
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
        </div>
    );
}

export default ReviewSingleView;
