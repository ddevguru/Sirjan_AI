"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, Box, Sphere } from "@react-three/drei"
import { useNavigate } from "react-router-dom"
import "./LandingPage.css"

// Enhanced 3D Animation
function FloatingElements() {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.5
    }
  })

  return (
    <group ref={groupRef}>
      {Array.from({ length: 15 }).map((_, i) => (
        <Float key={i} speed={1 + i * 0.1} rotationIntensity={0.5} floatIntensity={2}>
          {i % 3 === 0 ? (
            <Box position={[(i - 7) * 2, Math.sin(i) * 4, (i % 4) * 2]} scale={[0.3, 0.3, 0.3]}>
              <meshStandardMaterial color={i % 2 === 0 ? "#561C24" : "#6D2932"} transparent opacity={0.9} />
            </Box>
          ) : (
            <Sphere position={[(i - 7) * 2, Math.cos(i) * 4, (i % 4) * 2]} scale={[0.2, 0.2, 0.2]}>
              <meshStandardMaterial color="#C7B7A3" transparent opacity={0.8} />
            </Sphere>
          )}
        </Float>
      ))}
    </group>
  )
}

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [email, setEmail] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const features = [
    {
      icon: "🎨",
      title: "Visual Builder",
      description: "Create stunning websites with our intuitive drag-and-drop interface. No coding knowledge required.",
      color: "maroon",
    },
    {
      icon: "📱",
      title: "Responsive Design",
      description: "Your websites automatically adapt to all devices - desktop, tablet, and mobile perfectly.",
      color: "cherry",
    },
    {
      icon: "⚡",
      title: "Lightning Fast",
      description:
        "Deploy your websites instantly with our optimized hosting. Lightning-fast loading speeds guaranteed.",
      color: "taupe",
    },
    {
      icon: "🔒",
      title: "Secure Hosting",
      description: "Enterprise-grade security with SSL certificates, DDoS protection, and automated backups.",
      color: "maroon",
    },
    {
      icon: "📊",
      title: "Analytics Dashboard",
      description: "Track your website performance with detailed analytics and insights in real-time.",
      color: "cherry",
    },
    {
      icon: "🎯",
      title: "SEO Optimized",
      description: "Built-in SEO tools to help your website rank higher in search engines automatically.",
      color: "taupe",
    },
  ]

  const pricingPlans = [
    {
      name: "Starter",
      price: "$0",
      period: "forever",
      features: ["3 Projects", "Basic Templates", "Community Support", "Custom Domain", "5GB Storage"],
      cta: "Start Free",
      popular: false,
      color: "maroon",
    },
    {
      name: "Professional",
      price: "$29",
      period: "per month",
      features: [
        "Unlimited Projects",
        "Premium Templates",
        "Advanced Components",
        "Priority Support",
        "Custom Branding",
        "Analytics Dashboard",
        "100GB Storage",
        "Advanced SEO Tools",
      ],
      cta: "Go Professional",
      popular: true,
      color: "cherry",
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "per month",
      features: [
        "Everything in Pro",
        "White-label Solution",
        "API Access",
        "Custom Integrations",
        "Dedicated Support",
        "Unlimited Storage",
        "Advanced Security",
        "Team Collaboration",
      ],
      cta: "Contact Sales",
      popular: false,
      color: "taupe",
    },
  ]

  const testimonials = [
    {
      name: "Alex Rivera",
      role: "Startup Founder",
      company: "TechFlow Inc.",
      content:
        "Built our entire company website in 2 hours. The visual builder is incredibly intuitive and powerful. Our conversion rate increased by 300%!",
      avatar: "👨‍💼",
      rating: 5,
    },
    {
      name: "Sarah Kim",
      role: "Designer",
      company: "Creative Studio",
      content:
        "Finally, a tool that lets me focus on design instead of code. My clients love the results and I can deliver projects 5x faster!",
      avatar: "👩‍🎨",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Marketing Director",
      company: "Growth Labs",
      content:
        "The analytics and SEO features are game-changing. We've seen a 250% increase in organic traffic since switching to Sirjan Ai.",
      avatar: "👨‍💻",
      rating: 5,
    },
    {
      name: "Emily Johnson",
      role: "E-commerce Owner",
      company: "Fashion Forward",
      content:
        "The e-commerce templates are stunning and the checkout process is seamless. Our sales have doubled in just 3 months!",
      avatar: "👩‍💼",
      rating: 5,
    },
  ]

  const teamMembers = [
    {
      name: "David Park",
      role: "CEO & Founder",
      avatar: "👨‍💼",
      bio: "Former Google engineer with 10+ years in web development",
    },
    {
      name: "Lisa Wang",
      role: "Head of Design",
      avatar: "👩‍🎨",
      bio: "Award-winning designer from Apple and Airbnb",
    },
    {
      name: "James Miller",
      role: "CTO",
      avatar: "👨‍💻",
      bio: "Full-stack architect who built systems for millions of users",
    },
    {
      name: "Anna Rodriguez",
      role: "Head of Marketing",
      avatar: "👩‍💼",
      bio: "Growth expert who scaled multiple startups to $100M+",
    },
  ]

  const faqs = [
    {
      question: "How easy is it to get started?",
      answer:
        "You can create your first website in under 5 minutes! Simply choose a template, customize it with our drag-and-drop builder, and publish instantly.",
    },
    {
      question: "Do I need any coding knowledge?",
      answer:
        "Not at all! Sirjan Ai is designed for everyone. Our visual builder lets you create professional websites without writing a single line of code.",
    },
    {
      question: "Can I use my own domain?",
      answer:
        "Yes! You can connect your existing domain or purchase a new one directly through our platform. SSL certificates are included for free.",
    },
    {
      question: "What kind of support do you offer?",
      answer:
        "We offer 24/7 chat support, extensive documentation, video tutorials, and a community forum. Pro users get priority support with faster response times.",
    },
    {
      question: "Can I export my website?",
      answer:
        "Yes! You can export your website code at any time. We believe in giving you full control over your content and designs.",
    },
    {
      question: "Is there a money-back guarantee?",
      answer:
        "We offer a 30-day money-back guarantee on all paid plans. If you're not satisfied, we'll refund your payment in full.",
    },
  ]

  const stats = [
    { number: "500K+", label: "Websites Created", icon: "🌐" },
    { number: "150+", label: "Countries", icon: "🌍" },
    { number: "99.9%", label: "Uptime", icon: "⚡" },
    { number: "24/7", label: "Support", icon: "🛟" },
  ]

  const blogPosts = [
    {
      title: "10 Web Design Trends That Will Dominate 2025",
      excerpt: "Discover the latest design trends that will shape the future of web development and user experience.",
      author: "Sarah Kim",
      date: "Dec 15, 2024",
      readTime: "5 min read",
      image: "🎨",
    },
    {
      title: "How to Optimize Your Website for Mobile Users",
      excerpt: "Learn essential techniques to create mobile-first designs that convert visitors into customers.",
      author: "Michael Chen",
      date: "Dec 12, 2024",
      readTime: "7 min read",
      image: "📱",
    },
    {
      title: "The Complete Guide to Website SEO in 2025",
      excerpt: "Master the art of search engine optimization with our comprehensive guide to ranking higher.",
      author: "Emily Johnson",
      date: "Dec 10, 2024",
      readTime: "10 min read",
      image: "🔍",
    },
  ]

  const partners = [
    { name: "Google", logo: "🔍" },
    { name: "Microsoft", logo: "🪟" },
    { name: "Amazon", logo: "📦" },
    { name: "Shopify", logo: "🛒" },
    { name: "Stripe", logo: "💳" },
    { name: "Cloudflare", logo: "☁️" },
  ]

  const navItems = ["Features", "Pricing", "About", "Blog", "Contact"]

  const handleStartFree = () => {
    navigate("/register")
  }

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    // Handle newsletter signup
    console.log("Newsletter signup:", email)
    setEmail("")
  }

  return (
    <div className="landing-page">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="gradient-waves"></div>
        <div className="floating-shapes"></div>
        <div className="color-bubbles"></div>
      </div>

      {/* 3D Scene */}
      <div className="scene-3d">
        <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
          <ambientLight intensity={0.8} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#561C24" />
          <pointLight position={[-10, -10, -10]} intensity={0.8} color="#6D2932" />
          <pointLight position={[0, 10, -10]} intensity={0.6} color="#C7B7A3" />
          <Suspense fallback={null}>
            <FloatingElements />
          </Suspense>
        </Canvas>
      </div>

      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <div className="logo-icon">🚀</div>
            <span className="logo-text">Sirjan Ai</span>
          </div>

          <div className="nav-menu desktop-menu">
            {navItems.map((item, index) => (
              <a key={index} href={`#${item.toLowerCase()}`} className="nav-link">
                {item}
              </a>
            ))}
            <button className="nav-cta-btn" onClick={handleStartFree}>
              <span>Start Building</span>
            </button>
          </div>

          <div className="mobile-menu-toggle">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <span>✖</span> : <span>☰</span>}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="mobile-menu">
            {navItems.map((item, index) => (
              <a key={index} href={`#${item.toLowerCase()}`} className="mobile-nav-link">
                {item}
              </a>
            ))}
            <button className="mobile-cta-btn" onClick={handleStartFree}>
              Start Building
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          {/* Demo Container - Now on LEFT */}
          <div className={`hero-demo ${isVisible ? "visible" : ""}`}>
            <div className="demo-container">
              <div className="demo-header">
                <div className="demo-controls">
                  <div className="control-dot red"></div>
                  <div className="control-dot yellow"></div>
                  <div className="control-dot green"></div>
                </div>
                <div className="demo-title">Sirjan Ai Studio</div>
                <div className="demo-status">
                  <div className="status-dot"></div>
                  <span>Live</span>
                </div>
              </div>

              <div className="demo-tabs">
                {["Design", "Preview", "Deploy"].map((tab, index) => (
                  <button
                    key={index}
                    className={`demo-tab ${activeTab === index ? "active" : ""}`}
                    onClick={() => setActiveTab(index)}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="demo-content">
                <div className="building-animation">
                  <div className="component-block block-1">
                    <span className="block-icon">📄</span>
                    <span>Header</span>
                  </div>
                  <div className="component-block block-2">
                    <span className="block-icon">🧭</span>
                    <span>Navigation</span>
                  </div>
                  <div className="component-block block-3">
                    <span className="block-icon">📝</span>
                    <span>Content</span>
                  </div>
                  <div className="component-block block-4">
                    <span className="block-icon">📞</span>
                    <span>Footer</span>
                  </div>
                  <div className="magic-wand">✨</div>
                </div>

                <div className="demo-progress">
                  <div className="progress-bar">
                    <div className="progress-fill"></div>
                  </div>
                  <span className="progress-text">Building your masterpiece...</span>
                </div>
              </div>
            </div>
          </div>

          {/* Text Content - Now on RIGHT */}
          <div className={`hero-text ${isVisible ? "visible" : ""}`}>
            <div className="hero-badge">
              <span className="badge-icon">✨</span>
              <span>New: AI-Powered Design Assistant</span>
            </div>
            <h1 className="hero-title">
              Build Stunning
              <br />
              <span className="gradient-text">Websites & Apps</span>
              <br />
              <span className="highlight-text">In Minutes, Not Months</span>
            </h1>
            <p className="hero-subtitle">
              Create professional websites and mobile applications with our revolutionary visual builder. Design,
              customize, and deploy - all without writing a single line of code. Join 500,000+ creators worldwide!
            </p>

            <div className="hero-buttons">
              <button className="cta-button primary" onClick={handleStartFree}>
                <span className="btn-icon">🚀</span>
                <span>Start Building Free</span>
                <span className="btn-arrow">→</span>
              </button>
              <button className="cta-button secondary">
                <span className="btn-icon">▶️</span>
                <span>Watch Demo</span>
              </button>
            </div>

            <div className="hero-stats">
              {stats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="partners">
        <div className="container">
          <p className="partners-title">Trusted by industry leaders</p>
          <div className="partners-grid">
            {partners.map((partner, index) => (
              <div key={index} className="partner-item">
                <span className="partner-logo">{partner.logo}</span>
                <span className="partner-name">{partner.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <span>🎯</span>
              <span>Features</span>
            </div>
            <h2 className="section-title">Everything You Need to Succeed</h2>
            <p className="section-subtitle">
              Powerful tools and features designed to make website creation effortless, enjoyable, and incredibly
              effective
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className={`feature-card ${feature.color}`}>
                <div className="feature-icon">
                  <span>{feature.icon}</span>
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <div className="feature-link">
                  <span>Learn more</span>
                  <span className="link-arrow">→</span>
                </div>
              </div>
            ))}
          </div>

          <div className="process-section">
            <h3 className="process-title">How It Works - Simple as 1, 2, 3</h3>
            <div className="process-steps">
              <div className="step">
                <div className="step-number maroon">01</div>
                <div className="step-content">
                  <h4>Choose & Customize</h4>
                  <p>Select from 500+ professional templates and customize every detail to match your brand</p>
                </div>
                <div className="step-visual">🎨</div>
              </div>
              <div className="step-connector"></div>
              <div className="step">
                <div className="step-number cherry">02</div>
                <div className="step-content">
                  <h4>Design & Build</h4>
                  <p>Use our intuitive drag-and-drop builder to create stunning layouts without any coding</p>
                </div>
                <div className="step-visual">🔧</div>
              </div>
              <div className="step-connector"></div>
              <div className="step">
                <div className="step-number taupe">03</div>
                <div className="step-content">
                  <h4>Launch & Grow</h4>
                  <p>Publish your website instantly and watch your business grow with built-in analytics</p>
                </div>
                <div className="step-visual">🚀</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <span>💰</span>
              <span>Pricing</span>
            </div>
            <h2 className="section-title">Simple, Transparent Pricing</h2>
            <p className="section-subtitle">
              Choose the perfect plan for your needs. Start free, upgrade anytime. No hidden fees, no surprises.
            </p>
          </div>

          <div className="pricing-grid">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`pricing-card ${plan.color} ${plan.popular ? "popular" : ""}`}>
                {plan.popular && (
                  <div className="popular-badge">
                    <span className="badge-icon">⭐</span>
                    <span>Most Popular</span>
                  </div>
                )}

                <div className="plan-header">
                  <h3 className="plan-name">{plan.name}</h3>
                  <div className="plan-price">
                    <span className="price">{plan.price}</span>
                    <span className="period">/{plan.period}</span>
                  </div>
                  <p className="plan-description">Perfect for {plan.name.toLowerCase()} users</p>
                </div>

                <ul className="plan-features">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="plan-feature">
                      <span className="check-icon">✅</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className="plan-cta" onClick={handleStartFree}>
                  <span>{plan.cta}</span>
                  <span className="cta-arrow">→</span>
                </button>
              </div>
            ))}
          </div>

          <div className="pricing-guarantee">
            <div className="guarantee-icon">🛡️</div>
            <div className="guarantee-content">
              <h4>30-Day Money-Back Guarantee</h4>
              <p>Try Sirjan Ai risk-free. If you're not completely satisfied, we'll refund your money in full.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <span>💬</span>
              <span>Testimonials</span>
            </div>
            <h2 className="section-title">Loved by Creators Worldwide</h2>
            <p className="section-subtitle">
              Join thousands of satisfied customers who've transformed their ideas into stunning websites
            </p>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-header">
                  <div className="testimonial-rating">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="star">
                        ⭐
                      </span>
                    ))}
                  </div>
                  <div className="testimonial-quote">"</div>
                </div>
                <div className="testimonial-content">
                  <p>{testimonial.content}</p>
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">{testimonial.avatar}</div>
                  <div className="author-info">
                    <div className="author-name">{testimonial.name}</div>
                    <div className="author-role">{testimonial.role}</div>
                    <div className="author-company">{testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="about" className="team">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <span>👥</span>
              <span>Our Team</span>
            </div>
            <h2 className="section-title">Meet the Visionaries</h2>
            <p className="section-subtitle">
              Our world-class team of designers, developers, and innovators are passionate about empowering creators
            </p>
          </div>

          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-card">
                <div className="team-avatar">{member.avatar}</div>
                <h3 className="team-name">{member.name}</h3>
                <p className="team-role">{member.role}</p>
                <p className="team-bio">{member.bio}</p>
                <div className="team-social">
                  <a href="#" className="social-link">
                    LinkedIn
                  </a>
                  <a href="#" className="social-link">
                    Twitter
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <span>❓</span>
              <span>FAQ</span>
            </div>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">
              Got questions? We've got answers. Find everything you need to know about Sirjan Ai.
            </p>
          </div>

          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <h3 className="faq-question">
                  <span className="faq-icon">💡</span>
                  {faq.question}
                </h3>
                <p className="faq-answer">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="blog">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <span>📝</span>
              <span>Blog</span>
            </div>
            <h2 className="section-title">Latest Insights & Tips</h2>
            <p className="section-subtitle">
              Stay updated with the latest web design trends, tips, and best practices from our experts
            </p>
          </div>

          <div className="blog-grid">
            {blogPosts.map((post, index) => (
              <div key={index} className="blog-card">
                <div className="blog-image">{post.image}</div>
                <div className="blog-content">
                  <div className="blog-meta">
                    <span className="blog-author">{post.author}</span>
                    <span className="blog-date">{post.date}</span>
                    <span className="blog-read-time">{post.readTime}</span>
                  </div>
                  <h3 className="blog-title">{post.title}</h3>
                  <p className="blog-excerpt">{post.excerpt}</p>
                  <a href="#" className="blog-link">
                    <span>Read More</span>
                    <span className="link-arrow">→</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter">
        <div className="container">
          <div className="newsletter-content">
            <div className="newsletter-text">
              <h2 className="newsletter-title">Stay in the Loop</h2>
              <p className="newsletter-subtitle">
                Get the latest updates, tips, and exclusive offers delivered straight to your inbox
              </p>
            </div>
            <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="newsletter-input"
                  required
                />
                <button type="submit" className="newsletter-btn">
                  <span>Subscribe</span>
                  <span className="btn-icon">📧</span>
                </button>
              </div>
              <p className="newsletter-privacy">We respect your privacy. Unsubscribe at any time.</p>
            </form>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta">
        <div className="container">
          <div className="cta-content">
            <div className="cta-icon">🚀</div>
            <h2 className="cta-title">Ready to Build Something Amazing?</h2>
            <p className="cta-subtitle">
              Join over 500,000 creators who've built stunning websites with Sirjan Ai. Start your journey today - no
              credit card required, no limits on creativity!
            </p>
            <div className="cta-buttons">
              <button className="cta-button large primary" onClick={handleStartFree}>
                <span className="btn-icon">✨</span>
                <span>Start Building Now</span>
              </button>
              <button className="cta-button large secondary">
                <span className="btn-icon">📞</span>
                <span>Talk to Sales</span>
              </button>
            </div>
            <div className="cta-features">
              <div className="cta-feature">
                <span className="feature-icon">✅</span>
                <span>Free forever plan</span>
              </div>
              <div className="cta-feature">
                <span className="feature-icon">✅</span>
                <span>No credit card required</span>
              </div>
              <div className="cta-feature">
                <span className="feature-icon">✅</span>
                <span>30-day money-back guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section main">
              <div className="footer-logo">
                <div className="logo-icon">🚀</div>
                <span className="logo-text">Sirjan Ai</span>
              </div>
              <p className="footer-description">
                Empowering creators worldwide to build beautiful websites without code. Your vision, our tools,
                unlimited possibilities.
              </p>
              <div className="social-links">
                <a href="#" className="social-link twitter">
                  🐦 Twitter
                </a>
                <a href="#" className="social-link linkedin">
                  💼 LinkedIn
                </a>
                <a href="#" className="social-link github">
                  🐙 GitHub
                </a>
                <a href="#" className="social-link youtube">
                  📺 YouTube
                </a>
              </div>
            </div>

            <div className="footer-section">
              <h4 className="footer-subtitle">Product</h4>
              <ul className="footer-links">
                <li>
                  <a href="#">Visual Builder</a>
                </li>
                <li>
                  <a href="#">Templates</a>
                </li>
                <li>
                  <a href="#">Components</a>
                </li>
                <li>
                  <a href="#">Hosting</a>
                </li>
                <li>
                  <a href="#">Analytics</a>
                </li>
                <li>
                  <a href="#">SEO Tools</a>
                </li>
              </ul>
            </div>

            <div className="footer-section">
              <h4 className="footer-subtitle">Resources</h4>
              <ul className="footer-links">
                <li>
                  <a href="#">Help Center</a>
                </li>
                <li>
                  <a href="#">Documentation</a>
                </li>
                <li>
                  <a href="#">Video Tutorials</a>
                </li>
                <li>
                  <a href="#">Community</a>
                </li>
                <li>
                  <a href="#">Blog</a>
                </li>
                <li>
                  <a href="#">Webinars</a>
                </li>
              </ul>
            </div>

            <div className="footer-section">
              <h4 className="footer-subtitle">Company</h4>
              <ul className="footer-links">
                <li>
                  <a href="#">About Us</a>
                </li>
                <li>
                  <a href="#">Careers</a>
                </li>
                <li>
                  <a href="#">Press Kit</a>
                </li>
                <li>
                  <a href="#">Partners</a>
                </li>
                <li>
                  <a href="#">Contact</a>
                </li>
                <li>
                  <a href="#">Investors</a>
                </li>
              </ul>
            </div>

            <div className="footer-section">
              <h4 className="footer-subtitle">Legal</h4>
              <ul className="footer-links">
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
                <li>
                  <a href="#">Terms of Service</a>
                </li>
                <li>
                  <a href="#">Cookie Policy</a>
                </li>
                <li>
                  <a href="#">GDPR</a>
                </li>
                <li>
                  <a href="#">Security</a>
                </li>
                <li>
                  <a href="#">Compliance</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <p>© 2025 Sirjan Ai. All rights reserved. Made with ❤️ for creators worldwide.</p>
              <div className="footer-badges">
                <span className="badge">🔒 SOC 2 Certified</span>
                <span className="badge">🌍 Carbon Neutral</span>
                <span className="badge">⚡ 99.9% Uptime</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
