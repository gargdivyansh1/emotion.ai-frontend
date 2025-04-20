import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Database, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Privacy: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white">
      {/* Header */}
      <header className="max-w-6xl mx-auto px-4 py-8">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-indigo-400"
        >
          <span className="text-xl font-bold">← Back to Home</span>
        </button>
      </header>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="bg-indigo-900/30 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-gray-400">Last Updated: June 15, 2023</p>
        </motion.div>

        <div className="space-y-12">
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Lock className="w-6 h-6 text-indigo-400 mr-3" />
              1. Information We Collect
            </h2>
            <div className="text-gray-400 space-y-4">
              <p>
                We collect information to provide better services to all our users. The types of information we collect include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Account Information:</strong> When you create an account, we collect your name, email address, and other details you provide.
                </li>
                <li>
                  <strong>Session Data:</strong> During emotion analysis sessions, we process video data to detect facial expressions and emotional states.
                </li>
                <li>
                  <strong>Technical Information:</strong> We collect data about the devices and software you use to access our services.
                </li>
                <li>
                  <strong>Usage Data:</strong> Information about how you interact with our services, including features used and time spent.
                </li>
              </ul>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Database className="w-6 h-6 text-indigo-400 mr-3" />
              2. How We Use Information
            </h2>
            <div className="text-gray-400 space-y-4">
              <p>We use the information we collect for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Develop new features and functionality</li>
                <li>Personalize your experience and provide emotional insights</li>
                <li>Ensure security and prevent fraud</li>
                <li>Communicate with you about updates and offers</li>
                <li>Conduct research to improve emotional recognition technology</li>
              </ul>
              <p>
                We process video data in real-time and do not store raw video footage after analysis is complete. 
                Only processed emotional data is retained to provide historical trends.
              </p>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Shield className="w-6 h-6 text-indigo-400 mr-3" />
              3. Data Security
            </h2>
            <div className="text-gray-400 space-y-4">
              <p>
                We implement robust security measures to protect your information:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>End-to-end encryption for all data transmissions</li>
                <li>Regular security audits and penetration testing</li>
                <li>Access controls and strict authentication requirements</li>
                <li>Data anonymization where possible</li>
              </ul>
              <p>
                While we strive to protect your information, no security system is impenetrable. 
                We cannot guarantee the security of our databases, nor can we guarantee that information 
                you supply won't be intercepted while being transmitted to us.
              </p>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Mail className="w-6 h-6 text-indigo-400 mr-3" />
              4. Contact Us
            </h2>
            <div className="text-gray-400 space-y-4">
              <p>
                If you have any questions about this Privacy Policy or our practices, please contact us at:
              </p>
              <p>
                <strong>Email:</strong> divyanshgarg515@gmail.com<br />
                <strong>Address:</strong> MMMUT, Gorakhpur
              </p>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes 
                by posting the new Privacy Policy on this page and updating the "Last Updated" date.
              </p>
            </div>
          </motion.section>
        </div>
      </section>
    </div>
  );
};

export default Privacy;