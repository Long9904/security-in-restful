import type {
  HeroSectionProps,
  SideBySideComparisonCardProps,
  GridListProps,
  InteractiveDiagramProps,
  SequenceDiagramListProps,
  ProsConsTableProps,
  CallOutBlockProps,
} from '../types';

// ─── Hero ─────────────────────────────────────────────────────────────────────

export const heroData: HeroSectionProps = {
  title: 'Bảo mật trong RESTful WebService',
  subtitle: 'Tại sao hệ thống của bạn cần được bảo vệ?',
  content: [
    'Bảo vệ dữ liệu (Data Protection): Xác định rõ quyền truy cập, đặc biệt với các method như DELETE (xóa tài nguyên) và PUT (cập nhật tài nguyên).',
    'Chống tấn công DOS: Ngăn chặn API rơi vào trạng thái ngừng hoạt động do bị quá tải nếu không có biện pháp bảo mật đúng đắn.',
    'Chống Farming: Nếu không có cơ chế xác thực/cấp quyền, API có thể bị lạm dụng, làm quá tải server và giảm tốc độ phản hồi.',
  ],
};

// ─── Core Concepts ────────────────────────────────────────────────────────────

export const comparisonData: SideBySideComparisonCardProps = {
  title: 'Khái niệm Cốt lõi: Authentication vs Authorization',
  leftCard: {
    header: 'Authentication (Xác thực)',
    icon: 'ShieldCheck',
    description:
      'Là quá trình xác định danh tính của một người dùng. Người dùng cung cấp thông tin xác thực (credentials) để so sánh với dữ liệu được lưu trữ.',
    analogy:
      'Giống như việc bạn xuất trình thẻ từ để bước qua cửa chính của một tòa nhà server.',
  },
  rightCard: {
    header: 'Authorization (Cấp quyền)',
    icon: 'Key',
    description:
      'Là quá trình xác định xem người dùng có quyền truy cập vào một tài nguyên cụ thể hay không. Nó quyết định những gì người dùng được phép làm.',
    analogy:
      'Sau khi vào tòa nhà, nó quyết định bạn được phép vào những phòng nào và thao tác trên những thiết bị nào.',
  },
};

// ─── Best Practices ───────────────────────────────────────────────────────────

export const bestPracticesData: GridListProps = {
  title: 'Best Practices cho RESTful API',
  items: [
    {
      title: 'Validation',
      desc: 'Xác thực mọi input trên server để chống SQL/NoSQL injection.',
    },
    {
      title: 'No Sensitive Data in URL',
      desc: 'Không bao giờ truyền username, password hoặc token trong URL; hãy dùng method POST.',
    },
    {
      title: 'Method Restriction',
      desc: 'Giới hạn nghiêm ngặt các method GET, POST, DELETE. Method GET không được phép có khả năng xóa dữ liệu.',
    },
    {
      title: 'Generic Error Messages',
      desc: 'Sử dụng mã lỗi HTTP chuẩn (ví dụ 403 Forbidden).',
    },
  ],
};

// ─── JWT Diagram ──────────────────────────────────────────────────────────────

export const jwtDiagramData: InteractiveDiagramProps = {
  title: 'Kiến trúc JSON Web Token (JWT)',
  description:
    'JWT bao gồm 3 phần: Header, Payload, và Signature. Kích thước nhỏ gọn, dễ dàng truyền tải trong môi trường HTML và HTTP.',
  diagramSteps: [
    {
      step: '1',
      boxLabel: 'Header',
      detail:
        'Chứa thông tin thuật toán (vd: HMAC SHA256) và loại token (JWT). Được encode bằng Base64Url.',
      color: 'bg-red-100 text-red-800 border-red-300',
    },
    {
      step: '2',
      boxLabel: 'Payload',
      detail:
        "Chứa các 'claims' (thông tin về user) như sub, name, iat. Không nên chứa dữ liệu nhạy cảm vì chỉ được encode, không encrypt.",
      color: 'bg-purple-100 text-purple-800 border-purple-300',
    },
    {
      step: '3',
      boxLabel: 'Signature',
      detail:
        'Được tạo bằng cách kết hợp encoded header, encoded payload, và một chuỗi secret. Đảm bảo token không bị giả mạo.',
      color: 'bg-blue-100 text-blue-800 border-blue-300',
    },
  ],
};

// ─── Security Flow ────────────────────────────────────────────────────────────

export const securityFlowData: SequenceDiagramListProps = {
  title: 'Luồng hoạt động (Security Flow)',
  flows: [
    {
      flowName: 'Truy cập khi chưa xác thực',
      steps: [
        'Request đến Authentication Middleware.',
        'Middleware kiểm tra credential. Nếu không có, gán User thành anonymous.',
        'Authorization Middleware kiểm tra quyền. Nếu cần quyền, gọi ChallengeAsync() để từ chối/redirect.',
      ],
    },
    {
      flowName: 'Quá trình Đăng nhập (Signing In)',
      steps: [
        'User gửi ID & Password qua Login form.',
        'Hệ thống kiểm tra với database.',
        'Nếu dùng JWT, tạo JWT Token chứa claims của User.',
        'Gửi JWT Token về cho client lưu trữ (Local storage, session, cookie).',
      ],
    },
    {
      flowName: 'Các Request tiếp theo',
      steps: [
        'User gửi request kèm token trong Authorization header.',
        'Authentication Middleware đọc token, tạo ClaimsIdentity và cập nhật HttpContext.',
        'Authorization Middleware kiểm tra HttpContext.User và cho phép truy cập.',
      ],
    },
  ],
};

// ─── Pros/Cons ────────────────────────────────────────────────────────────────

export const prosConsData: ProsConsTableProps = {
  title: 'Điểm mạnh & Điểm yếu của JWT trong RESTful',
  pros: [
    'Nhỏ gọn (Compact): Kích thước nhỏ hơn XML/SAML, tối ưu cho HTTP.',
    'Dễ parse: JSON mapping trực tiếp ra object trong hầu hết các ngôn ngữ lập trình.',
    'Stateless: Server không cần lưu trữ session, dễ dàng Scale mở rộng hệ thống.',
  ],
  cons: [
    'Không thể thu hồi (Revoke) ngay lập tức: Token có thời hạn, nếu lộ token trước khi hết hạn sẽ rủi ro.',
    'Data lộ diện: Payload chỉ được encode base64, không encrypt, không nên chứa dữ liệu nhạy cảm.',
  ],
};

// ─── Conclusion ───────────────────────────────────────────────────────────────

export const conclusionData: CallOutBlockProps = {
  title: 'Kết luận',
  content:
    'Bảo mật WebService không chỉ là việc cấp phát Token. Nó là một chiến lược toàn diện từ việc mã hóa kênh truyền (TLS/SSL), xác thực đầu vào, quản lý danh tính (Authentication), cho đến phân quyền chặt chẽ (Authorization) dựa trên Role hoặc Policy. Việc sử dụng JWT là giải pháp tối ưu cho REST API hiện đại nhờ tính stateless và gọn nhẹ.',
};
