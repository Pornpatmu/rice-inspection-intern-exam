const apiBase = import.meta.env.VITE_API_BASE;

export type HistoryItem = {
    name: string;
    createDate?: string;
    inspectionID: string;
    standardID: string;
    note?: string;
    standardName?: string;
    samplingDate?: string;
    samplingPoint?: string[];
    price?: number;
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
export const getHistory = async (filter?: { fromDate?: string; toDate?: string; inspectionID?: string }) => {
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
    return unwrapData<Array<{ id?: string; name: string }>>(data) || [];
};