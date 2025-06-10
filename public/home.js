// src/pages/Home.js
import React from 'react';
import './home.css';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Required carousel CSS

const Home = () => {
  return (
    <div>
      {/* First Split: Text Left, Image Right */}
      <section className="home-section">
        <div className="home-text">
          <h1>Welcome to Powerhouse Ventures Corporation</h1>
          <p>Philippines #1 Ice Tube Machine Supplier!</p>
          <a>
            From tubes to profits, we help your business to stay cool and grow.
          </a>
        </div>
        <div className="home-image">
          <img src="/icebg.jpg" alt="Home Visual" />
        </div>
      </section>

      {/* Second Split: Image Left (Carousel), Text Right */}
      <section className="home-section">
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

        <div className="home-text">
          <h1>Powerhouse Ventures Corporation</h1>
          <a>
            Powerhouse Venture Corporation collaborates with experienced machine professionals and a trusted manufacturer to build highly efficient, high-quality ice machines. By sourcing the best components and assembling them with expert engineering, the company ensures top performance. Powerhouse is also recognized for its lifetime after-sales support, fostering strong, long-term partnerships with its clients.
          </a>
        </div>
      </section>

      {/* 🔽 New Full-Width Banner Section with Header */}
      <section className="partnership-banner">
        <h2>Partnerships with</h2>
        <img src="/banner.png" alt="Partnerships" />
      </section>

            {/* 🔽 Updated Split Section Below Banner with Bullet Points */}
      <section className="home-section">
  <div className="home-text">
    <h1>Why Choose Powerhouse?</h1>
    <ul style={{ fontSize: '1.5rem', lineHeight: '1.5', paddingLeft: '1.5rem' }}>
      <li>Powerhouse has a strong organization</li>
      <li>We offer an Ice Tube Machine with a competitive price</li>
      <li>Powerhouse has in-house engineers and machine experts</li>
      <li>Good credibility</li>
      <li>Top brand machine parts supplier</li>
      <li>Direct contact to the company executive</li>
      <li>Efficient and durable Ice Tube Machine</li>
      <li>Quick in-house technical team response for Machine troubleshooting</li>
      <li>Fast production and delivery</li>
      <li>Ice Tube Machine business one-stop shop</li>
    </ul>
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
      className="custom-carousel"
    >
      <div><img src="/i1.png" alt="Why Choose Us 1" /></div>
      <div><img src="/i2.png" alt="Why Choose Us 2" /></div>
      <div><img src="/i3.png" alt="Why Choose Us 3" /></div>
      <div><img src="/i4.png" alt="Why Choose Us 4" /></div>
    </Carousel>
  </div>
</section>

    <h1 style={{ textAlign: 'center', color: 'white', marginTop: '5rem',marginBottom: '5rem', fontSize: '3rem' }}>
  Testimonial Video
</h1>

<div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 2rem' }}>
  <iframe
    width="1200"
    height="600"
    src="https://www.youtube.com/embed/Zn1xyFZwDJ4"
    title="Testimonial Video"
    frameBorder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
  ></iframe>
</div>




    </div>

    
    
  );
};

export default Home;
