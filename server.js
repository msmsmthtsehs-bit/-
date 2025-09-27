const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// إعداد مجلد لرفع الصور
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// إعداد multer لرفع الصور
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// ملفات ثابتة
app.use(express.static('.'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// رفع منتج جديد
app.post('/upload', upload.single('image'), (req, res) => {
  const { name, description, price } = req.body;
  const image = req.file ? 'uploads/' + req.file.filename : '';

  // قراءة products.json
  const data = fs.existsSync('products.json') ? JSON.parse(fs.readFileSync('products.json')) : [];
  
  // إضافة المنتج الجديد
  data.push({ name, description, price, image });
  fs.writeFileSync('products.json', JSON.stringify(data, null, 2));
  res.send('تم رفع المنتج بنجاح!');
});

// تشغيل السيرفر
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
