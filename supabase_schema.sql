-- ==============================================================================
-- KỊCH BẢN KHỞI TẠO TOÀN BỘ CƠ SỞ DỮ LIỆU CHUẨN DÀNH CHO SUPABASE CLOUD
-- Dự án: Trường THCS Đồng Tân (Lang Son)
-- Supabase URL: https://mwhnntsojaxehyqoxapr.supabase.co
-- ==============================================================================

-- 1. XÓA BẢNG CŨ (NẾU TỒN TẠI) ĐỂ KHỞI TẠO MỚI TOÀN BỘ
DROP TABLE IF EXISTS public.contacts CASCADE;
DROP TABLE IF EXISTS public.schedules CASCADE;
DROP TABLE IF EXISTS public.resources CASCADE;
DROP TABLE IF EXISTS public.videos CASCADE;
DROP TABLE IF EXISTS public.albums CASCADE;
DROP TABLE IF EXISTS public.documents CASCADE;
DROP TABLE IF EXISTS public.articles CASCADE;
DROP TABLE IF EXISTS public.site_config CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- ==============================================================================
-- 2. ĐỊNH NGHĨA CÁC BẢNG DỮ LIỆU CHÍNH (TABLE DEFINITIONS)
-- ==============================================================================

-- BẢNG 1: TÀI KHOẢN NGƯỜI DÙNG (USERS)
CREATE TABLE public.users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'GIAO_VIEN', -- 'BGH', 'ADMIN', 'GIAO_VIEN', 'HOC_SINH', 'PHU_HUYNH'
    email VARCHAR(255),
    avatar TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
    status VARCHAR(50) DEFAULT 'ACTIVE', -- 'ACTIVE', 'PENDING', 'BLOCKED'
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- BẢNG 2: CẤU HÌNH TRANG WEB VÀ THÔNG TIN TRƯỜNG (SITE CONFIG)
CREATE TABLE public.site_config (
    id INT PRIMARY KEY DEFAULT 1,
    school_name VARCHAR(255) DEFAULT 'TRƯỜNG THCS ĐỒNG TÂN',
    slogan VARCHAR(255) DEFAULT 'Kỷ cương - Tình thương - Trách nhiệm - Hiệu quả',
    address VARCHAR(255) DEFAULT 'Thôn Đồng Tân, Xã Đồng Tân, Huyện Hữu Lũng, Tỉnh Lạng Sơn',
    phone VARCHAR(50) DEFAULT '0205.3828.123',
    email VARCHAR(100) DEFAULT 'thcsdongtan@langson.edu.vn',
    banner_url TEXT DEFAULT 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&q=80',
    logo_url TEXT DEFAULT '',
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- BẢNG 3: TIN TỨC VÀ BÀI VIẾT TUYÊN TRUYỀN (ARTICLES)
CREATE TABLE public.articles (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    summary TEXT,
    content TEXT NOT NULL,
    image_url TEXT,
    category_name VARCHAR(100) DEFAULT 'Tin tức chung',
    author VARCHAR(255) DEFAULT 'Ban Biên Tập THCS Đồng Tân',
    views INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- BẢNG 4: VĂN BẢN CHỈ ĐẠO VÀ QUY CHẾ CHUYÊN MÔN (DOCUMENTS)
CREATE TABLE public.documents (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(100),
    title VARCHAR(500) NOT NULL,
    category VARCHAR(100) DEFAULT 'Thông tư BGD&ĐT',
    issue_date VARCHAR(50),
    signer VARCHAR(255) DEFAULT 'BGH THCS Đồng Tân',
    file_url TEXT,
    file_name VARCHAR(255),
    external_link TEXT,
    downloads INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- BẢNG 5: THƯ VIỆN ALBUMS ẢNH HOẠT ĐỘNG (ALBUMS)
CREATE TABLE public.albums (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date VARCHAR(50),
    photos_count INT DEFAULT 1,
    cover TEXT NOT NULL, -- Hỗ trợ chuỗi Base64 dài hoặc URL
    description TEXT,
    file_url TEXT,
    external_link TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- BẢNG 6: THƯ VIỆN VIDEO HOẠT ĐỘNG VÀ BÀI GIẢNG (VIDEOS)
CREATE TABLE public.videos (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) DEFAULT 'Hoạt động trường',
    youtube_id VARCHAR(255),
    video_url TEXT,
    thumbnail_url TEXT,
    external_link TEXT,
    duration VARCHAR(50) DEFAULT '05:30',
    views INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- BẢNG 7: KHO TÀI NGUYÊN HỌC TẬP VÀ GIÁO ÁN (RESOURCES)
CREATE TABLE public.resources (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    type VARCHAR(100) DEFAULT 'Đề thi & Đáp án',
    subject VARCHAR(100) DEFAULT 'Toán học',
    author VARCHAR(255) DEFAULT 'Tổ Chuyên Môn',
    date VARCHAR(50),
    downloads INT DEFAULT 0,
    file_url TEXT,
    file_name VARCHAR(255),
    external_link TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- BẢNG 8: LỊCH LÀM VIỆC TUẦN CỦA NHÀ TRƯỜNG (SCHEDULES)
CREATE TABLE public.schedules (
    id BIGSERIAL PRIMARY KEY,
    week_name VARCHAR(100) NOT NULL, -- 'Tuần 24 (từ 16/08 - 22/08)'
    start_date DATE,
    end_date DATE,
    content TEXT,
    file_url TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- BẢNG 9: LIÊN HỆ VÀ GÓP Ý TỪ PHỤ HUYNH / HỌC SINH (CONTACTS)
CREATE TABLE public.contacts (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'CHUA_XU_LY', -- 'CHUA_XU_LY', 'DA_XU_LY'
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 3. NẠP DỮ LIỆU MẪU BAN ĐẦU CHUẨN (INITIAL SEED DATA)
-- ==============================================================================

-- Tài khoản mặc định: 
-- 1. admin (Ban Giám Hiệu) -> Mật khẩu ban đầu: admin123
-- 2. giaovien (Giáo Viên) -> Mật khẩu ban đầu: giaovien123
INSERT INTO public.users (username, password, full_name, role, email) VALUES
('admin', 'admin123', 'Thầy Hiệu Trưởng - THCS Đồng Tân', 'BGH', 'bgh.thcsdongtan@langson.edu.vn'),
('giaovien', 'admin123', 'Cô Nguyễn Thị Hoa - Giáo Viên Văn', 'GIAO_VIEN', 'hoanguyen@thcsdongtan.edu.vn')
ON CONFLICT (username) DO NOTHING;

-- Cấu hình mặc định trang web
INSERT INTO public.site_config (id, school_name, slogan, address, phone, email, banner_url) VALUES
(1, 'TRƯỜNG THCS ĐỒNG TÂN', 'Kỷ cương - Tình thương - Trách nhiệm - Hiệu quả', 'Thôn Đồng Tân, Xã Đồng Tân, Huyện Hữu Lũng, Tỉnh Lạng Sơn', '0205.3828.123', 'thcsdongtan@langson.edu.vn', 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&q=80')
ON CONFLICT (id) DO UPDATE SET school_name = EXCLUDED.school_name;

-- Bài viết mẫu
INSERT INTO public.articles (title, summary, content, image_url, category_name, author, is_featured) VALUES
('Trường THCS Đồng Tân tổ chức Lễ Khai Giảng năm học mới 2025 - 2026', 'Hòa chung không khí tưng bừng của Ngày hội toàn dân đưa trẻ đến trường, thầy và trò trường THCS Đồng Tân long trọng tổ chức Lễ Khai Giảng năm học mới.', 'Hòa chung không khí tưng bừng của Ngày hội toàn dân đưa trẻ đến trường, thầy và trò trường THCS Đồng Tân long trọng tổ chức Lễ Khai Giảng năm học mới 2025 - 2026 với sự tham gia đông đủ của toàn thể học sinh và các cán bộ giáo viên.', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80', 'Hoạt động nhà trường', 'Ban Biên Tập THCS Đồng Tân', TRUE),
('Tập huấn chuyển đổi số và ứng dụng Công nghệ thông tin trong dạy học', 'Nhà trường tổ chức buổi tập huấn nâng cao năng lực ứng dụng CNTT cho 100% cán bộ giáo viên.', 'Nhà trường tổ chức buổi tập huấn nâng cao năng lực ứng dụng CNTT cho 100% cán bộ giáo viên nhằm đẩy mạnh chuyển đổi số trong giáo dục năm 2026.', 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80', 'Tin chuyên môn', 'Tổ CNTT THCS Đồng Tân', FALSE);

-- Văn bản mẫu
INSERT INTO public.documents (code, title, category, issue_date, signer) VALUES
('VB-01/2026', 'Kế hoạch thực hiện nhiệm vụ năm học 2025 - 2026 trường THCS Đồng Tân', 'Quy chế nội bộ', '15/01/2026', 'Hiệu trưởng THCS Đồng Tân'),
('VB-02/2026', 'Thông tư hướng dẫn công tác thi đua khen thưởng ngành Giáo dục', 'Thông tư BGD&ĐT', '08/02/2026', 'Bộ Giáo dục & Đào tạo');

-- Albums mẫu
INSERT INTO public.albums (title, date, photos_count, cover, description) VALUES
('Lễ Khai Giảng Năm Học 2025 - 2026', '05/09/2025', 12, 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=80', 'Hình ảnh rực rỡ trong ngày khai giảng năm học mới'),
('Hội Thao Học Sinh Giỏi Thể Dục Thể Thao', '20/11/2025', 8, 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&q=80', 'Các hoạt động thi đấu thể thao của học sinh THCS Đồng Tân');

-- Videos mẫu
INSERT INTO public.videos (title, category, youtube_id, duration) VALUES
('Lễ Kỷ Niệm Ngày Nhà Giáo Việt Nam 20/11 - THCS Đồng Tân', 'Hoạt động trường', 'dQw4w9WgXcQ', '08:45'),
('Giao lưu Văn nghệ Học sinh Chào Xuân 2026', 'Văn nghệ thể thao', 'dQw4w9WgXcQ', '12:20');

-- Resources mẫu
INSERT INTO public.resources (title, type, subject, author, date) VALUES
('Đề thi Học kỳ II môn Toán lớp 9 năm học 2025 - 2026 (Có đáp án)', 'Đề thi & Đáp án', 'Toán học', 'Tổ Toán - Tin', '10/05/2026'),
('Bộ Giáo án minh họa Stem môn Vật Lý lớp 8', 'Giáo án điện tử', 'Vật lý', 'Cô Nguyễn Thị Hoa', '12/02/2026');

-- ==============================================================================
-- 4. BẢO MẬT & PHÂN QUYỀN TRUY CẬP ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- Bật RLS cho tất cả các bảng
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Tạo chính sách (Policies): Cho phép TẤT CẢ mọi người XEM DỮ LIỆU (SELECT)
CREATE POLICY "Public Read Users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Public Read SiteConfig" ON public.site_config FOR SELECT USING (true);
CREATE POLICY "Public Read Articles" ON public.articles FOR SELECT USING (true);
CREATE POLICY "Public Read Documents" ON public.documents FOR SELECT USING (true);
CREATE POLICY "Public Read Albums" ON public.albums FOR SELECT USING (true);
CREATE POLICY "Public Read Videos" ON public.videos FOR SELECT USING (true);
CREATE POLICY "Public Read Resources" ON public.resources FOR SELECT USING (true);
CREATE POLICY "Public Read Schedules" ON public.schedules FOR SELECT USING (true);

-- Chính sách Thêm/Sửa/Xóa (Write) dành cho tất cả thao tác từ ứng dụng web (ALL)
CREATE POLICY "Full Access Articles" ON public.articles FOR ALL USING (true);
CREATE POLICY "Full Access Documents" ON public.documents FOR ALL USING (true);
CREATE POLICY "Full Access Albums" ON public.albums FOR ALL USING (true);
CREATE POLICY "Full Access Videos" ON public.videos FOR ALL USING (true);
CREATE POLICY "Full Access Resources" ON public.resources FOR ALL USING (true);
CREATE POLICY "Full Access Schedules" ON public.schedules FOR ALL USING (true);
CREATE POLICY "Full Access Contacts" ON public.contacts FOR ALL USING (true);
CREATE POLICY "Full Access Users" ON public.users FOR ALL USING (true);
CREATE POLICY "Full Access SiteConfig" ON public.site_config FOR ALL USING (true);

-- ==============================================================================
-- HOÀN TẤT KỊCH BẢN CREATED SUPABASE SCHEMA!
-- ==============================================================================
