import React from 'react'
import styles from '../styles/navbar.module.css'
import { Link } from 'react-router-dom'
const Navbar = () => {
   return (
      <nav>
         <div className={styles.navbar}>
            <div className={styles.left}>
               <Link to='/'><h1>HANDSHAKE</h1></Link>
               <input type="text" placeholder='Search' />
            </div>
            <div>
               <ul className={styles.links}>
                  <li>
                     <Link to='/'>Home</Link>
                  </li>
                  <li>
                     <Link to='/explore'>Explore</Link>
                  </li>
                  <li>
                     <Link to='/blog'>Blog</Link>
                  </li>
                  <li>
                     <Link to='/about-us'>About us</Link>
                  </li>
                  <li>
                     <Link to='/cart'>Cart</Link>
                  </li>
                  <li>
                     <Link to='/user'>User</Link>
                  </li>
               </ul>
            </div>
         </div>
         <div className={styles.banner}>
            <p>Sign up and get 20% off to your first swap. <span>Sign Up Now</span></p>
         </div>
      </nav>
   )
}

export default Navbar