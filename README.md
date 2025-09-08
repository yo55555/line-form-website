# LINE Form Website

เว็บไซต์ฟอร์ม LINE ที่จำลองหน้าตาและการทำงานของแอป LINE จริง

## 🌟 ฟีเจอร์

- **3 หน้าหลัก**: รหัสยืนยันตัวตน, ฟอร์มกรอกข้อมูล, และ QR Code
- **Responsive Design**: รองรับการใช้งานบนมือถือและเดสก์ท็อป
- **ส่งข้อมูลไป Google Sheets**: เชื่อมต่อกับ Google Sheets โดยตรง
- **UI/UX เหมือน LINE**: ออกแบบให้เหมือนกับแอป LINE จริง

## 🚀 การติดตั้งและใช้งาน

### 1. Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/line-form-website.git
cd line-form-website
```

### 2. ติดตั้ง Dependencies
```bash
pnpm install
# หรือ
npm install
```

### 3. รันในโหมด Development
```bash
pnpm run dev
# หรือ
npm run dev
```

### 4. Build สำหรับ Production
```bash
pnpm run build
# หรือ
npm run build
```

## 📋 การตั้งค่า Google Sheets

### ขั้นตอนการเชื่อมต่อกับ Google Sheets:

1. **เปิด Google Sheets** ที่ต้องการรับข้อมูล
2. **สร้าง Google Apps Script**:
   - คลิก Extensions > Apps Script
   - ใส่โค้ดนี้:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      new Date(),
      data.firstName,
      data.lastName
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({result: 'success'}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({result: 'error', error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. **Deploy Script**:
   - คลิก Deploy > New deployment
   - เลือก type: Web app
   - Execute as: Me
   - Who has access: Anyone
   - คัดลอก Web app URL

4. **อัปเดต URL ในโค้ด**:
   - แก้ไขไฟล์ `src/App.jsx` บรรทัดที่ 45
   - ใส่ Web app URL ที่คัดลอกมา

## 🌐 การ Deploy ไป GitHub Pages

### วิธีที่ 1: ใช้ GitHub Actions (แนะนำ)

1. **สร้าง GitHub Repository**:
   ```bash
   # สร้าง repository ใหม่บน GitHub
   # แล้ว push โค้ดขึ้นไป
   git remote add origin https://github.com/YOUR_USERNAME/line-form-website.git
   git branch -M main
   git push -u origin main
   ```

2. **เปิดใช้ GitHub Pages**:
   - ไปที่ Settings > Pages
   - Source: GitHub Actions
   - GitHub Actions จะ deploy อัตโนมัติ

### วิธีที่ 2: Manual Deploy

1. **Build โปรเจกต์**:
   ```bash
   pnpm run build
   ```

2. **Deploy ไฟล์ใน folder dist**:
   - อัปโหลดไฟล์ใน folder `dist` ไปยัง hosting service
   - หรือใช้ GitHub Pages manual upload

## 🛠️ การแก้ไขและเพิ่มฟีเจอร์

### โครงสร้างไฟล์สำคัญ:

```
src/
├── App.jsx          # ไฟล์หลักที่มีทุกหน้า
├── App.css          # สไตล์หลัก
├── components/ui/   # UI Components
└── assets/          # รูปภาพและไฟล์สื่อ
```

### การแก้ไขหน้าตา:
- แก้ไขไฟล์ `src/App.jsx` สำหรับเปลี่ยนเนื้อหา
- แก้ไขไฟล์ `src/App.css` สำหรับเปลี่ยนสไตล์

### การเพิ่มฟีเจอร์ใหม่:
- เพิ่มฟิลด์ใหม่ในฟอร์ม: แก้ไข `formData` state
- เพิ่มหน้าใหม่: เพิ่ม step ใหม่และ render function
- เปลี่ยนสี/ธีม: แก้ไข CSS classes

## 🎨 การปรับแต่งธีม

### เปลี่ยนสีหลัก:
```css
/* ใน App.css */
.text-green-500 { color: #สีที่ต้องการ; }
.bg-green-500 { background-color: #สีที่ต้องการ; }
```

### เพิ่มแอนิเมชัน:
```css
/* เพิ่มใน App.css */
.fade-in {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

## 📱 การทดสอบ

### ทดสอบบนอุปกรณ์ต่างๆ:
```bash
# รันเซิร์ฟเวอร์ที่เข้าถึงได้จากเครือข่าย
pnpm run dev --host
```

### ทดสอบการส่งข้อมูล:
1. กรอกฟอร์มและส่งข้อมูล
2. ตรวจสอบใน Google Sheets
3. ดู Console ในเบราว์เซอร์หากมีข้อผิดพลาด

## 🔧 การแก้ไขปัญหา

### ปัญหาที่พบบ่อย:

1. **ข้อมูลไม่ส่งไป Google Sheets**:
   - ตรวจสอบ Web app URL
   - ตรวจสอบการตั้งค่า permissions ใน Apps Script

2. **เว็บไซต์ไม่แสดงผลถูกต้อง**:
   - ลองรัน `pnpm run build` ใหม่
   - ตรวจสอบ Console ในเบราว์เซอร์

3. **GitHub Pages ไม่อัปเดต**:
   - ตรวจสอบ Actions tab ใน GitHub
   - ตรวจสอบการตั้งค่า Pages ใน Settings

## 📞 การสนับสนุน

หากมีปัญหาหรือต้องการความช่วยเหลือ:
1. ตรวจสอบ Issues ใน GitHub Repository
2. สร้าง Issue ใหม่พร้อมรายละเอียดปัญหา
3. ดู Documentation ของ React และ Vite

## 📄 License

MIT License - ใช้งานได้อย่างอิสระ

