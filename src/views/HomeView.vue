<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <main>
    <div class="home-container">
      <div class="hero-section">
        <h1>MIT DormCraft</h1>
        <p class="tagline">Transform your MIT living experience</p>
      </div>
      
      <div class="content-section">
        <div class="description-card">
          <h2>Welcome to MIT DormCraft</h2>
          <p>
            At the Massachusetts Institute of Technology, your dorm room is more than just a place to sleep – 
            it's your home away from home, your study sanctuary, and your personal space in the heart of Cambridge. 
            MIT DormCraft is designed specifically for MIT students to share, discover, and create inspiring dorm room designs.
          </p>
          
          <h3>Why MIT DormCraft?</h3>
          <div class="features-grid">
            <div class="feature">
              <div class="feature-icon">🏠</div>
              <h4>MIT-Specific Designs</h4>
              <p>Browse layouts for every MIT dorm – from the modern Simmons Hall to the historic Senior House. Every dorm has unique room configurations, and we've got them all covered.</p>
            </div>
            
            <div class="feature">
              <div class="feature-icon">📏</div>
              <h4>Accurate Measurements</h4>
              <p>Real dimensions for singles, doubles, triples, and quads. No more guessing – see exactly how furniture fits in your actual MIT dorm room.</p>
            </div>
            
            <div class="feature">
              <div class="feature-icon">💡</div>
              <h4>Design Inspiration</h4>
              <p>Get inspired by how other MIT students optimize their space. From lofting hacks to storage solutions, discover creative ideas from your peers.</p>
            </div>
            
            <div class="feature">
              <div class="feature-icon">🎓</div>
              <h4>MIT Community</h4>
              <p>Connect with fellow MIT students. Share your room setup, get feedback, and help incoming students prepare for their first year at MIT.</p>
            </div>
            
            <div class="feature">
              <div class="feature-icon">✨</div>
              <h4>Easy to Use</h4>
              <p>Our intuitive platform makes it simple to browse, search, and share dorm room designs. Filter by dorm, room size, or style to find exactly what you're looking for.</p>
            </div>
            
            <div class="feature">
              <div class="feature-icon">🌟</div>
              <h4>Real Student Reviews</h4>
              <p>See honest feedback from actual MIT students about different room setups and decorations. Learn what works and what doesn't from those who've tried it.</p>
            </div>
          </div>
          
          <div class="cta-section">
            <h3>Ready to transform your dorm room?</h3>
            <p>Join the MIT DormCraft community and start exploring dorm layouts and designs today.</p>
            <div class="cta-buttons">
              <RouterLink to="/register" class="cta-button primary">Get Started</RouterLink>
              <RouterLink to="/dorms" class="cta-button secondary">Explore Dorms</RouterLink>
            </div>
          </div>
        </div>
      </div>
      
      <div class="about-mit-section">
        <h3>About MIT Dorm Life</h3>
        <p>
          MIT is home to a diverse residential community across numerous dorms, each with its own character and amenities. 
          Whether you're in an East Campus suite, a West Campus hall, or one of MIT's independent living groups, 
          your room configuration can make all the difference in your daily life. At MIT DormCraft, we understand the importance 
          of making the most of your space while balancing academics, social life, and personal well-being.
        </p>
      </div>
    </div>
  </main>
</template>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.hero-section {
  text-align: center;
  margin-bottom: 60px;
}

h1 {
  color: white;
  margin-bottom: 10px;
  font-size: 48px;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.tagline {
  color: white;
  font-size: 22px;
  font-weight: 400;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.content-section {
  margin-bottom: 50px;
}

.description-card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.description-card h2 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 32px;
  font-weight: 600;
}

.description-card h3 {
  color: #2c3e50;
  margin-top: 35px;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: 600;
}

.description-card p {
  color: #495057;
  font-size: 16px;
  line-height: 1.8;
  margin-bottom: 20px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-top: 30px;
  margin-bottom: 30px;
}

.feature {
  text-align: center;
  padding: 25px;
  background: #f8f9fa;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.feature:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.feature h4 {
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 18px;
  font-weight: 600;
}

.feature p {
  color: #6c757d;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 0;
}

.cta-section {
  background: linear-gradient(135deg, #0a1a2e 0%, #162447 50%, #1f4068 100%);
  padding: 40px;
  border-radius: 12px;
  text-align: center;
  color: white;
  margin-top: 40px;
  box-shadow: 0 4px 20px rgba(29, 178, 235, 0.3);
  border: 2px solid rgba(29, 178, 235, 0.3);
}

.cta-section h3 {
  color: white;
  margin-top: 0;
  margin-bottom: 15px;
}

.cta-section p {
  color: rgba(255, 255, 255, 0.95);
  font-size: 18px;
  margin-bottom: 25px;
}

.cta-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-button {
  padding: 14px 32px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-block;
}

.cta-button.primary {
  background: linear-gradient(135deg, #1db2eb, #00d4ff);
  color: white;
}

.cta-button.primary:hover {
  background: linear-gradient(135deg, #00d4ff, #1db2eb);
  transform: translateY(-2px);
  box-shadow: 0 0 25px rgba(29, 178, 235, 0.6), 0 0 50px rgba(0, 212, 255, 0.4);
}

.cta-button.secondary {
  background: rgba(29, 178, 235, 0.2);
  color: white;
  border: 2px solid rgba(29, 178, 235, 0.5);
}

.cta-button.secondary:hover {
  background: rgba(29, 178, 235, 0.3);
  border-color: rgba(29, 178, 235, 0.7);
  transform: translateY(-2px);
  box-shadow: 0 0 15px rgba(29, 178, 235, 0.4);
}

.about-mit-section {
  background: rgba(255, 255, 255, 0.15);
  padding: 30px;
  border-radius: 12px;
  border-left: 4px solid #1db2eb;
  backdrop-filter: blur(10px);
}

.about-mit-section h3 {
  color: white;
  margin-bottom: 15px;
  font-size: 22px;
  font-weight: 600;
}

.about-mit-section p {
  color: rgba(255, 255, 255, 0.95);
  font-size: 15px;
  line-height: 1.8;
  margin-bottom: 0;
}

/* Responsive design */
@media (max-width: 768px) {
  .home-container {
    padding: 20px 15px;
  }
  
  h1 {
    font-size: 36px;
  }
  
  .tagline {
    font-size: 18px;
  }
  
  .description-card {
    padding: 25px;
  }
  
  .description-card h2 {
    font-size: 26px;
  }
  
  .description-card h3 {
    font-size: 20px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .cta-section {
    padding: 30px 20px;
  }
  
  .cta-buttons {
    flex-direction: column;
  }
  
  .cta-button {
    width: 100%;
  }
}
</style>
