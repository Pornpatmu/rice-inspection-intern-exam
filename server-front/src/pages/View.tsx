import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getHistoryByID } from '../api';
import type { HistoryItem } from '../api';
import { useNavigate } from 'react-router-dom';

function View() {
  const { id } = useParams();
  const [data, setData] = useState<HistoryItem | null>(null);
  const navigate = useNavigate();


  useEffect(() => {
    if (id) getHistoryByID(id).then(res => setData(res));
  }, [id]);

  const handleEdit = () => {
    if (id) {
      navigate(`/edit/${id}`);
    }
  };
  return (
    <div>
      <h1>View</h1>
      <button onClick={handleEdit}>
        Edit
      </button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default View;