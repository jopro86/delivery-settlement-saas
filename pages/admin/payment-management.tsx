import { DollarSign, ChevronDown, Download } from 'lucide-react';
import type { NextPage } from 'next';

// 타입 정의
interface WeekOption {
  id: string;
  label: string;
}

interface PaymentSummary {
  totalPayout: string;
  totalTax: string;
  grandTotal: string;
}

interface PaymentItem {
  id: number;
  riderId: string;
  name: string;
  payout: string;
  tax: string;
  total: string;
}

// 급여 필터 카드 컴포넌트
const PaymentFilterCard = ({ 
  weeks, 
  onWeekChange 
}: { 
  weeks: WeekOption[];
  onWeekChange: (value: string) => void;
}) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
    <h2 className="text-xl font-bold text-gray-800">급여 지급 대시보드</h2>
    
    <div className="flex items-center gap-4 w-full md:w-auto">
      <div className="relative flex-grow md:flex-grow-0 md:w-72">
        <select 
          onChange={e => onWeekChange(e.target.value)} 
          className="w-full appearance-none bg-gray-100 border border-gray-200 rounded-md py-2 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {weeks.map(week => (
            <option key={week.id} value={week.id}>
              {week.label}
            </option>
          ))}
        </select>
        <ChevronDown className="w-5 h-5 text-gray-400 absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none" />
      </div>
      
      <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700">
        <Download className="w-4 h-4" />
        CSV
      </button>
    </div>
  </div>
);

// 급여 요약 카드 컴포넌트
const PaymentSummaryCard = ({ summary }: { summary: PaymentSummary }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <p className="text-sm text-gray-500">총 실지급액</p>
      <p className="text-3xl font-bold text-blue-600 mt-1">{summary.totalPayout}</p>
    </div>
    
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <p className="text-sm text-gray-500">총 원천세</p>
      <p className="text-3xl font-bold text-red-600 mt-1">{summary.totalTax}</p>
    </div>
    
    <div className="bg-white p-6 rounded-lg shadow-md border-2 border-gray-800">
      <p className="text-sm text-gray-500">총 합계</p>
      <p className="text-3xl font-bold text-gray-900 mt-1">{summary.grandTotal}</p>
    </div>
  </div>
);

// 급여 테이블 카드 컴포넌트
const PaymentTableCard = ({ payments }: { payments: PaymentItem[] }) => (
  <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-700">
        급여 지급 상세 ({payments.length}명)
      </h3>
    </div>
    
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            <th className="px-6 py-3">라이선스ID</th>
            <th className="px-6 py-3">성함</th>
            <th className="px-6 py-3 text-right">라이더별 실지급액</th>
            <th className="px-6 py-3 text-right">원천세(3.3%)</th>
            <th className="px-6 py-3 text-right">합계</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {payments.map(p => (
            <tr key={p.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                {p.riderId}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                {p.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                {p.payout}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 text-right">
                {p.tax}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-700 text-right">
                {p.total}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// 메인 급여 지급 관리 페이지
const PaymentManagementPage: NextPage = () => {
  const weeks: WeekOption[] = [
    { id: '2025-w23', label: '2025년 6월 1주차 (2025. 5. 28.~2025. 6. 3.)' }
  ];
  
  const summaryData: PaymentSummary = { 
    totalPayout: '10,622,589원', 
    totalTax: '350,546원', 
    grandTotal: '10,272,043원' 
  };
  
  const paymentListData: PaymentItem[] = [
    { 
      id: 1, 
      riderId: '86073821121', 
      name: '조용군4858', 
      payout: '713,741원', 
      tax: '23,553원', 
      total: '690,188원' 
    },
    { 
      id: 2, 
      riderId: '86074145766', 
      name: '박나영5940', 
      payout: '39,223원', 
      tax: '1,294원', 
      total: '37,929원' 
    },
    { 
      id: 3, 
      riderId: '86073146796', 
      name: '김재성0818', 
      payout: '1,233,260원', 
      tax: '40,698원', 
      total: '1,192,562원' 
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">급여 지급 관리</h1>
        <p className="text-gray-500 mt-2">기사별 급여 지급 현황을 관리합니다.</p>
      </div>
      
      <PaymentFilterCard weeks={weeks} onWeekChange={() => {}} />
      <PaymentSummaryCard summary={summaryData} />
      <PaymentTableCard payments={paymentListData} />
    </div>
  );
};

export default PaymentManagementPage; 