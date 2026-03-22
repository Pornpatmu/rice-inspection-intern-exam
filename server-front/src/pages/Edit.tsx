import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHistoryByID } from '../api';

function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    note: '',
    price: '',
    samplingPoint: [] as string[],
    samplingDate: '',
  });

  const samplingOptions = ['Front End', 'Back End', 'Other'];

  useEffect(() => {
    if (id) {
      getHistoryByID(id).then(res => {
        setForm({
          note: res.note || '',
          price: String(res.price || ''),
          samplingPoint: Array.isArray(res.samplingPoint) ? res.samplingPoint : [],
          samplingDate: res.samplingDate ? res.samplingDate.slice(0, 16) : '',
        });
      });
    }
  }, [id]);

  const handleCheckbox = (value: string) => {
    setForm(prev => ({
      ...prev,
      samplingPoint: prev.samplingPoint.includes(value)
        ? prev.samplingPoint.filter(v => v !== value)
        : [...prev.samplingPoint, value],
    }));
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/history/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert('แก้ไขสำเร็จ');
      navigate(-1);
    } catch (err) {
      alert('Error: ' + err);
    }
  };

  return (
    <div>
      <h1>Edit Inspection ID : {id}</h1>

      <label>Note</label>
      <textarea value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />

      <label>Price</label>
      <input type="number" min={0} max={100000} step={0.01} value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />

      <label>Sampling Point</label>
      <div>
        {samplingOptions.map(option => (
          <label key={option}>
            <input type="checkbox" checked={form.samplingPoint.includes(option)} onChange={() => handleCheckbox(option)} />
            {option}
          </label>
        ))}
      </div>

      <label>Date/Time of Sampling</label>
      <input type="datetime-local" value={form.samplingDate} onChange={e => setForm({ ...form, samplingDate: e.target.value })} />

      <button onClick={() => navigate(-1)}>Cancel</button>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default Edit;