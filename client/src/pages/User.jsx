import React, { useEffect, useState } from 'react'
import styles from '../styles/user.module.css'
import { FaRecycle, FaEdit, FaTrash } from "react-icons/fa";
import { FaBottleWater } from "react-icons/fa6";
import person from '../assets/person.jpg'
import ItemCard from '../components/ItemCard';
import axios from 'axios';
import { Link } from 'react-router-dom';
const User = () => {

  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get('http://localhost:5000/items', {
          params: { userId: 2 }
        })
        setItems(res.data)
      } catch (error) {
        console.error('Error fetching items: ', error)
      }
    }
    fetchItems();
  }, [])

  const deleteItem = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:5000/delete-item/${id}`)
      setItems(items.filter(item => item.id !== id))
    } catch (error) {
      console.error('Error deleting blog: ', error);
    }
  }


  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Personal Information</h1>
      <div className={styles.bigbox}>
        <div className={styles.boxuser}>
          <img src={person} alt="person" />
        </div>

        <div className={styles.textbox}>
          <div className={styles.desc}>
            <h2>Username</h2>
            <p>John Doe</p>
          </div>
          <div className={styles.desc}>
            <h2>Age</h2>
            <p>30</p>
          </div>
          <div className={styles.desc}>
            <h2>Email</h2>
            <p>john.doe@example.com</p>
          </div>
          <div className={styles.eco}>
            <FaRecycle /> <span>Total <b>50</b> EcoPoint</span> |
            <div className="">
              <FaBottleWater /> <span>Total <b>150</b> Bottle Collect</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.list}>
        <h1>Your Item</h1>
        <Link to='/user-item'><button>Add Item</button></Link>
      </div>

      <div className={styles.flex}>
        {items.map((item) => (
          <div key={item.id} className={styles.config}>
            <div className={styles.btnElement}>
              <Link to={`/user-item/${item.id}`}><button className={styles.editBtn}><FaEdit /> Edit</button></Link>
              <button className={styles.deleteBtn} onClick={() => deleteItem(item.id)}><FaTrash /> Delete</button>
            </div>
            <ItemCard item={item} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default User