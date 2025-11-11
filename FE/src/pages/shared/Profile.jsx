import { useAuth } from '../../context/AuthContext'
import { useState } from 'react'
// import apiClient from '../../services/apiClient' // Uncomment when backend is ready

function Profile() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)

  // Mock user data - in real app, fetch from API
  const profileData = {
    avatar: null, // Can be image URL
    name: user?.name || 'Nguyen Thanh Dat',
    username: '@sliderb00',
    major: 'Computer Science',
    class: 'CC23KHMT',
    studentId: '2352237',
    
    // Personal Info
    fullName: 'Nguyen Thanh Dat',
    gender: 'Male',
    country: 'Vietnam',
    
    // Contact Info
    studentEmail: 'dat.nguyen1206@hcmut.edu.vn',
    personalEmail: 'sliderboo2005@gmail.com',
    phoneNumber: '0382855660',
    address: '268 Ly Thuong Kiet, Phuong Dien Hong, TP.HCM',
    
    // Access History
    lastAccess: 'October 25, 2025'
  }

  // State for edited data (only contact fields)
  const [editedData, setEditedData] = useState({
    personalEmail: profileData.personalEmail,
    phoneNumber: profileData.phoneNumber,
    address: profileData.address
  })

  // Handle input changes
  const handleChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }))
    setError(null)
  }

  // Validate form data
  const validateForm = () => {
    if (!editedData.phoneNumber.trim()) {
      setError('Phone number is required')
      return false
    }
    if (editedData.personalEmail && !editedData.personalEmail.includes('@')) {
      setError('Please enter a valid email address')
      return false
    }
    // Add more validations as needed
    return true
  }

  // Handle save
  const handleSave = async () => {
    if (!validateForm()) return

    setIsSaving(true)
    setError(null)

    try {
      // BACKEND INTEGRATION POINT
      // Uncomment this when your backend API is ready:
      /*
      const response = await apiClient.put('/user/profile', {
        personalEmail: editedData.personalEmail,
        phoneNumber: editedData.phoneNumber,
        address: editedData.address
      })
      
      // Update user context if needed
      // updateUser(response.data)
      */

      // Mock success - Remove this when backend is ready
      await new Promise(resolve => setTimeout(resolve, 500))
      console.log('Profile updated (mock):', editedData)
      
      setIsEditing(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile')
      console.error('Update profile error:', err)
    } finally {
      setIsSaving(false)
    }
  }

  // Handle cancel
  const handleCancel = () => {
    // Reset to original data
    setEditedData({
      personalEmail: profileData.personalEmail,
      phoneNumber: profileData.phoneNumber,
      address: profileData.address
    })
    setError(null)
    setIsEditing(false)
  }

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Header Background */}
          <div className="h-48 bg-gradient-to-r from-purple-900 via-purple-700 to-pink-600 relative">
            {/* Avatar */}
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-12">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                {profileData.avatar ? (
                  <img src={profileData.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {getInitials(profileData.name)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Header Info */}
          <div className="pt-16 px-8 pb-6 border-b border-gray-100">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{profileData.name}</h1>
              <p className="text-gray-500 text-sm mb-2">{profileData.username}</p>
              <p className="text-gray-700 font-medium">{profileData.major}</p>
            </div>

            {/* Class and Student ID - Centered */}
            <div className="flex justify-center gap-8 mt-6">
              <div className="text-center">
                <p className="text-gray-500 text-sm mb-1">Class</p>
                <p className="text-gray-900 font-semibold text-lg">{profileData.class}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-500 text-sm mb-1">StudentID</p>
                <p className="text-gray-900 font-semibold text-lg">{profileData.studentId}</p>
              </div>
            </div>

            {/* Edit Button - Centered below */}
            <div className="flex justify-center mt-6">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-center">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </div>

          {/* Personal Section */}
          <div className="px-8 py-6 border-b border-gray-100">
            <div className="border-2 border-blue-100 rounded-xl p-6 bg-blue-50/30">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                Personal
              </h2>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Full Name</label>
                  <p className="text-gray-900 font-medium">{profileData.fullName}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Gender</label>
                  <p className="text-gray-900 font-medium">{profileData.gender}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Country</label>
                  <p className="text-gray-900 font-medium">{profileData.country}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="px-8 py-6 border-b border-gray-100">
            <div className="border-2 border-blue-100 rounded-xl p-6 bg-blue-50/30">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                Contact
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Student Email</label>
                    <p className="text-gray-900 font-medium break-all">{profileData.studentEmail}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Phone Number</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editedData.phoneNumber}
                        onChange={(e) => handleChange('phoneNumber', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        placeholder="Enter phone number"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">{profileData.phoneNumber}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Personal Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedData.personalEmail}
                        onChange={(e) => handleChange('personalEmail', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        placeholder="Enter personal email"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium break-all">{profileData.personalEmail}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Address</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.address}
                        onChange={(e) => handleChange('address', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        placeholder="Enter address"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">{profileData.address}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Access History Section */}
          <div className="px-8 py-6">
            <div className="border-2 border-blue-100 rounded-xl p-6 bg-blue-50/30">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                Access History
              </h2>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Last Access</label>
                <p className="text-gray-900 font-medium">{profileData.lastAccess}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
