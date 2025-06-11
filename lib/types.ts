// lib/types.ts
// Supabase 데이터베이스의 user_role ENUM과 일치하는 TypeScript 타입

export type UserRole = 'RIDER' | 'ADMIN' | 'SUPER_ADMIN';

export interface User {
    id: string;
    name: string;
    email?: string;
    role: UserRole;
    created_at?: string;
    updated_at?: string;
}

export interface DatabaseUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    created_at: string;
    updated_at: string;
}

// Tenants (지점) 테이블 타입
export interface Tenant {
    id: string;
    name: string;
    created_at: string;
}

export interface CreateTenantInput {
    name: string;
}

export interface UpdateTenantInput {
    name?: string;
}

// Profiles (사용자 추가 정보) 테이블 타입
export interface Profile {
    id: string; // auth.users의 id와 동일
    email?: string;
    full_name?: string;
    role?: UserRole;
    tenant_id?: string;
    platform_ids?: PlatformIds;
    updated_at?: string;
}

// 배달 플랫폼 ID들을 저장하는 JSONB 타입
export interface PlatformIds {
    baemin?: string;
    yogiyo?: string;
    coupang_eats?: string;
    uber_eats?: string;
    [key: string]: string | undefined; // 추가 플랫폼 대응
}

// Profile과 Tenant 정보가 합쳐진 타입 (JOIN 쿼리용)
export interface ProfileWithTenant extends Profile {
    tenant?: Tenant;
}

export interface CreateProfileInput {
    id: string; // auth.users에서 가져온 id
    email?: string;
    full_name?: string;
    role?: UserRole;
    tenant_id?: string;
    platform_ids?: PlatformIds;
}

export interface UpdateProfileInput {
    email?: string;
    full_name?: string;
    role?: UserRole;
    tenant_id?: string;
    platform_ids?: PlatformIds;
}

// Uploads (파일 업로드 내역) 테이블 타입
export type UploadStatus = 'processing' | 'completed' | 'failed' | 'pending';

export interface Upload {
    id: string;
    tenant_id: string;
    uploader_id: string;
    file_name: string;
    storage_path: string;
    week_identifier: string;
    status: UploadStatus;
    created_at: string;
}

// Upload과 관련 정보가 합쳐진 타입 (JOIN 쿼리용)
export interface UploadWithDetails extends Upload {
    tenant?: Tenant;
    uploader?: Profile;
}

export interface CreateUploadInput {
    tenant_id: string;
    uploader_id: string;
    file_name: string;
    storage_path: string;
    week_identifier: string;
    status?: UploadStatus;
}

export interface UpdateUploadInput {
    status?: UploadStatus;
    file_name?: string;
}

// Official_Settlements (공식 정산 데이터) 테이블 타입
export interface OfficialSettlement {
    id: number;
    upload_id: string;
    tenant_id: string;
    rider_name?: string;
    rider_platform_id: string;
    settlement_amount: number;
    support_fund: number;
    deduction_total: number;
    total_settlement_amount: number;
    employment_insurance: number;
    industrial_accident_insurance: number;
    hourly_insurance: number;
    retroactive_insurance: number;
    lease_fee: number;
    mission_fee: number;
    actual_payout: number;
    withholding_tax: number;
    final_payout: number;
}

// OfficialSettlement과 관련 정보가 합쳐진 타입 (JOIN 쿼리용)
export interface OfficialSettlementWithDetails extends OfficialSettlement {
    upload?: Upload;
    tenant?: Tenant;
}

export interface CreateOfficialSettlementInput {
    upload_id: string;
    tenant_id: string;
    rider_name?: string;
    rider_platform_id: string;
    settlement_amount?: number;
    support_fund?: number;
    deduction_total?: number;
    total_settlement_amount?: number;
    employment_insurance?: number;
    industrial_accident_insurance?: number;
    hourly_insurance?: number;
    retroactive_insurance?: number;
    lease_fee?: number;
    mission_fee?: number;
    actual_payout?: number;
    withholding_tax?: number;
    final_payout?: number;
}

