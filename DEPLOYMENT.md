# 🚀 คู่มือการ Deploy โปรเจค Toilet Check-in บน Railway

## 📋 สิ่งที่ต้องเตรียม

- [ ] บัญชี GitHub (ฟรี)
- [ ] บัญชี Railway (ฟรี - มี $5 credit)
- [ ] Credit Card สำหรับยืนยันตัวตน (ไม่เสียเงินถ้าใช้แค่ $5 credit)
- [ ] Facebook App ID & Secret (สำหรับ OAuth)
- [ ] Google Client ID & Secret (สำหรับ OAuth)

---

## 🎯 ขั้นตอนการ Deploy (ทั้งหมด 7 ขั้นตอน)

### ขั้นตอนที่ 1: เตรียม Code บน GitHub

#### 1.1 สร้าง GitHub Repository (ถ้ายังไม่มี)

1. ไปที่ https://github.com/new
2. ตั้งชื่อ repository เช่น `toilet-check-in`
3. เลือก **Public** หรือ **Private** (Railway รองรับทั้งสองแบบ)
4. คลิก **Create repository**

#### 1.2 Push Code ขึ้น GitHub

เปิด Terminal/PowerShell ในโฟลเดอร์โปรเจค แล้วรันคำสั่ง:

```bash
# ถ้ายังไม่ได้ init git
git init

# เพิ่มไฟล์ทั้งหมด
git add .

# Commit
git commit -m "Initial commit for deployment"

# เชื่อมต่อกับ GitHub (เปลี่ยน YOUR_USERNAME และ YOUR_REPO)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push ขึ้น GitHub
git branch -M main
git push -u origin main
```

> [!TIP]
> ถ้า push ไม่ได้ อาจต้อง login GitHub ก่อน หรือใช้ GitHub Desktop แทน

---

### ขั้นตอนที่ 2: สร้างบัญชี Railway

1. ไปที่ https://railway.app
2. คลิก **Login** ที่มุมบนขวา
3. เลือก **Login with GitHub**
4. อนุญาต Railway เข้าถึง GitHub account ของคุณ
5. ยืนยันตัวตนด้วย Credit Card (ไม่เสียเงิน - แค่ยืนยัน)

> [!IMPORTANT]
> Railway จะให้ **$5 credit ฟรีทุกเดือน** ซึ่งพอใช้งานโปรเจคขนาดเล็ก-กลางได้

---

### ขั้นตอนที่ 3: สร้าง Project บน Railway

1. ที่หน้า Dashboard คลิก **New Project**
2. เลือก **Deploy from GitHub repo**
3. เลือก repository `toilet-check-in` ที่เพิ่งสร้าง
4. Railway จะเริ่ม analyze โปรเจคอัตโนมัติ

---

### ขั้นตอนที่ 4: เพิ่ม MySQL Database

1. ในหน้า Project คลิก **New** (ปุ่ม + ด้านบน)
2. เลือก **Database** → **Add MySQL**
3. Railway จะสร้าง MySQL database ให้อัตโนมัติ
4. คลิกที่ MySQL service → ไปที่แท็บ **Variables**
5. **จดค่าเหล่านี้ไว้** (จะใช้ในขั้นตอนถัดไป):
   - `MYSQL_HOST`
   - `MYSQL_PORT`
   - `MYSQL_USER`
   - `MYSQL_PASSWORD`
   - `MYSQL_DATABASE`

---

### ขั้นตอนที่ 5: ตั้งค่า Environment Variables

#### 5.1 ตั้งค่าสำหรับ Backend

1. คลิกที่ **backend** service
2. ไปที่แท็บ **Variables**
3. คลิก **New Variable** และเพิ่มตัวแปรเหล่านี้:

