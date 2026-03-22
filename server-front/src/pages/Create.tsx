import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function Create() {
  const navigate = useNavigate();
  useEffect(() => { navigate('/'); }, [navigate]);
  return null;
}

export default Create;
