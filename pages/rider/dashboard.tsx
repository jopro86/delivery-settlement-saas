// pages/dashboard.tsx (새로운 허브 페이지)

import type { NextPage } from 'next';
import Head from 'next/head';
import { ChevronDown, Search, Calendar, User } from 'lucide-react';
import { useState } from 'react';

// 페이지 헤더 컴포넌트
const PageHeader = () => (
    <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">이번주 수익의 내역</h1>
        <p className="text-gray-500">라이선스 ID로 본인의 급여 데이터를 확인할 수 있습니다</p>
    </div>
);

// 주차 선택 컴포넌트
const WeekSelector = () => (
    <div className="bg-green-600 text-white p-6 rounded-t-xl shadow-lg">
        <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6" />
            <h2 className="text-xl font-bold">조회할 주차를 선택하세요</h2>
        </div>
    </div>
);

// 라이선스 ID 입력 컴포넌트
const LicenseIdSearch = () => (
    <div className="bg-blue-600 text-white p-6 rounded-t-xl shadow-lg mt-8">
        <div className="flex items-center gap-3">
            <User className="w-6 h-6" />
            <h2 className="text-xl font-bold">라이선스 ID를 입력하세요</h2>
        </div>
    </div>
);

// 결과 표시 영역 컴포넌트
const ResultDisplay = () => (
    <div className="text-center py-16">
        <p className="text-gray-500">라이선스 ID를 입력하고 조회해주세요</p>
        <p className="text-sm text-gray-400 mt-1">본인의 라이선스 ID를 입력하여 급여 기록을 확인하세요</p>
    </div>
);


const HubPage: NextPage = () => {
    const [selectedWeek, setSelectedWeek] = useState('');
    const [licenseId, setLicenseId] = useState('');
    
    // 가짜 주차 데이터
    const weekOptions = [
        { id: '2025-w23', label: '2025년 6월 1주차 (5.28 - 6.3)' },
        { id: '2025-w22', label: '2025년 5월 4주차 (5.21 - 5.27)' },
    ];
    
    return (
        <>
            <Head>
                <title>대시보드 - 배달TIPPICK</title>
            </Head>
            <div className="max-w-3xl mx-auto">
                <PageHeader />

                {/* 주차 선택 카드 */}
                <div className="bg-white rounded-xl shadow-lg">
                    <WeekSelector />
                    <div className="p-6">
                         <div className="relative">
                            <select 
                                value={selectedWeek}
                                onChange={e => setSelectedWeek(e.target.value)}
                                className="w-full appearance-none bg-gray-100 border-2 border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="">주차 선택</option>
                                {weekOptions.map(week => (
                                    <option key={week.id} value={week.id}>{week.label}</option>
                                ))}
                            </select>
                            <ChevronDown className="w-5 h-5 text-gray-400 absolute top-1/2 right-4 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* 라이선스 ID 검색 카드 */}
                <div className="bg-white rounded-xl shadow-lg mt-8">
                    <LicenseIdSearch />
                    <div className="p-6">
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={licenseId}
                                onChange={e => setLicenseId(e.target.value)}
                                className="flex-grow p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="라이선스 ID 입력"
                            />
                            <button className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                <Search className="w-5 h-5" />
                                조회
                            </button>
                        </div>
                    </div>
                </div>

                {/* 결과 표시 카드 */}
                <div className="bg-white rounded-xl shadow-lg mt-8">
                    <ResultDisplay />
                </div>
            </div>
        </>
    );
};

export default HubPage;