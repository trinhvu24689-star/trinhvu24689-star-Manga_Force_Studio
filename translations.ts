import { Language } from './types';

export const translations = {
  en: {
    appTitle: "MangaForge",
    modes: {
      screenwriter: "Screenwriter",
      characterLab: "Character Lab",
      storyboard: "Artist Studio",
      preview: "Comic Viewer",
      shop: "Store",
      adminGrant: "Admin Access"
    },
    dashboard: {
      title: "Create Your Universe",
      subtitle: "The AI-Powered Studio for Directors & Artists",
      inputLabel: "What is your story about?",
      inputPlaceholder: "e.g., A cyber-samurai protecting a cat in Neo-Hanoi...",
      btnAuto: "Auto-Create Story",
      btnManual: "Manual Setup",
      or: "OR",
      generating: "Dreaming up your story...",
      tip: "AI will generate title, characters, and script automatically. Cost: 50💎",
      cost: "Cost"
    },
    screenwriter: {
      title: "Story Config",
      lblTitle: "Title",
      lblGenre: "Genre",
      lblStyle: "Art Style",
      lblPremise: "Premise",
      btnGenerate: "Auto-Generate Script (10💎)",
      generating: "Writing Script...",
      editorTitle: "Script Editor",
      btnAddPanel: "Add Panel",
      visualDesc: "Visual Description",
      dialogue: "Dialogue / Caption",
      aspectRatio: "Aspect Ratio",
      placeholderPremise: "A detective discovers a robot that can dream...",
      placeholderDesc: "Enter scene description...",
      placeholderStyle: "e.g. Cyberpunk Manga, 90s Comic",
      emptyState: "No panels yet. Generate a script or add manually."
    },
    character: {
      title: "New Character",
      lblName: "Name",
      lblTraits: "Physical Traits",
      btnGenerate: "Generate Design (20💎)",
      galleryTitle: "Cast & Crew",
      emptyGallery: "Create characters to maintain consistency across your panels.",
      placeholderName: "Hero Name",
      placeholderTraits: "Tall, spiky blue hair, wears a red trenchcoat..."
    },
    storyboard: {
      title: "Artist Studio",
      subtitle: "Turn script descriptions into high-fidelity art.",
      btnRenderAll: "Render All Missing Panels",
      panel: "PANEL",
      regenerate: "Regenerate (30💎)",
      generate: "Generate (30💎)",
      rendering: "RENDERING...",
      awaiting: "AWAITING RENDER",
      description: "DESCRIPTION",
      dialogue: "DIALOGUE"
    },
    viewer: {
      missing: "Panel Missing",
      end: "End",
      empty: "The pages are blank. Go to the Screenwriter tab to start."
    },
    common: {
      poweredBy: "Powered by Gemini 3 Pro & Imagen",
      backHome: "Back to Menu",
      diamonds: "Diamonds",
      rubies: "Rubies",
      insufficientFunds: "Insufficient Diamonds! Please visit the Store."
    },
    shop: {
      title: "Premium Store",
      subtitle: "Upgrade your rank to unlock more power",
      currentPlan: "Current Plan",
      buy: "Upgrade",
      active: "Active",
      unlimited: "Unlimited",
      benefits: "Benefits"
    },
    adminGrant: {
      title: "NPH & ADMIN AREA",
      subtitle: "RESTRICTED: ONLY NPH (PUBLISHER) & ADMIN AUTHORIZED.",
      inputLabel: "NPH/Admin Key",
      placeholder: "Enter secret key...",
      btnVerify: "Authenticate",
      success: "Authentication Verified. Welcome.",
      error: "ACCESS DENIED. Invalid Key.",
      alreadyAdmin: "You have full NPH/Admin Privileges."
    }
  },
  vi: {
    appTitle: "MangaForge",
    modes: {
      screenwriter: "Biên Kịch",
      characterLab: "Họa Sĩ (Nhân vật)",
      storyboard: "Xưởng Vẽ",
      preview: "Đọc Truyện",
      shop: "Cửa Hàng",
      adminGrant: "Khu Vực Admin"
    },
    dashboard: {
      title: "Sáng Tạo Vũ Trụ Của Bạn",
      subtitle: "Studio AI dành cho Đạo Diễn & Họa Sĩ",
      inputLabel: "Câu chuyện của bạn về điều gì?",
      inputPlaceholder: "vd: Một samurai công nghệ bảo vệ chú mèo ở Neo-Hanoi...",
      btnAuto: "AI Tự Sáng Tác & Thiết Lập",
      btnManual: "Tự Thiết Lập Thủ Công",
      or: "HOẶC",
      generating: "Đang kiến tạo cốt truyện...",
      tip: "AI sẽ tự tạo tiêu đề, nhân vật và kịch bản cho bạn. Phí: 50💎",
      cost: "Phí"
    },
    screenwriter: {
      title: "Cấu Hình Cốt Truyện",
      lblTitle: "Tiêu Đề",
      lblGenre: "Thể Loại",
      lblStyle: "Phong Cách Vẽ",
      lblPremise: "Cốt Truyện Chính",
      btnGenerate: "Tự Động Viết Kịch Bản (10💎)",
      generating: "Đang Viết...",
      editorTitle: "Biên Tập Kịch Bản",
      btnAddPanel: "Thêm Khung Tranh",
      visualDesc: "Mô Tả Hình Ảnh",
      dialogue: "Lời Thoại / Dẫn Chuyện",
      aspectRatio: "Tỉ Lệ Khung",
      placeholderPremise: "Một thám tử phát hiện ra robot biết mơ...",
      placeholderDesc: "Nhập mô tả cảnh...",
      placeholderStyle: "vd: Truyện tranh Cyberpunk, Manga thập niên 90",
      emptyState: "Chưa có khung tranh nào. Hãy tạo kịch bản tự động hoặc thêm thủ công."
    },
    character: {
      title: "Tạo Nhân Vật Mới",
      lblName: "Tên",
      lblTraits: "Đặc Điểm Ngoại Hình",
      btnGenerate: "Thiết Kế Nhân Vật (20💎)",
      galleryTitle: "Danh Sách Nhân Vật",
      emptyGallery: "Tạo nhân vật để giữ sự nhất quán cho truyện.",
      placeholderName: "Tên nhân vật",
      placeholderTraits: "Cao, tóc xanh dựng ngược, mặc áo khoác đỏ..."
    },
    storyboard: {
      title: "Xưởng Vẽ Tranh",
      subtitle: "Biến kịch bản thành tác phẩm nghệ thuật.",
      btnRenderAll: "Vẽ Tất Cả Các Khung Còn Thiếu",
      panel: "KHUNG",
      regenerate: "Vẽ Lại (30💎)",
      generate: "Vẽ Tranh (30💎)",
      rendering: "ĐANG VẼ...",
      awaiting: "CHỜ VẼ",
      description: "MÔ TẢ",
      dialogue: "LỜI THOẠI"
    },
    viewer: {
      missing: "Thiếu Tranh",
      end: "Hết",
      empty: "Trang giấy còn trắng. Hãy qua tab Biên Kịch để bắt đầu."
    },
    common: {
      poweredBy: "Sức mạnh bởi Gemini 3 Pro & Imagen",
      backHome: "Về Menu Chính",
      diamonds: "KC Xanh",
      rubies: "Ruby",
      insufficientFunds: "Không đủ KC Xanh! Vui lòng nạp thêm tại Cửa Hàng."
    },
    shop: {
      title: "Cửa Hàng Vật Phẩm",
      subtitle: "Nâng cấp gói để nhận thêm tài nguyên",
      currentPlan: "Gói Hiện Tại",
      buy: "Nâng Cấp",
      active: "Đang Dùng",
      unlimited: "Vô Hạn",
      benefits: "Quyền Lợi"
    },
    adminGrant: {
      title: "KHU VỰC QUẢN TRỊ",
      subtitle: "CẢNH BÁO: CHỈ DÀNH CHO NPH & ADMIN.",
      inputLabel: "MÃ KHÓA NPH/ADMIN",
      placeholder: "Nhập mã xác thực...",
      btnVerify: "Xác Minh Danh Tính",
      success: "Xác thực thành công. Chào mừng Admin.",
      error: "TRUY CẬP BỊ TỪ CHỐI. SAI MÃ.",
      alreadyAdmin: "Bạn đã sở hữu toàn quyền NPH/Admin."
    }
  }
};