import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { createClient } from '@/lib/supabase/client';
import { Edit, Save, PlusCircle, Trash2 } from 'lucide-react';

// 타입 정의
interface Template {
  id: string;
  template_name: string;
  column_mapping: any;
  created_at: string;
}

const AdminTemplatesPage: NextPage = () => {
  const supabase = createClient();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // 템플릿 목록 불러오기
  const fetchTemplates = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('parsing_templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError('템플릿 목록을 불러오는 데 실패했습니다: ' + error.message);
    } else {
      setTemplates(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  // 템플릿 저장 (수정)
  const handleSaveTemplate = async () => {
    if (!selectedTemplate) return;

    // column_mapping의 내용을 string에서 JSON 객체로 변환
    let parsedMapping;
    try {
        parsedMapping = JSON.parse(selectedTemplate.column_mapping);
    } catch (e) {
        setError('JSON 형식이 올바르지 않습니다.');
        return;
    }

    const { error } = await supabase
      .from('parsing_templates')
      .update({
        template_name: selectedTemplate.template_name,
        column_mapping: parsedMapping, // 파싱된 객체를 저장
      })
      .eq('id', selectedTemplate.id);

    if (error) {
      setError('템플릿 저장에 실패했습니다: ' + error.message);
    } else {
      alert('템플릿이 성공적으로 저장되었습니다.');
      setSelectedTemplate(null);
      fetchTemplates(); // 목록 새로고침
    }
  };

  const handleSelectTemplate = (template: Template) => {
    // JSON 객체를 예쁘게 포맷팅된 문자열로 변환하여 textarea에 표시
    const formattedMapping = JSON.stringify(template.column_mapping, null, 2);
    setSelectedTemplate({ ...template, column_mapping: formattedMapping });
    setError('');
  };

  if (isLoading) return <div>로딩 중...</div>;

  return (
    <>
      <Head>
        <title>템플릿 관리 - 배달TIPPICK</title>
      </Head>
      <div className="flex gap-8">
        {/* 왼쪽: 템플릿 목록 */}
        <div className="w-1/3">
          <h2 className="text-xl font-bold mb-4">파싱 템플릿 목록</h2>
          <div className="space-y-2">
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() => handleSelectTemplate(template)}
                className={`p-4 rounded-lg cursor-pointer ${
                  selectedTemplate?.id === template.id ? 'bg-blue-100 ring-2 ring-blue-500' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <p className="font-semibold">{template.template_name}</p>
                <p className="text-sm text-gray-500">
                  생성일: {new Date(template.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 오른쪽: 템플릿 편집기 */}
        <div className="w-2/3">
          <h2 className="text-xl font-bold mb-4">템플릿 편집</h2>
          {selectedTemplate ? (
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="mb-4">
                <label className="font-semibold block mb-1">템플릿 이름</label>
                <input
                  type="text"
                  value={selectedTemplate.template_name}
                  onChange={(e) =>
                    setSelectedTemplate({ ...selectedTemplate, template_name: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="font-semibold block mb-1">컬럼 매핑 규칙 (JSON)</label>
                <textarea
                  value={selectedTemplate.column_mapping}
                  onChange={(e) =>
                    setSelectedTemplate({ ...selectedTemplate, column_mapping: e.target.value })
                  }
                  className="w-full p-2 border rounded font-mono text-sm"
                  rows={15}
                />
              </div>
              {error && <p className="text-red-500 mb-4">{error}</p>}
              <button onClick={handleSaveTemplate} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg">
                <Save size={18} />
                저장하기
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
              <p className="text-gray-500">왼쪽 목록에서 수정할 템플릿을 선택하세요.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminTemplatesPage;