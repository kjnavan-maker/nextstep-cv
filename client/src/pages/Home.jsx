import Navbar from "../components/Navbar";
import API from "../api/api";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

function Home() {
  const [success, setSuccess] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [fileName, setFileName] = useState("No file chosen");
  const [beforeCV, setBeforeCV] = useState(null);
  const [afterCV, setAfterCV] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData(e.target);

      const fullName = formData.get("fullName");
      const whatsapp = formData.get("whatsapp");
      const packageName = formData.get("packageName");
      const position = formData.get("position");

      const response = await API.post("/orders", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        const message = `Hello NextStep CV, I have submitted my CV order.

Name: ${fullName}
WhatsApp: ${whatsapp}
Package: ${packageName}
Job Position: ${position}

Please check my order.`;

        setWhatsappLink(
          `https://wa.me/94764304068?text=${encodeURIComponent(message)}`
        );

        setSuccess(true);
        setFileName("No file chosen");
        e.target.reset();
      }
    } catch (error) {
      console.log(error);
      alert("Order submit failed. Please try again.");
    }
  };

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            className="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="loader-logo"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              NextStep <span>CV</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar />

      <section className="hero" id="home">
        <div className="hero-content">
          <motion.div
            className="hero-left"
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="badge">ATS-Friendly CV Experts</div>

            <h1 className="hero-title">
              95% Of Recruiters Check Your CV First
            </h1>

            <p className="hero-subtitle">
              Professional ATS-Friendly CV Writing Services That Help You Get
              Hired Faster.
            </p>

            <div className="hero-buttons">
              <a href="#contact">
                <button className="primary-btn">Order My CV</button>
              </a>

              <a href="#packages">
                <button className="secondary-btn">View Packages</button>
              </a>
            </div>

            <div className="trust-row">
              <span>ATS-Friendly</span>
              <span>10,000+ Clients</span>
              <span>4.9/5 Rating</span>
            </div>
          </motion.div>

          <motion.div
            className="hero-right"
            initial={{ opacity: 0, x: 55 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="resume-card">
              <div className="resume-header"></div>
              <div className="resume-line big"></div>
              <div className="resume-line"></div>
              <div className="resume-line"></div>

              <div className="score-box">
                <h3>ATS Score</h3>
                <strong>96%</strong>
              </div>
            </div>

            <div className="floating-card top-card">Recruiter Ready</div>
            <div className="floating-card bottom-card">Hired Faster ↑</div>
          </motion.div>
        </div>
      </section>

      <section className="services-section" id="services">
        <motion.div
          className="section-heading"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span>Our Services</span>
          <h2>Premium Career Branding Services</h2>
          <p>
            Everything you need to create a recruiter-ready professional
            profile.
          </p>
        </motion.div>

        <div className="services-grid">
          {[
            "ATS-Friendly CV Writing",
            "Executive Resume Writing",
            "LinkedIn Optimization",
            "Cover Letter Writing",
          ].map((service, index) => (
            <motion.div
              className="service-card"
              key={index}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3>{service}</h3>
              <p>Premium service designed to improve your career opportunities.</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="why-section">
        <motion.div
          className="section-heading"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span>Why Choose Us</span>
          <h2>Built For Serious Job Seekers</h2>
          <p>
            We create CVs that look professional, pass ATS systems, and impress
            recruiters.
          </p>
        </motion.div>

        <div className="why-grid">
          {[
            "ATS keyword optimization",
            "Premium recruiter-focused layout",
            "Fast WhatsApp support",
            "Professional career branding",
            "Modern CV redesign",
            "Sri Lanka & global job market ready",
          ].map((item, index) => (
            <motion.div
              className="why-card"
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              ✓ {item}
            </motion.div>
          ))}
        </div>
      </section>

      <section className="pricing-section" id="packages">
        <motion.div
          className="section-heading"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span>Packages</span>
          <h2>Choose Your Career Package</h2>
          <p>Premium CV solutions for students, professionals, and executives.</p>
        </motion.div>

        <div className="pricing-grid">
          {[
            {
              name: "Basic",
              price: "Rs. 2,500",
              desc: "Perfect for students and freshers.",
              features: ["ATS Friendly CV", "1 Revision", "2 Days Delivery"],
            },
            {
              name: "Professional",
              price: "Rs. 4,500",
              desc: "Best for job seekers and professionals.",
              features: [
                "ATS Optimized CV",
                "LinkedIn Support",
                "Cover Letter",
                "Unlimited Revisions",
              ],
              popular: true,
            },
            {
              name: "Executive",
              price: "Rs. 8,500",
              desc: "Premium package for senior roles.",
              features: [
                "Executive Resume",
                "LinkedIn Optimization",
                "Cover Letter",
                "Career Branding",
              ],
            },
          ].map((plan, index) => (
            <motion.div
              className={`pricing-card ${plan.popular ? "popular" : ""}`}
              key={index}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {plan.popular && <div className="popular-badge">Most Popular</div>}
              <h3>{plan.name}</h3>
              <h2>{plan.price}</h2>
              <p>{plan.desc}</p>

              <ul>
                {plan.features.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>

              <div className="pricing-actions">
                <a href="#contact">
                  <button>Order Now</button>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="portfolio-section" id="portfolio">
        <motion.div
          className="section-heading dark-heading"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span>Portfolio</span>
          <h2>Real CV Transformations</h2>
          <p>Upload and preview your normal CV and ATS CV samples.</p>
        </motion.div>

        <div className="portfolio-upload-row">
          <label>
            Upload Normal CV
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={(e) =>
                e.target.files[0] &&
                setBeforeCV(URL.createObjectURL(e.target.files[0]))
              }
            />
          </label>

          <label>
            Upload ATS CV
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={(e) =>
                e.target.files[0] &&
                setAfterCV(URL.createObjectURL(e.target.files[0]))
              }
            />
          </label>
        </div>

        <div className="portfolio-grid">
          <motion.div
            className="cv-preview real-cv-preview"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span>Before</span>
            <h3>Normal CV</h3>
            {beforeCV ? (
              <iframe src={beforeCV} title="Normal CV Preview"></iframe>
            ) : (
              <p className="empty-cv">Upload normal CV to preview here</p>
            )}
          </motion.div>

          <motion.div
            className="transform-arrow"
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            →
          </motion.div>

          <motion.div
            className="cv-preview real-cv-preview"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span>After</span>
            <h3>ATS CV</h3>
            {afterCV ? (
              <iframe src={afterCV} title="ATS CV Preview"></iframe>
            ) : (
              <p className="empty-cv">Upload ATS CV to preview here</p>
            )}
          </motion.div>
        </div>
      </section>

      <section className="stats-section">
        <div className="stats-grid">
          {[
            ["10K+", "Happy Clients"],
            ["95%", "Interview Success"],
            ["4.9★", "Client Rating"],
            ["24h", "Fast Delivery"],
          ].map(([number, text], index) => (
            <motion.div
              className="stat-card"
              key={index}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2>{number}</h2>
              <p>{text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="testimonials-section">
        <motion.div
          className="section-heading"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span>Testimonials</span>
          <h2>Success Stories From Clients</h2>
          <p>Thousands of professionals trust NextStep CV for career growth.</p>
        </motion.div>

        <div className="testimonial-grid">
          {[
            [
              "Kasun Perera",
              "Software Engineer",
              "I received interview calls within one week after using my new ATS CV.",
            ],
            [
              "Nimal Fernando",
              "Project Manager",
              "Professional design, modern layout, and excellent LinkedIn support.",
            ],
            [
              "Sarah Wijesinghe",
              "HR Executive",
              "My executive resume now looks premium and recruiter-ready.",
            ],
          ].map(([name, role, text], index) => (
            <motion.div
              className="testimonial-card"
              key={index}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="stars">★★★★★</div>
              <p>“{text}”</p>

              <div className="client-info">
                <h4>{name}</h4>
                <span>{role}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="faq-section">
        <motion.div
          className="section-heading"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span>FAQ</span>
          <h2>Frequently Asked Questions</h2>
          <p>Everything you need to know before ordering your premium CV.</p>
        </motion.div>

        <div className="faq-container">
          {[
            [
              "What is an ATS-Friendly CV?",
              "An ATS-Friendly CV is optimized with keywords and formatting that recruitment systems can read easily.",
            ],
            [
              "How long does delivery take?",
              "Most CV packages are delivered within 24–48 hours depending on the package.",
            ],
            [
              "Do you provide LinkedIn optimization?",
              "Yes. Professional and Executive packages include LinkedIn optimization support.",
            ],
            [
              "Can I request revisions?",
              "Yes. We provide revisions based on your selected package.",
            ],
          ].map(([q, a], index) => (
            <motion.div
              className="faq-card"
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3>{q}</h3>
              <p>{a}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <motion.div
          className="cta-box"
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <span>Ready To Get Hired?</span>
          <h2>Transform Your CV Into A Recruiter-Winning Resume Today</h2>
          <p>
            Join thousands of professionals who improved their careers with
            NextStep CV.
          </p>

          <div className="cta-buttons">
            <a href="#contact">
              <button className="primary-btn">Order My CV</button>
            </a>

            <a
              href="https://wa.me/94764304068"
              target="_blank"
              rel="noreferrer"
            >
              <button className="secondary-btn">WhatsApp Us</button>
            </a>
          </div>
        </motion.div>
      </section>

      <section className="order-section" id="contact">
        <motion.div
          className="order-box"
          initial={{ opacity: 0, y: 45 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="order-left">
            <span>Start Your Order</span>
            <h2>Get Your Premium ATS CV Today</h2>
            <p>Fill the form and our CV expert will contact you through WhatsApp.</p>
          </div>

          <form className="order-form" onSubmit={handleSubmit}>
            <input type="text" name="fullName" placeholder="Full Name" required />
            <input type="email" name="email" placeholder="Email Address" required />
            <input type="text" name="whatsapp" placeholder="WhatsApp Number" required />
            <input type="text" name="position" placeholder="Job Position" required />

            <label className="custom-file-upload" htmlFor="cvUpload">
              <input
                id="cvUpload"
                type="file"
                name="cvFile"
                accept=".pdf,.doc,.docx"
                hidden
                onChange={(e) =>
                  setFileName(e.target.files[0]?.name || "No file chosen")
                }
              />
              <span className="file-btn">Choose file</span>
              <span className="file-text">{fileName}</span>
            </label>

            <select name="packageName" required>
              <option value="">Select Package</option>
              <option>Basic</option>
              <option>Professional</option>
              <option>Executive</option>
            </select>

            <textarea name="notes" placeholder="Additional Notes"></textarea>
            <button type="submit">Submit Order</button>
          </form>
        </motion.div>
      </section>

      <AnimatePresence>
        {success && (
          <motion.div
            className="success-popup"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
          >
            <h3>Order Submitted Successfully!</h3>
            <p>Click WhatsApp button to notify our CV expert.</p>

            <a href={whatsappLink} target="_blank" rel="noreferrer">
              <button>Open WhatsApp</button>
            </a>

            <button onClick={() => setSuccess(false)}>Close</button>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="footer">
        <div className="footer-glow"></div>

        <div className="footer-top">
          <div className="footer-brand">
            <h2>
              NextStep <span>CV</span>
            </h2>

            <p>
              Premium ATS-friendly CV writing and career branding service for
              modern professionals.
            </p>

            <div className="footer-badges">
              <span>ATS Friendly</span>
              <span>Premium Design</span>
              <span>Fast Delivery</span>
            </div>
          </div>

          <div className="footer-column">
            <h4>Company</h4>
            <a href="#home">Home</a>
            <a href="#services">Services</a>
            <a href="#packages">Packages</a>
            <a href="#portfolio">Portfolio</a>
            <a href="#contact">Contact</a>
          </div>

          <div className="footer-column">
            <h4>Social</h4>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              Facebook
            </a>
            <span>LinkedIn Soon</span>
            <span>TikTok Soon</span>
          </div>

          <div className="footer-cta">
            <h4>Ready to upgrade your CV?</h4>
            <p>Message us directly and start your order today.</p>

            <a
              className="footer-whatsapp"
              href="https://wa.me/94764304068"
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp Us
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 NextStep CV. All Rights Reserved.</p>
          <p>Designed for premium career growth.</p>
        </div>
      </footer>

      <a
        className="floating-whatsapp"
        href="https://wa.me/94764304068"
        target="_blank"
        rel="noreferrer"
      >
        WhatsApp
      </a>
    </>
  );
}

export default Home;