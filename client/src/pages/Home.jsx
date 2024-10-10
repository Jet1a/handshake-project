import React, { useEffect, useState } from 'react'
import ItemCard from '../components/ItemCard'
import ReviewCard from '../components/ReviewCard'
import styles from '../styles/home.module.css'
import pic1 from '../assets/swap.jpg'
import { Link } from 'react-router-dom'
import axios from 'axios'

const Home = () => {

   const [items, setItems] = useState([])

   useEffect(() => {
      const fetchData = async () => {
         try {
            await axios.get('http://localhost:5000/items')
               .then((res) => {
                  setItems(res.data)
               })
         } catch (error) {
            throw error
         }
      }
      fetchData()
   }, [])

   return (
      <section>
         <div className={styles.hero}>
            <div className={styles.title}>
               <h1>Reduce waste, save money: Swap your
                  items today!</h1>
               <p>Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.</p>
            </div>
            <div className={styles.img}>
               <img src={pic1} alt="swap" />
            </div>
         </div>


         <h1 className={styles.title2}>Explore Variety of Goods</h1>
         <div className={styles.showcase}>
            {items.slice(0, 4).map((item, index) => (
               <ItemCard key={index} item={item} />
            ))}
         </div>

         <h1 className={styles.title3}>WORTHY & TRUSTED</h1>
         <div className={styles.review}>
            <ReviewCard />
            <ReviewCard />
            <ReviewCard />
            <ReviewCard />
            <ReviewCard />
         </div>

         <div className={styles.banner}>
            <h1>Eco <span>Exchange</span></h1>
            <p>turn trash into valuable by exchange it with us!</p>
            <Link to='/about-us'><button>Exchange Now</button></Link>
         </div>

      </section>
   )
}

export default Home