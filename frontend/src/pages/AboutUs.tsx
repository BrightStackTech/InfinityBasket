import { motion } from "framer-motion";

const aboutFeatures = [
  {
    title: "Global Reach",
    description: "InfinityBasket connects quality FMCG products with customers in over 50 countries.",
    icon: "🌍",
  },
  {
    title: "Trusted Brands",
    description: "We partner with top international brands to ensure premium quality and reliability.",
    icon: "🏆",
  },
  {
    title: "Fast Delivery",
    description: "Our logistics network ensures timely delivery across the globe.",
    icon: "🚚",
  },
  {
    title: "Customer Focused",
    description: "We prioritize customer satisfaction and adapt to market needs.",
    icon: "🤝",
  },
];

const teamMembers = [
  {
    name: "Amit Sharma",
    role: "Founder & CEO",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Priya Patel",
    role: "Head of Operations",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Rahul Verma",
    role: "Logistics Manager",
    img: "https://randomuser.me/api/portraits/men/65.jpg",
  },
];

const AboutUs = () => (
  <div className="container mx-auto px-4 md:px-12 pt-4 md:pb-4 pb-8">
    {/* Hero Section */}
    <div
      className="relative mb-6 rounded-xl overflow-hidden pt-8"
      style={{ minHeight: '120px' }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 flex-start justify-center h-full p-8">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.25 }}
          className="text-3xl md:text-4xl font-bold text-white"
        >
          About Us
        </motion.h1>
      </div>
    </div>

    {/* Company Story */}
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="mb-12"
    >
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 md:p-10">
        <h2 className="text-2xl md:text-3xl font-bold text-gold-500 mb-4">Our Story</h2>
        <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
          InfinityBasket was founded with a vision to make premium FMCG products accessible to customers worldwide. With years of experience in global trade, our team has built a robust network of suppliers and logistics partners. We believe in quality, transparency, and customer satisfaction. Our journey is driven by innovation and a commitment to excellence.
        </p>
      </div>
    </motion.section>

    {/* Features Section */}
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="mb-12"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {aboutFeatures.map((feature, idx) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300"
          >
            <span className="text-4xl mb-3">{feature.icon}</span>
            <h3 className="font-bold text-lg mb-2 text-gold-500">{feature.title}</h3>
            <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>

    {/* Team Section */}
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="mb-12"
    >
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 md:p-10">
        <h2 className="text-2xl md:text-3xl font-bold text-gold-500 mb-6">Meet Our Team</h2>
        <div className="flex flex-wrap gap-8 justify-center">
          {teamMembers.map(member => (
            <div key={member.name} className="flex flex-col items-center w-48">
              <img
                src={member.img}
                alt={member.name}
                className="w-24 h-24 rounded-full shadow-lg mb-3 object-cover"
              />
              <h4 className="font-semibold text-lg dark:text-white">{member.name}</h4>
              <span className="text-sm text-gray-500 dark:text-gray-400">{member.role}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.section>

    {/* Contact CTA */}
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="mb-12"
    >
      <div className="bg-gold-500 rounded-xl shadow-lg p-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Want to connect?</h2>
        <p className="text-white mb-4">Reach out to us for business inquiries, partnerships, or feedback.</p>
        <a
          href="/contact"
          className="inline-block px-6 py-3 bg-white text-gold-500 font-semibold rounded-lg shadow hover:bg-gray-100 transition"
        >
          Contact Us
        </a>
      </div>
    </motion.section>
  </div>
);

export default AboutUs;