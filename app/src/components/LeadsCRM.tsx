'use client';
import { useStore } from '@/lib/store';
import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import Papa from 'papaparse';
import { 
  Upload, FileText, CheckCircle, AlertCircle, X, 
  Download, Table, Eye, Plus, Trash2, Filter,
  Search, ChevronDown, Phone, Mail, Building, Tag,
  MessageSquare
} from 'lucide-react';
import { Lead, LeadStatus } from '@/lib/types';
import { format } from 'date-fns';

const STATUS_COLORS: Record<LeadStatus, string> = {
  new: 'blue', contacted: 'purple', qualified: 'green',
  'not-interested': 'red', callback: 'orange', converted: 'green', dnc: 'red',
};

function UploadZone({ onUpload }: { onUpload: (leads: Partial<Lead>[]) => void }) {
  const [uploadState, setUploadState] = useState<'idle' | 'parsing' | 'preview' | 'done'>('idle');
  const [preview, setPreview] = useState<Partial<Lead>[]>([]);
  const [fileName, setFileName] = useState('');
  const [errorRows, setErrorRows] = useState(0);

  const onDrop = useCallback((files: File[]) => {
    const file = files[0];
    if (!file) return;
    setFileName(file.name);
    setUploadState('parsing');

    if (file.name.endsWith('.csv') || file.name.endsWith('.txt')) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const parsed = results.data as Record<string, string>[];
          const leads: Partial<Lead>[] = parsed.map((row, i) => ({
            id: `upload-${i}-${Date.now()}`,
            name: row.name || row.Name || row.full_name || row['Full Name'] || `Lead ${i + 1}`,
            phone: row.phone || row.Phone || row.mobile || row.Mobile || row.number || '',
            email: row.email || row.Email || '',
            company: row.company || row.Company || row.organization || '',
            status: 'new' as LeadStatus,
            score: Math.floor(Math.random() * 100),
            tags: [],
            attempts: 0,
            notes: '',
            campaignId: 'camp1',
            createdAt: format(new Date(), 'yyyy-MM-dd'),
          }));
          const errors = leads.filter(l => !l.phone).length;
          setErrorRows(errors);
          setPreview(leads.filter(l => l.phone));
          setUploadState('preview');
        },
      });
    } else {
      // Simulate Excel parsing
      const mockLeads: Partial<Lead>[] = Array.from({ length: 20 }, (_, i) => ({
        id: `upload-${i}-${Date.now()}`,
        name: `Contact ${i + 1}`,
        phone: `+1 (555) ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
        email: `contact${i + 1}@example.com`,
        company: 'Sample Corp',
        status: 'new' as LeadStatus,
        score: Math.floor(Math.random() * 100),
        tags: [],
        attempts: 0,
        notes: '',
        campaignId: 'camp1',
        createdAt: format(new Date(), 'yyyy-MM-dd'),
      }));
      setPreview(mockLeads);
      setUploadState('preview');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'text/csv': ['.csv'], 'application/vnd.ms-excel': ['.xls', '.xlsx'], 'text/plain': ['.txt'] },
  });

  const handleConfirmUpload = () => {
    onUpload(preview);
    setUploadState('done');
  };

  if (uploadState === 'done') {
    return (
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        style={{ textAlign: 'center', padding: '40px 20px' }}>
        <CheckCircle size={48} color="var(--accent-green)" style={{ marginBottom: 12 }} />
        <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)' }}>Upload Successful!</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{preview.length} leads imported</div>
        <button className="btn-primary" style={{ marginTop: 16 }} onClick={() => setUploadState('idle')}>
          Upload More
        </button>
      </motion.div>
    );
  }

  if (uploadState === 'preview') {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{fileName}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              <span style={{ color: 'var(--accent-green)' }}>{preview.length} valid</span>
              {errorRows > 0 && <span style={{ color: 'var(--accent-red)', marginLeft: 8 }}>{errorRows} skipped (missing phone)</span>}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-secondary" style={{ fontSize: 12 }} onClick={() => setUploadState('idle')}>
              <X size={13} /> Cancel
            </button>
            <button className="btn-primary" style={{ fontSize: 12 }} onClick={handleConfirmUpload}>
              <Upload size={13} /> Import {preview.length} Leads
            </button>
          </div>
        </div>

        {/* Field mapping */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, padding: '10px 12px', background: 'rgba(88,166,255,0.05)', borderRadius: 8, border: '1px solid rgba(88,166,255,0.15)', fontSize: 12 }}>
          <span style={{ color: 'var(--accent-blue)' }}>ℹ</span>
          <span style={{ color: 'var(--text-secondary)' }}>Auto-detected fields: name, phone, email, company. You can map custom columns below.</span>
        </div>

        {/* Preview table */}
        <div style={{ overflowX: 'auto', maxHeight: 340, border: '1px solid var(--border)', borderRadius: 10, overflow: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr><th>#</th><th>Name</th><th>Phone</th><th>Email</th><th>Company</th><th>Score</th></tr>
            </thead>
            <tbody>
              {preview.slice(0, 10).map((lead, i) => (
                <tr key={i}>
                  <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                  <td>{lead.name}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{lead.phone}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 11 }}>{lead.email}</td>
                  <td>{lead.company}</td>
                  <td><span className="badge badge-blue" style={{ fontSize: 10 }}>{lead.score}</span></td>
                </tr>
              ))}
              {preview.length > 10 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 11 }}>
                  +{preview.length - 10} more leads
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        {...getRootProps()}
        style={{
          border: `2px dashed ${isDragActive ? 'var(--accent-blue)' : 'rgba(48,54,61,0.8)'}`,
          borderRadius: 16, padding: '48px 24px', textAlign: 'center', cursor: 'pointer',
          background: isDragActive ? 'rgba(88,166,255,0.05)' : 'rgba(13,17,23,0.4)',
          transition: 'all 0.2s',
        }}
      >
        <input {...getInputProps()} />
        <motion.div animate={isDragActive ? { scale: 1.05 } : { scale: 1 }}>
          <Upload size={40} color={isDragActive ? 'var(--accent-blue)' : 'var(--text-muted)'} style={{ marginBottom: 12 }} />
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
            {isDragActive ? 'Drop your file here' : 'Upload Calling Data'}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
            Drag & drop or click to browse
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
            {['CSV', 'Excel', 'JSON', 'XML'].map(fmt => (
              <span key={fmt} className="badge badge-gray">{fmt}</span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Template Download */}
      <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
        <button className="btn-secondary" style={{ fontSize: 12 }}>
          <Download size={13} /> Download CSV Template
        </button>
        <button className="btn-secondary" style={{ fontSize: 12 }}>
          <Download size={13} /> Download Excel Template
        </button>
      </div>
    </div>
  );
}

export default function LeadsAndCRM() {
  const { leads, addLeads, updateLead, fetchLeads, importLeads } = useStore();
  const [activeView, setActiveView] = useState<'list' | 'upload'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<typeof leads[0] | null>(null);

  useEffect(() => {
    fetchLeads('tenant-nexdial-enterprise');
  }, [fetchLeads]);

  const filtered = leads.filter(l => {
    const matchSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.phone.includes(searchQuery) || (l.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleUpload = async (newLeads: Partial<Lead>[]) => {
    await importLeads('tenant-nexdial-enterprise', newLeads);
    addLeads(newLeads as Lead[]);
    setActiveView('list');
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: selectedLead ? '1fr 380px' : '1fr', height: '100%', overflow: 'hidden' }}>
      <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 600 }}>Leads & CRM</h2>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>{leads.length.toLocaleString()} total leads</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className={`tab-btn ${activeView === 'list' ? 'active' : ''}`} onClick={() => setActiveView('list')} style={{ fontSize: 12 }}>
              <Table size={13} style={{ display: 'inline', marginRight: 4 }} />Leads List
            </button>
            <button className={`tab-btn ${activeView === 'upload' ? 'active' : ''}`} onClick={() => setActiveView('upload')} style={{ fontSize: 12 }}>
              <Upload size={13} style={{ display: 'inline', marginRight: 4 }} />Upload Data
            </button>
            <button className="btn-primary" style={{ fontSize: 12 }}>
              <Plus size={13} /> Add Lead
            </button>
          </div>
        </div>

        {activeView === 'upload' ? (
          <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
            <UploadZone onUpload={handleUpload} />
          </div>
        ) : (
          <>
            {/* Filters */}
            <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 8, background: 'var(--bg-secondary)' }}>
              <div style={{ position: 'relative', flex: 1, maxWidth: 300 }}>
                <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input className="input-field" style={{ paddingLeft: 32, fontSize: 13 }}
                  placeholder="Search leads..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              </div>
              <select className="input-field" style={{ width: 160, fontSize: 13 }}
                value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="all">All Status</option>
                {['new', 'contacted', 'qualified', 'callback', 'converted', 'not-interested', 'dnc'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <button className="btn-secondary" style={{ fontSize: 12 }}>
                <Filter size={13} /> Filter
              </button>
              <button className="btn-secondary" style={{ fontSize: 12 }}>
                <Download size={13} /> Export
              </button>
            </div>

            {/* Leads Table */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <table className="data-table">
                <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                  <tr>
                    <th><input type="checkbox" /></th>
                    <th>Name</th><th>Phone</th><th>Company</th>
                    <th>Status</th><th>Score</th><th>Attempts</th>
                    <th>Last Contact</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(lead => (
                    <tr key={lead.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedLead(lead)}>
                      <td onClick={e => e.stopPropagation()}><input type="checkbox" /></td>
                      <td>
                        <div style={{ fontWeight: 500, fontSize: 13 }}>{lead.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{lead.email}</div>
                      </td>
                      <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{lead.phone}</td>
                      <td style={{ fontSize: 12 }}>{lead.company || '—'}</td>
                      <td>
                        <span className={`badge badge-${STATUS_COLORS[lead.status] || 'gray'}`} style={{ fontSize: 10 }}>
                          {lead.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(48,54,61,0.6)', overflow: 'hidden' }}>
                            <div style={{ width: `${lead.score}%`, height: '100%', background: lead.score > 70 ? '#3fb950' : lead.score > 40 ? '#f0883e' : '#ff7b72', borderRadius: 2 }} />
                          </div>
                          <span style={{ fontSize: 11, fontFamily: 'monospace' }}>{lead.score}</span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center', fontSize: 12 }}>{lead.attempts}</td>
                      <td style={{ fontSize: 11, color: 'var(--text-muted)' }}>{lead.lastContact || '—'}</td>
                      <td onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button style={{ padding: '3px 8px', borderRadius: 6, background: 'rgba(88,166,255,0.1)', border: 'none', color: 'var(--accent-blue)', cursor: 'pointer', fontSize: 11 }}>
                            Call
                          </button>
                          <button style={{ padding: '3px 8px', borderRadius: 6, background: 'rgba(48,54,61,0.6)', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 11 }}>
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Lead Detail Panel */}
      <AnimatePresence>
        {selectedLead && (
          <motion.div
            initial={{ x: 380 }} animate={{ x: 0 }} exit={{ x: 380 }}
            style={{ borderLeft: '1px solid var(--border)', background: 'var(--bg-secondary)', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>Lead Profile</span>
              <button onClick={() => setSelectedLead(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: 20 }}>
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{
                  width: 60, height: 60, borderRadius: '50%', margin: '0 auto 10px',
                  background: 'linear-gradient(135deg, #58a6ff, #a371f7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, fontWeight: 700, color: 'white',
                }}>
                  {selectedLead.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>{selectedLead.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{selectedLead.company}</div>
              </div>

              {[
                { icon: Phone, label: 'Phone', value: selectedLead.phone },
                { icon: Mail, label: 'Email', value: selectedLead.email || '—' },
                { icon: Building, label: 'Company', value: selectedLead.company || '—' },
              ].map(f => (
                <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid rgba(48,54,61,0.4)' }}>
                  <f.icon size={14} color="var(--text-muted)" />
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{f.label}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-primary)' }}>{f.value}</div>
                  </div>
                </div>
              ))}

              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 8, color: 'var(--text-secondary)' }}>LEAD SCORE</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="progress-bar" style={{ flex: 1 }}>
                    <div className="progress-fill" style={{ width: `${selectedLead.score}%`, background: selectedLead.score > 70 ? '#3fb950' : selectedLead.score > 40 ? '#f0883e' : '#ff7b72' }} />
                  </div>
                  <span style={{ fontSize: 16, fontFamily: 'monospace', fontWeight: 700, color: selectedLead.score > 70 ? 'var(--accent-green)' : 'var(--accent-orange)' }}>
                    {selectedLead.score}
                  </span>
                </div>
              </div>

              {selectedLead.notes && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 6, color: 'var(--text-secondary)' }}>NOTES</div>
                  <div style={{ padding: '10px', background: 'rgba(88,166,255,0.05)', borderRadius: 8, fontSize: 12, color: 'var(--text-secondary)', borderLeft: '3px solid var(--accent-blue)' }}>
                    {selectedLead.notes}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
                <button className="btn-primary" style={{ flex: 1, justifyContent: 'center', fontSize: 12 }}>
                  <Phone size={13} /> Call Now
                </button>
                <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center', fontSize: 12 }}>
                  <MessageSquare size={13} /> WhatsApp
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
