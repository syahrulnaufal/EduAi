import React, { useState, useRef, useEffect } from 'react';

const EditProfileModal = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    profileImage: null
  });
  const [previewImage, setPreviewImage] = useState(user?.profileImage || null);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'password'
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const fileInputRef = useRef(null);

  // Animation effect when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profileImage: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle save
  const handleSave = async () => {
    // Show confirmation dialog first
    const result = await Swal.fire({
      icon: 'question',
      title: 'Konfirmasi Perubahan',
      text: activeTab === 'password' 
        ? 'Apakah Anda yakin ingin mengubah password?' 
        : 'Apakah Anda yakin ingin menyimpan perubahan profile?',
      showCancelButton: true,
      confirmButtonColor: '#8B5CF6',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Ya, Simpan',
      cancelButtonText: 'Batal',
      reverseButtons: true
    });

    // If user cancels, don't proceed
    if (!result.isConfirmed) {
      return;
    }

    setIsLoading(true);
    try {
      if (activeTab === 'password') {
        if (formData.newPassword !== formData.confirmPassword) {
          Swal.fire({
            icon: 'error',
            title: 'Password Tidak Cocok',
            text: 'Password baru dan konfirmasi password tidak sama',
            confirmButtonColor: '#8B5CF6'
          });
          return;
        }
        if (formData.newPassword.length < 6) {
          Swal.fire({
            icon: 'warning',
            title: 'Password Terlalu Pendek',
            text: 'Password minimal 6 karakter',
            confirmButtonColor: '#8B5CF6'
          });
          return;
        }
      }
      
      await onSave(formData, activeTab);
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('profileUpdated'));
      
      // Show success notification
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: activeTab === 'password' ? 'Password berhasil diubah' : 'Profile berhasil diperbarui',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
      
      onClose();
    } catch (error) {
      console.error('Error saving profile:', error);
      Swal.fire({
        icon: 'error',
        title: 'Terjadi Kesalahan',
        text: 'Gagal menyimpan perubahan. Silakan coba lagi.',
        confirmButtonColor: '#8B5CF6'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get user initials for default avatar
  const getUserInitials = (username) => {
    if (!username) return "U";
    const names = username.split(' ');
    if (names.length >= 2) {
      return names[0][0].toUpperCase() + names[1][0].toUpperCase();
    }
    return username[0].toUpperCase();
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}>
      <div className={`bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto transform transition-all duration-300 ${
        isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 hover:rotate-90"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-4 px-6 text-sm font-semibold transition-all duration-200 ${
              activeTab === 'profile' 
                ? 'border-b-2 border-purple-500 text-purple-600 bg-purple-50/50' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            Profile Info
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`flex-1 py-4 px-6 text-sm font-semibold transition-all duration-200 ${
              activeTab === 'password' 
                ? 'border-b-2 border-purple-500 text-purple-600 bg-purple-50/50' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            Change Password
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {activeTab === 'profile' ? (
            <>
              {/* Profile Picture */}
              <div className="text-center mb-8">
                <div className="relative inline-block z-10">
                  <div
                    className="relative w-28 h-28 rounded-full flex items-center justify-center mx-auto"
                    style={{ background: 'conic-gradient(#8B5CF6 65%, #E5E7EB 0)' }}
                  >
                    <div className="absolute w-[104px] h-[104px] bg-white rounded-full z-1"></div>
                    {previewImage ? (
                      <img 
                        src={previewImage} 
                        alt="Profile" 
                        className="w-24 h-24 rounded-full relative z-10 object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold relative z-10">
                        {getUserInitials(formData.username)}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-purple-500 text-white p-3 rounded-full hover:bg-purple-600 transition-all duration-200 z-30 shadow-lg hover:shadow-xl hover:scale-110"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <p className="text-sm text-gray-500 mt-3">Click the + button to change photo</p>
              </div>

              {/* Username */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your username"
                />
              </div>

              {/* Email */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>
            </>
          ) : (
            <>
              {/* Current Password */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                  placeholder="Enter current password"
                />
              </div>

              {/* New Password */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                  placeholder="Enter new password"
                />
              </div>

              {/* Confirm Password */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                  placeholder="Confirm new password"
                />
              </div>
            </>
          )}

          {/* Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Saving...
                </div>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;