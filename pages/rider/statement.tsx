// pages/rider/statement.tsx

import type { NextPage } from 'next';
import Head from 'next/head';
import { ChevronDown, Search, Calendar, User } from 'lucide-react';
import { useState } from 'react';

// --- 각 섹션을 구성하는 컴포넌트들 ---

const PageHeader = () => (
    <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">이번주 수익의 내역</h1>
        <p className="text-gray-500">라이선스 ID로 본인의 급여 데이터를 확인할 수 있습니다</p>
    </div>
);

const WeekSelectorCard = () => {
    const [selectedWeek, setSelectedWeek] = useState('2025-w23');
    const weekOptions = [
        { id: '2025-w23', label: '2025년 6월 1주차 (2025. 5. 28.~2025. 6. 3.)', period: '5월 28일(수) ~ 6월 3일(화)' },
        { id: '2025-w22', label: '2025년 5월 4주차 (2025. 5. 21.~2025. 5. 27.)', period: '5월 21일(수) ~ 5월 27일(화)' },
    ];
    const currentPeriod = weekOptions.find(w => w.id === selectedWeek)?.period;

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="bg-green-600 text-white p-6 rounded-t-xl">
                <div className="flex items-center gap-3">
                    <Calendar className="w-6 h-6" />
                    <h2 className="text-xl font-bold">조회할 주차를 선택하세요</h2>
                </div>
            </div>
            <div className="p-6 space-y-4">
                <div className="relative">
                    <select value={selectedWeek} onChange={e => setSelectedWeek(e.target.value)}
                        className="w-full appearance-none bg-gray-100 border-2 border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500">
                        {weekOptions.map(week => ( <option key={week.id} value={week.id}>{week.label}</option>))}
                    </select>
                    <ChevronDown className="w-5 h-5 text-gray-400 absolute top-1/2 right-4 -translate-y-1/2 pointer-events-none" />
                </div>
                <div className="bg-green-50 text-green-800 p-4 rounded-lg">
                    <p className="font-semibold">정산 기간: {currentPeriod}</p>
                </div>
            </div>
        </div>
    );
};

const LicenseIdSearchCard = () => {
     const [licenseId, setLicenseId] = useState('86074145591');
     return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 mt-8">
            <div className="bg-blue-600 text-white p-6 rounded-t-xl">
                <div className="flex items-center gap-3">
                    <User className="w-6 h-6" />
                    <h2 className="text-xl font-bold">라이선스 ID를 입력하세요</h2>
                </div>
            </div>
            <div className="p-6">
                <div className="flex gap-3">
                    <input type="text" value={licenseId} onChange={e => setLicenseId(e.target.value)}
                        className="flex-grow p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="라이선스 ID 입력"
                    />
                    <button className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <Search className="w-5 h-5" /> 조회
                    </button>
                </div>
            </div>
        </div>
     );
};


// --- 페이지 메인 컴포넌트 ---
const RiderStatementPage: NextPage = () => {
    return (
        <>
            <Head>
                <title>공식 정산서 조회 - 배달TIPPICK</title>
            </Head>
            <div className="max-w-3xl mx-auto">
                <PageHeader />
                <WeekSelectorCard />
                <LicenseIdSearchCard />

                {/* 여기에 조회 결과가 표시됩니다. */}
                <div className="mt-8 text-center text-gray-500">
                    <p>라이선스 ID를 입력하고 조회해주세요.</p>
                </div>
            </div>
        </>
    );
};

export default RiderStatementPage; 