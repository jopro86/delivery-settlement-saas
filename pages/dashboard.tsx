// pages/dashboard.tsx (캘린더 라이브러리 적용 버전)

'use client';
import type { NextPage } from 'next';
import Head from 'next/head';
import { PlusCircle, BarChart2, Calendar, ChevronRight, Home, X } from 'lucide-react';
import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

// --- *** react-day-picker 관련 import 추가 *** ---
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css'; // 기본 스타일 import
import { ko } from 'date-fns/locale'; // 한글 지원

// 가짜 데이터
const monthlyStats = [
    { month: '2025년 5월', income: '4,120,500원', cases: 380 },
    { month: '2025년 4월', income: '3,980,000원', cases: 365 },
    { month: '2025년 3월', income: '4,350,000원', cases: 410 },
];

// 페이지 헤더 컴포넌트 (디자인 추가)
const PageHeader = () => (
    <div className="text-center mb-12">
        <div className="inline-block p-3 bg-blue-100 rounded-full mb-3">
            <Home className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight mb-2">My 대시보드</h1>
        <p className="text-lg text-gray-500">나의 수입/지출을 기록하고 월별 통계를 확인하세요.</p>
    </div>
);

// --- *** 새로운 RecordModal 컴포넌트 추가 *** ---
const RecordModal = ({ isOpen, closeModal }: { isOpen: boolean; closeModal: () => void }) => {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={closeModal}>
                <Transition.Child 
                    as={Fragment} 
                    enter="ease-out duration-300" 
                    enterFrom="opacity-0" 
                    enterTo="opacity-100" 
                    leave="ease-in duration-200" 
                    leaveFrom="opacity-100" 
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child 
                            as={Fragment} 
                            enter="ease-out duration-300" 
                            enterFrom="opacity-0 scale-95" 
                            enterTo="opacity-100 scale-100" 
                            leave="ease-in duration-200" 
                            leaveFrom="opacity-100 scale-100" 
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-gray-900 flex justify-between items-center">
                                    수입/지출 기록하기
                                    <button onClick={closeModal} className="p-1 rounded-full hover:bg-gray-100">
                                        <X className="w-5 h-5 text-gray-500" />
                                    </button>
                                </Dialog.Title>
                                <div className="mt-4 space-y-4">
                                    <div>
                                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">날짜</label>
                                        <input 
                                            type="date" 
                                            id="date" 
                                            defaultValue={new Date().toISOString().split('T')[0]} 
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">금액</label>
                                        <input 
                                            type="number" 
                                            id="amount" 
                                            placeholder="금액을 입력하세요" 
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">내용</label>
                                        <input 
                                            type="text" 
                                            id="description" 
                                            placeholder="예: 배달 수수료, 기름값" 
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end gap-3">
                                    <button 
                                        type="button" 
                                        className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none" 
                                        onClick={closeModal}
                                    >
                                        취소
                                    </button>
                                    <button 
                                        type="button" 
                                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none"
                                    >
                                        저장하기
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

// --- *** InteractiveCalendar 컴포넌트 새로 추가 *** ---
const InteractiveCalendar = () => {
    const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());
    
    // 가짜 데이터: 수입이 있는 날짜들
    const incomeDays = [
        new Date(2025, 5, 2), // 2025년 6월 2일 (월은 0부터 시작)
        new Date(2025, 5, 3),
        new Date(2025, 5, 5),
    ];

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-7 h-7 text-gray-700" />
                <h2 className="text-2xl font-bold text-gray-800">2025년 6월</h2>
            </div>
            {/* --- DayPicker 컴포넌트로 교체 --- */}
            <DayPicker
                mode="single"
                selected={selectedDay}
                onSelect={setSelectedDay}
                locale={ko} // 한글 설정
                modifiers={{ income: incomeDays }} // 수입이 있는 날에 'income' 스타일 적용
                modifiersStyles={{
                    income: { 
                        color: '#1d4ed8', // 파란색 글씨
                        fontWeight: 'bold',
                        backgroundColor: '#eff6ff', // 파란색 배경
                    }
                }}
                className="w-full flex justify-center"
            />
        </div>
    );
};

// --- HubPage 메인 컴포넌트 수정 ---
const HubPage: NextPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            <Head>
                <title>대시보드 - 배달TIPPICK</title>
            </Head>
            <div className="max-w-7xl mx-auto">
                <PageHeader />
                
                {/* 상단 요약 및 수입/지출 추가 버튼 */}
                <div className="mb-8 p-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl shadow-lg">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="opacity-80">이번달 예상 수입</p>
                            <p className="text-4xl font-bold tracking-tight">3,450,000 원</p>
                        </div>
                        <button 
                            onClick={openModal}
                            className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-xl hover:bg-white/30 shadow-md transition-all duration-300"
                        >
                            <PlusCircle className="w-5 h-5" />
                            기록하기
                        </button>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* --- 왼쪽 캘린더 부분을 InteractiveCalendar 컴포넌트로 교체 --- */}
                    <div className="lg:col-span-2">
                        <InteractiveCalendar />
                    </div>

                    {/* 오른쪽 월별/연별 통계 (1칸 차지) */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                        <div className="flex items-center gap-3 mb-4">
                            <BarChart2 className="w-7 h-7 text-gray-700" />
                            <h2 className="text-2xl font-bold text-gray-800">월별 내역</h2>
                        </div>
                        <div className="space-y-3">
                            {monthlyStats.map((stat, index) => (
                                <div key={index} className="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md hover:border-blue-500 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                                    <div>
                                        <p className="font-semibold text-gray-800">{stat.month}</p>
                                        <p className="text-sm text-gray-500">{stat.cases}건</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-bold text-lg text-gray-900">{stat.income}</p>
                                        <ChevronRight className="w-5 h-5 text-gray-400" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <RecordModal isOpen={isModalOpen} closeModal={closeModal} />
        </>
    );
};

export default HubPage;