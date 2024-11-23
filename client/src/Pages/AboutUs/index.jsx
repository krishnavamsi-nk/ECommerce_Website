import React from "react";

const AboutUs = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>About Us</h1>
      <p style={styles.description}>
        Welcome to <strong>Our OnLineShoppY Website</strong>, where innovation meets excellence. We are dedicated to providing top-notch products and services that cater to the unique needs of our customers. With a focus on quality, integrity, and customer satisfaction, we strive to make a difference in the industry.
      </p>
      <div style={styles.mission}>
        <h2 style={styles.subheading}>Our Mission</h2>
        <p style={styles.text}>
          To empower individuals and businesses by delivering exceptional value through innovative solutions and services. We aim to foster long-lasting relationships and make a positive impact in the communities we serve.
        </p>
      </div>
      <div style={styles.vision}>
        <h2 style={styles.subheading}>Our Vision</h2>
        <p style={styles.text}>
          To be a global leader in our industry, setting benchmarks for excellence and driving transformation in the lives of our customers and stakeholders.
        </p>
      </div>
      <div style={styles.team}>
        <h2 style={styles.subheading}>Meet Our Team</h2>
        <p style={styles.text}>
          Our team is composed of talented and passionate individuals committed to delivering the best results. Together, we bring a wealth of experience and expertise to achieve our goals.
        </p>
      </div>
    </div>
  );
};

// Inline styles for the component
const styles = {
  container: {
    padding: "20px",
    maxWidth: "800px",
    margin: "auto",
    fontFamily: "Arial, sans-serif",
    lineHeight: "1.6",
    color: "#333",
  },
  heading: {
    fontSize: "2.5rem",
    color: "#007BFF",
    textAlign: "center",
    marginBottom: "20px",
  },
  description: {
    fontSize: "1.1rem",
    marginBottom: "30px",
    textAlign: "justify",
  },
  subheading: {
    fontSize: "1.8rem",
    color: "#007BFF",
    marginBottom: "10px",
  },
  text: {
    fontSize: "1rem",
    marginBottom: "20px",
    textAlign: "justify",
  },
};

export default AboutUs;
