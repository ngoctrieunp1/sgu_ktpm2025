// import React, { useContext, useState, useEffect } from 'react';
// import '../PlaceOrder/placeOrder.css';
// import { Context } from '../../../Context/Context';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { toast } from 'react-hot-toast'; // <- dùng named import

// function PlaceOrder() {
//   const { getTotalPrice, cartItems, userId, token, setCartItems } = useContext(Context);
//   const navigate = useNavigate();

//   const [formData, setformData] = useState({
//     name: '',
//     phoneNumber: '',
//     street: '',
//     city: '',
//     pincode: ''
//   });

//   // tiện ích lấy message từ AxiosError
//   const getErrorMessage = (err) =>
//     err?.response?.data?.message ||
//     err?.message ||
//     'Có lỗi xảy ra, vui lòng thử lại.';

//   useEffect(() => {
//     if (!token || Number(getTotalPrice()) === 0) {
//       navigate('/cart');
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [token]); // tránh gọi getTotalPrice mỗi render

//   const handleChange = (e) => {
//     setformData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handlePayment = async (e) => {
//     e.preventDefault();

//     try {
//       // Chuẩn hoá sản phẩm trong giỏ
//       const products = cartItems.map((item) => ({
//         productId: item.productId ?? item.item_id ?? item.itemId, // các khả năng thường gặp
//         quantity: Number(item.quantity ?? 1),
//         price: Number(item.price ?? 0)
//       }));

//       const orderDetails = {
//         userId,
//         address: {
//           name: formData.name,
//           phoneNumber: formData.phoneNumber,
//           street: formData.street,
//           city: formData.city,
//           pincode: formData.pincode
//         },
//         products,
//         totalAmount: Number(getTotalPrice()) + 2, // 2 = phí ship demo
//         status: 'Pending'
//       };

//       // Nếu đã set proxy trong client/package.json thì chỉ cần '/placeorder'
//       const res = await axios.post('/placeorder', orderDetails, {
//         headers: token ? { Authorization: `Bearer ${token}` } : {}
//       });

//       // OK
//       toast.success('Đặt hàng thành công!');
//       // Clear cart (BE + FE)
//       try {
//         await axios.delete(`/cart/clear/${userId}`, {
//           headers: token ? { Authorization: `Bearer ${token}` } : {}
//         });
//       } catch (clearErr) {
//         // nếu BE không có route clear cũng không sao, vẫn xoá FE
//         console.warn('Clear cart failed (ignored):', clearErr);
//       }
//       setCartItems([]);
//       navigate('/myorder');
//     } catch (err) {
//       console.error('PlaceOrder error:', err);
//       toast.error(getErrorMessage(err)); // <- chỉ hiện chuỗi, không crash
//     }
//   };

//   return (
//     <form className="place-order" onSubmit={handlePayment}>
//       <div className="place-order-left">
//         <h2>Shipping Address</h2>
//         <input
//           type="text"
//           name="name"
//           placeholder="Full Name"
//           value={formData.name}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="tel"
//           name="phoneNumber"
//           placeholder="Phone Number"
//           value={formData.phoneNumber}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="text"
//           name="street"
//           placeholder="Street Address"
//           value={formData.street}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="text"
//           name="city"
//           placeholder="City"
//           value={formData.city}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="text"
//           name="pincode"
//           placeholder="Pincode"
//           value={formData.pincode}
//           onChange={handleChange}
//           required
//         />
//       </div>

//       <div className="place-order-right">
//         <div className="cart-total">
//           <h2>Cart Totals</h2><br />
//           <div className="cart-total-details">
//             <p>Subtotal</p>
//             <p>{Number(getTotalPrice())}</p>
//           </div>
//           <hr />
//           <div className="cart-total-details">
//             <p>Delivery Fee</p>
//             <p>{2}</p>
//           </div>
//           <hr />
//           <div className="cart-total-details">
//             <p>Total</p>
//             <p>{Number(getTotalPrice()) + 2}</p>
//           </div>
//           <button style={{ marginTop: '30px' }} type="submit">
//             PROCEED TO ORDER
//           </button>
//         </div>
//       </div>
//     </form>
//   );
// }

// export default PlaceOrder;

//////////////////////////////////////////////////////////////////////////////// /////////////////////////////////////////////////////////////////////////////

import React, { useContext, useState, useEffect } from 'react';
import '../PlaceOrder/placeOrder.css';
import { Context } from '../../../Context/Context';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

