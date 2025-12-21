import './Services.css'
import Card from './Card'
import Button from './Button'

function Services() {
  const services = [
    {
      title: 'Web Development',
      description: 'Custom web applications built with modern technologies like React, Node.js, and more.',
      icon: '🌐',
      features: ['Responsive Design', 'Modern Frameworks', 'SEO Optimized']
    },
    {
      title: 'UI/UX Design',
      description: 'Beautiful and intuitive user interfaces designed with user experience in mind.',
      icon: '🎨',
      features: ['User Research', 'Prototyping', 'Design Systems']
    },
    {
      title: 'Mobile Development',
      description: 'Native and cross-platform mobile applications for iOS and Android.',
      icon: '📱',
      features: ['iOS Development', 'Android Development', 'Cross-Platform']
    },
    {
      title: 'Consulting',
      description: 'Expert advice on technology strategy, architecture, and best practices.',
      icon: '💼',
      features: ['Technical Consulting', 'Code Reviews', 'Architecture Planning']
    },
    {
      title: 'Maintenance & Support',
      description: 'Ongoing maintenance, updates, and support for your applications.',
      icon: '🔧',
      features: ['Bug Fixes', 'Updates', '24/7 Support']
    },
    {
      title: 'Cloud Solutions',
      description: 'Scalable cloud infrastructure and deployment solutions.',
      icon: '☁️',
      features: ['AWS/Azure/GCP', 'DevOps', 'Scalability']
    }
  ]

  return (
    <div className="services">
      <div className="services-hero">
        <h1 className="services-title">Our Services</h1>
        <p className="services-subtitle">Comprehensive solutions for all your digital needs</p>
      </div>

      <div className="services-grid">
        {services.map((service, index) => (
          <Card key={index} title={service.title}>
            <div className="service-icon">{service.icon}</div>
            <p className="service-description">{service.description}</p>
            <ul className="service-features">
              {service.features.map((feature, idx) => (
                <li key={idx} className="service-feature">✓ {feature}</li>
              ))}
            </ul>
            <Button variant="primary" style={{ width: '100%', marginTop: '1rem' }}>
              Learn More
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Services

