import { useState } from 'react'
import hcmutLogo from '../assets/icons/Ho Chi Minh City University of Technology_idnZjcXgHX_1 3.svg'
import panelImage from '../assets/icons/image 15.svg'

function Landing() {
  const [openFAQ, setOpenFAQ] = useState(null)

  const services = [
    {
      icon: '📚',
      title: 'Curriculum-Based Tutoring',
      description: 'Get personalized tutoring sessions aligned with your school syllabus.'
    },
    {
      icon: '👥',
      title: 'Group Study Sessions',
      description: 'Join collaborative learning groups and benefit from peer-to-peer discussions.'
    },
    {
      icon: '💻',
      title: 'Online Support',
      description: 'Access tutoring services anytime, anywhere through our online platform.'
    },
    {
      icon: '📖',
      title: 'Reliable Learning Resources',
      description: 'Gain access to trusted study materials from library and the platform.'
    }
  ]

  const faqs = [
    'What is HCMUT Tutor Support System?',
    'How do I register for the Program?',
    'What subjects are covered?',
    'How much does tutoring cost?',
    'Can I cancel or reschedule a session?',
    'Are the tutors qualified?'
  ]

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={hcmutLogo} alt="HCMUT Logo" className="h-10 w-10" />
            <span className="text-xl font-semibold">
              <span className="text-black">HCMUT</span>{' '}
              <span className="text-blue-600">Tutor Support</span>
            </span>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            Find a tutor
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-linear-to-br from-blue-50 to-indigo-50 py-16 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900 leading-tight">
              Connect with expert tutors right now!
            </h1>
            <p className="text-lg text-gray-600">
              Get personalized lessons aligned with your school syllabus and achieve academic success.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium text-lg transition-colors shadow-lg hover:shadow-xl">
              Get started
            </button>
          </div>
          <div className="relative">
            <div className="rounded-2xl shadow-2xl overflow-hidden">
              <img src={panelImage} alt="Tutoring support" className="w-full h-auto block" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-12">
            Our offered services
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-linear-to-br from-blue-50 to-white border-l-4 border-blue-600 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-blue-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-4">
            Common questions
          </h2>
          <p className="text-center text-gray-600 mb-8">
            If you cannot find the questions that you are looking for, please contact{' '}
            <a href="#" className="text-blue-600 hover:underline">our support team</a>
          </p>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-800">{faq}</span>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      openFAQ === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFAQ === index && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-600">
                      Answer content for "{faq}" would go here. This is a placeholder for the actual FAQ answer.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-700 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={hcmutLogo} alt="HCMUT Logo" className="h-10 w-10 brightness-0 invert" />
              <span className="text-xl font-semibold">HCMUT Tutor Support</span>
            </div>
            <p className="text-blue-100 text-sm leading-relaxed">
              Empowering HCMUT students through personalized academic support and collaborative learning.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Help center</h3>
            <ul className="space-y-2 text-blue-100 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Campus Locations</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Phone: +84 908 73 138</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Email: tutorsupport@hcmut.edu.vn</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-blue-100 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">MyBK Portal</a></li>
              <li><a href="#" className="hover:text-white transition-colors">BK LMS</a></li>
              <li><a href="#" className="hover:text-white transition-colors">HCMUT Homepage</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-blue-600 text-center text-blue-200 text-sm">
          <p>&copy; 2025 HCMUT Tutor Support System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Landing