```bash
# Database Configuration
DB_HOST=<คัดลอกจาก MySQL service - MYSQL_HOST>
DB_PORT=<คัดลอกจาก MySQL service - MYSQL_PORT>
DB_USER=<คัดลอกจาก MySQL service - MYSQL_USER>
DB_PASS=<คัดลอกจาก MySQL service - MYSQL_PASSWORD>
DB_NAME=<คัดลอกจาก MySQL service - MYSQL_DATABASE>

# Session Secret (สร้างใหม่ - ต้องยาวและสุ่ม)
SECRET=your-super-secret-session-key-change-this-in-production

# Client URL (จะได้หลังจาก deploy frontend)
CLIENT=https://your-frontend-url.railway.app

# Facebook OAuth (ใช้ค่าจาก Facebook Developer Console)
FACEBOOK_CLIENT_ID=your-facebook-app-id
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret
FACEBOOK_CALLBACK_URL=https://your-backend-url.railway.app/auth/facebook/callback

# Google OAuth (ใช้ค่าจาก Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://your-backend-url.railway.app/auth/google/callback
```

> [!WARNING]
> **ต้องเปลี่ยน URL ให้ถูกต้อง!**
> - `your-backend-url.railway.app` → URL จริงของ backend (ดูได้จาก Settings → Domains)
> - `your-frontend-url.railway.app` → URL จริงของ frontend

#### 5.2 หา URL ของ Backend

1. คลิกที่ **backend** service
2. ไปที่แท็บ **Settings**
3. ในส่วน **Domains** คลิก **Generate Domain**
4. คัดลอก URL ที่ได้ (จะเป็นแบบ `backend-production-xxxx.up.railway.app`)
5. นำไปใส่ใน `FACEBOOK_CALLBACK_URL` และ `GOOGLE_CALLBACK_URL`

#### 5.3 ตั้งค่าสำหรับ Frontend

1. คลิกที่ **frontend** service
2. ไปที่แท็บ **Variables**
3. เพิ่มตัวแปร:

```bash
# Backend API URL
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
```

#### 5.4 หา URL ของ Frontend

1. คลิกที่ **frontend** service
2. ไปที่แท็บ **Settings**
3. ในส่วน **Domains** คลิก **Generate Domain**
4. คัดลอก URL ที่ได้
5. **กลับไปแก้ไข** `CLIENT` variable ใน backend service ให้เป็น URL นี้

---

### ขั้นตอนที่ 6: อัพเดท OAuth Callback URLs

> [!IMPORTANT]
> **ขั้นตอนนี้สำคัญมาก!** ถ้าไม่ทำ Login จะไม่ได้

#### 6.1 Facebook Developer Console

1. ไปที่ https://developers.facebook.com/apps
2. เลือก App ของคุณ
3. ไปที่ **Settings** → **Basic**
4. ในส่วน **App Domains** เพิ่ม:
   ```
   your-backend-url.railway.app
   ```
5. ไปที่ **Facebook Login** → **Settings**
6. ในส่วน **Valid OAuth Redirect URIs** เพิ่ม:
   ```
   https://your-backend-url.railway.app/auth/facebook/callback
   ```
7. คลิก **Save Changes**

#### 6.2 Google Cloud Console

1. ไปที่ https://console.cloud.google.com/apis/credentials
2. เลือก OAuth 2.0 Client ID ของคุณ
3. ในส่วน **Authorized redirect URIs** เพิ่ม:
   ```
   https://your-backend-url.railway.app/auth/google/callback
   ```
4. คลิก **Save**

---

### ขั้นตอนที่ 7: Deploy และ Run Migration

#### 7.1 Deploy Services

Railway จะ deploy อัตโนมัติเมื่อคุณ push code หรือเปลี่ยน variables

ตรวจสอบสถานะ:
1. ดูที่แต่ละ service ว่ามีสถานะ **Active** (สีเขียว)
2. ถ้ามีปัญหา ดู logs ได้ที่แท็บ **Deployments**

#### 7.2 Run Database Migration

1. คลิกที่ **backend** service
2. ไปที่แท็บ **Deployments**
3. คลิกที่ deployment ล่าสุด
4. เลื่อนลงไปหา **Command** section
5. รันคำสั่ง:
   ```bash
   npm run migrate
   ```

