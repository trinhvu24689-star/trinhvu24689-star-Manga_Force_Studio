import { SubscriptionPlan } from './types';

export const PLANS: SubscriptionPlan[] = [
  { id: 0, code: 'GUEST', name: 'Người dùng mặc định', type: 'Free', priceVND: '0 đ', priceUSD: 0, diamonds: 30, rubies: 0, benefits: '' },
  { id: 1, code: 'MEMBER', name: 'Thành viên cơ bản', type: 'Free', priceVND: '0 đ', priceUSD: 0, diamonds: 50, rubies: 0, benefits: '' },
  { id: 2, code: 'TALENT', name: 'Người dùng có tài năng', type: 'Free', priceVND: '0 đ', priceUSD: 0, diamonds: 100, rubies: 0, benefits: 'Mở khóa vẽ tự do' },
  { id: 3, code: 'CONGTU', name: 'Con nhà quyền quý', type: 'Tháng', priceVND: '99.000 đ', priceUSD: 3.99, diamonds: 200, rubies: 10, benefits: 'Nhập môn' },
  { id: 4, code: 'THIEUGIA', name: 'Người kế nghiệp gia đình', type: 'Tháng', priceVND: '199.000 đ', priceUSD: 7.99, diamonds: 400, rubies: 20, benefits: '' },
  { id: 5, code: 'DAIGIA', name: 'Giàu có và quyền lực', type: 'Tháng', priceVND: '499.000 đ', priceUSD: 19.99, diamonds: 800, rubies: 50, benefits: 'Khung: Kim Cương' },
  { id: 6, code: 'DAINHAN', name: 'Người có địa vị cao', type: 'Tháng', priceVND: '699.000 đ', priceUSD: 27.99, diamonds: 1500, rubies: 80, benefits: 'Khung: Phượng Rồng' },
  { id: 7, code: 'THAITU', name: 'Người thừa kế ngai vàng', type: 'Tháng', priceVND: '999.000 đ', priceUSD: 39.99, diamonds: 2500, rubies: 120, benefits: 'Khung: Phượng Hoàng' },
  { id: 8, code: 'DAITHAITU', name: 'Vị vua tương lai', type: 'Tháng', priceVND: '1.499.000 đ', priceUSD: 59.99, diamonds: 3500, rubies: 180, benefits: '' },
  { id: 9, code: 'THIENTU', name: 'Con của trời', type: 'Tháng', priceVND: '1.999.000 đ', priceUSD: 79.99, diamonds: 4500, rubies: 250, benefits: '' },
  { id: 10, code: 'VUA', name: 'Người đứng đầu', type: 'Tháng', priceVND: '2.499.000 đ', priceUSD: 99.99, diamonds: 5500, rubies: 350, benefits: 'Tùy chỉnh Avatar động' },
  { id: 11, code: 'CHUA', name: 'Chúa tể tối thượng', type: 'Tháng', priceVND: '2.999.000 đ', priceUSD: 119.99, diamonds: 6500, rubies: 450, benefits: '' },
  { id: 12, code: 'THANTAI', name: 'Thần may mắn tiền bạc', type: 'Tháng', priceVND: '3.499.000 đ', priceUSD: 139.99, diamonds: 7500, rubies: 600, benefits: '' },
  { id: 13, code: 'THUONGTIEN', name: 'Tiên nhân pháp lực cao', type: 'Tháng', priceVND: '3.999.000 đ', priceUSD: 159.99, diamonds: 8500, rubies: 750, benefits: '' },
  { id: 14, code: 'THUONGTHAN', name: 'Vị thần tối cao', type: 'Tháng', priceVND: '4.499.000 đ', priceUSD: 179.99, diamonds: 9500, rubies: 900, benefits: '' },
  { id: 15, code: 'COTHAN', name: 'Vị thần từ hồng hoang', type: 'Tháng', priceVND: '4.999.000 đ', priceUSD: 199.99, diamonds: 10500, rubies: 1000, benefits: 'Max cấp Tháng' },
  { id: 16, code: 'LIFETIME', name: 'Quyền lực vĩnh cửu', type: 'V.Viễn', priceVND: '9.000.000 đ', priceUSD: 359.99, diamonds: 'Unlimited', rubies: 5000, benefits: 'Giảm 25% gói Mod' },
  { id: 17, code: 'MODERATOR', name: 'Quản lý cộng đồng', type: 'V.Viễn', priceVND: '24.500.000 đ', priceUSD: 999.00, diamonds: 'Unlimited', rubies: 10000, benefits: 'Full Quyền Mod' },
  { id: 99, code: 'ADMIN', name: 'Quản trị viên tối cao', type: '-', priceVND: 'Niêm yết', priceUSD: 0, diamonds: 'Unlimited', rubies: 'Unlimited', benefits: 'Full Admin' },
];