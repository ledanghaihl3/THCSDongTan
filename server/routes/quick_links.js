import express from 'express';
import { get, query, run } from '../db/database.js';

const router = express.Router();

// GET /api/quick-links (Lấy danh sách tất cả các liên kết nhanh)
router.get('/', async (req, res) => {
  try {
    const links = await query('SELECT * FROM quick_links ORDER BY sortOrder ASC, id ASC');
    res.json({ success: true, data: links });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách liên kết nhanh', error: err.message });
  }
});

// POST /api/quick-links (Thêm liên kết mới)
router.post('/', async (req, res) => {
  try {
    const { title, url, target, position, sortOrder } = req.body;
    if (!title || !url) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập tên chữ hiển thị và đường link liên kết' });
    }

    const result = await run(
      `INSERT INTO quick_links (title, url, target, position, sortOrder) VALUES (?, ?, ?, ?, ?)`,
      [
        title, 
        url, 
        target || '_blank', 
        position || 'footer', 
        sortOrder ? parseInt(sortOrder) : 0
      ]
    );

    res.json({
      success: true,
      message: 'Thêm liên kết mới thành công!',
      data: {
        id: result.id,
        title,
        url,
        target: target || '_blank',
        position: position || 'footer',
        sortOrder: sortOrder ? parseInt(sortOrder) : 0
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi khi tạo liên kết mới', error: err.message });
  }
});

// PUT /api/quick-links/:id (Cập nhật tên chữ & đường link)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, url, target, position, sortOrder } = req.body;

    if (!title || !url) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ tên chữ hiển thị và đường link' });
    }

    await run(
      `UPDATE quick_links SET title = ?, url = ?, target = ?, position = ?, sortOrder = ? WHERE id = ?`,
      [
        title, 
        url, 
        target || '_blank', 
        position || 'footer', 
        sortOrder !== undefined ? parseInt(sortOrder) : 0, 
        id
      ]
    );

    res.json({
      success: true,
      message: 'Cập nhật chữ & đường link liên kết thành công!'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi khi cập nhật liên kết', error: err.message });
  }
});

// DELETE /api/quick-links/:id (Xóa liên kết)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await run('DELETE FROM quick_links WHERE id = ?', [id]);
    res.json({ success: true, message: 'Đã xóa liên kết thành công!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi khi xóa liên kết', error: err.message });
  }
});

export default router;
