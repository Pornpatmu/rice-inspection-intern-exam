import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createHistory, getStandards } from '../api';

function Create() {
  const navigate = useNavigate();
  const [standards, setStandards] = useState<{ id?: string; name: string }[]>([]);  
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
    getStandards().then((items) => {
      setStandards(
        items.map((item) => ({
          id: item.id ?? '',
          name: item.name,
        })),
      );
    });
  }, []);

  const samplingOptions = ['Front End', 'Back End', 'Other'];

  const handleCheckbox = (value: string) => {
    setForm((prev) => ({
      ...prev,
      samplingPoint: prev.samplingPoint.includes(value)
        ? prev.samplingPoint.filter((point) => point !== value)
        : [...prev.samplingPoint, value],
    }));
  };

  const handleSubmit = async () => {
    if (!form.name) {
      alert('Please enter name');
      return;
    }

    if (!form.standardID) {
      alert('Please select standard');
      return;
    }

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('standardID', form.standardID);
    formData.append('note', form.note);
    formData.append('samplingDate', form.samplingDate);
    formData.append('samplingPoint', JSON.stringify(form.samplingPoint));
    formData.append('price', form.price);

    if (form.fileUpload) {
      formData.append('fileUpload', form.fileUpload);
    }

    try {
      await createHistory(formData);
      alert('History created successfully');
      navigate('/');
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      alert(`Error: ${message}`);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6">
      <h1>Create History</h1>

      <input
        type="text"
        placeholder="Name *"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <select
        value={form.standardID}
        onChange={(e) => setForm({ ...form, standardID: e.target.value })}
      >
        <option value="">Select Standard</option>
        {standards.map(s => (
    <option key={s.id} value={s.id}>
        {s.name}
    </option>
))}
      </select>

      <input
        type="file"
        onChange={(e) => setForm({ ...form, fileUpload: e.target.files?.[0] || null })}
      />

      <textarea
        placeholder="Note"
        value={form.note}
        onChange={(e) => setForm({ ...form, note: e.target.value })}
      />

      <input
        type="number"
        placeholder="Price"
        min={0}
        max={100000}
        step={0.01}
        value={form.price}
        onChange={(e) => setForm({ ...form, price: e.target.value })}
      />

      <div>
        <p>Sampling Point</p>
        {samplingOptions.map((option) => (
          <label key={option}>
            <input
              type="checkbox"
              checked={form.samplingPoint.includes(option)}
              onChange={() => handleCheckbox(option)}
            />
            {option}
          </label>
        ))}
      </div>

      <input
        type="datetime-local"
        value={form.samplingDate}
        onChange={(e) => setForm({ ...form, samplingDate: e.target.value })}
      />

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default Create;
