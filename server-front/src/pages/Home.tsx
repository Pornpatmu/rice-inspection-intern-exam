import { useEffect, useState } from 'react';
import { getHistory, getHistoryByID } from '../api';
import type { HistoryItem } from '../api';
import { useNavigate, Link } from 'react-router-dom';

function Home() {
  const [data, setData] = useState<HistoryItem[]>([]);
  const [filter, setFilter] = useState({
    fromDate: '',
    toDate: '',
    inspectionID: '',
  });
  const navigate = useNavigate();

  const fetchData = (f = filter) => {
    getHistory(f).then(res => setData(res));
  };

  useEffect(() => {
    fetchData();
  }, []);
  const handleClear = () => {
    const empty = { fromDate: '', toDate: '', inspectionID: '' };
    setFilter(empty);
    fetchData(empty);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`ลบ ${id} ?`)) return;
    await fetch(`${import.meta.env.VITE_API_BASE}/history/${id}`, { method: 'DELETE' });
    fetchData();
  };

  return (
    <div>
      <h1>Home</h1>
      <Link to="/create"><button>Create</button></Link>

      <div>
       <label>From Create Date: <input type="date" value={filter.fromDate} onChange={e => setFilter({ ...filter, fromDate: e.target.value })} /></label>
        <label>To Create Date: <input type="date" value={filter.toDate} onChange={e => setFilter({ ...filter, toDate: e.target.value })} /></label>
        <label>Inspection ID: <input type="text" placeholder="EC-0000-0000" value={filter.inspectionID} onChange={e => setFilter({ ...filter, inspectionID: e.target.value })} /></label>
        <button onClick={() => fetchData()}>Search</button>
        <button onClick={handleClear}>Clear</button>
      </div>

      {data.map(item => (
        <div key={item.inspectionID}>
          <div onClick={() => navigate(`/view/${item.inspectionID}`)}>
            <p>ID: {item.inspectionID}</p>
            <p>Name: {item.name}</p>
            <p>Standard: {item.standardName}</p>
            <p>Sampling Date: {item.samplingDate}</p>
            <p>Sampling Point: {item.samplingPoint?.join(', ')}</p>
            <p>Price: {item.price}</p>
            <p>Note: {item.note}</p>
          </div>
          <button onClick={(e) => { e.stopPropagation(); navigate(`/edit/${item.inspectionID}`); }}>Edit</button>
          <button onClick={(e) => { e.stopPropagation(); handleDelete(item.inspectionID); }}>Delete</button>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default Home;