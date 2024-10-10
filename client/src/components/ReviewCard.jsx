import React from 'react'
import { FaCheckCircle, FaStar } from "react-icons/fa";
import styles from '../styles/reviewCard.module.css'
const ReviewCard = () => {
   return (
      <div className={styles.box}>
         <div className={styles.star}>
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
         </div>
         <h1>Sarah M.<FaCheckCircle id='check' /> </h1>
         <p>"Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions.”</p>

      </div>
   )
}

export default ReviewCard