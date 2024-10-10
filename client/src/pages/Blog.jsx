import React, { useEffect, useState } from 'react'
import BlogCard from '../components/BlogCard'
import styles from '../styles/blog.module.css'
import { Link } from 'react-router-dom'
import { IoIosAdd } from "react-icons/io";
import axios from 'axios'
const Blog = () => {

  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios.get('http://localhost:5000/blogs')
          .then((res) => {
            setBlogs(res.data)
          })
      } catch (error) {
        throw error
      }
    }
    fetchData()
  }, [])

  return (
    <section className={styles.container}>
      <h1 className={styles.title}>BLOG POST</h1>
      <p className={styles.titleDesc}>
        <Link to={'/create-post'}>
          <IoIosAdd />Share your blog
        </Link>
      </p>
      <div className={styles.flex}>
        {
          blogs.map((blog, index) => (
            <BlogCard key={index} blog={blog} />
          ))
        }
      </div>
    </section>
  )
}

export default Blog