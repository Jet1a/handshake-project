import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import styles from '../styles/itemDetails.module.css'
import { FaLocationDot } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";

const ItemDetails = () => {

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState(null)
  const [owner, setOwner] = useState('')
  const [postType, setPostType] = useState('person')
  const [location, setLocation] = useState('')

  const { id } = useParams()

  useEffect(() => {
    if (id) {
      fetchItemData(id)
    }
  }, [id])

  const fetchItemData = async (itemId) => {
    try {
      const res = await axios.get(`http://localhost:5000/items/${itemId}`)
      const { title, description, image, owner_name, location, post_type } = res.data[0]

      setTitle(title)
      setDescription(description)
      setLocation(location)
      setOwner(owner_name)
      setImage(image)
      setPostType(post_type)


    } catch (error) {
      console.error('Error fetching item data: ', error)
    }
  }


  return (
    <section className={styles.container}>
      <div className={styles.card}>
        <div className={styles.img}>
          <img src={`http://localhost:5000${image}`} alt="product" />
        </div>
        <div className={styles.desc}>

          <div className={styles.title}>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>

          <div className={styles.offer}>
            <p>will swap for</p>
            <h2>Any Offers</h2>
          </div>

          <div className={styles.location}>
            <h2>Location</h2>
            <p><FaLocationDot /> {location}</p>
          </div>

          <div className={styles.radioDiv}>
            <h1>Delivery Preferences</h1>
            <div className={styles.radioContainer}>
              <div className={styles.radioBox}>
                <div className={styles.radioInput}>
                  <input type="radio" id="person" name="postType" value="person" checked={postType === 'person'} readOnly />
                  <label htmlFor="person" className={styles.radioLabel}>Person to person</label>
                </div>
                <div className={styles.radioDescription}>
                  You take care of the exchange.
                </div>
              </div>

              <div className={styles.radioBox}>
                <div className={styles.radioInput}>
                  <input type="radio" id="delivery" name="postType" value="delivery" checked={postType === 'delivery'} readOnly />
                  <label htmlFor="delivery" className={styles.radioLabel}>Delivery with Us</label>
                </div>
                <div className={styles.radioDescription}>
                  We pick up your item, deliver it, and bring you back your swap for a fee.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <div className={styles.owner}>
          <img src="" alt="" />
          <div className="">
            <h1>{owner} <FaCheckCircle /></h1>
            <p>Owner | last seen yesterday</p>
          </div>
        </div>
        <div className={styles.btnList}>
          <Link to="/explore"><button>Back</button></Link>
          <Link to={`/order/${id}`}><button>Exchange</button></Link>
        </div>
      </div>
    </section>
  )
}

export default ItemDetails