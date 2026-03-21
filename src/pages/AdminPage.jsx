// src/components/AdminPage.jsx
import React, { useEffect, useState } from 'react';

const STORAGE_KEY = 'ottawa_er_admin_cache_v1';

// small helper to avoid XSS when injecting HTML
function escapeHtml(s) { 
  if(!s) return ''; 
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[c]); 
}

export default function AdminPage() {
  // ----- AUTH (client-side) -----
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

  function tryLogin() {
    const real = process.env.REACT_APP_ADMIN_PASSWORD || 'letmein';
    if (pw === real) {
      setAuthed(true);
      setPw('');
    } else {
      alert('Incorrect password. Please try again.');
    }
  }

  // ----- CRUD helpers -----
  const list = data.filter(r => (r.hospital + ' ' + r.location + ' ' + (r.notes || '')).toLowerCase().includes(filter.toLowerCase()));

  function openModal(entry){
    setEditing(entry ? {...entry} : { id:null, hospital:'', location:'', wait:'', status:'stable', notes:'' });
    setModalOpen(true);
  }
  
  function closeModal(){ 
    setModalOpen(false); 
    setEditing(null); 
  }

  function saveEditing(){
    if(!editing.hospital.trim()){ alert('Hospital name is required'); return; }
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
    if(!window.confirm('Are you sure you want to delete this hospital entry?')) return;
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
      setLastSaved(new Date().toLocaleTimeString());
      alert('✅ Successfully saved to server');
    } catch(err){
      console.error(err);
      alert('Save failed — demo fallback uses localStorage. Implement /api/admin/wait-times/bulk on server.');
    }
  }

  // ----- RENDER -----
  if(!authed){
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-slate-100 w-full max-w-md text-center">
          <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Admin Access</h2>
          <p className="text-sm text-slate-500 mb-8">Enter your secure password to access the hospital management dashboard.</p>
          
          <div className="space-y-4">
            <input
              type="password"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-center tracking-widest font-medium"
              placeholder="••••••••"
              value={pw}
              onChange={e=>setPw(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && tryLogin()}
            />
            <button 
              onClick={tryLogin} 
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              Secure Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            Dashboard Overview
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Managing <span className="font-bold text-slate-700">{list.length}</span> active facilities. Last sync: <span className="font-bold text-slate-700">{lastSaved}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Bar */}
          <div className="relative">
            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none w-full md:w-64 transition-all"
              placeholder="Search facilities..."
              value={filter}
              onChange={e=>setFilter(e.target.value)}
            />
          </div>
          
          <button onClick={()=>openModal(null)} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-semibold transition-colors shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Add Facility
          </button>
          
          <button onClick={saveToServer} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-all shadow-md">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
            Save Changes
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Hospital</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Wait Time</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Notes</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {list.map(r => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold text-slate-900" dangerouslySetInnerHTML={{__html: escapeHtml(r.hospital)}}/>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{r.location || '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                      ${r.status === 'stable' ? 'bg-emerald-100 text-emerald-800' : 
                        r.status === 'busy' ? 'bg-amber-100 text-amber-800' : 
                        'bg-rose-100 text-rose-800'}`}
                    >
                      {r.wait}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate" title={r.notes}>{r.notes || '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button onClick={()=>openModal(r)} className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors">Edit</button>
                    <button onClick={()=>{ navigator.clipboard?.writeText(JSON.stringify(r)).then(()=>alert('Copied to clipboard!')) }} className="text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-md transition-colors">Copy</button>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-slate-500">
                    No facilities found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editing Modal */}
      {modalOpen && editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">
                {editing.id ? 'Edit Facility Data' : 'Add New Facility'}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Hospital Name</label>
                <input className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" value={editing.hospital} onChange={e=>setEditing({...editing, hospital:e.target.value})} placeholder="e.g. Civic Campus" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Location</label>
                  <input className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" value={editing.location} onChange={e=>setEditing({...editing, location:e.target.value})} placeholder="e.g. Central" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Status</label>
                  <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-slate-700" value={editing.status} onChange={e=>setEditing({...editing, status:e.target.value})}>
                    <option value="stable">🟢 Stable</option>
                    <option value="busy">🟡 Busy</option>
                    <option value="very">🔴 Very Busy</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Wait Time String</label>
                <input className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" value={editing.wait} onChange={e=>setEditing({...editing, wait:e.target.value})} placeholder="e.g. 2 hr 15 min" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Admin Notes</label>
                <textarea className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" value={editing.notes} onChange={e=>setEditing({...editing, notes:e.target.value})} rows={3} placeholder="Add any internal notes here..." />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-between items-center">
              {editing.id ? (
                <button onClick={deleteEditing} className="text-red-600 hover:text-red-800 font-semibold text-sm px-3 py-2 rounded-md hover:bg-red-50 transition-colors">
                  Delete
                </button>
              ) : <div></div>}
              
              <div className="flex gap-2">
                <button onClick={closeModal} className="px-4 py-2 border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 rounded-lg text-sm font-semibold transition-colors">Cancel</button>
                <button onClick={saveEditing} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-all shadow-md">Save Data</button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}