// /pages/index.tsx (최종 수정본)

import type { NextPage } from 'next';
import Head from 'next/head';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/router';
import { useState } from 'react';

// pages/index.tsx

const KakaoLoginButton = () => {
  const handleLogin = () => {
      alert('카카오 로그인 기능 연동 예정입니다.');
  };
  return (
      <button 
          onClick={handleLogin}
          // --- w-full과 max-w-xs를 제거하고, 패딩과 폰트 크기 조정 ---
          className="flex items-center justify-center gap-3 bg-[#FEE500] text-[#191919] font-bold py-4 px-8 rounded-xl shadow-lg hover:opacity-90 transition-opacity text-xl"
      >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#191919"><path d="M12 2c-5.523 0-10 3.582-10 8 0 2.908 1.883 5.483 4.636 6.886-.11.231-.443.984-.529 1.297-.104.382-.047.604.102.738.149.133.349.12.493.038.145-.084 2.193-1.422 3.327-2.298.601.107 1.22.162 1.85.162 5.523 0 10-3.582 10-8s-4.477-8-10-8z"/></svg>
          카카오 계정으로 시작하기
      </button>
  );
};

// 임시 로그인 버튼 컴포넌트
const TempLoginButton = () => {
  const supabase = createClient();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleTempLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: 'hearpoint@naver.com', // Supabase Auth에 등록된 관리자 이메일
        password: 'RHKRxodms2@', // 해당 계정의 비밀번호
      });

      if (error) {
        alert('로그인 실패: ' + error.message);
      } else {
        alert('로그인 성공! 관리자 대시보드로 이동합니다.');
        router.push('/admin/dashboard');
      }
    } catch (err) {
      console.error('로그인 중 오류:', err);
      alert('로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleTempLogin}
      disabled={isLoading}
      className="flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <>
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          로그인 중...
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
            <polyline points="10,17 15,12 10,7"/>
            <line x1="15" y1="12" x2="3" y2="12"/>
          </svg>
          임시 관리자 로그인
        </>
      )}
    </button>
  );
};

const Footer = () => (
    // --- 'absolute bottom-0' 제거하고, 패딩만 조정 ---
    <footer className="w-full text-center py-8 text-xs text-gray-500">
        <div className="mb-2">
            <span>Powered by 배달TIPPICK</span>
        </div>
        <div>
            <a href="#" className="hover:underline">이용약관</a>
            <span className="mx-2">|</span>
            <a href="#" className="hover:underline">개인정보처리방침</a>
        </div>
    </footer>
);


const LandingPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>배달TIPPICK - 라이더를 위한 모든 것</title>
      </Head>
      
      {/* 
        전체 화면을 차지하는 flex 컨테이너.
        main과 footer를 자식으로 가짐.
      */}
      <div className="flex flex-col min-h-screen bg-white">
        {/* 
          main 영역.
          남는 공간을 모두 차지하고(flex-grow), 내부 콘텐츠를 중앙 정렬.
        */}
        <main className="flex flex-col items-center justify-center flex-grow text-center px-4">
            <h2 className="text-lg font-semibold text-gray-600 tracking-wider">전국 라이더의 성지</h2>
            <h1 className="text-7xl font-black my-4 bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text">
                배달TIPPICK
            </h1>
            <p className="text-gray-500 mb-10">
                수입/지출부터 예상 세금 계산, 공식 정산 내역까지.<br/>
                라이더의 모든 것을 한 곳에서 관리하세요.
            </p>
            
            {/* 로그인 버튼들 */}
            <div className="flex flex-col gap-4">
                <KakaoLoginButton />
                
                {/* 구분선 */}
                <div className="flex items-center gap-4 my-2">
                    <div className="flex-1 h-px bg-gray-300"></div>
                    <span className="text-sm text-gray-500">또는</span>
                    <div className="flex-1 h-px bg-gray-300"></div>
                </div>
                
                <TempLoginButton />
                
                {/* 임시 로그인 안내 */}
                <p className="text-xs text-gray-400 mt-2">
                    * 임시 로그인은 개발/테스트 목적입니다
                </p>
            </div>
        </main>

        {/* 
          footer 영역.
          flex 레이아웃의 일부로 자연스럽게 맨 아래에 위치.
        */}
        <Footer />
      </div>
    </>
  );
};

export default LandingPage;