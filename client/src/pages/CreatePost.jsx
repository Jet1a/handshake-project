import React, { useEffect, useState } from 'react'
import styles from '../styles/createpost.module.css'
import axios from 'axios'
import { Link, useNavigate, useParams } from 'react-router-dom'

const CreatePost = () => {

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const navigate = useNavigate();
  const { id } = useParams()

  useEffect(() => {
    if (id) {
      fetchBlogData(id)
    }
  }, [id])

  const fetchBlogData = async (postId) => {
    try {
      const res = await axios.get(`http://localhost:5000/blogs/${postId}`)
      const { title, image_path, description } = res.data

      setTitle(title)
      setImage(image_path)
      if (image_path) {
        setImagePreview(`http://localhost:5000${image_path}`)
      }
      setDescription(description)
    } catch (error) {
      console.error('Error fetching post data: ', error)
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('image', image);


      const url = id ? `http://localhost:5000/create-post/${id}` : 'http://localhost:5000/create-post';
      const method = id ? 'put' : 'post';


      const res = await axios[method](url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log(res.data);

      setTitle('');
      setDescription('');
      setImage(null);
      setImagePreview(null)
      navigate('/blog')
    } catch (error) {
      console.error('Error uploading file: ', error);
    }
  };

  const deleteBlog = async () => {
    try {
      const res = await axios.delete(`http://localhost:5000/delete/${id}`)
      navigate('/blog')
    } catch (error) {
      console.error('Error deleting blog: ', error);
    }
  }

  return (
    <section className={styles.container}>
      <h1 className={styles.title}>Share Your Blog</h1>
      <form onSubmit={handleSubmit} className={styles.form} encType='multipart/form-data' >
        <label>Title</label> <br />
        <input type="text" value={title} placeholder='blog title' onChange={handleTitleChange} name='title' /> <br />
        <label>Images</label> <br />
        <input type="file" name='image' onChange={handleImageChange} /><br />
        {imagePreview && <img src={imagePreview} alt='selected' className={styles.imagePreview} style={{ display: 'block' }} />}
        <label>Description</label> <br />
        <textarea value={description} onChange={handleDescriptionChange} name='description' className={styles.fixedarea} placeholder='what would you like to share' />
        <div className={styles.button}>
          <Link to="/blog"><button type='button' className={styles.cancelBtn}>Cancel</button></Link>
          {id && (
            <button onClick={deleteBlog} className={styles.deleteBtn}>Delete</button>
          )}
          <input type="submit" value={id ? 'Update' : 'Post'} className={styles.btn} />
        </div>
      </form>
    </section>
  )
}

export default CreatePost