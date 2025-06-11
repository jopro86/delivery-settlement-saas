'use client';
import type { NextPage } from 'next';
import Head from 'next/head';
import { ChevronDown, Download, Users, Save } from 'lucide-react';
import { useState, useEffect } from 'react';

// 가짜 데이터: 실제로는 API를 통해 주차를 선택하면 불러옵니다.
const fakePayrollData = [
    { id: 1, licenseId: '86073821121', name: '조봉군4858', totalOrders: 177, settlementAmount: 772894, supportFund: 1000, deduction: 0, totalSettlement: 773894, employmentInsurance: -10640, industrialInsurance: -6450, hourlyInsurance: 0, retroactiveInsurance: 0, actualPayout: 713741, leaseFee: 0, missionFee: 0 },
    { id: 2, licenseId: '86074145766', name: '박나영5940', totalOrders: 10, settlementAmount: 42875, supportFund: 0, deduction: 0, totalSettlement: 42875, employmentInsurance: -280, industrialInsurance: -310, hourlyInsurance: 0, retroactiveInsurance: 0, actualPayout: 39223, leaseFee: 0, missionFee: 0 },
    { id: 3, licenseId: '86073146796', name: '김재성0818', totalOrders: 301, settlementAmount: 1338982, supportFund: 0, deduction: 0, totalSettlement: 1338982, employmentInsurance: -10640, industrialInsurance: -8920, hourlyInsurance: 0, retroactiveInsurance: 0, actualPayout: 1233260, leaseFee: 0, missionFee: 0 },
];

const PayrollPage: NextPage = () => {
    const [selectedWeek, setSelectedWeek] = useState('');
    const [payrollData, setPayrollData] = useState(fakePayrollData);
    const [isLoading, setIsLoading] = useState(false);
    
    const weekOptions = [
        { id: '2025-w23', label: '2025년 6월 1주차 (5.28 - 6.3)' },
        { id: '2025-w22', label: '2025년 5월 4주차 (5.21 - 5.27)' },
    ];
    
    // 리스비 또는 미션비 입력 시 상태 업데이트하는 함수
    const handleFeeChange = (id: number, feeType: 'leaseFee' | 'missionFee', value: string) => {
        const numericValue = parseInt(value, 10) || 0;
        setPayrollData(currentData =>
            currentData.map(item =>
                item.id === id ? { ...item, [feeType]: numericValue } : item
            )
        );
    };
    
    // 저장 버튼 클릭 시 실행될 함수
    const handleSave = async () => {
        setIsLoading(true);
        // console.log("저장할 데이터:", payrollData); // 이 줄은 이제 필요 없으므로 삭제하거나 주석 처리

        // API에 보낼 데이터는 id, lease_fee, mission_fee만 포함하면 됩니다.
        const updates = payrollData.map(item => ({
            id: item.id,
            lease_fee: item.leaseFee,
            mission_fee: item.missionFee,
        }));

        try {
            const response = await fetch('/api/update-fees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ updates }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || '저장에 실패했습니다.');
            }

            alert('성공적으로 저장되었습니다!');

        } catch (error: any) {
            alert(`오류: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Head><title>기사 급여 관리 - 배달TIPPICK</title></Head>
            <div>
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">전체 기사 급여 관리</h1>
                    <p className="text-gray-500 mt-2">주차별로 기사 급여 데이터를 조회하고 리스비/미션비를 입력하세요.</p>
                </div>

                {/* 필터 및 요약 카드 */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                        <div>
                            <label className="text-sm font-semibold text-gray-700 block mb-2">주차 선택</label>
                            <div className="relative"><select value={selectedWeek} onChange={e => setSelectedWeek(e.target.value)} className="w-full appearance-none bg-gray-100 border-2 border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"><option value="">주차를 선택하세요</option>{weekOptions.map(week => (<option key={week.id} value={week.id}>{week.label}</option>))}</select><ChevronDown className="w-5 h-5 text-gray-400 absolute top-1/2 right-4 -translate-y-1/2" /></div>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg text-center"><p className="text-sm font-semibold text-gray-700">총 기사수</p><p className="text-3xl font-bold text-blue-600 mt-1">{payrollData.length}명</p></div>
                        <div className="p-4 bg-gray-50 rounded-lg text-center"><p className="text-sm font-semibold text-gray-700 mb-2">데이터 내보내기</p><button className="flex items-center justify-center gap-2 w-full py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700"><Download className="w-4 h-4" />CSV 내보내기</button></div>
                    </div>
                </div>

                {/* 데이터 테이블 카드 */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                    <div className="p-6 flex justify-between items-center">
                        <h3 className="flex items-center text-xl font-bold text-gray-800"><Users className="w-6 h-6 mr-3" />기사 급여 데이터</h3>
                        <button onClick={handleSave} disabled={isLoading} className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 shadow-sm disabled:bg-gray-400">
                            <Save className="w-5 h-5" />
                            {isLoading ? '저장 중...' : '변경사항 일괄 저장'}
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left text-gray-500">
                            <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
                                <tr>
                                    {/* 테이블 헤더 */}
                                    <th className="px-4 py-3">라이선스 ID</th>
                                    <th className="px-4 py-3">성함</th>
                                    <th className="px-4 py-3 text-right">실지급액</th>
                                    <th className="px-4 py-3 text-center">리스비</th>
                                    <th className="px-4 py-3 text-center">미션비</th>
                                    {/* 필요시 다른 헤더 추가 */}
                                </tr>
                            </thead>
                            <tbody>
                                {payrollData.map((item) => (
                                    <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-4 py-4 font-mono">{item.licenseId}</td>
                                        <td className="px-4 py-4 font-semibold text-gray-900">{item.name}</td>
                                        <td className="px-4 py-4 text-right font-medium text-gray-900">{item.actualPayout.toLocaleString()}원</td>
                                        <td className="px-4 py-4 w-32">
                                            <input type="number" value={item.leaseFee} onChange={(e) => handleFeeChange(item.id, 'leaseFee', e.target.value)} className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 text-right"/>
                                        </td>
                                        <td className="px-4 py-4 w-32">
                                            <input type="number" value={item.missionFee} onChange={(e) => handleFeeChange(item.id, 'missionFee', e.target.value)} className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 text-right"/>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PayrollPage; 