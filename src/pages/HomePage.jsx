// HomePage.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import previewImage from '../assets/preview.svg';

const FeatureCard = ({ icon, title, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
  >
    <div className="text-blue-600 mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 to-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute transform rotate-45 bg-blue-100/20"
                style={{
                  width: '60px',
                  height: '60px',
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `float ${3 + i}s infinite ease-in-out alternate`
                }}
              />
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Create Your Professional CV in Minutes
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Build, personalize, and download your resume with ease.
              Choose from multiple templates and customize to your needs.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/login"
                  className="px-8 py-4 text-white bg-blue-600 hover:bg-blue-700 transition rounded-full text-lg font-medium shadow-lg hover:shadow-xl inline-block"
                >
                  Get Started Now
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/cv-editor"
                  className="px-8 py-4 text-blue-600 border-2 border-blue-600 hover:bg-blue-50 transition rounded-full text-lg font-medium shadow-lg hover:shadow-xl inline-block"
                >
                  Try Without Account
                </Link>
              </motion.div>
            </div>

            {/* Preview Image */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              <div className="relative rounded-xl shadow-2xl overflow-hidden">
                <img
                  src={previewImage}
                  alt="CV Builder Preview"
                  className="w-full h-auto"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Instructions Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <div className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 text-blue-600">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 9l-3 3m0 0l-3-3m3 3V4m0 0v12" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">1. Choose a Template</h3>
              <p className="text-gray-600">
                Start by selecting from our professionally designed CV templates, each tailored for different industries and career levels.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 text-blue-600">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">2. Add Your Content</h3>
              <p className="text-gray-600">
                Fill in your details using our intuitive editor. Add work experience, skills, education, and more with easy-to-use forms.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 text-blue-600">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">3. Export & Share</h3>
              <p className="text-gray-600">
                Download your CV as a professional PDF, ready to share with employers. Your data is saved securely for future updates.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center p-4 bg-blue-50 rounded-lg text-blue-700">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Your data is automatically saved when you create an account, allowing you to update your CV anytime.</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center mb-12"
        >
          Why Choose Our CV Builder?
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            }
            title="Multiple Templates"
            description="Choose from a variety of professional templates designed to match your style and industry."
          />
          <FeatureCard
            icon={
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            }
            title="Easy Customization"
            description="Customize every aspect of your CV with our intuitive drag-and-drop interface."
          />
          <FeatureCard
            icon={
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            title="PDF Export"
            description="Download your CV as a professional PDF file ready to send to employers."
          />
        </div>
      </section>

      {/* Add animation keyframes */}
      <style>
        {`
          @keyframes float {
            0% { transform: translate(0, 0) rotate(45deg); }
            100% { transform: translate(0, 20px) rotate(45deg); }
          }
        `}
      </style>
    </div>
  );
};

export default HomePage;
