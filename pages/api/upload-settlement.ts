// pages/api/upload-settlement.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import formidable, { type File } from 'formidable'; // formidable의 File 타입을 명시적으로 import
import fs from 'fs/promises';
import * as XLSX from 'xlsx';
import { UserRole } from '@/lib/types'; // UserRole 타입 import

// formidable이 파일을 직접 처리하므로 Next.js의 bodyParser를 비활성화합니다.
export const config = {
    api: {
        bodyParser: false,
    },
};

// 동적 파싱 템플릿의 타입을 정의합니다.
interface ColumnMapping {
    [dbColumn: string]: string | { key: string, type: string };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // 최신 Supabase SSR 클라이언트를 생성합니다.
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get: (name: string) => req.cookies[name],
                set: (name:string, value:string, options: CookieOptions) => { /* 클라이언트에서 처리 */ },
                remove: (name:string, options: CookieOptions) => { /* 클라이언트에서 처리 */ },
            },
        }
    );

    // --- 1. 인증 및 권한 확인 ---
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        return res.status(401).json({ error: '인증되지 않은 사용자입니다. 로그인이 필요합니다.' });
    }

    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, tenant_id')
        .eq('id', session.user.id)
        .single();

    if (profileError || !profile) {
        return res.status(500).json({ error: '사용자 프로필 정보를 가져오는 데 실패했습니다. RLS 정책을 확인하세요.' });
    }

    // ================== ✅ 여기에 변경 사항이 적용됩니다 ✅ ==================
    const userRole = profile.role as UserRole;
    const allowedRoles: UserRole[] = ['ADMIN', 'SUPER_ADMIN']; // 허용할 역할 목록

    // 사용자의 역할이 허용 목록에 없거나, tenant_id가 없는 경우 권한 없음 처리
    if (!allowedRoles.includes(userRole) || !profile.tenant_id) {
        return res.status(403).json({ error: '파일을 업로드할 권한이 없습니다.' });
    }
    // ======================================================================

    const { tenant_id: tenantId } = profile;
    const form = formidable({});
    let uploadRecordId: string | null = null;
    let tempFile: File | undefined; // 임시 파일 객체를 저장할 변수

    try {
        console.log(`[${new Date().toISOString()}] User ${session.user.email} (Role: ${userRole}) started file upload.`);

        const [fields, files] = await form.parse(req);

        tempFile = files.excelFile?.[0];
        const templateId = fields.template_id?.[0];
        const weekIdentifier = fields.week_identifier?.[0] || 'unknown-week';

        if (!tempFile || !templateId) {
            return res.status(400).json({ error: '파일과 파싱 템플릿을 모두 선택해주세요.' });
        }

        // --- 2. 파싱 템플릿 정보 가져오기 ---
        const { data: template, error: templateError } = await supabase
            .from('parsing_templates')
            .select('column_mapping') // 실제 컬럼명 확인
            .eq('id', templateId)
            .single();

        if (templateError || !template || !template.column_mapping) {
            return res.status(404).json({ error: '유효한 파싱 템플릿을 찾을 수 없거나, 매핑 정보가 비어있습니다.' });
        }
        const columnMapping = template.column_mapping as any;

        // --- 3. Supabase 스토리지에 원본 파일 저장 ---
        const fileContent = await fs.readFile(tempFile.filepath);
        // ✅ 한글 파일명 문제 해결: 스토리지에는 안전한 영문명만 사용
        const safeTimestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const originalFilename = tempFile.originalFilename || 'unknownfile';
        
        // 파일 확장자 추출
        const fileExtension = originalFilename.includes('.') 
            ? originalFilename.slice(originalFilename.lastIndexOf('.'))
            : '.xlsx'; // 기본 확장자
        
        // 스토리지 경로는 영문/숫자만 사용 (한글 제거)
        const safeStorageFilename = `upload-${Date.now()}${fileExtension}`;
        const storagePath = `${tenantId}/${safeTimestamp}-${safeStorageFilename}`;

        const { error: storageError } = await supabase.storage
            .from('settlement-files')
            .upload(storagePath, fileContent);

        if (storageError) {
            throw new Error(`스토리지 저장 오류: ${storageError.message}`);
        }

        // --- 4. uploads 테이블에 메타데이터 기록 ---
        const { data: newUploadRecord, error: uploadError } = await supabase
            .from('uploads')
            .insert({
                tenant_id: tenantId,
                uploader_id: session.user.id,
                file_name: tempFile.originalFilename || 'unknown_file',
                storage_path: storagePath,
                week_identifier: weekIdentifier,
                status: 'processing'
            })
            .select('id')
            .single();

        if (uploadError || !newUploadRecord) {
            throw new Error(`업로드 기록 저장 오류: ${uploadError?.message}`);
        }
        uploadRecordId = newUploadRecord.id; // 나중에 에러 핸들링에 사용하기 위해 ID 저장

        // --- 5. 템플릿을 사용하여 엑셀 동적 파싱 ---
        const workbook = XLSX.read(fileContent, { type: 'buffer' });
        const sheetName = columnMapping.sheetName || workbook.SheetNames[0];
        const startRow = columnMapping.startRow || 1;

        const worksheet = workbook.Sheets[sheetName];
        if (!worksheet) {
            throw new Error(`시트 이름 '${sheetName}'을 찾을 수 없습니다.`);
        }
        const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: startRow - 1 });

        const headerRow = jsonData[0];
        const dbColToExcelIndex: { [key: string]: number } = {};
        
        const mappingColumns = columnMapping.columns || columnMapping;

        for (const dbColKey in mappingColumns) {
            const excelColName = mappingColumns[dbColKey].key || mappingColumns[dbColKey];
            const index = headerRow.indexOf(excelColName);
            if (index !== -1) {
                dbColToExcelIndex[dbColKey] = index;
            }
        }
        
        const settlementData = jsonData.slice(1).map(row => {
            const newRow: { [key: string]: any } = {
                upload_id: uploadRecordId,
                tenant_id: tenantId,
            };
            for (const dbCol in dbColToExcelIndex) {
                let value = row[dbColToExcelIndex[dbCol]];
                newRow[dbCol] = (value === undefined || value === '') ? null : value;
            }
            return newRow;
        }).filter(row => row.rider_platform_id != null);

        if (settlementData.length === 0) {
            throw new Error('처리할 유효한 데이터가 없습니다. 파일 형식 또는 템플릿의 시작 행을 확인해주세요.');
        }

        // --- 6. official_settlements 테이블에 데이터 저장 ---
        const { error: settlementError } = await supabase
            .from('official_settlements')
            .insert(settlementData);

        if (settlementError) {
            throw new Error(`정산 데이터 저장 오류: ${settlementError.message}`);
        }

        // --- 7. uploads 테이블 상태 업데이트 ---
        await supabase
            .from('uploads')
            .update({ status: 'completed', processed_records: settlementData.length })
            .eq('id', uploadRecordId);

        console.log(`[${new Date().toISOString()}] Successfully processed ${settlementData.length} settlement records.`);

        res.status(200).json({
            message: '파일이 성공적으로 업로드되고 처리되었습니다!',
            processed_records: settlementData.length,
            upload_id: uploadRecordId
        });

    } catch (error: any) {
        console.error('File upload process error:', error.message);
        
        // 오류 발생 시 업로드 레코드 상태를 'failed'로 업데이트
        if (uploadRecordId) {
            try {
                await supabase
                    .from('uploads')
                    .update({ status: 'failed', error_message: error.message })
                    .eq('id', uploadRecordId);
            } catch (updateError) {
                console.error('Failed to update upload status to failed:', updateError);
            }
        }
        
        res.status(500).json({ error: error.message || '서버 내부 오류가 발생했습니다.' });
    } finally {
        // ✅ 올바른 finally 블록 복원
        if (tempFile) {
            try {
                await fs.unlink(tempFile.filepath);
            } catch (unlinkError) {
                console.error('Error deleting temporary file:', unlinkError);
            }
        }
    }
}