import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import styles from '../styles/order.module.css'
import { FaUser } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
const Order = () => {

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState(null)
  const [owner, setOwner] = useState('')
  const [postType, setPostType] = useState('person')
  const [location, setLocation] = useState('')
  const [userItems, setUserItems] = useState([])
  const [selectedSwapItem, setSelectedSwapItem] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (id) {
      fetchItemData(id)
    }
    fetchUserItems(2)
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

  const fetchUserItems = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:5000/user-items/${userId}`)
      setUserItems(res.data)
    } catch (error) {
      console.error('Error fetching user items: ', error)
    }
  }

  const handleConfirm = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/check-swap/${id}`)
      if (res.data.exists) {
        setErrorMessage('This item has already been added to the cart.')
        return
      }
     
      await axios.post('http://localhost:5000/swaps', {
        item_id: id,
        swap_with_item_id: selectedSwapItem
      })
   
      navigate('/cart')
    } catch (error) {
      console.error('Error confirming swap: ', error)
    }
  }

  return (
    <section className={styles.container}>
      <div className={styles.card}>
        <div className={styles.left}>
          <img src={`http://localhost:5000${image}`} alt="product" />
          <div className={styles.desc}>
            <h1>{title}</h1>
            <span><FaUser /> {owner}</span>
            <span><FaLocationDot /> {location}</span>
            <div className="">
              <label htmlFor="">Choose your item: </label>
              <select name="swapItem" id="swapItem" value={selectedSwapItem} onChange={(e) => setSelectedSwapItem(e.target.value)}>
                <option value="" disabled>Select an item</option>
                {userItems.map((item) => (
                  <option value={item.id} key={item.id}>
                    {item.title}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.status}>
              <h1>Status: On process</h1>
            </div>
          </div>
        </div>

        <div className={styles.button}>
          <button onClick={() => navigate(-1)}>Cancel</button>
          <button onClick={handleConfirm} disabled={!selectedSwapItem}>Confirm</button>
        </div>
      </div>
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
    </section>
  )
}

export default Order