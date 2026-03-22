import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHistoryByID, updateHistory } from '../api';

const samplingOptions = ['Front End', 'Back End', 'Other'];

function parseSamplingPoint(raw?: string | string[]): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch { /* empty */ }
  return [];
}

function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    note: '',
    price: '',
    samplingPoint: [] as string[],
    samplingDate: '',
  });

  useEffect(() => {
    if (!id) {
      setError('Missing inspection id');
      setLoading(false);
      return;
    }

    getHistoryByID(id)
      .then(res => {
        setForm({
          note: res.note || '',
          price: String(res.price || ''),
          samplingPoint: parseSamplingPoint(res.samplingPoint),
          samplingDate: res.samplingDate
            ? new Date(res.samplingDate).toISOString().slice(0, 16)
            : '',
        });
      })
      .catch((err) => {
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
      })
      .finally(() => setLoading(false));
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
    if (!id) return;
    setSubmitting(true);
    try {
      await updateHistory(id, form);
      navigate(-1);
    } catch (err) {
      alert('Error: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <nav className="navbar">
        <a href="/" className="navbar-brand">EasyRice</a>
      </nav>

      <div className="page-wrapper">
        {loading ? (
          <div className="state-center">Loading...</div>
        ) : error ? (
          <div className="state-center">Error: {error}</div>
        ) : (
        <div className="modal-box">
          <h2 className="modal-title">Edit Inspection ID : {id}</h2>

          <div className="form-group">
            <label className="form-label">Note</label>
            <textarea
              className="form-textarea"
              placeholder="Inspection Support"
              value={form.note}
              onChange={e => setForm({ ...form, note: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Price</label>
            <input
              className="form-input"
              type="number"
              min={0}
              max={100000}
              value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Sampling Point</label>
            <div className="checkbox-group">
              {samplingOptions.map(opt => (
                <label className="checkbox-item" key={opt}>
                  <input
                    type="checkbox"
                    checked={form.samplingPoint.includes(opt)}
                    onChange={() => handleCheckbox(opt)}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Date/Time of Sampling</label>
            <input
              className="form-input"
              type="datetime-local"
              value={form.samplingDate}
              onChange={e => setForm({ ...form, samplingDate: e.target.value })}
            />
          </div>

          <div className="modal-actions">
            <button className="btn btn-cancel" onClick={() => navigate(-1)} disabled={submitting}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Saving...' : 'Submit'}
            </button>
          </div>
        </div>
        )}
      </div>
    </>
  );
}

export default Edit;
