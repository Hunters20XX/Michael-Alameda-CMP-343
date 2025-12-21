import './About.css'
import Card from './Card'

function About() {
  return (
    <div className="about">
      <div className="about-hero">
        <h1 className="about-title">About Us</h1>
        <p className="about-subtitle">Learn more about our mission and values</p>
      </div>

      <Card title="Our Mission">
        <p className="about-text">
          We are dedicated to creating innovative solutions that make a difference. 
          Our mission is to build user-friendly applications that enhance productivity 
          and improve the digital experience for everyone.
        </p>
      </Card>

      <Card title="Our Story">
        <p className="about-text">
          Founded with a passion for technology and innovation, we've been at the 
          forefront of web development for years. Our team consists of experienced 
          developers, designers, and strategists who work together to deliver 
          exceptional results.
        </p>
      </Card>

      <Card title="Our Values">
        <ul className="values-list">
          <li className="value-item">
            <strong>Innovation:</strong> We constantly explore new technologies and methodologies
          </li>
          <li className="value-item">
            <strong>Quality:</strong> We maintain the highest standards in everything we do
          </li>
          <li className="value-item">
            <strong>Collaboration:</strong> We believe in the power of teamwork and open communication
          </li>
          <li className="value-item">
            <strong>User-Centric:</strong> Our users are at the heart of every decision we make
          </li>
        </ul>
      </Card>

      <Card title="Our Team">
        <div className="team-grid">
          <div className="team-member">
            <div className="team-avatar">JD</div>
            <h3>John Doe</h3>
            <p>Lead Developer</p>
          </div>
          <div className="team-member">
            <div className="team-avatar">JS</div>
            <h3>Jane Smith</h3>
            <p>UI/UX Designer</p>
          </div>
          <div className="team-member">
            <div className="team-avatar">BJ</div>
            <h3>Bob Johnson</h3>
            <p>Product Manager</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default About

