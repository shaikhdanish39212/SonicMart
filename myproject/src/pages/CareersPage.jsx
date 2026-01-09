import React, { useState } from 'react';

const CareersPage = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const jobOpenings = [
    {
      id: 1,
      title: "Senior Audio Engineer",
      department: "engineering",
      location: "Bangalore",
      type: "Full-time",
      experience: "3-5 years",
      description: "Lead audio product development and acoustic testing for premium headphones, speakers, and audio accessories at SonicMart.",
      skills: ["Audio Engineering", "Acoustic Testing", "DSP", "Electronics Design", "Sony/Bose Products"]
    },
    {
      id: 2,
      title: "Audio Product Marketing Manager",
      department: "marketing",
      location: "Mumbai",
      type: "Full-time",
      experience: "2-4 years",
      description: "Drive marketing strategies for SonicMart's audio equipment portfolio, focusing on headphones, speakers, and premium audio brands.",
      skills: ["Audio Product Marketing", "Brand Partnerships", "Sony/Bose Relations", "Audio Content Creation"]
    },
    {
      id: 3,
      title: "Audio Technical Support Specialist",
      department: "support",
      location: "Remote",
      type: "Full-time",
      experience: "1-2 years",
      description: "Provide expert technical support for headphones, speakers, and audio equipment troubleshooting to SonicMart customers.",
      skills: ["Audio Troubleshooting", "Headphone Repair", "Speaker Setup", "Bluetooth Connectivity", "Product Knowledge"]
    },
    {
      id: 4,
      title: "Audio E-commerce Developer",
      department: "engineering",
      location: "Bangalore",
      type: "Full-time",
      experience: "2-3 years",
      description: "Build and maintain SonicMart's audio e-commerce platform with product configurators and audio preview features.",
      skills: ["React", "Audio APIs", "Product Configurators", "Node.js", "E-commerce Platforms"]
    },
    {
      id: 5,
      title: "Audio Product Manager",
      department: "product",
      location: "Pune",
      type: "Full-time",
      experience: "4-6 years",
      description: "Lead product strategy for SonicMart's headphone, speaker, and audio accessory portfolio. Manage Sony, Bose, JBL partnerships.",
      skills: ["Audio Product Management", "Brand Partnerships", "Market Research", "Sony/Bose Relations", "Audio Trends"]
    },
    {
      id: 6,
      title: "Audio Sales Intern",
      department: "sales",
      location: "Delhi",
      type: "Internship",
      experience: "0-1 years",
      description: "Support SonicMart sales team with audio product demos, customer education, and headphone/speaker sales analytics.",
      skills: ["Audio Product Knowledge", "Customer Demo Skills", "Sales Analytics", "Headphone Expertise"]
    }
  ];

  const departments = [
    { id: 'all', name: 'All Departments' },
    { id: 'engineering', name: 'Audio Engineering' },
    { id: 'marketing', name: 'Audio Marketing' },
    { id: 'support', name: 'Audio Support' },
    { id: 'product', name: 'Audio Product' },
    { id: 'sales', name: 'Audio Sales' }
  ];

  const locations = [
    { id: 'all', name: 'All Locations' },
    { id: 'Bangalore', name: 'Bangalore' },
    { id: 'Mumbai', name: 'Mumbai' },
    { id: 'Pune', name: 'Pune' },
    { id: 'Delhi', name: 'Delhi' },
    { id: 'Remote', name: 'Remote' }
  ];

  const filteredJobs = jobOpenings.filter(job => {
    const matchesDepartment = selectedDepartment === 'all' || job.department === selectedDepartment;
    const matchesLocation = selectedLocation === 'all' || job.location === selectedLocation;
    return matchesDepartment && matchesLocation;
  });

  const companyBenefits = [
    {
      icon: "💰",
      title: "Audio Industry Competitive Salary",
      description: "Industry-leading audio sector compensation with performance bonuses and equity options"
    },
    {
      icon: "🏥",
      title: "Premium Health Benefits",
      description: "Comprehensive health insurance plus hearing protection coverage for audio professionals"
    },
    {
      icon: "🏖️",
      title: "Flexible Audio Work",
      description: "Remote work options and flexible hours for audio testing and international brand coordination"
    },
    {
      icon: "📚",
      title: "Audio Learning & Development",
      description: "Annual learning budget for audio conferences, Sony/Bose certifications, and audio engineering courses"
    },
    {
      icon: "🎧",
      title: "Premium Audio Gear Discounts",
      description: "Exclusive 50% discounts on all SonicMart headphones, speakers, and audio accessories"
    },
    {
      icon: "🚀",
      title: "Audio Career Growth",
      description: "Clear progression paths from junior audio roles to senior sound engineering positions with mentorship"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-brand-coral to-brand-navy text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">Join the SonicMart Audio Family</h1>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Help us revolutionize India's audio industry. Build innovative headphone experiences, grow your audio career, 
            and make an impact that resonates with audiophiles and music lovers nationwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#openings" className="bg-white text-brand-coral px-8 py-3 rounded-lg font-medium hover:bg-brand-cream transition-colors">
              View Audio Positions
            </a>
            <a href="#culture" className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-brand-coral transition-colors">
              Audio Team Culture
            </a>
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-brand-coral mb-2">150+</div>
              <div className="text-gray-600">Audio Specialists</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-brand-teal mb-2">25+</div>
              <div className="text-gray-600">Audio Brands</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-brand-coral mb-2">1L+</div>
              <div className="text-gray-600">Audio Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-brand-teal mb-2">98%</div>
              <div className="text-gray-600">Team Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Work With Us */}
      <section id="culture" className="py-16 bg-brand-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-navy mb-4">Why Join SonicMart's Audio Team?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're building India's premier audio technology ecosystem while fostering a culture of sound innovation, 
              audio expertise collaboration, and professional growth in the audio industry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {companyBenefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Openings */}
      <section id="openings" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Current Openings</h2>
            <p className="text-xl text-gray-600">Find your next career opportunity with us</p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
            >
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
            >
              {locations.map(loc => (
                <option key={loc.id} value={loc.id}>{loc.name}</option>
              ))}
            </select>
          </div>

          {/* Job Listings */}
          <div className="space-y-6">
            {filteredJobs.length > 0 ? (
              filteredJobs.map(job => (
                <div key={job.id} className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          job.type === 'Full-time' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {job.type}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                          </svg>
                          {job.department.charAt(0).toUpperCase() + job.department.slice(1)}
                        </span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                          </svg>
                          {job.location}
                        </span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                          </svg>
                          {job.experience}
                        </span>
                      </div>

                      <p className="text-gray-700 mb-4">{job.description}</p>

                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill, index) => (
                          <span key={index} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 lg:mt-0 lg:ml-8">
                      <button className="w-full lg:w-auto bg-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors">
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No positions found</h3>
                <p className="text-gray-600">Try adjusting your filters or check back later for new openings.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Hiring Process</h2>
            <p className="text-xl text-gray-600">A transparent and efficient process designed to find the right fit</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Apply Online</h3>
              <p className="text-gray-600">Submit your application and resume through our online portal</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Initial Review</h3>
              <p className="text-gray-600">Our HR team reviews your application and contacts qualified candidates</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Interviews</h3>
              <p className="text-gray-600">Technical and cultural fit interviews with the hiring team</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Welcome Aboard</h3>
              <p className="text-gray-600">Onboarding and orientation to get you started on your journey</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Make Your Mark?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join us in shaping the future of audio technology and building products that bring joy to millions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:careers@sonicmart.in"
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Send Your Resume
            </a>
            <a
              href="#openings"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-purple-600 transition-colors"
            >
              Browse Positions
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CareersPage;