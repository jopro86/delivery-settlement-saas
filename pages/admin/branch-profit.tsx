import { ClipboardList, TrendingUp, CalendarDays, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import type { NextPage } from 'next';

// 타입 정의
interface WeekOption {
  id: string;
  label: string;
  period: string;
}

interface ProfitData {
  total: number;
  totalOrders: number;
  managementFee: number;
  promotion: number;
  supplyFee: number;
  vat: number;
  coupaEatsSupport: number;
  employerEmploymentInsurance: number;
  employerIndustrialAccidentInsurance: number;
  retroInsurance: string | number;
}

// 수익 필터 카드 컴포넌트
const ProfitFilterCard = ({ 
  weeks, 
  onWeekChange, 
  selectedPeriod 
}: {
  weeks: WeekOption[];
  onWeekChange: (value: string) => void;
  selectedPeriod: string | undefined;
}) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
    <div className="bg-green-600 text-white p-6 rounded-lg shadow-inner">
      <h2 className="flex items-center text-xl font-bold mb-4">
        <TrendingUp className="w-6 h-6 mr-2" />
        수익내역 조회
      </h2>
      
      <div className="relative mb-4">
        <select 
          onChange={e => onWeekChange(e.target.value)} 
          className="w-full appearance-none bg-white text-gray-800 border border-green-400 rounded-md py-3 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-green-300"
        >
          {weeks.map(week => (
            <option key={week.id} value={week.id}>
              {week.label}
            </option>
          ))}
        </select>
        <ChevronDown className="w-6 h-6 text-gray-400 absolute top-1/2 right-4 -translate-y-1/2 pointer-events-none" />
      </div>
      
      <div className="bg-green-700/50 p-4 rounded-md flex items-center">
        <CalendarDays className="w-5 h-5 mr-3" />
        <p>
          <span className="text-sm font-medium">정산 기간:</span> {selectedPeriod}
        </p>
      </div>
    </div>
  </div>
);

// 수익 카드 컴포넌트
const ProfitCard = ({ 
  label, 
  value, 
  valueColor = 'text-gray-900', 
  isLarge = false, 
  note = null 
}: {
  label: string;
  value: string | number;
  valueColor?: string;
  isLarge?: boolean;
  note?: string | null;
}) => (
  <div className={`bg-white p-5 rounded-lg shadow-md border border-gray-200 ${
    isLarge ? 'md:col-span-2 lg:col-span-3' : 'md:col-span-1'
  }`}>
    <p className="text-sm text-gray-500">{label}</p>
    <p className={`mt-1 text-3xl font-bold ${valueColor}`}>{value}</p>
    {note && <p className="text-xs text-gray-400 mt-1">{note}</p>}
  </div>
);

// 메인 지점 수익내역 페이지
const BranchProfitPage: NextPage = () => {
  const [selectedWeek, setSelectedWeek] = useState('2025-w23');
  
  const weekOptions: WeekOption[] = [
    { 
      id: '2025-w23', 
      label: '2025년 6월 1주차 (2025. 5. 28.~2025. 6. 3.)', 
      period: '5월 28일(수) ~ 6월 3일(화)' 
    }
  ];
  
  const profitData: { [key: string]: ProfitData } = {
    '2025-w23': { 
      total: 271020, 
      totalOrders: 2721, 
      managementFee: 480000, 
      promotion: 22500, 
      supplyFee: 11385015, 
      vat: 1138501, 
      coupaEatsSupport: 0, 
      employerEmploymentInsurance: -154770, 
      employerIndustrialAccidentInsurance: -76710, 
      retroInsurance: '-' 
    }
  };
  
  const formatCurrency = (num: number | string) => 
    typeof num === 'number' ? num.toLocaleString() + '원' : num;
  
  const formatNumber = (num: number) => num.toLocaleString() + '건';
  
  const currentData = profitData[selectedWeek] || {};
  const currentWeekInfo = weekOptions.find(w => w.id === selectedWeek);

  return (
    <div>
      <div className="mb-8 text-center">
        <ClipboardList className="w-10 h-10 mx-auto text-green-600 mb-2" />
        <h1 className="text-3xl font-bold text-gray-800">지점 수익내역 관리</h1>
        <p className="text-gray-500 mt-2">
          엑셀 종합 시트 데이터를 기반으로 지점별 수익 현황을 확인하세요
        </p>
      </div>
      
      <ProfitFilterCard 
        weeks={weekOptions} 
        onWeekChange={setSelectedWeek} 
        selectedPeriod={currentWeekInfo?.period} 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProfitCard 
          label="합계" 
          value={formatCurrency(currentData.total)} 
          valueColor="text-orange-600" 
          isLarge={true} 
          note="(쿠팡이츠 지원금+관리비+프로모션+사업주부담 고용보험+사업주부담 산재보험+보험료 소급)"
        />
        <ProfitCard 
          label="총 정산 오더수" 
          value={formatNumber(currentData.totalOrders)} 
        />
        <ProfitCard 
          label="관리비" 
          value={formatCurrency(currentData.managementFee)} 
        />
        <ProfitCard 
          label="프로모션" 
          value={formatCurrency(currentData.promotion)} 
          valueColor="text-pink-600" 
        />
        <ProfitCard 
          label="공급가" 
          value={formatCurrency(currentData.supplyFee)} 
        />
        <ProfitCard 
          label="부가세" 
          value={formatCurrency(currentData.vat)} 
        />
        <ProfitCard 
          label="쿠팡이츠 지원금" 
          value={formatCurrency(currentData.coupaEatsSupport)} 
        />
        <ProfitCard 
          label="사업주부담 고용보험" 
          value={formatCurrency(currentData.employerEmploymentInsurance)} 
        />
        <ProfitCard 
          label="사업주부담 산재보험" 
          value={formatCurrency(currentData.employerIndustrialAccidentInsurance)} 
        />
        <ProfitCard 
          label="보험료 소급" 
          value={currentData.retroInsurance} 
        />
      </div>
    </div>
  );
};

export default BranchProfitPage; 