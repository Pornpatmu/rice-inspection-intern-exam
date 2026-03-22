import { useEffect, useState } from 'react';
import { createHistory, deleteHistory, getHistory, getStandards } from '../api';
import type { HistoryItem } from '../api';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 10;

function formatDate(dateStr?: string) {
  if (!dateStr) return '---';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${dd}/${mm}/${yyyy} ${hh}:${min}:${ss}`;
}

function CreateModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [standards, setStandards] = useState<{ standardID: string; name: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    standardID: '',
    note: '',
    samplingDate: '',
    samplingPoint: [] as string[],
    price: '',
    fileUpload: null as File | null,
  });

  useEffect(() => {
    getStandards().then((items) =>
      setStandards(
        items.map((item) => ({
          standardID: item.standardID ?? item.id ?? '',
          name: item.name,
        })),
      )
    );
  }, []);

  const samplingOptions = ['Front End', 'Back End', 'Other'];

  const handleCheckbox = (value: string) => {
    setForm((prev) => ({
      ...prev,
      samplingPoint: prev.samplingPoint.includes(value)
        ? prev.samplingPoint.filter((p) => p !== value)
        : [...prev.samplingPoint, value],
    }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) { alert('Please enter name'); return; }
    if (!form.standardID) { alert('Please select standard'); return; }
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('standardID', form.standardID);
    formData.append('note', form.note);
    formData.append('samplingDate', form.samplingDate);
    formData.append('samplingPoint', JSON.stringify(form.samplingPoint));
    formData.append('price', form.price);
    if (form.fileUpload) formData.append('fileUpload', form.fileUpload);
    setSubmitting(true);
    try {
      await createHistory(formData);
      onSuccess();
    } catch (err) {
      alert('Error: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Create Inspection</h2>

        <div className="form-group">
          <label className="form-label">Name <span className="required">*</span></label>
          <input className="form-input" type="text" placeholder="Enter name"
            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>

        <div className="form-group">
          <label className="form-label">Standard <span className="required">*</span></label>
          <select className="form-select" value={form.standardID}
            onChange={(e) => setForm({ ...form, standardID: e.target.value })}>
            <option value="">Please Select Standard</option>
            {standards.map((s) => <option key={s.standardID} value={s.standardID}>{s.name}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Upload File</label>
          <input className="form-input" type="file" accept=".json"
            onChange={(e) => setForm({ ...form, fileUpload: e.target.files?.[0] || null })} />
        </div>

        <div className="form-group">
          <label className="form-label">Price</label>
          <input className="form-input" type="number" placeholder="10,000"
            min={0} max={100000} value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })} />
        </div>

        <div className="form-group">
          <label className="form-label">Note</label>
          <input className="form-input" type="text" placeholder="Note"
            value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
        </div>

        <div className="form-group">
          <label className="form-label">Sampling Point</label>
          <div className="checkbox-group">
            {samplingOptions.map((opt) => (
              <label className="checkbox-item" key={opt}>
                <input type="checkbox" checked={form.samplingPoint.includes(opt)}
                  onChange={() => handleCheckbox(opt)} />
                {opt}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Date/Time of Sampling</label>
          <input className="form-input" type="datetime-local" value={form.samplingDate}
            onChange={(e) => setForm({ ...form, samplingDate: e.target.value })} />
        </div>

        <div className="modal-actions">
          <button className="btn btn-cancel" onClick={onClose} disabled={submitting}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Saving...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Home() {
  const [allData, setAllData] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({ fromDate: '', toDate: '', inspectionID: '' });
  const [page, setPage] = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  const navigate = useNavigate();

  const fetchData = (f = filter) => {
    setLoading(true);
    setError('');
    getHistory(f)
      .then((res) => { setAllData(res); setPage(1); })
      .catch((err) => {
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleClear = () => {
    const empty = { fromDate: '', toDate: '', inspectionID: '' };
    setFilter(empty);
    fetchData(empty);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`ลบ ${id} ?`)) return;
    try {
      await deleteHistory(id);
      fetchData();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      alert(`Error: ${message}`);
    }
  };

  const totalPages = Math.max(1, Math.ceil(allData.length / PAGE_SIZE));
  const pageData = allData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <nav className="navbar">
        <a href="/" className="navbar-brand">EasyRice</a>
      </nav>

      <div className="page-wrapper">
        <div className="page-header">
          <div>
            <h1 className="page-title">Rice Inspection History</h1>
            <p className="page-subtitle">View, search, and manage inspection results</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
            <span className="btn-icon">+</span> Create Inspection
          </button>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="filter-bar">
              <div className="filter-group">
                <span className="filter-label">ID</span>
                <div className="filter-input-wrap">
                  <input className="filter-input" type="text" placeholder="Exact inspection ID"
                    value={filter.inspectionID}
                    onChange={(e) => setFilter({ ...filter, inspectionID: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && fetchData()} />
                </div>
              </div>

              <div className="filter-group">
                <span className="filter-label">Created From</span>
                <div className="filter-input-wrap">
                  <input className="filter-input" type="date"
                    value={filter.fromDate}
                    onChange={(e) => setFilter({ ...filter, fromDate: e.target.value })} />
                </div>
              </div>

              <div className="filter-group">
                <span className="filter-label">Created To</span>
                <div className="filter-input-wrap">
                  <input className="filter-input" type="date"
                    value={filter.toDate}
                    onChange={(e) => setFilter({ ...filter, toDate: e.target.value })} />
                </div>
              </div>

              <button className="btn btn-primary btn-sm" onClick={() => fetchData()}>Search</button>
              <button className="clear-link" onClick={handleClear}>Clear</button>
            </div>

            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Create Date - Time</th>
                    <th>Inspection ID</th>
                    <th>Name</th>
                    <th>Standard</th>
                    <th>Note</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={7}><div className="state-center">Loading...</div></td></tr>
                  ) : error ? (
                    <tr><td colSpan={7}><div className="state-center">Error: {error}</div></td></tr>
                  ) : pageData.length === 0 ? (
                    <tr><td colSpan={7}><div className="state-center">No data found</div></td></tr>
                  ) : pageData.map((item) => (
                    <tr key={item.inspectionID} onClick={() => navigate(`/view/${item.inspectionID}`)}>
                      <td><input className="row-checkbox" type="checkbox" onClick={(e) => e.stopPropagation()} /></td>
                      <td>{formatDate(item.createDate)}</td>
                      <td>{item.inspectionID}</td>
                      <td>{item.name}</td>
                      <td>{item.standardName || '---'}</td>
                      <td className="muted">{item.note || '---'}</td>
                      <td>
                        <button onClick={(e) => { e.stopPropagation(); navigate(`/edit/${item.inspectionID}`); }}>Edit</button>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(item.inspectionID); }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>‹</button>
              <span>{page}/{totalPages} of {allData.length}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>›</button>
            </div>
          </div>
        </div>
      </div>

      {showCreate && (
        <CreateModal
          onClose={() => setShowCreate(false)}
          onSuccess={() => { setShowCreate(false); fetchData(); }}
        />
      )}
    </>
  );
}

export default Home;
