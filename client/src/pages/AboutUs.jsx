import React from "react";
import Coupon from "../components/Coupon";
import styles from "../styles/aboutUs.module.css";
import eco from "../assets/eco.jpg";
import Map from "../components/Map";
import { FaLocationDot } from "react-icons/fa6";
import partner from '../assets/sponser.png'
const AboutUs = () => {
  return (
    <section>
      <div className={styles.hero}>
        <div className={styles.title}>
          <p>EMPOWERING ENVIRONMENTAL CONSERVATION</p>
          <h1 className={styles.subtitle}>
            Join Us in <span className={styles.greenText}>PROTECTING</span>{" "}
            <br /> Our Planet
          </h1>
          <p>
            Join Us in Protecting Our Planet, Preserving Nature, and Creating a
            Sustainable Future for Generations to Come
          </p>
        </div>

        <img src={eco} alt="ecoExchange" />
      </div>

      <div className={styles.coupon}>
        <Coupon />
        <Coupon />
        <Coupon />
        <Coupon />
        <Coupon />
      </div>
      <div className={styles.slogan}>
        <div className={styles.sloganTitle}>WE ARE PROUD OF</div>
        <div className={styles.sloganText}>
          Our partnerships with leading brands in the food packaging industry
        </div>
      </div>

      <div className={styles.partner}>
        <img src={partner} alt="partner" />
      </div>

      <div className={styles.map}>
        <Map />
        <div className={styles.desc}>
          <h1>Join Our Recycling Efforts</h1>
          <p>Help Us Make a Difference: Send Your Recyclable Items Today!</p>
          <p>
            We are committed to creating a sustainable future by reducing waste
            and promoting recycling. Your participation is crucial to our
            mission. By sending us your recyclable items, you contribute to a
            cleaner environment and help conserve natural resources. Together,
            we can make a significant impact on our planet's health.
          </p>
          <div className={styles.location}>
            <h1>We are here!</h1>
            <p className={styles.place}><FaLocationDot /> 22 Phahon Yothin 48 Alley, Lane 60</p>
            <p>Khwaeng Tha Raeng, Khet Bang Khen, Krung Thep Maha Nakhon 10220</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
