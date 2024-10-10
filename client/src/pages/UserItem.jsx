import React, { useEffect, useState } from 'react'
import styles from '../styles/userItem.module.css'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

const UserItem = () => {

   const [title, setTitle] = useState('')
   const [description, setDescription] = useState('')
   const [image, setImage] = useState(null)
   const [imagePreview, setImagePreview] = useState(null)
   const [owner, setOwner] = useState('')
   const [postType, setPostType] = useState('person')
   const [location, setLocation] = useState('')

   const navigate = useNavigate();
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

         if (image) {
            setImagePreview(`http://localhost:5000${image}`)
         }
         setPostType(post_type)
      } catch (error) {
         console.error('Error fetching item data: ', error)
      }
   }

   const handleTitleChange = (e) => {
      setTitle(e.target.value)
   }

   const handleDescriptionChange = (e) => {
      setDescription(e.target.value)
   }

   const handleImageChange = (e) => {
      const file = e.target.files[0]
      setImage(file)

      if (file) {
         const reader = new FileReader();
         reader.onload = (event) => {
            setImagePreview(event.target.result)
         }
         reader.readAsDataURL(file)
      }
   }

   const handleOwnerChange = (e) => {
      setOwner(e.target.value)
   }

   const handlePostTypeChange = (e) => {
      setPostType(e.target.value)
   }

   const handleLocationChange = (e) => {
      setLocation(e.target.value)
   }

   const handleSubmit = async (e) => {
      e.preventDefault()

      try {
         const formData = new FormData()
         formData.append('title', title)
         formData.append('description', description)
         formData.append('owner', owner.trim().toLowerCase())
         formData.append('postType', postType)
         formData.append('image', image)
         formData.append('location', location)

         const url = id ? `http://localhost:5000/edit-item/${id}` : 'http://localhost:5000/add-item';
         const method = id ? 'put' : 'post';

         const res = await axios[method](url, formData, {
            headers: {
               'Content-Type': 'multipart/form-data'
            }
         })

         setTitle('');
         setDescription('');
         setImage(null);
         setImagePreview(null)
         setLocation('')
         setPostType('person')
         setOwner('')
         navigate('/user')

      } catch (error) {
         console.error('Error adding item: ', error)
      }
   }

   return (
      <section className={styles.container}>
         <h1 className={styles.title}>Add Your Item</h1>
         <form onSubmit={handleSubmit} className={styles.form} encType='multipart/form-data' >
            <div className={styles.image}>
               <label>Images</label>
               <input type="file" name='image' onChange={handleImageChange} />
               {imagePreview && <img src={imagePreview} alt='selected' className={styles.imagePreview} style={{ display: 'block' }} />}
            </div>

            <div className={styles.information}>
               <label htmlFor="">Title</label><br />
               <input type="text" placeholder='blog title' name='title' value={title} onChange={handleTitleChange} /> <br />
               <label htmlFor="">Location</label><br />
               <input type="text" placeholder='Foster VIC 3960, Australia' value={location} name='location' onChange={handleLocationChange} /> <br />
               <label htmlFor="">Delivery Preferences</label>
               <div className={styles.radioContainer}>
                  <div className={styles.radioBox}>
                     <div className={styles.radioInput}>
                        <input type="radio" id="person" name="postType" value="person" checked={postType === 'person'} onChange={handlePostTypeChange} />
                        <label htmlFor="person" className={styles.radioLabel}>Person to person</label>
                     </div>
                     <div className={styles.radioDescription}>
                        You take care of the exchange.
                     </div>
                  </div>

                  <div className={styles.radioBox}>
                     <div className={styles.radioInput}>
                        <input type="radio" id="delivery" name="postType" value="delivery" checked={postType === 'delivery'} onChange={handlePostTypeChange} />
                        <label htmlFor="delivery" className={styles.radioLabel}>Delivery with Us</label>
                     </div>
                     <div className={styles.radioDescription}>
                        We pick up your item, deliver it, and bring you back your swap for a fee.
                     </div>
                  </div>
               </div>
               <label>Description</label> <br />
               <textarea name='description' className={styles.fixedarea} value={description} placeholder='what would you like to share' onChange={handleDescriptionChange} /> <br />
               <label htmlFor="">Owner name</label><br />
               {id ? (
                  <input type="text" placeholder='Owner name' name='owner' value={owner} onChange={handleOwnerChange} disabled />
               ) : (
                  <input type="text" placeholder='Owner name' name='owner' value={owner} onChange={handleOwnerChange} />
               )}
               <div className={styles.button}>
                  <Link to="/user"><button type='button' className={styles.cancelBtn}>Cancel</button></Link>
                  <input type="submit" value={id ? `Update` : `Add`} className={styles.btn} />
               </div>
            </div>
         </form>
      </section>
   )
}

export default UserItem