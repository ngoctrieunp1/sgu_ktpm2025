import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../../../Components/SingleView/SingleView.css'; // Make sure to import the CSS file

function Singleviews() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                    <h2 className="single-food-item-name">{product.name}</h2>
                    <p className="single-food-item-descrip">{product.description}</p>
                    <p className="single-food-item-price">${product.price}</p>
                </div>
            </div>
        </div>
    );
}

export default Singleviews;
