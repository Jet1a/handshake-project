import React, { useEffect, useState } from 'react'
import styles from '../styles/explore.module.css'
import ItemCard from '../components/ItemCard';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Explore = () => {

  const [selectedPrice, setSelectedPrice] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [items, setItems] = useState([])
  const [filterItems, setFilterItems] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios.get('http://localhost:5000/items', {
          params: {
            excludeUserId: 2
          }
        })
          .then((res) => {
            setItems(res.data)
            setFilterItems(res.data)
          })
      } catch (error) {
        console.error('Error fetching items: ', error)
      }
    }
    fetchData()
  }, [])

  const handlePriceChange = (e) => {
    setSelectedPrice(e.target.value);
  };

  const handleSearchChange = (e) => {
    const input = e.target.value.trim().toLowerCase()
    setSearchInput(input)
    const filterItems = items.filter(item =>
      item.title.trim().toLowerCase().includes(input))
    setFilterItems(filterItems)
  }

  return (
    <section className={styles.container}>
      <div className={styles.input}>
        <label htmlFor="">Products </label>
        <input type="text" placeholder='Search products, articles, faq, ...' onChange={handleSearchChange} />
        <label htmlFor="">Location</label>
        <input type="text" placeholder='Location' />
        <label htmlFor="">Type</label>
        <input type="text" placeholder='Type of item' />
        <div className={styles.dropdownContainer}>
          <select
            id="price"
            className={styles.dropdown}
            value={selectedPrice}
            onChange={handlePriceChange}
          >
            <option value=""> Price </option>
            <option value="under50">Under $50</option>
            <option value="50to100">$50 - $100</option>
            <option value="100to200">$100 - $200</option>
            <option value="200to500">$200 - $500</option>
            <option value="above500">Above $500</option>
          </select>
        </div>
      </div>

      <div className={styles.grid}>
        {filterItems.map((item) => (
          <Link to={`/item-details/${item.id}`} key={item.id} ><ItemCard item={item} /></Link>
        ))}
      </div>

    </section>
  )
}

export default Explore