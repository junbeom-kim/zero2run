# Zero2Run

러닝 크루의 월별 마일리지를 관리하는 웹 앱입니다.

- 회원별 러닝 거리 기록 및 통계
- 월별 추이 차트
- 명예의 전당 (마라톤 완주 기록)

## 설치 방법

### 1. Supabase 프로젝트 생성

1. [supabase.com](https://supabase.com)에 가입하고 새 프로젝트를 만듭니다.
2. 프로젝트 대시보드에서 **SQL Editor**를 엽니다.
3. `supabase/schema.sql` 파일의 내용을 복사해서 실행합니다.

### 2. 환경변수 설정

`.env.example`을 복사해서 `.env.local`을 만듭니다.

```bash
cp .env.example .env.local
```

아래 값들을 채워 넣습니다.

| 변수 | 설명 | 찾는 곳 |
|------|------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | Supabase 대시보드 > Settings > API > Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 서비스 키 | Supabase 대시보드 > Settings > API > service_role |
| `ADMIN_PASSWORD` | 관리자 비밀번호 | 원하는 값으로 직접 설정 |

### 3. 실행

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

### 4. 배포 (Vercel)

1. [vercel.com](https://vercel.com)에 GitHub 계정으로 로그인합니다.
2. **New Project**에서 이 저장소를 import합니다.
3. **Environment Variables**에 위 3개 환경변수를 추가합니다.
4. **Deploy**를 누릅니다.

## 사용 방법

- **전체 현황**: 월별 크루 전체 러닝 통계
- **회원 상세**: 회원 이름을 누르면 개인 기록 조회 및 추가
- **관리**: 관리자 비밀번호 입력 후 회원 등록
- **명예의 전당**: `data/hall-of-fame.ts`에서 직접 편집
