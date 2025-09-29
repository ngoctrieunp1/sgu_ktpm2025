import React, { useState } from 'react';
import './Add.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function Add() {
    const navigate = useNavigate();
    const [product, setProduct] = useState({
        image: "",
        name: "",
        description: "",
        category: "",
        price: ""
    });
    const token = localStorage.getItem('token');

    const update = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleUpdate = () => {
        axios.post("http://localhost:4000/create", product, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((res) => {
            console.log(res);
            toast.success('Successfully Added Products!')
            navigate("/");
        }).catch((err) => {
            console.log(err);
            toast.error(err)
        });
    };

    return (
        <div className='add'>
            <h2 className='add-title'>Add New Product</h2>
            <form className='form' onChange={update} onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
                <div className="form-group">
                    <label htmlFor="image">Upload Image</label>
                    <input
                        type="text"
                        id="image"
                        name='image'
                        placeholder='Enter The Product Image URL'
                        value={product.image}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="name">Product Name</label>
                    <input
                        type="text"
                        id="name"
                        name='name'
                        placeholder='Enter The Product Name'
                        value={product.name}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Product Description</label>
                    <textarea
                        id="description"
                        name="description"
                        rows='6'
                        placeholder='Write Content Here'
                        value={product.description}
                        required
                    ></textarea>
                </div>
                <div className="form-group form-group-row">
                    <div className="form-group-col">
                        <label htmlFor="category">Product Category</label>
                        <select
                            id="category"
                            name="category"
                            value={product.category}
                            required
                        >
                            <option value="">Choose</option>
                            <option value="Salad">Salad</option>
                            <option value="Rolls">Rolls</option>
                            <option value="Deserts">Deserts</option>
                            <option value="Sandwich">Sandwich</option>
                            <option value="Cake">Cake</option>
                            <option value="Pure veg">Pure veg</option>
                            <option value="Pasta">Pasta</option>
                            <option value="Noodles">Noodles</option>
                        </select>
                    </div>
                    <div className="form-group-col">
                        <label htmlFor="price">Product Price</label>
                        <input
                            type="text"
                            id="price"
                            name='price'
                            placeholder='Price'
                            value={product.price}
                            required
                        />
                    </div>
                </div>
                <button type='submit' className='add-button'>Add Product</button>
            </form>
        </div>
    );
}

export default Add;
