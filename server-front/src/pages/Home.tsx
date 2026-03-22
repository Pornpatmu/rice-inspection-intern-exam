import { useEffect, useState } from 'react';
import { getHistory } from '../api';
import type { HistoryItem } from '../api';
import { useNavigate, Link } from 'react-router-dom';

function Home() {
  const [data, setData] = useState<HistoryItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getHistory().then(res => setData(res));
  }, []);

  return (
    <div>
      <h1>Home</h1>
      <Link to="/create"><button>Create</button></Link>

      {data.map(item => (
  <div key={item.inspectionID} onClick={() => navigate(`/view/${item.inspectionID}`)}>
    <p>ID: {item.inspectionID}</p>
    <p>Name: {item.name}</p>
    <p>Standard: {item.standardName}</p>
    <p>Sampling Date: {item.samplingDate}</p>
    <p>Sampling Point: {item.samplingPoint?.join(', ')}</p>
    <p>Price: {item.price}</p>
    <p>Note: {item.note}</p>
    <hr />
  </div>
))}
    </div>
  );
}

export default Home;