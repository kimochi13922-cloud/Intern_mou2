import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useSql } from '../sql_connect';
import { useActivity } from '../sql_connect';

// ─── Helpers ────────────────────────────────────────────────────────────────

const UPLOAD_URL = 'http://localhost:5000/api/upload';

const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const res = await fetch(UPLOAD_URL, { method: 'POST', body: formData });
  if (!res.ok) throw new Error('Upload failed');
  const data = await res.json();
  return data.url; // e.g. "http://localhost:5000/uploads/xxx.jpg"
};

// ─── Activity Card ───────────────────────────────────────────────────────────

const ActivityCard = ({ activity }) => {
  const { updateActivity, removeActivity } = useActivity();
  const images = activity.activities_pic
    ? activity.activities_pic.split(',').map((s) => s.trim()).filter(Boolean)
    : [];
  const [currentImg, setCurrentImg] = useState(0);
  const [editing, setEditing]       = useState(false);
  const [saving,  setSaving]        = useState(false);
  const [form, setForm] = useState({
    activities:      activity.activities      || '',
    activities_desc: activity.activities_desc || '',
  });

  const prev = () => setCurrentImg((i) => (i - 1 + images.length) % images.length);
  const next = () => setCurrentImg((i) => (i + 1) % images.length);

  const handleSave = async () => {
    if (!form.activities.trim()) return;
    setSaving(true);
    try {
      await updateActivity(activity.mouid, {
        activities:      form.activities,
        activities_desc: form.activities_desc,
      });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Image Slideshow */}
      {images.length > 0 ? (
        <div className="relative bg-gray-100 aspect-video">
          <img
            src={images[currentImg]}
            alt={`กิจกรรม ${currentImg + 1}`}
            className="w-full h-full object-cover"
          />
          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              {/* Dots */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImg(i)}
                    className={`w-2 h-2 rounded-full transition-all ${i === currentImg ? 'bg-white scale-125' : 'bg-white/50'}`}
                  />
                ))}
              </div>
              {/* Counter */}
              <span className="absolute top-2 right-2 text-xs text-white bg-black/40 px-2 py-0.5 rounded-full">
                {currentImg + 1} / {images.length}
              </span>
            </>
          )}
        </div>
      ) : (
        <div className="aspect-video bg-gray-50 flex flex-col items-center justify-center text-gray-300">
          <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm">ยังไม่มีรูปภาพ</span>
        </div>
      )}

      {/* Info / Edit */}
      <div className="p-4">
        {editing ? (
          /* ── Edit mode ── */
          <div className="space-y-2">
            <input
              type="text"
              value={form.activities}
              onChange={(e) => setForm((f) => ({ ...f, activities: e.target.value }))}
              placeholder="ชื่อกิจกรรม *"
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <textarea
              value={form.activities_desc}
              onChange={(e) => setForm((f) => ({ ...f, activities_desc: e.target.value }))}
              placeholder="คำอธิบาย (ไม่บังคับ)"
              rows={2}
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => { setEditing(false); setForm({ activities: activity.activities || '', activities_desc: activity.activities_desc || '' }); }}
                className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors disabled:opacity-60"
              >
                {saving ? 'กำลังบันทึก...' : 'บันทึก'}
              </button>
            </div>
          </div>
        ) : (
          /* ── View mode ── */
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 leading-snug mb-1">{activity.activities}</p>
              {activity.activities_desc && (
                <p className="text-xs text-gray-500 leading-relaxed">{activity.activities_desc}</p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setEditing(true)}
                title="แก้ไขกิจกรรม"
                className="shrink-0 text-gray-300 hover:text-indigo-500 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => {
                  if (window.confirm('คุณต้องการลบกิจกรรมนี้ใช่หรือไม่?')) {
                    removeActivity(activity.mouid);
                  }
                }}
                title="ลบกิจกรรม"
                className="shrink-0 text-gray-300 hover:text-red-500 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


// ─── Add Activity Form ────────────────────────────────────────────────────────

