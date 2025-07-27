import React from 'react';
import { motion } from 'framer-motion';
import { Handshake } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsPage: React.FC = () => {
  const navigate = useNavigate();
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-gray-100">
      <header className="max-w-6xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-indigo-400"
        >
          <span className="text-xl font-bold">← Back to Home</span>
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-xl shadow-lg p-6 md:p-10"
        >
          <div className="mb-8 text-center">
            <div className='bg-indigo-900/30 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6'>
              <Handshake className="w-8 h-8 text-indigo-400" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
            <p className="text-gray-400">Last Updated: {currentDate}</p>
          </div>

          <div className="prose prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">1. Acceptance of Terms</h2>
              <p className="text-gray-300 mb-4">
                Welcome to EmotionAI ("Service"), provided by EmotionAI Inc. ("we," "us," or "our"). By accessing or using our Service, you ("User" or "you") agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use our Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">2. Description of Service</h2>
              <p className="text-gray-300 mb-4">
                EmotionAI provides an AI-powered emotional analysis platform that:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
                <li>Analyzes facial expressions through device cameras</li>
                <li>Provides real-time emotional feedback</li>
                <li>Generates reports and insights about emotional patterns</li>
                <li>Offers personalized recommendations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">3. User Accounts</h2>
              <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
                <li>To access certain features, you must create an account by providing accurate and complete information.</li>
                <li>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</li>
                <li>You must be at least 16 years old to use our Service, or have parental consent if younger.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">4. Privacy Policy</h2>
              <p className="text-gray-300 mb-4">
                Your use of our Service is also governed by our Privacy Policy, which explains how we collect, use, and protect your personal information, including biometric data. By using our Service, you consent to our collection and use of your data as described in the Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">5. Acceptable Use</h2>
              <p className="text-gray-300 mb-4">
                You agree not to:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
                <li>Use the Service for any illegal purpose or in violation of any laws</li>
                <li>Harass, threaten, or harm others</li>
                <li>Attempt to reverse engineer, decompile, or disassemble any part of our Service</li>
                <li>Use automated systems to access our Service in a manner that sends more requests than a human could reasonably produce</li>
                <li>Share, sell, or transfer your account to others</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">6. Intellectual Property</h2>
              <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
                <li>All content, features, and functionality on our Service, including software, text, graphics, and logos, are owned by us or our licensors and are protected by intellectual property laws.</li>
                <li>We grant you a limited, non-exclusive, non-transferable license to access and use our Service for personal, non-commercial purposes.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">7. User Content</h2>
              <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
                <li>You retain ownership of any video or image data you submit through our Service ("User Content").</li>
                <li>By submitting User Content, you grant us a worldwide, royalty-free license to use, process, and analyze your User Content solely to provide and improve our Service.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">8. Medical Disclaimer</h2>
              <p className="text-gray-300 mb-4">
                EmotionAI is not a medical device and does not provide medical advice, diagnosis, or treatment. Our Service is for informational and self-awareness purposes only. Always seek the advice of qualified health providers regarding medical conditions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">9. Limitation of Liability</h2>
              <p className="text-gray-300 mb-4">
                To the maximum extent permitted by law:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
                <li>We shall not be liable for any indirect, incidental, special, consequential, or punitive damages</li>
                <li>Our total liability for any claims related to the Service shall not exceed the amount you paid us, if any, in the past six months</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">10. Modifications to Service and Terms</h2>
              <p className="text-gray-300 mb-4">
                We reserve the right to:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
                <li>Modify or discontinue the Service at any time</li>
                <li>Change these Terms at our discretion</li>
                <li>Notify you of material changes through the Service or via email</li>
              </ul>
              <p className="text-gray-300 mb-4">
                Your continued use after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">11. Termination</h2>
              <p className="text-gray-300 mb-4">
                We may suspend or terminate your access to the Service at any time for any reason, including violation of these Terms. You may terminate your account at any time by contacting us or through account settings.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">12. Governing Law</h2>
              <p className="text-gray-300 mb-4">
                These Terms shall be governed by the Government of India without regard to its conflict of law provisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">13. Dispute Resolution</h2>
              <p className="text-gray-300 mb-4">
                Any disputes shall be resolved through binding arbitration in Gorakhpur, India under the rules of the Government of India. Judgment may be entered in any court with jurisdiction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">14. General Provisions</h2>
              <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
                <li>These Terms constitute the entire agreement between you and us regarding the Service.</li>
                <li>Our failure to enforce any right or provision will not be considered a waiver.</li>
                <li>If any provision is found invalid, the remaining provisions will remain in effect.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">15. Contact Information</h2>
              <p className="text-gray-300 mb-4">
                For questions about these Terms, please contact us at:
              </p>
              <address className="not-italic text-gray-300">
                EmotionAI Inc.<br />
                MMMUT<br />
                Gorakhpur<br />
                Email: divyanshgarg515@gmail.com<br />
                Phone: +91-7617449174
              </address>
            </section>
          </div>
        </motion.div>
      </main>

      <footer className="bg-gray-900 border-t border-gray-800 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} EmotionAI Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default TermsPage;