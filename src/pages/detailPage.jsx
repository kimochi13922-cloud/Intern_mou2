import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useSql, API_URL } from '../sql_connect';
import { useActivity } from '../sql_connect';
import { NATION_LIST } from './AddMouPage';

// ─── Helpers ────────────────────────────────────────────────────────────────

// ─── Activity Card ───────────────────────────────────────────────────────────

const ActivityCard = ({ activity }) => {
  const { updateActivity, removeActivity } = useActivity();
  let images = [];
  try {
    images = activity.activities_pic ? JSON.parse(activity.activities_pic) : [];
  } catch(e) {
    images = activity.activities_pic
      ? activity.activities_pic.split(',').map((s) => s.trim()).filter(Boolean)
      : [];
  }
  const [currentImg, setCurrentImg] = useState(0);
  const [editing, setEditing]       = useState(false);
  const [editImages, setEditImages] = useState(images);
  const [saving,  setSaving]        = useState(false);
  const [form, setForm] = useState({
    activities:      activity.activities      || '',
    activities_desc: activity.activities_desc || '',
    activities_type: activity.activities_type || '',
    activities_service: activity.activities_service || '',
    activities_category: activity.activities_category || '',
    activities_date: activity.activities_date || '',
    activities_budget: activity.activities_budget || '',
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
        activities_type: form.activities_type,
        activities_service: form.activities_service,
        activities_category: form.activities_category,
        activities_date: form.activities_date,
        activities_budget: form.activities_budget,
        activities_pic: JSON.stringify(editImages),
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="date"
                value={form.activities_date}
                onChange={(e) => setForm((f) => ({ ...f, activities_date: e.target.value }))}
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <select
                value={form.activities_type}
                onChange={(e) => setForm((f) => ({ ...f, activities_type: e.target.value }))}
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">เลือกประเภทกิจกรรม</option>
                <option value="Inbound">Inbound</option>
                <option value="Outbound">Outbound</option>
              </select>
              <select
                value={form.activities_service}
                onChange={(e) => setForm((f) => ({ ...f, activities_service: e.target.value }))}
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">เลือกบริการ</option>
                <option value="Onsite">Onsite</option>
                <option value="Online">Online</option>
              </select>
              <select
                value={form.activities_category}
                onChange={(e) => setForm((f) => ({ ...f, activities_category: e.target.value }))}
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400">
                <option value="">เลือกหมวดหมู่</option>
                <option value="ด้านสวัสดิการ">ด้านสวัสดิการ</option>
                <option value="ด้านวิชาการ">ด้านวิชาการ</option>
                <option value="ด้านการฝึกงาน">ด้านการฝึกงาน</option>
                <option value="ด้านการแลกเปลี่ยนทางวิชาการและวัฒนธรรม">ด้านการแลกเปลี่ยนทางวิชาการและวัฒนธรรม</option>
                <option value="ด้านอื่นๆ">ด้านอื่นๆ</option>
              </select>
            </div>
            <div>
              <input
                type="number"
                value={form.activities_budget}
                onChange={(e) => setForm((f) => ({ ...f, activities_budget: e.target.value }))}
                placeholder="งบประมาณ (บาท)"
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 mt-2"
              />
            </div>
            
            {/* Image Edit Upload */}
            <div className="mt-3 border-t border-gray-100 pt-3">
              <label className="flex items-center gap-2 cursor-pointer w-fit text-sm text-indigo-600 hover:text-indigo-800 font-medium mb-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                เพิ่ม/แก้ไข รูปภาพ
                <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => {
                  const files = Array.from(e.target.files);
                  files.forEach((file) => {
                    const reader = new FileReader();
                    reader.onload = (ev) => setEditImages((prev) => [...prev, ev.target.result]);
                    reader.readAsDataURL(file);
                  });
                  e.target.value = '';
                }} />
              </label>
              {editImages.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {editImages.map((src, i) => (
                    <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                      <img src={src} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setEditImages(prev => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center leading-none shadow-sm hover:bg-red-600 transition-colors"
                      >×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2 justify-end mt-2">
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
              {activity.activities_date && (
                <div className="flex items-center gap-1 mb-2">
                  <svg className="w-3.5 h-3.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                    วันที่จัดกิจกรรม: {new Date(activity.activities_date).toLocaleDateString('th-TH')}
                  </span>
                </div>
              )}
              {activity.activities_desc && (
                <p className="text-xs text-gray-500 leading-relaxed">{activity.activities_desc}</p>
              )}
              <div className="mt-2 flex flex-wrap gap-2">
                {activity.activities_type && (
                  <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded">{activity.activities_type}</span>
                )}
                {activity.activities_category && (
                  <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded">{activity.activities_category}</span>
                )}
                {activity.activities_service && (
                  <span className="text-[10px] bg-yellow-50 text-yellow-600 px-2 py-0.5 rounded">{activity.activities_service}</span>
                )}
                {activity.activities_budget && (
                  <span className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded">งบประมาณ: {Number(activity.activities_budget).toLocaleString()} บาท</span>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setEditing(true);
                  setEditImages([...images]);
                }}
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
  const [form, setForm] = useState({ 
    activities: '', 
    activities_desc: '',
    activities_type: '',
    activities_service: '',
    activities_category: '',
    activities_date: '',
    activities_budget: ''
  });
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => setPreviews((prev) => [...prev, ev.target.result]);
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removeImage = (idx) => {
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    if (!form.activities.trim()) return;
    setUploading(true);
    try {
      // Use base64 previews directly instead of uploading to server
      const picsString = JSON.stringify(previews);
      await addActivity({
        mouid: mouId,
        ownerid: mouId,
        activities: form.activities,
        activities_desc: form.activities_desc,
        activities_type: form.activities_type,
        activities_service: form.activities_service,
        activities_category: form.activities_category,
        activities_date: form.activities_date,
        activities_budget: form.activities_budget,
        activities_pic: picsString,
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
        <input
          type="text"
          placeholder="ชื่อกิจกรรม *"
          value={form.activities}
          onChange={(e) => setForm((f) => ({ ...f, activities: e.target.value }))}
          className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <textarea
          placeholder="คำอธิบายกิจกรรม (ไม่บังคับ)"
          value={form.activities_desc}
          onChange={(e) => setForm((f) => ({ ...f, activities_desc: e.target.value }))}
          rows={2}
          className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="date"
            value={form.activities_date}
            onChange={(e) => setForm((f) => ({ ...f, activities_date: e.target.value }))}
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <select
            value={form.activities_type}
            onChange={(e) => setForm((f) => ({ ...f, activities_type: e.target.value }))}
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">เลือกประเภทกิจกรรม</option>
            <option value="Inbound">Inbound</option>
            <option value="Outbound">Outbound</option>
          </select>
          <select
            value={form.activities_service}
            onChange={(e) => setForm((f) => ({ ...f, activities_service: e.target.value }))}
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">เลือกบริการ</option>
            <option value="Onsite">Onsite</option>
            <option value="Online">Online</option>
          </select>
          <select
            value={form.activities_category}
            onChange={(e) => setForm((f) => ({ ...f, activities_category: e.target.value }))}
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">เลือกหมวดหมู่</option>
            <option value="ด้านสวัสดิการ">ด้านสวัสดิการ</option>
            <option value="ด้านวิชาการ">ด้านวิชาการ</option>
            <option value="ด้านการฝึกงาน">ด้านการฝึกงาน</option>
            <option value="ด้านการแลกเปลี่ยนทางวิชาการและวัฒนธรรม">ด้านการแลกเปลี่ยนทางวิชาการและวัฒนธรรม</option>
            <option value="ด้านอื่นๆ">ด้านอื่นๆ</option>
          </select>
        </div>
        <div>
          <input
            type="number"
            value={form.activities_budget}
            onChange={(e) => setForm((f) => ({ ...f, activities_budget: e.target.value }))}
            placeholder="งบประมาณ (บาท)"
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
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

const getDateKeyForStatus = (statusKey) => {
  switch(statusKey) {
    case 'approval':
    case 'approval_out':
    case 'approval_special': return 'approval_date';
    case 'submit':
    case 'submit_out':
    case 'submit_special': return 'submit_date';
    case 'analyze': return 'analyze_date';
    case 'accept': return 'accept_date';
    case 'edit':
    case 'edit_out':
    case 'edit_special': return 'edit_date';
    case 'sign':
    case 'sign_out':
    case 'sign_special': return 'sign_date';
    case 'legal_out': return 'legal_date';
    case 'manager_out': return 'manager_date';
    case 'council_out': return 'council_date';
    case 'notice_special': return 'notice_date';
    default: return null;
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return isNaN(d) ? dateStr : d.toLocaleDateString('th-TH');
};

const ProgressCard = ({ mou }) => {
  const { updateStatus, updateMou } = useSql();
  const [saving, setSaving] = useState(false);
  const [editingDateStep, setEditingDateStep] = useState(null);
  const [isLocked, setIsLocked] = useState(true);

  const mouId = mou.ID;
  const status = mou.status || '';
  const country_check = mou.country_check || '';

  const TIMELINE_STEPS_INSIDE = [
    { key: 'approval', label: 'นำเข้าพิจารณาในที่ประชุม' },
    { key: 'submit', label: 'เสนอต่อกองกฎหมาย' },
    { key: 'analyze', label: 'เสนอต่อที่ประชุมคณะกรรมการบริหารมหาวิทยาลัยนเรศวร' },
    { key: 'accept', label: 'ผ่านมติคณะกรรมการบริหารมหาวิทยาลัย' },
    { key: 'edit', label: 'ส่งกลับคณะเพื่อแก้ไข' },
    { key: 'sign', label: 'ลงนาม' }
  ];

  const TIMELINE_STEPS_OUTSIDE = [
    { key: 'approval_out', label: 'นำเข้าพิจารณาในที่ประชุมประจำคณะฯ' },
    { key: 'submit_out', label: 'ส่งต่อไปยังกองพัฒนาภาษาและกิจการต่างประเทศ' },
    { key: 'edit_out', label: 'ส่งกลับคณะแก้ไข (ถ้ามี)' },
    { key: 'legal_out', label: 'ส่งต่อไปยังกองกฎหมายเพื่อพิจาณา' },
    { key: 'manager_out', label: 'เสนอในที่ประชุมคณะกรรมการบริหารมหาวิทยาลัยนเรศวร' },
    { key: 'council_out', label: 'เสนอในที่ประชุมคณะกรรมการสภามหาวิทยาลัย' },
    { key: 'sign_out', label: 'ลงนาม' }
  ];

  const TIMELINE_STEPS_INSIDE_SPECIAL = [
    { key: 'approval_special', label: 'นำเข้าพิจารณาในที่ประชุม' },
    { key: 'submit_special', label: 'เสนอต่อกองกฎหมาย' },
    { key: 'edit_special', label: 'ส่งกลับคณะเพื่อแก้ไข' },
    { key: 'sign_special', label: 'ลงนาม' },
    { key: 'notice_special', label: 'แจ้งมติคณะกรรมการบริหารมหาวิทยาลัย' }
  ];

  let TIMELINE_STEPS = TIMELINE_STEPS_INSIDE; // Default to INSIDE
  if (country_check === 'Inside') {
    TIMELINE_STEPS = TIMELINE_STEPS_INSIDE;
  } else if (country_check === 'Outside') {
    TIMELINE_STEPS = TIMELINE_STEPS_OUTSIDE;
  } else if (country_check === 'InsideSpecial') {
    TIMELINE_STEPS = TIMELINE_STEPS_INSIDE_SPECIAL;
  }

  // doneCount comes from whatever key is stored in mou_data.Status
  const doneCount = TIMELINE_STEPS.findIndex((s) => s.key === status) >= 0 
    ? TIMELINE_STEPS.findIndex((s) => s.key === status) + 1 
    : 0;
  const pct = Math.round((doneCount / TIMELINE_STEPS.length) * 100);

  const markStep = async (idx) => {
    if (saving) return;
    if (isLocked) {
      alert('กรุณาปลดล็อกก่อนแก้ไขความคืบหน้า');
      return;
    }
    const newDone = idx < doneCount ? idx : idx + 1;
    const newKey  = newDone > 0 ? TIMELINE_STEPS[newDone - 1].key : '';
    setSaving(true);
    try {
      await updateStatus(mouId, newKey);
      
      // Update date for the new step if it's advancing
      if (newKey && idx >= doneCount) {
        const dateKey = getDateKeyForStatus(newKey);
        if (dateKey) {
          const today = new Date().toISOString().split('T')[0];
          await updateMou(mouId, { [dateKey]: today });
        }
      }
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
          <button
            onClick={() => setIsLocked(!isLocked)}
            className={`p-1 rounded-full transition-colors ${
              isLocked ? 'text-gray-400 hover:text-indigo-600' : 'text-indigo-600'
            }`}
            title={isLocked ? "ปลดล็อกเพื่อแก้ไข" : "ล็อกป้องกันการแก้ไข"}
          >
            {isLocked ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
            )}
          </button>
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
          
          const dateKey = getDateKeyForStatus(step.key);
          const rawDate = mou[dateKey];
          const completedDate = isDone && rawDate ? formatDate(rawDate) : null;

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
              className={`flex gap-4 ${saving ? 'cursor-wait opacity-60' : (isLocked ? 'cursor-default' : 'cursor-pointer')}`}
              onClick={() => !isLocked && markStep(idx)}
              title={isLocked ? "ปลดล็อกเพื่อแก้ไข" : `บันทึก Status = "${step.key}"`}
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
                </p>
                {editingDateStep === dateKey ? (
                  <div className="mt-1.5 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="date" 
                      defaultValue={rawDate ? new Date(rawDate).toISOString().split('T')[0] : ''}
                      onChange={async (e) => {
                        const newDate = e.target.value;
                        if (newDate) {
                           setSaving(true);
                           await updateMou(mouId, { [dateKey]: newDate });
                           setSaving(false);
                        }
                        setEditingDateStep(null);
                      }}
                      className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                      autoFocus
                      onBlur={() => setEditingDateStep(null)}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') setEditingDateStep(null);
                      }}
                    />
                  </div>
                ) : completedDate ? (
                  <div className="text-xs text-green-600 mt-1.5 font-medium flex items-center gap-2 group" onClick={(e) => e.stopPropagation()}>
                    <p className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      วันที่ดำเนินการ: {completedDate}
                    </p>
                    <button 
                      onClick={() => setEditingDateStep(dateKey)}
                      className="text-gray-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="แก้ไขวันที่"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  </div>
                ) : isDone && dateKey ? (
                  <div className="text-xs mt-1.5 flex items-center gap-2 group" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => setEditingDateStep(dateKey)}
                      className="text-gray-400 hover:text-indigo-600 flex items-center gap-1 transition-colors"
                      title="เพิ่มวันที่"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      ระบุวันที่
                    </button>
                  </div>
                ) : null}
                {step.key.includes('sign') && (isActive || isDone) && (
                  <div className="mt-2 flex flex-wrap items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    {mou.has_mou_pdf ? (
                      <a 
                        href={`${API_URL}/${mouId}/pdf`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded border border-indigo-100 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        ดูไฟล์ PDF
                      </a>
                    ) : null}
                    
                    <label 
                      className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-indigo-600 bg-gray-50 hover:bg-indigo-50 px-3 py-1.5 rounded border border-gray-200 hover:border-indigo-200 cursor-pointer transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      {mou.has_mou_pdf ? 'อัปโหลดใหม่' : 'แนบไฟล์ PDF'}
                      <input 
                        type="file" 
                        accept="application/pdf" 
                        className="hidden" 
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          if (file.type !== 'application/pdf') {
                            alert('กรุณาอัปโหลดไฟล์ PDF เท่านั้น');
                            return;
                          }
                          if (file.size > 5 * 1024 * 1024) {
                            alert('ขนาดไฟล์ต้องไม่เกิน 5MB');
                            return;
                          }
                          setSaving(true);
                          try {
                            const reader = new FileReader();
                            reader.onload = async (ev) => {
                              try {
                                const base64String = ev.target.result;
                                await updateMou(mouId, { mou_pdf: base64String });
                                alert('อัปโหลดไฟล์ PDF สำเร็จ');
                              } catch (err) {
                                console.error('Upload Error:', err);
                                alert('เกิดข้อผิดพลาดในการอัปโหลดไฟล์ PDF');
                              } finally {
                                setSaving(false);
                              }
                            };
                            reader.onerror = () => {
                              alert('เกิดข้อผิดพลาดในการอ่านไฟล์');
                              setSaving(false);
                            };
                            reader.readAsDataURL(file);
                          } catch (err) {
                            console.error(err);
                            alert('เกิดข้อผิดพลาดในการอัปโหลด');
                            setSaving(false);
                          }
                        }} 
                      />
                    </label>
                    
                    {!!mou.has_mou_pdf && (
                      <button 
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (window.confirm('คุณต้องการลบไฟล์ PDF นี้ใช่หรือไม่?')) {
                            setSaving(true);
                            try {
                              await updateMou(mouId, { mou_pdf: '' });
                              alert('ลบไฟล์ PDF สำเร็จ');
                            } catch (err) {
                              console.error('Delete Error:', err);
                              alert('เกิดข้อผิดพลาดในการลบไฟล์ PDF');
                            } finally {
                              setSaving(false);
                            }
                          }
                        }}
                        className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded border border-red-200 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        ลบไฟล์ PDF
                      </button>
                    )}
                  </div>
                )}
                <p className={`text-xs leading-relaxed mt-1 ${isDone ? 'text-gray-500' : 'text-gray-400'}`}>
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
  const [isOtherNation, setIsOtherNation] = useState(false);

  const [filterType, setFilterType] = useState('');
  const [filterService, setFilterService] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortActivity, setSortActivity] = useState('');

  // Read ?id= from query string (matches routIdInfo in MouPage)
  const params = new URLSearchParams(location.search);
  const id = parseInt(params.get('id'));

  const safeSqlData = Array.isArray(sqlData) ? sqlData : [];
  const mou = safeSqlData.find((r) => r.ID === id);
  const activities = (activityData || []).filter((a) => Number(a.ownerid) === id);
  const filteredActivities = activities.filter((a) => {
    if (filterType && a.activities_type !== filterType) return false;
    if (filterService && a.activities_service !== filterService) return false;
    if (filterCategory && a.activities_category !== filterCategory) return false;
    return true;
  });

  const sortedActivities = [...filteredActivities].sort((a, b) => {
    if (sortActivity === 'date_desc') return new Date(b.activities_date || 0) - new Date(a.activities_date || 0);
    if (sortActivity === 'date_asc') return new Date(a.activities_date || 0) - new Date(b.activities_date || 0);
    if (sortActivity === 'budget_desc') return (Number(b.activities_budget) || 0) - (Number(a.activities_budget) || 0);
    if (sortActivity === 'budget_asc') return (Number(a.activities_budget) || 0) - (Number(b.activities_budget) || 0);
    if (sortActivity === 'name_asc') return (a.activities || '').localeCompare(b.activities || '', 'th');
    return 0;
  });

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
              onClick={() => { setTitleForm(mou.name); setEditTitle(true); }}
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
                    await updateMou(mou.ID, { ...mou, name: titleForm });
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
            {mou.name}
          </h1>
        )}
        <p className="text-gray-500 text-sm">{mou.type || ''} {mou.period ? `· ระยะเวลา ${mou.period}` : ''}</p>
      </div>

      {/* ── Progress + Info Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4 items-start">

        {/* LEFT — Progress Timeline: reads mou.Status (step key) from DB, saves back on click */}
        <ProgressCard mou={mou} />

        {/* RIGHT — Info Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Card header with edit button */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">รายละเอียด</span>
            <button
              onClick={() => { 
                const initNation = mou.nation || '';
                const isCustomNation = initNation && initNation !== 'ไทย' && !NATION_LIST.includes(initNation);
                setIsOtherNation(isCustomNation);
                setInfoForm({ name: mou.name || '', institution: mou.institution || '', contact: mou.contact || '', staff: mou.staff || '', period: mou.period || '', type: mou.type || '', nation: initNation, country_check: mou.country_check || 'Inside' }); 
                setEditInfo(true); 
              }}
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
                <label className="text-xs text-gray-400 mb-1 block">สถาบันที่ร่วม</label>
                <input type="text" value={infoForm.institution} onChange={(e) => setInfoForm((f) => ({ ...f, institution: e.target.value }))} className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">ผู้ประสานงาน</label>
                <input type="text" value={infoForm.contact} onChange={(e) => setInfoForm((f) => ({ ...f, contact: e.target.value }))} className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">ผู้รับผิดชอบ</label>
                <input type="text" value={infoForm.staff} onChange={(e) => setInfoForm((f) => ({ ...f, staff: e.target.value }))} className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">ระยะเวลา</label>
                <input type="text" value={infoForm.period} onChange={(e) => setInfoForm((f) => ({ ...f, period: e.target.value }))} className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">ประเภทความร่วมมือ</label>
                <select value={infoForm.type} onChange={(e) => setInfoForm((f) => ({ ...f, type: e.target.value }))} className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400">
                    <option value="">เลือกประเภท</option>
                    <option value="MOU">MOU</option>
                    <option value="MOA">MOA</option>
                    <option value="LOI">LOI</option>
                    <option value="LOA">LOA</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">ประเทศ</label>
                {isOtherNation ? (
                  <div className="flex items-center gap-2">
                    <input type="text" placeholder="ระบุประเทศด้วยตนเอง" value={infoForm.nation} onChange={(e) => setInfoForm((f) => ({ ...f, nation: e.target.value }))} className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                    <button type="button" onClick={() => { setIsOtherNation(false); setInfoForm((f) => ({ ...f, nation: '' })); }} className="px-3 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg transition-colors whitespace-nowrap">ยกเลิก</button>
                  </div>
                ) : (
                  <select value={infoForm.nation} onChange={(e) => {
                      if (e.target.value === 'Other') {
                          setIsOtherNation(true);
                          setInfoForm((f) => ({ ...f, nation: '' }));
                      } else {
                          setInfoForm((f) => ({ ...f, nation: e.target.value }));
                      }
                  }} className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400">
                      <option value="">เลือกประเทศ</option>
                      <option value="ไทย">ไทย</option>
                      {NATION_LIST
                      .sort((a, b) => a.localeCompare(b, 'en'))
                      .map(country => (
                          <option key={country} value={country}>{country}</option>
                      ))}
                      <option value="Other">Other (ระบุเอง)</option>
                  </select>
                )}
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">ประเภท (Inside/Outside)</label>
                <select value={infoForm.country_check} onChange={(e) => setInfoForm((f) => ({ ...f, country_check: e.target.value }))} className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400">
                  <option value="Inside">ภายในประเทศ (Inside)</option>
                  <option value="InsideSpecial">ภายในประเทศ ลักษณะเฉพาะกิจ</option>
                  <option value="Outside">ต่างประเทศ (Outside)</option>
                </select>
              </div>
              <div className="flex gap-2 justify-end pt-1">
                <button onClick={() => setEditInfo(false)} className="text-sm px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">ยกเลิก</button>
                <button
                  onClick={async () => { setSavingInfo(true); try { await updateMou(mou.ID, infoForm); setEditInfo(false); } finally { setSavingInfo(false); } }}
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
                <p className="text-xs text-gray-400 mb-1">สถาบันที่ร่วม</p>
                <p className="text-sm font-medium text-gray-800">{mou.institution || '—'}</p>
              </div>
              <div className="px-5 py-4">
                <p className="text-xs text-gray-400 mb-1">ผู้ประสานงาน</p>
                <p className="text-sm font-medium text-gray-800">{mou.contact || '—'}</p>
              </div>
              <div className="px-5 py-4">
                <p className="text-xs text-gray-400 mb-1">ผู้รับผิดชอบ</p>
                <p className="text-sm font-medium text-gray-800">{mou.staff || '—'}</p>
              </div>
              <div className="px-5 py-4">
                <p className="text-xs text-gray-400 mb-1">ระยะเวลา</p>
                <p className="text-sm font-medium text-gray-800">{mou.period || '—'}</p>
              </div>
              <div className="px-5 py-4">
                <p className="text-xs text-gray-400 mb-1">ประเภทความร่วมมือ</p>
                <p className="text-sm font-medium text-gray-800">{mou.type || '—'}</p>
              </div>
              <div className="px-5 py-4">
                <p className="text-xs text-gray-400 mb-1">ประเทศ</p>
                <p className="text-sm font-medium text-gray-800">{mou.nation || '—'}</p>
              </div>
              <div className="px-5 py-4">
                <p className="text-xs text-gray-400 mb-1">ประเภท</p>
                <p className="text-sm font-medium text-gray-800">
                  {mou.country_check === 'InsideSpecial' ? 'ภายในประเทศ ลักษณะเฉพาะกิจ' : (mou.country_check === 'Outside' ? 'ต่างประเทศ (Outside)' : 'ภายในประเทศ (Inside)')}
                </p>
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

        {/* Filter Bar */}
        {activities.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">ทุกประเภทกิจกรรม</option>
              <option value="Inbound">Inbound</option>
              <option value="Outbound">Outbound</option>
            </select>
            <select
              value={filterService}
              onChange={(e) => setFilterService(e.target.value)}
              className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">ทุกบริการ</option>
              <option value="Onsite">Onsite</option>
              <option value="Online">Online</option>
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">ทุกหมวดหมู่</option>
              <option value="ด้านสวัสดิการ">ด้านสวัสดิการ</option>
              <option value="ด้านวิชาการ">ด้านวิชาการ</option>
              <option value="ด้านการฝึกงาน">ด้านการฝึกงาน</option>
              <option value="ด้านการแลกเปลี่ยนทางวิชาการและวัฒนธรรม">ด้านการแลกเปลี่ยนทางวิชาการและวัฒนธรรม</option>
              <option value="ด้านอื่นๆ">ด้านอื่นๆ</option>
            </select>
            <select
              value={sortActivity}
              onChange={(e) => setSortActivity(e.target.value)}
              className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">เรียงลำดับ...</option>
              <option value="date_desc">วันที่จัดกิจกรรม (ล่าสุด - เก่าสุด)</option>
              <option value="date_asc">วันที่จัดกิจกรรม (เก่าสุด - ล่าสุด)</option>
              <option value="budget_desc">งบประมาณ (มาก - น้อย)</option>
              <option value="budget_asc">งบประมาณ (น้อย - มาก)</option>
              <option value="name_asc">ชื่อกิจกรรม (ก-ฮ)</option>
            </select>
            {(filterType || filterService || filterCategory || sortActivity) && (
              <button
                onClick={() => { setFilterType(''); setFilterService(''); setFilterCategory(''); setSortActivity(''); }}
                className="text-xs text-red-500 hover:text-red-700 px-2 py-1.5 font-medium transition-colors"
              >
                ล้างตัวกรอง
              </button>
            )}
          </div>
        )}

        {/* Activity Grid */}
        {activities.length > 0 ? (
          sortedActivities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sortedActivities.map((act, i) => (
                <ActivityCard key={act.mouid ?? i} activity={act} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-12 text-center text-gray-400">
              <p className="text-sm">ไม่พบกิจกรรมที่ตรงกับตัวกรอง</p>
            </div>
          )
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
              navigate('/MouPage');
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