import React from 'react'
import styles from '../styles/blogCard.module.css'
import { Link } from 'react-router-dom'

const BlogCard = ({ blog }) => {

   const getPathUrl = (imgPath) => {
      return `http://localhost:5000${imgPath}`
   }

   return (
      <div className={styles.card} key={blog.id}>
         {blog.image_path && <img src={getPathUrl(blog.image_path)} alt="blog" />}
         <div className={styles.desc}>
            <p>BY TOMAS PARKER IN RESOURCE</p>
            <h1>{blog.title}</h1>
            <p>{blog.description}</p>
         </div>
         <Link to={`/create-post/${blog.id}`} className={styles.button}>Edit this post</Link>
      </div>
   )
}


export default BlogCard