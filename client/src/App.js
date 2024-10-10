import React from 'react'
import {
  Routes,
  Route
} from "react-router-dom";
import Home from './pages/Home';
import Blog from './pages/Blog';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CreatePost from './pages/CreatePost';
import "./App.css"
import AboutUs from './pages/AboutUs';
import Cart from './pages/Cart';
import User from './pages/User';
import Explore from './pages/Explore';
import ItemDetails from './pages/ItemDetails';
import UserItem from './pages/UserItem';
import Order from './pages/Order';

const App = () => {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/explore' element={<Explore />} />
          <Route path='/item-details/:id' element={<ItemDetails />} />
          <Route path='/blog' element={<Blog />} />
          <Route path='/create-post' element={<CreatePost />} />
          <Route path='/create-post/:id' element={<CreatePost />} />
          <Route path='/about-us' element={<AboutUs />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order/:id' element={<Order />} />
          <Route path='/user' element={<User />} />
          <Route path='/user-item' element={<UserItem />} />
          <Route path='/user-item/:id' element={<UserItem />} />
        </Routes>
      </div>
      <Footer />
    </>
  )
}

export default App