function PlaceOrder() {
  const { getTotalPrice, cartItems, userId, token, setCartItems } = useContext(Context);
  const navigate = useNavigate();

  const [formData, setformData] = useState({
    name: '',
    phoneNumber: '',
    street: '',
    city: '',
    pincode: ''
  });

  useEffect(() => {
    if (!token || getTotalPrice() === 0) navigate('/cart');
  }, [token, getTotalPrice, navigate]);

  const handleChange = (e) => {
    setformData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handlePayment = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const orderDetails = {
  //       userId,
  //       address: {
  //         name: formData.name,
  //         phoneNumber: formData.phoneNumber,
  //         street: formData.street,
  //         city: formData.city,
  //         pincode: formData.pincode,
  //       },
  //       products: cartItems.map(item => ({
  //         productId: item.itemId,
  //         quantity: item.quantity,
  //         price: item.price,
  //       })),
  //       // KHÔNG có phí ship:
  //       totalAmount: getTotalPrice(),
  //       status: 'Pending',
  //     };

  //     const response = await axios.post('http://localhost:4000/placeorder', orderDetails);
  //     console.log('Order placed successfully:', response.data);
  //     toast.success('Order placed successfully!');

  //     await axios.delete(`http://localhost:4000/cart/clear/${userId}`);
  //     setCartItems([]);
  //     navigate('/myorder');
  //   } catch (error) {
  //     console.error('Error placing order:', error);
  //     toast.error('Failed to place order');
  //   }
  // };

//   const handlePayment = async (e) => {
//   e.preventDefault();
//   try {
//     const orderDetails = {
//       userId,
//       address: {
//         name: formData.name,
//         phoneNumber: formData.phoneNumber,
//         street: formData.street,
//         city: formData.city,
//         pincode: formData.pincode,
//       },
//       products: cartItems
//         .filter(i => Number(i.quantity) > 0)
//         .map(i => ({
//           productId: i.itemId || i.productId || i._id, // <-- dùng đúng id sản phẩm
//           quantity: Number(i.quantity),
//         })),
//     };

//     // (tuỳ) Nếu BE yêu cầu auth:
//     // const headers = { Authorization: `Bearer ${token}` };
//     const resp = await axios.post("http://localhost:4000/placeorder-split", orderDetails /*, { headers }*/);

//     // resp.data = { orders: [...] }
//     const count = Array.isArray(resp.data?.orders) ? resp.data.orders.length : 1;
//     toast.success(`Tạo ${count} đơn hàng thành công!`);

//     await axios.delete(`http://localhost:4000/cart/clear/${userId}`);
//     setCartItems([]);
//     navigate("/myorder");
//   } catch (error) {
//     console.error("Error placing order:", error);
//     const msg =
//       error?.response?.data?.message ||
//       error?.response?.data ||
//       error?.message ||
//       "Failed to place order";
//     toast.error(String(msg));
//   }
// };

const handlePayment = async (e) => {
  e.preventDefault();
  try {
    const orderDetails = {
      userId,
      address: {
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        street: formData.street,
        city: formData.city,
        pincode: formData.pincode,
      },
      products: cartItems
        .filter(i => Number(i.quantity) > 0)
        .map(i => ({
          productId: i.itemId || i.productId || i._id, 
          quantity: Number(i.quantity),
        })),
    };

    // Gọi API backend
    const resp = await axios.post("http://localhost:4000/placeorder-split", orderDetails);

    // Nếu backend trả {orders: [...]}
    const orders = resp.data?.orders || resp.data; // fallback nếu BE trả mảng
    const count = Array.isArray(orders) ? orders.length : 1;

    toast.success(`Tạo ${count} đơn hàng thành công!`);

    // Xóa giỏ hàng
    await axios.delete(`http://localhost:4000/cart/clear/${userId}`);
    setCartItems([]);

    // Chuyển sang trang My Orders
    navigate("/myorder");
  } catch (error) {
    console.error("Error placing order:", error);
    const msg =
      error?.response?.data?.message ||
      error?.response?.data ||
      error?.message ||
      "Failed to place order";
    toast.error(String(msg));
  }
};


  return (
    <form className='place-order' onSubmit={handlePayment}>
      <div className="place-order-left">
        <h2>Shipping Address</h2>
        <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
        <input type="tel" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} required />
        <input type="text" name="street" placeholder="Street Address" value={formData.street} onChange={handleChange} required />
        <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
        <input type="text" name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} required />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2><br />
          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>{getTotalPrice()}</p>
          </div>
          <hr />
          {/* BỎ Delivery Fee */}
          <div className="cart-total-details">
            <p>Total</p>
            <p>{getTotalPrice()}</p>
          </div>
          <button style={{ marginTop: "30px" }} type="submit">PROCEED TO ORDER</button>
        </div>
      </div>
    </form>
  );
}

export default PlaceOrder;
