import type { NextPage } from 'next';
import Head from 'next/head';
import { FileText, UploadCloud, ClipboardList, CheckCircle, AlertTriangle, Loader } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/router';

// 타입 정의
interface Template {
  id: string;
  template_name: string;
}

interface UploadHistory {
  id: string;
  file_name: string;
  created_at: string;
  status: string;
  week_identifier: string; // 주차 정보
}

// 상태 배지 컴포넌트
const StatusBadge = ({ status }: { status: string }) => {
  const statusStyles: { [key: string]: string } = {
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    processing: 'bg-blue-100 text-blue-800',
  };
  
  return (
    <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
};

const FileUploadCard = ({ onUploadSuccess }: { onUploadSuccess: () => void }) => {
    const supabase = createClient();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [templates, setTemplates] = useState<Template[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [weekIdentifier, setWeekIdentifier] = useState('2025-W25');
    
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchTemplates = async () => {
            const { data, error } = await supabase
                .from('parsing_templates')
                .select('id, template_name');
            
            if (error) {
                console.error('Error fetching templates:', error);
                setMessage('템플릿 목록을 불러오는 데 실패했습니다.');
            } else {
                setTemplates(data || []);
            }
        };
        fetchTemplates();
    }, [supabase]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            setUploadStatus('idle');
            setMessage('');
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !selectedTemplate) {
            setMessage('파일과 파싱 템플릿을 모두 선택해주세요.');
            setUploadStatus('error');
            return;
        }
        setUploadStatus('uploading');
        setMessage('업로드 및 데이터 처리 중... (파일 크기에 따라 시간이 걸릴 수 있습니다)');

        const formData = new FormData();
        formData.append('excelFile', selectedFile);
        formData.append('template_id', selectedTemplate);
        formData.append('week_identifier', weekIdentifier);

        try {
            const response = await fetch('/api/upload-settlement', {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || '알 수 없는 오류가 발생했습니다.');
            
            setUploadStatus('success');
            setMessage(`✅ 성공: "${selectedFile.name}" 파일이 처리되었습니다.`);
            setSelectedFile(null);
            onUploadSuccess();

        } catch (error: any) {
            setUploadStatus('error');
            setMessage(`❌ 오류: ${error.message}`);
        }
    };
    
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h3 className="flex items-center text-xl font-bold text-gray-800 mb-4">
                <FileText className="w-6 h-6 mr-3" />
                정산 엑셀 업로드
            </h3>
            <div className="space-y-4">
                <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-2">1. 파싱 템플릿 선택</label>
                    <select value={selectedTemplate} onChange={e => setSelectedTemplate(e.target.value)} className="w-full bg-gray-100 border-2 border-gray-200 rounded-lg p-3">
                        <option value="">템플릿을 선택하세요</option>
                        {templates.map(t => <option key={t.id} value={t.id}>{t.template_name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-2">2. 엑셀 파일 선택</label>
                    <input type="file" onChange={handleFileChange} accept=".xlsx, .xls, .csv" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"/>
                </div>
            </div>
            
            <div className="mt-6 border-t pt-6 flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm">
                    {uploadStatus === 'uploading' && <Loader className="w-5 h-5 animate-spin" />}
                    {uploadStatus === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
                    {uploadStatus === 'error' && <AlertTriangle className="w-5 h-5 text-red-500" />}
                    <p className={`${uploadStatus === 'error' ? 'text-red-600' : 'text-gray-600'}`}>{message}</p>
                </div>
                <button onClick={handleUpload} disabled={!selectedFile || !selectedTemplate || uploadStatus === 'uploading'} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed">
                    <UploadCloud className="w-5 h-5" />
                    {uploadStatus === 'uploading' ? '처리 중...' : '업로드 및 데이터 저장'}
                </button>
            </div>
        </div>
    );
};

const UploadHistoryCard = ({ history }: { history: UploadHistory[] }) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mt-8">
    <h3 className="flex items-center text-lg font-semibold text-gray-800 mb-4">
      <ClipboardList className="w-5 h-5 mr-2" />
      업로드 내역
    </h3>
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="text-left text-sm text-gray-500">
            <th className="p-2 font-medium">주차 정보</th>
            <th className="p-2 font-medium">파일명</th>
            <th className="p-2 font-medium">업로드 일시</th>
            <th className="p-2 font-medium">상태</th>
          </tr>
        </thead>
        <tbody>
          {history.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center p-8 text-gray-500">업로드 내역이 없습니다.</td>
            </tr>
          ) : (
            history.map((item) => (
              <tr key={item.id} className="border-t border-gray-200">
                <td className="p-4 text-blue-600 font-semibold">{item.week_identifier}</td>
                <td className="p-4 text-gray-800">{item.file_name}</td>
                <td className="p-4 text-gray-600">{new Date(item.created_at).toLocaleString('ko-KR')}</td>
                <td className="p-4"><StatusBadge status={item.status} /></td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

const AdminDashboardPage: NextPage = () => {
  const supabase = createClient();
  const [uploadHistory, setUploadHistory] = useState<UploadHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchUploadHistory = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('uploads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
        console.error('Error fetching upload history:', error);
    } else {
        setUploadHistory(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUploadHistory();
  }, []);

  const handleTempLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: 'admin@test.com',      // 테스트 관리자 계정
      password: 'password123',      // 테스트 비밀번호
    });
    
    if (!error) {
      router.push('/admin/dashboard'); // 성공 시 관리자 대시보드로 이동
    }
  };

  return (
    <>
      <Head><title>관리자 대시보드 - 배달TIPPICK</title></Head>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">관리자 대시보드</h1>
          <p className="text-gray-500 mt-2">
            엑셀 파일을 업로드하여 배달기사 급여 데이터를 관리하세요.
          </p>
        </div>
        <FileUploadCard onUploadSuccess={fetchUploadHistory} />
        {isLoading ? (
            <div className="text-center p-8"><Loader className="w-8 h-8 animate-spin mx-auto text-gray-400" /></div>
        ) : (
            <UploadHistoryCard history={uploadHistory} />
        )}
      </div>
    </>
  );
};

export default AdminDashboardPage; 