export interface UpdateOfficialSettlementInput {
    rider_name?: string;
    settlement_amount?: number;
    support_fund?: number;
    deduction_total?: number;
    total_settlement_amount?: number;
    employment_insurance?: number;
    industrial_accident_insurance?: number;
    hourly_insurance?: number;
    retroactive_insurance?: number;
    lease_fee?: number;
    mission_fee?: number;
    actual_payout?: number;
    withholding_tax?: number;
    final_payout?: number;
}

// 정산 요약 타입 (통계용)
export interface SettlementSummary {
    total_riders: number;
    total_settlement_amount: number;
    total_final_payout: number;
    total_deductions: number;
    average_payout: number;
}

// Personal_Ledgers (개인 정산 계산기) 테이블 타입
export type LedgerEntryType = 'INCOME' | 'EXPENSE';

export interface PersonalLedger {
    id: number;
    user_id: string;
    entry_date: string; // DATE 타입은 YYYY-MM-DD 형식의 문자열
    entry_type: LedgerEntryType;
    amount: number;
    description?: string;
    created_at: string;
}

export interface CreatePersonalLedgerInput {
    user_id: string;
    entry_date: string; // YYYY-MM-DD 형식
    entry_type: LedgerEntryType;
    amount: number;
    description?: string;
}

export interface UpdatePersonalLedgerInput {
    entry_date?: string;
    entry_type?: LedgerEntryType;
    amount?: number;
    description?: string;
}

// 개인 장부 통계 타입
export interface LedgerSummary {
    total_income: number;
    total_expense: number;
    net_amount: number; // 순수익 (수입 - 지출)
    entry_count: number;
    period_start: string;
    period_end: string;
}

// 날짜별 개인 장부 집계 타입
export interface DailyLedgerSummary {
    date: string;
    total_income: number;
    total_expense: number;
    net_amount: number;
    entries: PersonalLedger[];
}

// 월별 개인 장부 집계 타입
export interface MonthlyLedgerSummary {
    year: number;
    month: number;
    total_income: number;
    total_expense: number;
    net_amount: number;
    entry_count: number;
}

// Parsing_Templates (파싱 템플릿) 테이블 타입
export interface ColumnMapping {
    // OfficialSettlement 필드와 엑셀 컬럼의 매핑
    rider_name?: string; // 예: "C" (C 컬럼)
    rider_platform_id?: string; // 예: "A"
    settlement_amount?: string; // 예: "G"
    support_fund?: string;
    deduction_total?: string;
    total_settlement_amount?: string;
    employment_insurance?: string;
    industrial_accident_insurance?: string;
    hourly_insurance?: string;
    retroactive_insurance?: string;
    lease_fee?: string;
    mission_fee?: string;
    actual_payout?: string;
    withholding_tax?: string;
    final_payout?: string;
    // 추가 매핑 필드들
    [key: string]: string | undefined;
}

export interface ParsingTemplate {
    id: string;
    tenant_id: string;
    template_name: string;
    column_mapping: ColumnMapping;
    is_active: boolean;
    created_at: string;
}

// ParsingTemplate과 관련 정보가 합쳐진 타입 (JOIN 쿼리용)
export interface ParsingTemplateWithDetails extends ParsingTemplate {
    tenant?: Tenant;
}

export interface CreateParsingTemplateInput {
    tenant_id: string;
    template_name: string;
    column_mapping: ColumnMapping;
    is_active?: boolean;
}

export interface UpdateParsingTemplateInput {
    template_name?: string;
    column_mapping?: ColumnMapping;
    is_active?: boolean;
}

// 템플릿 사용 결과 타입
export interface ParseResult {
    success: boolean;
    data?: CreateOfficialSettlementInput[];
    errors?: string[];
    total_rows: number;
    parsed_rows: number;
}

// 엑셀 파일 미리보기 타입
export interface ExcelPreview {
    headers: string[]; // A, B, C, D... 또는 컬럼명
    sample_rows: (string | number)[][]; // 첫 몇 행의 샘플 데이터
    total_rows: number;
} 