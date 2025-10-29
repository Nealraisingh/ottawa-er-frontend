// src/components/AdminPage.jsx
import React, { useEffect, useState } from 'react';

const STORAGE_KEY = 'ottawa_er_admin_cache_v1';

// small helper to avoid XSS when injecting HTML
function escapeHtml(s){ if(!s) return ''; return String(s).replace(/[&<>\"']/g, c=> ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[c]); }

export default function AdminPage(){
  // ----- AUTH (client-side) -----
  // WARNING: client-side password is not secure. See notes below for a better flow.
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');

  // ----- DATA -----
  const [data, setData] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [
        {id:1,hospital:'The Ottawa Hospital - Civic',location:'Civic Campus',wait:'1 hr 15 min',status:'busy',notes:'Triage 2 & 3 slower'},
        {id:2,hospital:'Queensway Carleton Hospital',location:'Bayshore',wait:'45 min',status:'stable',notes:''},
        {id:3,hospital:'Montfort Hospital',location:'Vanier',wait:'2 hr',status:'very',notes:'High volume overnight'}
      ];
    } catch { return []; }
  });

  const [filter, setFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [lastSaved, setLastSaved] = useState('never');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // simple auth handler (change 'letmein' to your password or implement server auth)
  function tryLogin() {
    const real = process.env.REACT_APP_ADMIN_PASSWORD || 'letmein';
    if (pw === real) {
      setAuthed(true);
      setPw('');
    } else {
      alert('Wrong password');
    }
  }

  // ----- CRUD helpers -----
  const list = data.filter(r => (r.hospital + ' ' + r.location + ' ' + (r.notes || '')).toLowerCase().includes(filter.toLowerCase()));

  function openModal(entry){
    setEditing(entry ? {...entry} : { id:null, hospital:'', location:'', wait:'', status:'stable', notes:'' });
    setModalOpen(true);
  }
  function closeModal(){ setModalOpen(false); setEditing(null); }

  function saveEditing(){
    if(!editing.hospital.trim()){ alert('Hospital name required'); return; }
    if(editing.id){
      setData(d => d.map(x => x.id === editing.id ? {...editing} : x));
    } else {
      const newId = data.reduce((m,x) => Math.max(m,x.id||0), 0) + 1;
      setData(d => [...d, {...editing, id:newId}]);
    }
    closeModal();
  }

  function deleteEditing(){
    if(!editing?.id) { alert('No entry to delete'); return; }
    if(!window.confirm('Delete this entry?')) return;
    setData(d => d.filter(x => x.id !== editing.id));
    closeModal();
  }

  async function saveToServer(){
    try {
      // TODO: replace with your real backend endpoint
      const res = await fetch('/api/admin/wait-times/bulk', {
        method: 'POST',
        headers: {'content-type':'application/json'},
        body: JSON.stringify({items: data})
      });
      if(!res.ok) throw new Error('Server returned ' + res.status);
      await res.json();
      setLastSaved(new Date().toLocaleString());
      alert('Saved to server');
    } catch(err){
      console.error(err);
      alert('Save failed — demo fallback uses localStorage. Implement /api/admin/wait-times/bulk on server.');
    }
  }

  // ----- RENDER -----
  if(!authed){
    return (
      <div className="max-w-xl mx-auto py-24 px-6 text-center">
        <h2 className="text-2xl font-semibold mb-4">Admin Login</h2>
        <p className="text-sm text-gray-600 mb-6">Enter admin password to access the admin panel.</p>
        <div className="flex items-center justify-center gap-3">
          <input
            type="password"
            className="px-3 py-2 border rounded-md w-64"
            placeholder="Admin password"
            value={pw}
            onChange={e=>setPw(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && tryLogin()}
          />
          <button onClick={tryLogin} className="px-4 py-2 bg-blue-700 text-white rounded-md">Login</button>
        </div>
        <p className="text-xs text-gray-500 mt-4">Tip: set REACT_APP_ADMIN_PASSWORD in your environment for a custom password.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-blue-900">Admin — Ottawa ER Wait Times</h1>
          <p className="text-sm text-gray-500">Showing <span className="font-medium">{list.length}</span> entries — last saved: <span className="font-medium">{lastSaved}</span></p>
        </div>

        <div className="flex items-center gap-3">
          <input
            className="px-3 py-2 border rounded-md"
            placeholder="Search hospital or ER"
            value={filter}
            onChange={e=>setFilter(e.target.value)}
          />
          <button onClick={()=>openModal(null)} className="px-4 py-2 bg-white border rounded-md">+ Add</button>
          <button onClick={saveToServer} className="px-4 py-2 bg-blue-700 text-white rounded-md">Save changes</button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <table className="min-w-full">
          <thead>
            <tr className="text-left text-sm text-gray-600">
              <th className="py-2">Hospital</th>
              <th className="py-2">Location</th>
              <th className="py-2">Wait (triage)</th>
              <th className="py-2">Updated</th>
              <th className="py-2">Notes</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map(r => (
              <tr key={r.id} className="border-t">
                <td className="py-3"><strong dangerouslySetInnerHTML={{__html: escapeHtml(r.hospital)}}/></td>
                <td className="py-3 text-sm text-gray-600">{r.location}</td>
                <td className="py-3"><span className={`inline-block px-3 py-1 rounded-full text-sm ${r.status === 'stable' ? 'bg-green-50 text-green-700' : r.status === 'busy' ? 'bg-yellow-50 text-yellow-800' : 'bg-red-50 text-red-700'}`}>{r.wait}</span></td>
                <td className="py-3 text-sm text-gray-600">Just now</td>
                <td className="py-3 text-sm text-gray-600">{r.notes}</td>
                <td className="py-3 space-x-2">
                  <button onClick={()=>openModal(r)} className="px-3 py-1 border rounded-md text-sm">Edit</button>
                  <button onClick={()=>{ navigator.clipboard?.writeText(JSON.stringify(r)).then(()=>alert('Copied to clipboard')) }} className="px-3 py-1 border rounded-md text-sm">Copy</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-lg bg-white rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">{editing.id ? 'Edit entry' : 'Add entry'}</h3>

            <label className="block text-sm text-gray-600">Hospital name</label>
            <input className="w-full px-3 py-2 border rounded-md mb-3" value={editing.hospital} onChange={e=>setEditing({...editing, hospital:e.target.value})} />

            <label className="block text-sm text-gray-600">Location</label>
            <input className="w-full px-3 py-2 border rounded-md mb-3" value={editing.location} onChange={e=>setEditing({...editing, location:e.target.value})} />

            <label className="block text-sm text-gray-600">Wait time</label>
            <input className="w-full px-3 py-2 border rounded-md mb-3" value={editing.wait} onChange={e=>setEditing({...editing, wait:e.target.value})} />

            <label className="block text-sm text-gray-600">Status</label>
            <select className="w-full px-3 py-2 border rounded-md mb-3" value={editing.status} onChange={e=>setEditing({...editing, status:e.target.value})}>
              <option value="stable">Stable</option>
              <option value="busy">Busy</option>
              <option value="very">Very busy</option>
            </select>

            <label className="block text-sm text-gray-600">Notes</label>
            <textarea className="w-full px-3 py-2 border rounded-md mb-3" value={editing.notes} onChange={e=>setEditing({...editing, notes:e.target.value})} rows={4} />

            <div className="flex justify-end gap-3">
              <button onClick={closeModal} className="px-4 py-2 border rounded-md">Cancel</button>
              <button onClick={deleteEditing} className="px-4 py-2 bg-red-50 text-red-700 rounded-md">Delete</button>
              <button onClick={saveEditing} className="px-4 py-2 bg-blue-700 text-white rounded-md">Save</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
