import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './Viewupdate.css';
import toast from 'react-hot-toast';

function Viewupdate() {
    const navigate = useNavigate();
    const { id } = useParams();
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

    useEffect(() => {
        axios.get(`http://localhost:4000/getproducts/${id}`)
            .then((res) => {
                setProduct(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [id]);

    const handleUpdate = () => {
        axios.put(`http://localhost:4000/update/${id}`, product, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => {
                toast.success('Successfully Updated Products!')
                navigate("/list-item");
            })
            .catch((err) => {
                console.log(err);
                toast.error(err)
            });
    };

    return (
        <div className='view-update'>
            <h2 className='view-update-title'>Update Product</h2>
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
                            <option value="">Select Category</option>
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
                <button type='submit' className='update-button'>Update Product</button>
            </form>
        </div>
    );
}

export default Viewupdate;