หรือถ้า Railway ไม่มี command console ให้:
1. เชื่อมต่อ MySQL ด้วย MySQL Workbench หรือ phpMyAdmin
2. Import ไฟล์ SQL schema ด้วยตัวเอง

---

## ✅ ตรวจสอบว่า Deploy สำเร็จ

### ทดสอบ Backend

เปิดเบราว์เซอร์ไปที่:
```
https://your-backend-url.railway.app
```

ควรเห็นข้อความหรือ API response

### ทดสอบ Frontend

เปิดเบราว์เซอร์ไปที่:
```
https://your-frontend-url.railway.app
```

ควรเห็นหน้าเว็บโหลดขึ้นมา

### ทดสอบ OAuth Login

1. คลิกปุ่ม Login with Facebook
2. ควรเด้งไปหน้า Facebook login
3. หลัง authorize ควร redirect กลับมาที่เว็บและ login สำเร็จ
4. ทดสอบเช่นเดียวกันกับ Google

---

## 🔧 แก้ปัญหาที่พบบ่อย

### ปัญหา: Backend ไม่เชื่อมต่อ Database

**วิธีแก้:**
1. ตรวจสอบว่า environment variables ถูกต้อง
2. ตรวจสอบว่า MySQL service กำลัง running
3. ดู logs ของ backend service

### ปัญหา: OAuth Login ไม่ได้

**วิธีแก้:**
1. ตรวจสอบว่า callback URLs ใน Facebook/Google ถูกต้อง
2. ตรวจสอบว่าใช้ HTTPS (ไม่ใช่ HTTP)
3. ตรวจสอบว่า `CLIENT` variable ใน backend ถูกต้อง

### ปัญหา: Frontend ไม่เชื่อมต่อ Backend

**วิธีแก้:**
1. ตรวจสอบ `NEXT_PUBLIC_API_URL` ใน frontend variables
2. ตรวจสอบว่า backend เปิด CORS ให้ frontend domain

### ปัญหา: เกิน $5 Credit

**วิธีแก้:**
1. ลด resource usage (ปิด services ที่ไม่ใช้)
2. ใช้ sleep mode สำหรับ services ที่ไม่ได้ใช้ตลอดเวลา
3. Upgrade เป็น Hobby plan ($5/เดือน)

---

## 💰 ประมาณการค่าใช้จ่าย

**สำหรับโปรเจคนี้:**
- Frontend (Next.js): ~$1-2/เดือน
- Backend (Node.js): ~$2-3/เดือน
- MySQL Database: ~$1-2/เดือน
- **รวม: ~$4-7/เดือน**

✅ **อยู่ในงบ $5 credit ฟรี!** (ถ้าใช้งานไม่หนักมาก)

---

## 📚 ทรัพยากรเพิ่มเติม

- [Railway Documentation](https://docs.railway.app/)
- [Railway Discord Community](https://discord.gg/railway)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)

---

## 🎉 เสร็จแล้ว!

ตอนนี้โปรเจคของคุณ deploy แล้วและพร้อมใช้งานบนอินเทอร์เน็ต! 🚀

**URLs ของคุณ:**
- Frontend: `https://your-frontend-url.railway.app`
- Backend: `https://your-backend-url.railway.app`
- Database: (เชื่อมต่อผ่าน backend)

---

## 📝 หมายเหตุสำคัญ

> [!CAUTION]
> **อย่าลืม:**
> 1. เปลี่ยน `SECRET` ให้เป็นค่าที่ปลอดภัย (สุ่มยาวๆ)
> 2. อัพเดท OAuth callback URLs ใน Facebook และ Google
> 3. ตรวจสอบ usage ของ Railway เป็นประจำ
> 4. Backup database เป็นระยะ

> [!TIP]
> **Auto-deploy:**
> Railway จะ deploy อัตโนมัติทุกครั้งที่คุณ `git push` ไปที่ GitHub!
