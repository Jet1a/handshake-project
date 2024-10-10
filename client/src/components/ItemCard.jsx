import React from 'react'
import styles from '../styles/itemCard.module.css'
import { FaLocationDot } from "react-icons/fa6";

const ItemCard = ({ item }) => {

  const getPathUrl = (imgPath) => {
    return `http://localhost:5000${imgPath}`
  }
  return (
    <div className={styles.card}>
      <div className={styles.cardImg}>
        <img src={getPathUrl(item.image)} alt={item.title} />
      </div>
      <div className={styles.desc}>
        <h3>{item.title}</h3>
        <p><FaLocationDot /> {item.location}</p>
        <p>Owner: <span>{item.owner_name}</span></p>
        <h1>ANY OFFERS</h1>
      </div>
    </div>
  )
}

export default ItemCard