import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './AllReviews.css';

function AllReviews() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:4000/getallreviews')
      .then((res) => {
        console.log(res);
        setProducts(res.data.reverse()); // Reverse the product array for LIFO
      })
      .catch((err) => {
        console.log(err);
        setError('Failed to load products.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: "flex" }}>
      {/* Main Content */}
      <div className='list add1 flex-col' style={{ marginLeft: "10px" }}>
        {/* Reviews Section */}
        <div className="review-disp">
          <h2>Product Reviews</h2>
          <div className="review-disp-list">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>{error}</p>
            ) : products.length > 0 ? (
              products.map(product => (
                <div key={product._id} className='review-item'>
                  <div className="review-item-container">
                    <img src={product.image} alt={product.name} className='review-item-img' />
                  </div>
                  <div className="review-item-info">
                    <div className="review-item-name-rating">
                      <p style={{ color: "black", textDecoration: "none" }}>{product.name}</p>
                    </div>
                    <div className='food-item-descripp'>
                      {product.reviews.length > 0 ? (
                        product.reviews.map(review => (
                          <div key={review._id} className="review-itemmmm">
                            <p><strong>User:</strong> {review.name} <strong>Review:</strong> {review.comment} <strong>Rating:</strong> {review.rating}</p>
                          </div>
                        ))
                      ) : (
                        <p className='reviewitem-descrip'>No reviews.</p>
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
      </div>
    </div>
  );
}

export default AllReviews;
