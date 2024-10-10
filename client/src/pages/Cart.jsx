import axios from 'axios';
import React, { useEffect, useState } from 'react'
import styles from '../styles/cart.module.css'
import { FaUser } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { Link } from 'react-router-dom';

const Cart = () => {
   const [swappedItems, setSwappedItems] = useState([]);

   useEffect(() => {
      fetchSwappedItems();
   }, []);

   const fetchSwappedItems = async () => {
      try {
         const res = await axios.get('http://localhost:5000/swapped-items');
         setSwappedItems(res.data);
      } catch (error) {
         console.error('Error fetching swapped items: ', error);
      }
   };

   const handleComfirm = async (itemId, swappedTitle, owner) => {
      try {
         await axios.put(`http://localhost:5000/orderItem/${itemId}`, {
            newOwner: 2
         })
         await axios.put(`http://localhost:5000/update-items`, {
            newOwner: owner,
            swappedTitle: swappedTitle
         })
         await axios.delete(`http://localhost:5000/delete-swap/${itemId}`)
         fetchSwappedItems()
      } catch (error) {
         console.error('Error confirming the deal: ', error)
      }
   }

   const handleReject = async (itemId) => {
      try {
         await axios.delete(`http://localhost:5000/delete-swap/${itemId}`)
         fetchSwappedItems()
      } catch (error) {
         console.error('Error reject the deal: ', error)
      }
   }

   return (
      <section className={styles.container}>
         <h1 className={styles.title}>Order Swap Items</h1>
         <div className={styles.items}>
            {swappedItems.length !== 0 ? swappedItems.map((item) => (
               <div key={item.id} className={styles.item}>

                  <img src={`http://localhost:5000${item.image}`} alt="product" />
                  <div className={styles.box}>
                     <div className={styles.desc}>
                        <h1>{item.title}</h1>
                        <p>{item.description}</p>
                        <p><FaUser /> {item.owner}</p>
                        <p><FaLocationDot /> {item.location}</p>
                     </div>
                     <div className={styles.status}>
                        <p className={styles.swap}>Swapped with: <span>{item.swapped_with_title}</span> </p>
                        <p className={styles.statusText}>Status: <span>Accepted</span></p>
                     </div>
                     <div className={styles.button}>
                        <button className={styles.reject} onClick={() => handleReject(item.id)}>Reject</button>
                        <button className={styles.confirm} onClick={() => handleComfirm(item.id, item.swapped_with_title, item.user_id)}>Confirm</button>
                     </div>
                  </div>
               </div>
            )) : (
               <p className={styles.emptyMessage}>Your cart is empty. Start swapping to see items <Link to="/explore">here!</Link> </p>
            )}
         </div>
      </section>
   );
}

export default Cart