// /pages/login.tsx (새로운 로그인 페이지)

import type { NextPage } from 'next';
import Head from 'next/head';

const KakaoLoginButton = () => (
    // 실제 카카오 로그인 기능은 추후에 연동합니다.
    <button className="flex items-center justify-center gap-3 w-full max-w-xs bg-[#FEE500] text-[#000000] font-semibold py-3 px-6 rounded-lg shadow-md hover:opacity-90 transition-opacity">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2c-5.523 0-10 3.582-10 8 0 2.908 1.883 5.483 4.636 6.886-.11.231-.443.984-.529 1.297-.104.382-.047.604.102.738.149.133.349.12.493.038.145-.084 2.193-1.422 3.327-2.298.601.107 1.22.162 1.85.162 5.523 0 10-3.582 10-8s-4.477-8-10-8z"/></svg>
        카카오 계정으로 로그인
    </button>
);

const Footer = () => (
    <footer className="w-full text-center p-4 text-xs text-gray-500">
        <div className="mb-2">
            <span>Powered by 배달TIPPICK</span>
        </div>
        <div>
            <a href="#" className="hover:underline">이용약관</a>
            <span className="mx-2">|</span>
            <a href="#" className="hover:underline">개인정보처리방침</a>
            <span className="mx-2">|</span>
            <a href="#" className="hover:underline">광고문의</a>
        </div>
    </footer>
);


const LoginPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>배달TIPPICK - 로그인</title>
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <main className="flex flex-col items-center justify-center flex-grow text-center px-4">
            <h2 className="text-sm font-semibold text-gray-600">전국 라이더의 성지</h2>
            <h1 className="text-6xl font-black my-4">
                배달TIPPICK
            </h1>
            <KakaoLoginButton />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default LoginPage;