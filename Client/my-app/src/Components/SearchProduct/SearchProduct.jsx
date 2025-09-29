import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { Context } from '../../Context/Context';
import './SearchProduct.css';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchProduct() {
  const query = useQuery().get('q');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { cartItem, addCart } = useContext(Context);

  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/searchproduct`, {
          params: {
            q: query,
            category: category || undefined,
            minPrice: minPrice || undefined,
            maxPrice: maxPrice || undefined,
          },
        });
        setResults(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query, category, minPrice, maxPrice]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    // Triggering useEffect for new search query with filters
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching results: {error.message}</p>;

  return (
    <div className="searchproduct">
      <form onSubmit={handleFilterSubmit}>
        <div className="filter-options">
          <label>
            Category:
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All</option>
              <option value="Salad">Salad</option>
                            <option value="Rolls">Rolls</option>
                            <option value="Deserts">Deserts</option>
                            <option value="Sandwich">Sandwich</option>
                            <option value="Cake">Cake</option>
                            <option value="Pure veg">Pure veg</option>
                            <option value="Pasta">Pasta</option>
                            <option value="Noodles">Noodles</option>
            </select>
          </label>
          <label>
            Min Price:
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Min Price"
            />
          </label>
          <label>
            Max Price:
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max Price"
            />
          </label>
          <button type="submit">Apply Filters</button>
        </div>
      </form>

      <div className="food-disp-list" style={{ color: 'black', textDecoration: 'none' }}>
        {results.map((result) => (
          <div className="food-item" key={result._id}>
            <div className="food-item-container">
              <Link to={`/product/${result._id}`}>
                <img src={result.image} alt="" className="food-item-img" />
              </Link>
              <button onClick={() => addCart(result._id)} className="carttt">
                Add to Cart
              </button>
            </div>
            <div className="food-item-info">
              <div className="food-item-name-rating">
                <p style={{ color: 'black', textDecoration: 'none' }}>{result.name}</p>
              </div>
              <p className="food-item-descrip">{result.description}</p>
              <p className="food-item-price">${result.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchProduct;
