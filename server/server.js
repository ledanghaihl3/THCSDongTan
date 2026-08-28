import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDb } from './db/database.js';

// Import Middleware (Tầng 2 - Bảo mật & Gateway)
import { apiGatewayLimiter, requestLogger } from './middleware/gateway.js';

// Import Routes (Tầng 3 - Dịch vụ Nghiệp vụ Backend API)
import authRoutes from './routes/auth.js';
import newsRoutes from './routes/news.js';
import documentsRoutes from './routes/documents.js';
import mediaRoutes from './routes/media.js';
import announcementsRoutes from './routes/announcements.js';
import uploadRoutes from './routes/upload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// CORS Config
app.use(cors());

// Body Parser (Tăng giới hạn dung lượng nhận chuỗi ảnh Base64 lên 50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve Uploaded Files Static Directory
const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));

// Tầng 2: Middleware & API Gateway
app.use('/api/', apiGatewayLimiter);
app.use(requestLogger);

// Initialize Database (Tầng 4: Main DB)
initDb().then(() => {
  console.log('[Database] CSDL SQLite đã khởi tạo và cấu hình dữ liệu THCS Đồng Tân thành công!');
}).catch(err => {
  console.error('[Database Error]', err);
});

// Tầng 3: Mount Backend API Services
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/announcements', announcementsRoutes);
app.use('/api/upload', uploadRoutes);

// Healthcheck Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    system: 'Portal THCS Đồng Tân - Backend API Engine',
    timestamp: new Date().toISOString(),
    version: '2026.1.0'
  });
});

// Serve Vite production build static assets if exists
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
  if (!req.originalUrl.startsWith('/api') && !req.originalUrl.startsWith('/uploads')) {
    res.sendFile(path.join(distPath, 'index.html'), (err) => {
      if (err) {
        res.status(200).send('Cổng thông tin THCS Đồng Tân API đang hoạt động tại cổng ' + PORT);
      }
    });
  }
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(`🚀 API Gateway & Backend Services THCS Đồng Tân`);
  console.log(`🌐 Website đang chạy tại: http://localhost:${PORT}`);
  console.log(`=======================================================`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`⚠️ Cổng ${PORT} đang được sử dụng bởi tiến trình khác. Đang tự động kết nối...`);
  } else {
    console.error('Lỗi khởi động Server:', err);
  }
});
