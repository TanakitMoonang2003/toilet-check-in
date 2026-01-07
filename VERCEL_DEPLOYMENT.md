# 🚀 คู่มือการ Deploy Frontend บน Vercel

## 📋 สิ่งที่ต้องเตรียม

- [ ] บัญชี GitHub (พร้อม repository ที่มี code แล้ว)
- [ ] บัญชี Vercel (ฟรี - เชื่อมกับ GitHub)
- [ ] Backend ที่ deploy แล้ว (Railway หรือ platform อื่น)
- [ ] Mapbox Token (ถ้ายังไม่มี สมัครได้ที่ https://account.mapbox.com/)

---

## 🎯 ขั้นตอนการ Deploy (4 ขั้นตอน)

### ขั้นตอนที่ 1: เตรียม Code สำหรับ Vercel

#### 1.1 อัพเดท next.config.js

แก้ไขไฟล์ `frontend/next.config.js` ให้ API ชี้ไปที่ backend ที่ deploy แล้ว:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://your-backend-url.railway.app/api/:path*', // เปลี่ยนเป็น URL จริง
      },
    ];
  },
  env: {
    NEXT_PUBLIC_URL: 'https://your-frontend-url.vercel.app/', // จะได้หลัง deploy
    NEXT_PUBLIC_BACK_END: 'https://your-backend-url.railway.app/', // URL จริงของ backend
    NEXT_PUBLIC_MAPBOX_TOKEN: 'your-mapbox-token' // ใส่ token จริง
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'your-backend-url.railway.app', // เปลี่ยนเป็น domain จริง
        pathname: '/images/**',
      },
    ],
  },
};

module.exports = nextConfig;
```

> [!IMPORTANT]
> เปลี่ยน `your-backend-url.railway.app` เป็น URL จริงของ backend ที่ deploy แล้ว

#### 1.2 Commit และ Push Code

```bash
git add .
git commit -m "Update config for Vercel deployment"
git push
```

---

### ขั้นตอนที่ 2: สร้างบัญชี Vercel

1. ไปที่ https://vercel.com
2. คลิก **Sign Up** หรือ **Login with GitHub**
3. อนุญาต Vercel เข้าถึง GitHub account

---

### ขั้นตอนที่ 3: Deploy Frontend

1. ที่หน้า Dashboard คลิก **New Project**
2. เลือก **Import Git Repository**
3. เลือก repository `toilet-check-in`
4. **ตั้งค่า Project**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend` (สำคัญ! เพราะ code อยู่โฟลเดอร์นี้)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

5. คลิก **Deploy**

Vercel จะเริ่ม build และ deploy อัตโนมัติ!

---

### ขั้นตอนที่ 4: ตั้งค่า Environment Variables

หลังจาก deploy เสร็จ ให้ตั้งค่า environment variables:

1. ไปที่ Project Settings → Environment Variables
2. เพิ่มตัวแปรเหล่านี้:

```bash
NEXT_PUBLIC_URL=https://your-project-name.vercel.app
NEXT_PUBLIC_BACK_END=https://your-backend-url.railway.app
NEXT_PUBLIC_MAPBOX_TOKEN=your-mapbox-token
```

3. คลิก **Save**
4. **Redeploy** เพื่อให้ environment variables มีผล

---

## ✅ ตรวจสอบการ Deploy

### ทดสอบ Frontend

เปิดเบราว์เซอร์ไปที่ URL ที่ Vercel ให้มา (เช่น `https://toilet-check-in.vercel.app`)

ควรเห็นหน้าเว็บโหลดขึ้นมา

### ทดสอบการเชื่อมต่อ Backend

1. ลองเข้าหน้า Map หรือหน้า Login
2. ตรวจสอบ Console ใน Browser (F12) ว่าไม่มี error เกี่ยวกับ API calls

---

## 🔧 แก้ปัญหาที่พบบ่อย

### ปัญหา: API Calls ไม่ได้

**วิธีแก้:**
1. ตรวจสอบว่า `next.config.js` ชี้ไปที่ backend URL ที่ถูกต้อง
2. ตรวจสอบว่า backend เปิด CORS ให้ Vercel domain
3. ตรวจสอบ environment variables ใน Vercel

### ปัญหา: Images ไม่โหลด

**วิธีแก้:**
1. ตรวจสอบ `remotePatterns` ใน `next.config.js`
2. ตรวจสอบว่า backend URL ใน `remotePatterns` ถูกต้อง

### ปัญหา: Mapbox ไม่ทำงาน

**วิธีแก้:**
1. ตรวจสอบว่า `NEXT_PUBLIC_MAPBOX_TOKEN` ถูกตั้งค่า
2. ตรวจสอบว่า token ยัง active อยู่

---

## 💰 ค่าใช้จ่าย Vercel

- **Hobby Plan**: ฟรี! (100GB bandwidth/เดือน)
- **Pro Plan**: $20/เดือน (สำหรับทีมหรือ traffic สูง)

✅ **ฟรีสำหรับโปรเจคส่วนตัว!**

---

## 📝 หมายเหตุสำคัญ

- Vercel จะ redeploy อัตโนมัติทุกครั้งที่ push code ขึ้น GitHub
- ถ้าต้องการ custom domain สามารถตั้งค่าได้ใน Settings
- สำหรับ production ควรตั้งค่า Analytics และ Monitoring