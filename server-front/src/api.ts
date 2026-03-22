const apiBase = import.meta.env.VITE_API_BASE;

export type HistoryItem = {
    name: string;
    createDate?: string;
    inspectionID: string;
    standardID: string;
    note?: string;
    standardName?: string;
    samplingDate?: string;
    samplingPoint?: string[] | string;
    price?: number | string;
    imageLink?: string | null;
    standardData?: Array<{
        key: string;
        minLength?: number;
        maxLength?: number;
        shape?: string[];
        name: string;
        conditionMin?: string;
        conditionMax?: string;
        value?: number;
    }>;
};

type HistoryFilter = {
    fromDate?: string;
    toDate?: string;
    inspectionID?: string;
};

// ดึง nested data ออกมา เช่น { data: { data: [...] } } → [...]
const unwrapData = <T>(payload: any): T => {
    if (payload && typeof payload === 'object' && 'data' in payload) {
        return unwrapData(payload.data);
    }
    return payload as T;
};

// สร้าง history ใหม่
export const createHistory = async (formData: FormData) => {
    const res = await fetch(`${apiBase}/history`, { method: 'POST', body: formData });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create history');
    return data;
};

// ดึง history ทั้งหมด แต่กรองได้ด้วย fromDate, toDate, inspectionID
export const getHistory = async (filter?: HistoryFilter) => {
    const params = new URLSearchParams(filter as Record<string, string>);
    const res = await fetch(`${apiBase}/history?${params}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to load history');
    return unwrapData<HistoryItem[]>(data) || [];
};

// ดึง history ตาม ID
export const getHistoryByID = async (id: string) => {
    const res = await fetch(`${apiBase}/history/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to load history detail');
    return unwrapData<HistoryItem>(data);
};

// ดึง standard ทั้งหมด
export const getStandards = async () => {
    const res = await fetch(`${apiBase}/standard`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to load standards');
    return unwrapData<Array<{ standardID?: string; id?: string; name: string }>>(data) || [];
};

export const deleteHistory = async (id: string) => {
    const res = await fetch(`${apiBase}/history/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete history');
    return data;
};

export const updateHistory = async (
    id: string,
    payload: {
        note: string;
        price: string;
        samplingPoint: string[];
        samplingDate: string;
    },
) => {
    const res = await fetch(`${apiBase}/history/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update history');
    return data;
};

// type ของผลการตรวจแต่ละรายการ ใช้ได้ทั้ง composition และ defect
export type ResultItem = {
    key: string;
    name: string;
    minLength?: number;
    maxLength?: number;
    actual: number;
    type: 'composition' | 'defect';
};

// ดึงผลการตรวจ composition และ defect ตาม inspectionID
export const getInspectionResult = async (id: string) => {
    const res = await fetch(`${apiBase}/history/${id}/result`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return unwrapData<{ composition: ResultItem[]; defect: ResultItem[] }>(data);
};