const AddActivityForm = ({ mouId, onSaved, onCancel }) => {
  const { addActivity } = useActivity();
  const [form, setForm] = useState({ activities: '', activities_desc: '' });
  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => setPreviews((prev) => [...prev, ev.target.result]);
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removeImage = (idx) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    if (!form.activities.trim()) return;
    setUploading(true);
    try {
      // Upload all images and collect URLs
      const urls = await Promise.all(imageFiles.map((file) => uploadImage(file)));
      await addActivity({
        mouid: mouId,
        activities: form.activities,
        activities_desc: form.activities_desc,
        ownerid: mouId,
        activities_pic: urls.join(','),
      });
      onSaved();
    } catch (err) {
      console.error('Failed to save activity:', err);
      alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-indigo-200 shadow-sm p-5 mb-5">
      <p className="text-sm font-semibold text-gray-800 mb-4">เพิ่มกิจกรรมใหม่</p>
      <div className="space-y-3">
        {/* Title */}
        <input
          type="text"
          placeholder="ชื่อกิจกรรม *"
          value={form.activities}
          onChange={(e) => setForm((f) => ({ ...f, activities: e.target.value }))}
          className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        {/* Description */}
        <textarea
          placeholder="คำอธิบายกิจกรรม (ไม่บังคับ)"
          value={form.activities_desc}
          onChange={(e) => setForm((f) => ({ ...f, activities_desc: e.target.value }))}
          rows={2}
          className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
        />
        {/* Image Upload */}
        <div>
          <label className="flex items-center gap-2 cursor-pointer w-fit text-sm text-indigo-600 hover:text-indigo-800 font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            เพิ่มรูปภาพ
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
          </label>
          {previews.length > 0 && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {previews.map((src, i) => (
                <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeImage(i)}
                    className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center leading-none"
                  >×</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2 mt-4 justify-end">
        <button
          onClick={onCancel}
          className="text-sm px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          ยกเลิก
        </button>
        <button
          onClick={handleSubmit}
          disabled={uploading}
          className="text-sm px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {uploading ? 'กำลังบันทึก...' : 'บันทึก'}
        </button>
      </div>
    </div>
  );
};

// ─── Progress Card ───────────────────────────────────────────────────────────
// The step `key` (e.g. 'proposal', 'collect', ...) is what gets saved
// in the mou_data.Status column.  doneCount = index of the active step + 1.

const TIMELINE_STEPS = [
  { key: 'proposal', label: 'อนุมัติโครงการ',   desc: 'โครงการได้รับการอนุมัติและจัดสรรงบประมาณ' },
  { key: 'collect',  label: 'เก็บรวบรวมข้อมูล', desc: 'ดำเนินการเก็บข้อมูลและทดลองตามแผนงาน' },
  { key: 'analyze',  label: 'วิเคราะห์ผล',       desc: 'วิเคราะห์ข้อมูลและสรุปผลการวิจัย' },
  { key: 'report',   label: 'จัดทำรายงาน',       desc: 'จัดทำรายงานฉบับสมบูรณ์และเผยแพร่' },
  { key: 'complete', label: 'เสร็จสิ้น',         desc: 'ปิดโครงการและส่งมอบผลงาน' },
];

// step key  →  how many steps are "done"
// null / unknown → 0  (no step completed yet)
const keyToDone = (key) => {
  const idx = TIMELINE_STEPS.findIndex((s) => s.key === key);
  return idx >= 0 ? idx + 1 : 0;
};

const ProgressCard = ({ mouId, status }) => {
  const { updateStatus } = useSql();
  const [saving, setSaving] = useState(false);

  // debug: show what value is coming from DB
  console.log('[ProgressCard] mouId=', mouId, 'status=', status);

  // doneCount comes from whatever key is stored in mou_data.Status
  const doneCount = keyToDone(status);
  const pct = Math.round((doneCount / TIMELINE_STEPS.length) * 100);

  const markStep = async (idx) => {
    if (saving) return;
    const newDone = idx < doneCount ? idx : idx + 1;
    const newKey  = newDone > 0 ? TIMELINE_STEPS[newDone - 1].key : '';
    setSaving(true);
    try {
      await updateStatus(mouId, newKey);
    } catch (e) {
      console.error('markStep error:', e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          ความคืบหน้า
        </h2>
        <div className="flex items-center gap-2">
          {saving && (
            <svg className="animate-spin w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          <span className="text-sm font-bold text-indigo-600">{pct}%</span>
        </div>
      </div>

      {/* Current status badge — shows the stored key */}
      <div className="mb-4">
        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full border ${
          pct === 100
            ? 'bg-green-50 text-green-700 border-green-200'
            : doneCount === 0
            ? 'bg-gray-100 text-gray-400 border-gray-200'
            : 'bg-indigo-50 text-indigo-600 border-indigo-200'
        }`}>
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="10" />
          </svg>
          {status || 'none'}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-100 rounded-full mb-4 overflow-hidden">
        <div
          className="h-2 rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: pct === 100
              ? 'linear-gradient(90deg,#22c55e,#16a34a)'
              : 'linear-gradient(90deg,#6366f1,#818cf8)',
          }}
        />
      </div>

      {/* Vertical timeline */}
      <ol className="relative">
        {TIMELINE_STEPS.map((step, idx) => {
          const isDone   = idx < doneCount;
          const isActive = idx === doneCount && doneCount < TIMELINE_STEPS.length;

          let dotBg, dotBorder, dotInner, labelColor, connectorBg;

          if (isDone) {
            dotBg        = 'bg-indigo-600';
            dotBorder    = 'border-indigo-600';
            dotInner     = (
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            );
            labelColor   = 'text-gray-900';
            connectorBg  = 'bg-indigo-300';
          } else if (isActive) {
            dotBg        = 'bg-white';
            dotBorder    = 'border-indigo-500 border-2';
            dotInner     = <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />;
            labelColor   = 'text-indigo-700';
            connectorBg  = 'bg-gray-200';
          } else {
            dotBg        = 'bg-white';
            dotBorder    = 'border-gray-300';
            dotInner     = <span className="w-2 h-2 rounded-full bg-gray-300" />;
            labelColor   = 'text-gray-400';
            connectorBg  = 'bg-gray-200';
          }

          return (
            <li
              key={step.key}
              className={`flex gap-4 ${saving ? 'cursor-wait opacity-60' : 'cursor-pointer'}`}
              onClick={() => markStep(idx)}
              title={`บันทึก Status = "${step.key}"`}
            >
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 ${dotBg} ${dotBorder} transition-all duration-300 hover:scale-110`}
                >
                  {dotInner}
                </div>
                {idx < TIMELINE_STEPS.length - 1 && (
                  <div
                    className={`w-0.5 flex-1 my-1 rounded-full ${connectorBg} transition-colors duration-300`}
                    style={{ minHeight: '1.5rem' }}
                  />
                )}
              </div>

              <div className="pb-4">
                <p className={`text-sm font-semibold leading-none mb-1 ${labelColor} flex items-center gap-2`}>
                  {step.label}
                  <code className="text-[10px] font-mono text-gray-300 hidden sm:inline">{step.key}</code>
                  {isActive && (
                    <span className="text-xs font-medium bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">
                      กำลังดำเนินการ
                    </span>
                  )}
                  {isDone && (
                    <span className="text-xs font-medium bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                      เสร็จสิ้น
                    </span>
                  )}
                </p>
                <p className={`text-xs leading-relaxed ${isDone ? 'text-gray-500' : 'text-gray-400'}`}>
                  {step.desc}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      <p className="text-xs text-gray-400 mt-2 text-center">คลิกที่ขั้นตอนเพื่ออัปเดตความคืบหน้า</p>
    </div>
  );
};

// ─── Main Detail Page ────────────────────────────────────────────────────────

const DetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sqlData, loading: mouLoading, updateMou, removeMou } = useSql();
  const { activityData, activityLoading, refreshActivities } = useActivity();
  const [showForm,   setShowForm]   = useState(false);
  const [editInfo,   setEditInfo]   = useState(false);
  const [infoForm,   setInfoForm]   = useState(null);  // populated on edit open
  const [savingInfo, setSavingInfo] = useState(false);
  const [editTitle,  setEditTitle]  = useState(false);
  const [titleForm,  setTitleForm]  = useState('');
  const [savingTitle, setSavingTitle] = useState(false);

  // Read ?id= from query string (matches routIdInfo in MouPage)
  const params = new URLSearchParams(location.search);
  const id = parseInt(params.get('id'));

  const mou = (sqlData || []).find((r) => r.ID === id);
  const activities = (activityData || []).filter((a) => Number(a.ownerid) === id);

  // ── Loading state ──
  if (mouLoading || activityLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="flex justify-center items-center">
          <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p className="text-gray-500 mt-4 font-medium">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  // ── Not found state ──
  if (!mou) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">ไม่พบข้อมูล MOU</h2>
        <p className="text-gray-400 mb-6">รหัส MOU ที่ระบุไม่มีอยู่ในระบบ</p>
        <Link
          to="/MouPage"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
        >
          ← กลับไปตาราง MOU
        </Link>
      </div>
    );
  }

  const budgetNum = Number(mou.Budget) || 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

      {/* ── Top bar: back button ── */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate('/MouPage')}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          กลับไปตาราง MOU
        </button>
      </div>

      {/* ── Header Card ── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-4">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
          <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
            ID: {mou.ID}
          </span>
          {!editTitle && (
            <button
              onClick={() => { setTitleForm(mou.Name); setEditTitle(true); }}
              className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-indigo-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              แก้ไขชื่อ
            </button>
          )}
        </div>
        
        {editTitle ? (
          <div className="mb-3 space-y-3">
            <input
              type="text"
              value={titleForm}
              onChange={(e) => setTitleForm(e.target.value)}
              className="w-full text-xl md:text-2xl font-bold text-gray-900 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  setSavingTitle(true);
                  try {
                    await updateMou(mou.ID, { ...mou, Name: titleForm });
                    setEditTitle(false);
                  } finally {
                    setSavingTitle(false);
                  }
                }}
                disabled={savingTitle}
                className="text-sm px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors disabled:opacity-60"
              >
                {savingTitle ? 'กำลังบันทึก...' : 'บันทึก'}
              </button>
              <button
                onClick={() => setEditTitle(false)}
                className="text-sm px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        ) : (
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug mb-3">
            {mou.Name}
          </h1>
        )}
        <p className="text-gray-500 text-sm">ปีงบประมาณ พ.ศ. {mou.Year}</p>
      </div>

      {/* ── Progress + Info Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4 items-start">

        {/* LEFT — Progress Timeline: reads mou.Status (step key) from DB, saves back on click */}
        <ProgressCard mouId={mou.ID} status={mou.Status ?? mou.status ?? ''} />

        {/* RIGHT — Info Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Card header with edit button */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">รายละเอียด</span>
            <button
              onClick={() => { setInfoForm({ Name: mou.Name, Owner: mou.Owner || '', Faculty: mou.Faculty || '', Budget: String(mou.Budget || ''), Year: String(mou.Year || '') }); setEditInfo(true); }}
              className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              แก้ไข
            </button>
          </div>

          {editInfo && infoForm ? (
            /* ── Edit mode ── */
            <div className="px-5 py-4 space-y-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">ชื่อผู้รับผิดชอบ</label>
                <input type="text" value={infoForm.Owner} onChange={(e) => setInfoForm((f) => ({ ...f, Owner: e.target.value }))} className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">คณะ</label>
                <input type="text" value={infoForm.Faculty} onChange={(e) => setInfoForm((f) => ({ ...f, Faculty: e.target.value }))} className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">งบประมาณ</label>
                <input type="text" value={infoForm.Budget} onChange={(e) => setInfoForm((f) => ({ ...f, Budget: e.target.value }))} className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">ปีงบประมาณ</label>
                <input type="number" value={infoForm.Year} onChange={(e) => setInfoForm((f) => ({ ...f, Year: e.target.value }))} className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
              <div className="flex gap-2 justify-end pt-1">
                <button onClick={() => setEditInfo(false)} className="text-sm px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">ยกเลิก</button>
                <button
                  onClick={async () => { setSavingInfo(true); try { await updateMou(mou.ID, { Name: infoForm.Name, Owner: infoForm.Owner, Faculty: infoForm.Faculty, Budget: parseFloat(infoForm.Budget), Year: infoForm.Year }); setEditInfo(false); } finally { setSavingInfo(false); } }}
                  disabled={savingInfo}
                  className="text-sm px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors disabled:opacity-60"
                >
                  {savingInfo ? 'กำลังบันทึก...' : 'บันทึก'}
                </button>
              </div>
            </div>
          ) : (
            /* ── View mode ── */
            <div className="divide-y divide-gray-100">
              <div className="px-5 py-4">
                <p className="text-xs text-gray-400 mb-1">ผู้รับผิดชอบ</p>
                <p className="text-sm font-medium text-gray-800">{mou.Owner || '—'}</p>
              </div>
              <div className="px-5 py-4">
                <p className="text-xs text-gray-400 mb-1">คณะ</p>
                <p className="text-sm font-medium text-gray-800">{mou.Faculty || '—'}</p>
              </div>
              <div className="px-5 py-4">
                <p className="text-xs text-gray-400 mb-1">งบประมาณ</p>
                <p className="text-sm font-medium text-gray-800">฿{budgetNum.toLocaleString()}</p>
              </div>
              <div className="px-5 py-4">
                <p className="text-xs text-gray-400 mb-1">ปีงบประมาณ</p>
                <p className="text-sm font-medium text-gray-800">พ.ศ. {mou.Year}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Activity Section ── */}
      <div className="mt-6">
        {/* Section header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            กิจกรรม
            {activities.length > 0 && (
              <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {activities.length}
              </span>
            )}
          </h2>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            เพิ่มกิจกรรม
          </button>
        </div>

        {/* Add Form */}
        {showForm && (
          <AddActivityForm
            mouId={id}
            onSaved={() => { setShowForm(false); refreshActivities(); }}
            onCancel={() => setShowForm(false)}
          />
        )}

        {/* Activity Grid */}
        {activities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activities.map((act, i) => (
              <ActivityCard key={act.mouid ?? i} activity={act} />
            ))}
          </div>
        ) : (
          !showForm && (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-12 text-center text-gray-400">
              <svg className="w-10 h-10 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm">ยังไม่มีกิจกรรม</p>
              <p className="text-xs mt-1">กดปุ่ม "เพิ่มกิจกรรม" เพื่อเริ่มต้น</p>
            </div>
          )
        )}
      </div>

      {/* ── Delete Button ── */}
      <div className="mt-8 flex justify-center border-t border-gray-200 pt-6">
        <button
          onClick={() => {
            if (window.confirm('คุณต้องการลบ MOU นี้ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้')) {
              removeMou(mou.ID);
              navigate('/');
            }
          }}
          className="inline-flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-5 py-2.5 rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          ลบข้อมูล MOU นี้
        </button>
      </div>

    </div>
  );
};

export default DetailPage;