import { useState } from 'react';

function Create() {
  const [form, setForm] = useState({
    name: '',
    standardID: '',
    note: '',
    samplingDate: '',
    samplingPoint: [] as string[],
    price: '',
    fileUpload: null as File | null,
  });

  const samplingOptions = ['Front End', 'Back End', 'Other'];

  const handleCheckbox = (value: string) => {
    setForm(prev => ({
      ...prev,
      samplingPoint: prev.samplingPoint.includes(value)
        ? prev.samplingPoint.filter(v => v !== value)
        : [...prev.samplingPoint, value],
    }));
  };

  const handleSubmit = () => {
    console.log(form);
  };

  return (
    <div className="flex flex-col gap-4 p-6">
      <h1>Create</h1>

      <input
        type="text"
        placeholder="Name *"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
      />

      <input
        type="text"
        placeholder="Standard"
        value={form.standardID}
        onChange={e => setForm({ ...form, standardID: e.target.value })}
      />
      <input
        type="file"
        onChange={e => setForm({ ...form, fileUpload: e.target.files?.[0] || null })}
      />
      <textarea
        placeholder="Note"
        value={form.note}
        onChange={e => setForm({ ...form, note: e.target.value })}
      />
        <input
        type="number"
        placeholder="Price"
        min={0}
        max={100000}
        step={0.01}
        value={form.price}
        onChange={e => setForm({ ...form, price: e.target.value })}
      />

    
      <div>
        <p>Sampling Point</p>
        {samplingOptions.map(option => (
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
        onChange={e => setForm({ ...form, samplingDate: e.target.value })}
      />

      <button onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}

export default Create;