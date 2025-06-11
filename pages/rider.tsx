import { Search, User } from 'lucide-react';
import type { NextPage } from 'next';

// 타입 정의
interface RiderData {
  name: string;
  totalOrders: number;
  settlementAmount: number;
  supportFund: number;
  deductionTotal: number;
  totalSettlementAmount: number;
  employmentInsurance: number;
  industrialAccidentInsurance: number;
  hourlyInsurance: number;
  retroactiveInsurance: number;
  leaseFee: number;
  missionFee: number;
  actualPayout: number;
  taxRate: number;
  withholdingTax: number;
  finalPayout: number;
}

interface InfoCardProps {
  label: string;
  value: string | number;
  valueColor?: string;
  isBold?: boolean;
  bgColor?: string;
}

interface HighlightCardProps {
  label: string;
  value: string | number;
  bgColor?: string;
  valueColor?: string;
}

// 유틸리티 함수
const formatCurrency = (num: number): string => {
  return typeof num === 'number' ? `${num.toLocaleString()} 원` : String(num);
};

const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

// 기본 정보 카드 컴포넌트
const InfoCard: React.FC<InfoCardProps> = ({ 
  label, 
  value, 
  valueColor = 'text-gray-900', 
  isBold = false, 
  bgColor = 'bg-blue-50/50' 
}) => (
  <div className={`${bgColor} p-4 rounded-lg`}>
    <p className="text-sm text-gray-500">{label}</p>
    <p className={`mt-1 text-xl ${isBold ? 'font-bold' : 'font-semibold'} ${valueColor}`}>
      {value}
    </p>
  </div>
);

// 강조 카드 컴포넌트
const HighlightCard: React.FC<HighlightCardProps> = ({ 
  label, 
  value, 
  bgColor = 'bg-green-100', 
  valueColor = 'text-green-800' 
}) => (
  <div className={`${bgColor} p-4 rounded-lg`}>
    <p className="text-sm text-gray-500">{label}</p>
    <p className={`mt-1 text-xl font-bold ${valueColor}`}>{value}</p>
  </div>
);

// 라이더 ID 검색 컴포넌트
const RiderIdSearch: React.FC = () => (
  <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200">
    <h2 className="flex items-center text-lg font-bold text-blue-600 mb-4">
      <User className="w-6 h-6 mr-2" />
      라이선스 ID를 입력하세요
    </h2>
    <div className="flex gap-2">
      <input 
        type="text" 
        defaultValue="86074145591" 
        className="flex-grow p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
        placeholder="라이선스 ID" 
      />
      <button className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
        <Search className="w-5 h-5" />
        조회
      </button>
    </div>
  </div>
);

// 정산 상세 정보 컴포넌트
const SettlementDetails: React.FC<{ data: RiderData }> = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">시원컴퍼니</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard label="성함" value={data.name} isBold={true} />
        <InfoCard label="총 정산 오더수" value={formatNumber(data.totalOrders)} />
        <InfoCard label="정산금액" value={formatCurrency(data.settlementAmount)} />
        <InfoCard label="총 지원금" value={formatCurrency(data.supportFund)} />
        <InfoCard label="차감내역" value={formatCurrency(data.deductionTotal)} />
        <InfoCard label="총 정산금액" value={formatCurrency(data.totalSettlementAmount)} />
        <InfoCard 
          label="기사부담 고용보험" 
          value={formatCurrency(data.employmentInsurance)} 
          valueColor="text-blue-600" 
        />
        <InfoCard 
          label="기사부담 산재보험" 
          value={formatCurrency(data.industrialAccidentInsurance)} 
          valueColor="text-blue-600" 
        />
        <InfoCard label="시간제보험" value={formatCurrency(data.hourlyInsurance)} />
        <InfoCard label="보험료 소급" value={formatCurrency(data.retroactiveInsurance)} />
        <InfoCard 
          label="리스비" 
          value={formatCurrency(data.leaseFee)} 
          bgColor="bg-yellow-50"
        />
        <InfoCard 
          label="미션비" 
          value={formatCurrency(data.missionFee)} 
          bgColor="bg-purple-50"
        />
        <HighlightCard 
          label="라이더별 실지급액" 
          value={formatCurrency(data.actualPayout)} 
          bgColor="bg-green-100" 
          valueColor="text-green-800" 
        />
        <HighlightCard 
          label={`원천세 (${data.taxRate}%)`} 
          value={formatCurrency(data.withholdingTax)} 
          bgColor="bg-red-100" 
          valueColor="text-red-700" 
        />
      </div>
      
      <div className="mt-6 bg-blue-600 text-white p-6 rounded-lg text-center">
        <p className="font-semibold">입금받으실금액</p>
        <p className="text-4xl font-bold mt-2">{formatCurrency(data.finalPayout)}</p>
      </div>
    </div>
  );
};

// 메인 라이더 정산 페이지
const RiderSettlementPage: NextPage = () => {
  const riderData: RiderData = {
    name: '장진호1902',
    totalOrders: 233,
    settlementAmount: 904070,
    supportFund: 1000,
    deductionTotal: 0,
    totalSettlementAmount: 905070,
    employmentInsurance: -10640,
    industrialAccidentInsurance: -6450,
    hourlyInsurance: 0,
    retroactiveInsurance: 0,
    leaseFee: 0,
    missionFee: 0,
    actualPayout: 887980,
    taxRate: 3.3,
    withholdingTax: 29303,
    finalPayout: 858677
  };

  return (
    <div className="max-w-4xl mx-auto">
      <RiderIdSearch />
      <SettlementDetails data={riderData} />
    </div>
  );
};

export default RiderSettlementPage; 