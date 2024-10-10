import React from 'react'
import styles from '../styles/coupon.module.css'
import { FaBottleWater } from "react-icons/fa6";
import pizza from '../assets/pizza.png'
const Coupon = () => {
   return (
      <div className={styles.card}>
         <div className={styles.left}>
            <h1>1 FREE 1 PIZZA COUPON</h1>
            <p className={styles.bottle}><FaBottleWater /> 100 Bottles</p>
            <p className={styles.sub}>exchange empty plastic bottle with us!</p>
         </div>
         <div className={styles.right}>
            <img src={pizza} alt="pizza" />
         </div>
      </div>
   )
}

export default Coupon