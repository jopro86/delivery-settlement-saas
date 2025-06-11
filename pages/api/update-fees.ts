import { NextApiRequest, NextApiResponse } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

// 업데이트할 데이터의 타입을 정의합니다.
type FeeUpdateData = {
    id: number; // official_settlements 테이블의 id
    lease_fee: number;
    mission_fee: number;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const supabase = createPagesServerClient({ req, res });
    const { data: { session } } = await supabase.auth.getSession();

    // 1. 인증 및 권한 확인
    if (!session) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const { data: profile } = await supabase
        .from('profiles')
        .select('role, tenant_id')
        .eq('id', session.user.id)
        .single();

    if (!profile || profile.role !== 'ADMIN' || !profile.tenant_id) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    try {
        const updates: FeeUpdateData[] = req.body.updates;

        if (!updates || !Array.isArray(updates) || updates.length === 0) {
            return res.status(400).json({ error: 'Invalid update data provided.' });
        }
        
        // 2. 여러 행을 한번에 업데이트 (Upsert 사용)
        // Supabase는 여러 행을 한번에 update하는 직접적인 메소드가 없으므로,
        // upsert를 사용하여 동일한 효과를 냅니다. id가 일치하면 update, 없으면 insert (하지만 id가 있으므로 항상 update됨)
        const { error } = await supabase
            .from('official_settlements')
            .upsert(
                updates.map(item => ({
                    id: item.id,
                    lease_fee: item.lease_fee,
                    mission_fee: item.mission_fee,
                })),
                { onConflict: 'id' } // id가 충돌(일치)할 경우 덮어쓰기
            );

        if (error) {
            console.error('Error updating fees:', error);
            throw new Error(error.message);
        }

        // 3. 성공 응답
        res.status(200).json({ message: 'Fees updated successfully.' });

    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
} 