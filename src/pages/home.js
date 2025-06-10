// src/pages/Home.js
import React from 'react';
import './home.css';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Required carousel CSS


const Home = () => {
  return (
    <div>
      {/* First Split */}
      <section className="home-section">
        <div className="home-text">
          <h1>Welcome to Powerhouse Ventures Corporation</h1>
          <p>Philippines #1 Ice Tube Machine Supplier!</p>
        </div>
        <div className="home-image">
          <img src="/1.png" alt="Home Visual" />
        </div>
      </section>

      {/* Second Split */}
      <section className="home-section reverse">
        <div className="home-image">
          <div className="home-image carousel-container">
          <Carousel
            autoPlay
            infiniteLoop
            showThumbs={false}
            showStatus={false}
            interval={3000}
            transitionTime={600}
            showArrows={false}
            emulateTouch={false}
            className="custom-carousel"
          >
            <div>
              <img src="/1.png" alt="Slide 1" />
            </div>
            <div>
              <img src="/2.png" alt="Slide 2" />
            </div>
            <div>
              <img src="/3.png" alt="Slide 3" />
            </div>
            <div>
              <img src="/4.png" alt="Slide 3" />
            </div>
          </Carousel>
        </div>
        </div>
        <div className="home-text">
          <h1>Powerhouse Ventures Corporation</h1>
          <p>Powerhouse Venture Corporation collaborates with experienced machine professionals and a trusted manufacturer to build highly efficient, high-quality ice machines. By sourcing the best components and assembling them with expert engineering, the company ensures top performance. Powerhouse is also recognized for its lifetime after-sales support, fostering strong, long-term partnerships with its clients.</p>
        </div>
      </section>

         {/* 🔽 Updated Split Section Below Banner with Bullet Points */}
      <section className="home-section">
  <div className="home-text">
    <h1>Why Choose Powerhouse?</h1>
    <p>
        Powerhouse is a strong and credible organization offering efficient and durable Ice Tube Machines at competitive prices. With in-house engineers and machine experts, we ensure fast troubleshooting and technical support. As a top-brand machine parts supplier, we provide quick production and delivery, direct access to company executives, and a complete one-stop-shop solution for the Ice Tube Machine business.
    </p>
    
  </div>

  <div className="home-image carousel-container">
    <Carousel
      autoPlay
      infiniteLoop
      showThumbs={false}
      showStatus={false}
      showArrows={false}
      showIndicators={false}
      interval={3500}
      transitionTime={600}
      className="custom-carousel1"
    >
      <div><img src="/i1.png" alt="Why Choose Us 1" /></div>
      <div><img src="/i2.png" alt="Why Choose Us 2" /></div>
      <div><img src="/i3.png" alt="Why Choose Us 3" /></div>
      <div><img src="/i4.png" alt="Why Choose Us 4" /></div>
    </Carousel>
  </div>
</section>

{/* Centered Statement + YouTube Video */}
<section className="home-video-section">
  <div className="video-text">
    <h2>Discover How Our Ice Tube Machines Work</h2>
    <p>Watch our demo video to learn more about the efficiency, reliability, and quality of Powerhouse Ice Tube Machines.</p>
  </div>
  <div className="video-container">
    <iframe 
      width="100%" 
      height="500" 
      src="https://www.youtube.com/embed/Zn1xyFZwDJ4" 
      title="Powerhouse Ice Tube Machine Demo" 
      frameBorder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowFullScreen
    ></iframe>
  </div>
</section>

{/* Footer Section */}
<footer className="home-footer">
  <div className="footer-content">
    <div className="footer-column">
      <h3>Contact Us</h3>
      <p>Powerhouse Ventures Corporation</p>
      <p>123 Ice Plant Road, Manila, Philippines</p>
      <p>Email: info@powerhouse.com</p>
      <p>Phone: +63 912 345 6789</p>
    </div>
    <div className="footer-column">
      <h3>Follow Us</h3>
      <p>
        <a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a><br />
        <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a><br />
        <a href="https://youtube.com" target="_blank" rel="noreferrer">YouTube</a>
      </p>
    </div>
    <div className="footer-column">
      <h3>More Info</h3>
      <p>Business Hours: Mon–Sat, 9:00 AM – 6:00 PM</p>
      <p>Support: 24/7 Technical Support Available</p>
    </div>
  </div>
  <div className="footer-bottom">
    <p>&copy; {new Date().getFullYear()} Powerhouse Ventures Corporation. All rights reserved.</p>
  </div>
</footer>


    

      


    </div>
  );
};

export default Home;
