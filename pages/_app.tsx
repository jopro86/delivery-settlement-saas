// pages/_app.tsx (AdminLayout 조건부 적용 최종본)

// 1. 가장 위에 전역 CSS를 임포트합니다.
import '@/styles/globals.css';

// 2. 필요한 타입과 컴포넌트를 임포트합니다.
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import AppLayout, { AuthProvider } from '@/components/layouts/AppLayout';
import AdminLayout from '@/components/layouts/AdminLayout';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // 1. 관리자 페이지 경로일 경우
  if (router.pathname.startsWith('/admin')) {
    return (
        <AuthProvider>
            <AppLayout>  {/* 바깥쪽 공통 헤더 */}
                <AdminLayout> {/* 안쪽 관리자 전용 탭 메뉴 */}
                    <Component {...pageProps} />
                </AdminLayout>
            </AppLayout>
        </AuthProvider>
    );
  }

  // 2. 로그인 페이지일 경우 (레이아웃 없음)
  if (router.pathname === '/' || router.pathname === '/login') {
    return <Component {...pageProps} />;
  }
  
  // 3. 그 외 모든 페이지 (예: /dashboard, /rider/statement)
  return (
    <AuthProvider>
      <AppLayout>
        <Component {...pageProps} />
      </AppLayout>
    </AuthProvider>
  );
}

export default MyApp;