import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHistoryByID, getInspectionResult } from '../api';
import type { HistoryItem, ResultItem } from '../api';

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
  return `${dd}/${mm}/${yyyy} : ${hh}:${min}:${ss}`;
}

function parseSamplingPoint(raw?: string | string[]): string {
  if (!raw) return '---';
  if (Array.isArray(raw)) return raw.join(', ') || '---';
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.join(', ') || '---';
  } catch { /* empty */ }
  return String(raw);
}

function View() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<HistoryItem | null>(null);
  const [composition, setComposition] = useState<ResultItem[]>([]);
  const [defect, setDefect] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = () => {
    if (!id) {
      setError('Missing inspection id');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    getHistoryByID(id)
      .then(res => setData(res))
      .catch((err) => {
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
      })
      .finally(() => setLoading(false));

    getInspectionResult(id)
      .then(res => {
        setComposition(res.composition || []);
        setDefect(res.defect || []);
      })
      .catch(() => {
        setComposition([]);
        setDefect([]);
      });
  };

  useEffect(() => { loadData(); }, [id]);

  if (loading) {
    return (
      <>
        <nav className="navbar"><a href="/" className="navbar-brand">EasyRice</a></nav>
        <div className="page-wrapper"><div className="state-center">Loading...</div></div>
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <nav className="navbar"><a href="/" className="navbar-brand">EasyRice</a></nav>
        <div className="page-wrapper"><div className="state-center">{error || 'Inspection not found.'}</div></div>
      </>
    );
  }

  return (
    <>
      <nav className="navbar"><a href="/" className="navbar-brand">EasyRice</a></nav>

      <div className="page-wrapper">
        <button className="back-link" onClick={() => navigate('/')}>
          <span className="back-arrow">←</span> Back
        </button>

        <h2 className="inspection-page-title">Inspection</h2>

        <div className="card">
          <div className="card-body">
            <div className="view-layout">
              {/* Left: Image + Edit */}
              <div className="view-image-col">
                {data.imageLink ? (
                  <img
                    className="view-image"
                    src={data.imageLink}
                    alt="inspection"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : (
                  <div className="view-image-placeholder">No Image</div>
                )}
                <button className="btn btn-primary btn-sm" onClick={() => navigate(`/edit/${id}`)}>Edit</button>
              </div>

              {/* Right: Details */}
              <div className="view-details-col">
                <div className="detail-row">
                  <span className="detail-label">Create Date - Time</span>
                  <span className="detail-value">{formatDate(data.createDate)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Inspection ID</span>
                  <span className="detail-value green">{data.inspectionID}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Standard</span>
                  <span className="detail-value">{data.standardName || '---'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Update Date - Time</span>
                  <span className="detail-value">{formatDate(data.samplingDate)}</span>
                </div>

                {data.note && (
                  <div className="note-box" style={{ marginTop: 12 }}>
                    <div className="note-label">NOTE :</div>
                    <div className="note-content">{data.note}</div>
                  </div>
                )}

                <div className="meta-row">
                  <div className="meta-item">
                    <span className="meta-label">Price</span>
                    <span className="meta-value">{data.price ? Number(data.price).toLocaleString() : '---'}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Date/Time of Sampling</span>
                    <span className="meta-value">{formatDate(data.samplingDate)}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Sampling of Point</span>
                    <span className="meta-value">{parseSamplingPoint(data.samplingPoint)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Composition */}
            {composition.length > 0 && (
              <>
                <h3 className="section-title">Composition</h3>
                <table className="sub-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Min Length</th>
                      <th>Max Length</th>
                      <th>Actual (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {composition.map(item => (
                      <tr key={item.key}>
                        <td>{item.name}</td>
                        <td>{item.minLength ?? '---'}</td>
                        <td>{item.maxLength ?? '---'}</td>
                        <td>{Number(item.actual).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {/* Defect Rice */}
            {defect.length > 0 && (
              <>
                <h3 className="section-title">Defect Rice</h3>
                <table className="sub-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Actual (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {defect.map(item => (
                      <tr key={item.name}>
                        <td>{item.name}</td>
                        <td>{Number(item.actual).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default View;
