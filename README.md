# AI 뉴스레터 랜딩페이지 🤖

AI 기술의 최신 동향과 트렌드를 매주 전달하는 뉴스레터 구독 랜딩페이지입니다.

## 🚀 기능

- **모던한 반응형 디자인**: 모바일, 태블릿, 데스크톱에서 완벽하게 작동
- **실시간 이메일 검증**: 입력 시 즉시 이메일 유효성 검사
- **Supabase 통합**: 구독자 정보를 안전하게 저장
- **애니메이션 효과**: 부드러운 페이지 로딩 및 인터랙션 애니메이션
- **에러 처리**: 사용자 친화적인 에러 메시지 및 중복 구독 방지

## 🛠 기술 스택

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Supabase (PostgreSQL)
- **배포**: GitHub Pages
- **CI/CD**: GitHub Actions

## 📦 설치 및 실행

1. 저장소 클론
```bash
git clone https://github.com/[username]/ai-newsletter-landing.git
cd ai-newsletter-landing
```

2. 로컬에서 실행
```bash
# 간단한 HTTP 서버 실행 (Python)
python -m http.server 8000

# 또는 Node.js의 http-server 사용
npx http-server
```

3. 브라우저에서 `http://localhost:8000` 접속

## 🔧 Supabase 설정

1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. 다음 SQL로 테이블 생성:

```sql
create table newsletter_subscribers (
  id uuid default gen_random_uuid() primary key,
  email varchar not null unique,
  subscribed_at timestamp with time zone default now(),
  is_active boolean default true
);

-- RLS 정책 활성화
alter table newsletter_subscribers enable row level security;

-- 삽입 정책 생성
create policy "Anyone can subscribe to newsletter" on newsletter_subscribers
  for insert with check (true);
```

3. `script.js`에서 Supabase URL과 API 키 업데이트

## 🌟 주요 특징

### 💡 사용자 경험
- 직관적인 구독 프로세스
- 실시간 입력 검증
- 로딩 상태 및 성공/에러 피드백
- 애니메이션을 통한 시각적 매력

### 🔒 보안
- Row Level Security (RLS) 적용
- 클라이언트 사이드 입력 검증
- 중복 구독 방지

### 📱 반응형 디자인
- 모바일 우선 접근법
- CSS Grid & Flexbox 활용
- 다양한 화면 크기 지원

## 🚀 배포

GitHub Pages를 통해 자동 배포됩니다:

1. GitHub 저장소의 Settings > Pages 설정
2. Source를 "GitHub Actions"로 설정
3. 코드를 main 브랜치에 푸시하면 자동 배포

## 📊 성능 최적화

- CSS와 JavaScript 최적화
- 이미지 최적화 (SVG 아이콘 사용)
- 지연 로딩 구현
- 캐싱 전략 적용

## 🤝 기여

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 연락처

프로젝트 링크: [https://github.com/[username]/ai-newsletter-landing](https://github.com/[username]/ai-newsletter-landing)

---

Made with ❤️ for AI enthusiasts 