import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getHistoryByID } from '../api';
import type { HistoryItem } from '../api';

function View() {
  const { id } = useParams();
  const [data, setData] = useState<HistoryItem | null>(null);

  useEffect(() => {
    if (id) getHistoryByID(id).then(res => setData(res));
  }, [id]);

  return (
    <div>
      <h1>View</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default View;