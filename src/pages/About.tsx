import React from 'react';
import { motion } from 'framer-motion';
import { Users, Globe, Award, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const About: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    { icon: Users, value: '100+', label: 'Active Users' },
    { icon: Globe, value: '1', label: 'Countries' },
    { icon: Award, value: '94%', label: 'Accuracy' },
    { icon: Heart, value: '4.3/5', label: 'Satisfaction' }
  ];

  const team = [
    {
      name: 'Divyansh Garg',
      role: 'Developer',
      bio: 'Developer and Resarcher'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white">
      <header className="max-w-6xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-indigo-400"
        >
          <span className="text-xl font-bold">← Back to Home</span>
        </button>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-12 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-white mb-6"
        >
          Our Mission: <span className="text-indigo-400">Humanizing Technology</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-400 max-w-3xl mx-auto"
        >
          At EmotionAI, we believe technology should understand human emotions as well as humans do.
          Our goal is to bridge the gap between how we feel and how we communicate.
        </motion.p>
      </section>

      {/* Stats */}
      <section className="bg-gray-800 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-4"
              >
                <div className="bg-indigo-900/30 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-indigo-400" />
                </div>
                <p className="text-3xl font-bold text-white mb-2">{stat.value}</p>
                <p className="text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
            <p className="text-gray-400 mb-4">
              Founded in 2025, EmotionAI began as a research project at Madan Mohan Malviya University of Technology Of Gorakhpur. I noticed that while technology was advancing
              rapidly, emotional intelligence in software remained primitive.
            </p>
            <p className="text-gray-400 mb-4">
              After reading several resarch papers on micro-expression recognition, I realized this
              technology could help millions struggling with emotional awareness - from people
              on the autism spectrum to professionals needing better emotional regulation.
            </p>
            <p className="text-gray-400">
              Today, I'm proud to serve individuals, therapists, and enterprises worldwide,
              helping them bridge the gap between how they feel and how they communicate.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gray-800 rounded-xl h-80"
          >
            <div className="h-full flex items-center justify-center text-gray-500">
              <img src="src\pages\black.jpg" alt="" />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <div>
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Meet The Team</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 flex justify-center items-center">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 rounded-xl p-6 text-center"
            >
              <div className="w-24 h-24 rounded-full bg-gray-700 mx-auto mb-4 flex items-center justify-center">
                <span className="text-gray-400 text-xl">{member.name.charAt(0)}</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
              <p className="text-indigo-400 mb-4">{member.role}</p>
              <p className="text-gray-400 text-sm">{member.bio}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;