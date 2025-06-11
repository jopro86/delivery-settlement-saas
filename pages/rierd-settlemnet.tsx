// /pages/index.tsx (로그인 후 리디렉션 허브)

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/components/layouts/AppLayout'; // 우리가 만든 인증 컨텍스트

const HubPage = () => {
    const router = useRouter();
    const { user } = useAuth();

    useEffect(() => {
        // user 정보가 로드되면 역할(role)에 따라 페이지 이동
        if (user) {
            switch (user.role) {
                case 'RIDER':
                    router.replace('/rider/dashboard'); // 라이더 대시보드로 이동
                    break;
                case 'ADMIN':
                case 'SUPER_ADMIN':
                    router.replace('/admin/dashboard'); // 관리자 대시보드로 이동
                    break;
                default:
                    // 역할이 없는 등 예외 상황 발생 시 로그인 페이지로
                    router.replace('/login');
                    break;
            }
        } else {
          // 비로그인 상태면 로그인 페이지로
          router.replace('/login');
        }
    }, [user, router]);

    // 페이지 이동 중에 보여줄 로딩 화면
    return (
        <div className="flex items-center justify-center min-h-screen">
            <p className="text-lg">로그인 정보를 확인 중입니다...</p>
        </div>
    );
};

export default HubPage;