import React, { useState, useMemo, useEffect } from "react";

// --- GLOBAL UTILITY FUNCTION ---
// Fungsi utilitas untuk menghitung bulan penuh
// Dipindahkan ke atas agar bisa diakses oleh useMemo.
const getFullMonthsWorked = (start, end) => {
    if (start > end) return 0;
    let months;
    months = (end.getFullYear() - start.getFullYear()) * 12;
    months -= start.getMonth();
    months += end.getMonth();
    // Jika tanggal akhir lebih kecil dari tanggal mulai, hitungan bulan penuh berkurang 1.
    if (end.getDate() < start.getDate()) {
        months--;
    }
    return Math.max(0, months);
};

// --- GLOBAL CONFIGURATION ---
const POLICY_TYPES = [
    { 
        value: 'ACCRUAL_MONTHLY', 
        label: 'Akrual Bulanan (Berdasarkan Masa Kerja)', 
        desc: 'Jatah cuti dihitung berdasarkan jumlah bulan kerja penuh yang telah dilalui (max 12 bulan).' 
    },
    { 
        value: 'RESET_JAN', 
        label: 'Reset Awal Tahun (1 Jan)', 
        desc: 'Jatah cuti dihitung proporsional dari tanggal masuk hingga akhir tahun (31 Des).' 
    },
    { 
        value: 'ANNIVERSARY', 
        label: 'Ulang Tahun Kerja (Anniversary)', 
        desc: 'Jatah cuti dihitung proporsional berdasarkan bulan kerja penuh, direset setiap ulang tahun tanggal masuk.' 
    },
];

// --- Icons (Menggunakan SVG inline agar self-contained) ---

// Icon Kalender (Result - Unchanged)
const CalendarIcon = ({ className = "w-5 h-5 text-purple-600" }) => ( 
    <svg width="24" height="24" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h.01M12 11h.01M15 11h.01M7 21h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

// Icon Timbangan (Comparison/Regulations - Unchanged)
const ScaleIcon = ({ className = "w-5 h-5 text-indigo-600" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.044m17.236 0c.264.444.385.968.385 1.512V19a2 2 0 01-2 2H5a2 2 0 01-2-2V7.456c0-.544.121-1.068.385-1.512m17.236 0L12 18l-8.618-11.016" />
    </svg>
);

// Icon Kalkulator (Header - Unchanged)
const CalculatorIcon = ({ className = "w-5 h-5 text-white" }) => (
    <svg width="24" height="24" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
);

// Icon Ceklis (Panduan - Unchanged)
const CheckIcon = ({ className = "w-4 h-4 text-purple-600" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

// Icon Peringatan (Catatan Penting - Unchanged)
const WarningIcon = ({ className = "w-5 h-5 text-red-600" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);

// 1. **BARU**: Icon Daftar/Formulir untuk Input Data Perhitungan
const ClipboardListIcon = ({ className = "w-5 h-5 text-slate-500" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
);

// 2. **BARU**: Icon Piala/Pencapaian untuk Total Cuti Proporsional (Hasil)
const TrophyIcon = ({ className = "w-5 h-5 text-yellow-400" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-2.526a2 2 0 01-1.789-2.894l-3.5-7A2 2 0 015.236 10H10m4 0l1 3m-4-3l-1 3m-4 3h12" />
    </svg>
);

// 3. Simulasi Dokumen Cuti (Document/File Icon - Unchanged)
const DocumentIcon = ({ className = "w-5 h-5 text-purple-300" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

// --- REUSABLE FORM COMPONENTS ---
const ResponsiveDateInput = ({ id, label, value, onChange, helperText }) => {
    const dayRef = React.useRef(null);
    const monthRef = React.useRef(null);
    const yearRef = React.useRef(null);

    const handleInputChange = (field, val) => {
        const numericValue = val.replace(/[^0-9]/g, '');
        onChange({ ...value, [field]: numericValue });

        if (field === 'day' && numericValue.length === 2) {
            monthRef.current?.focus();
        } else if (field === 'month' && numericValue.length === 2) {
            yearRef.current?.focus();
        }
    };
    
    const handleKeyDown = (e, field) => {
        if (e.key === 'Backspace' && !value[field]) {
            if (field === 'year') {
                monthRef.current?.focus();
            } else if (field === 'month') {
                dayRef.current?.focus();
            }
        }
    };

    const handleFocus = (e) => {
        e.target.select();
    };

    return (
        <div className="group">
            <label htmlFor={id} className="block text-base font-bold text-slate-700 mb-1">{label}</label>
            <div className="flex items-center gap-2">
                <input
                    ref={dayRef}
                    id={`${id}-day`}
                    type="text"
                    inputMode="numeric"
                    maxLength="2"
                    value={value.day}
                    placeholder="DD"
                    onChange={(e) => handleInputChange('day', e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, 'day')}
                    onFocus={handleFocus}
                    className="w-1/3 px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-slate-900 font-medium text-base text-center"
                />
                <span className="text-slate-400">/</span>
                <input
                    ref={monthRef}
                    id={`${id}-month`}
                    type="text"
                    inputMode="numeric"
                    maxLength="2"
                    value={value.month}
                    placeholder="MM"
                    onChange={(e) => handleInputChange('month', e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, 'month')}
                    onFocus={handleFocus}
                    className="w-1/3 px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-slate-900 font-medium text-base text-center"
                />
                <span className="text-slate-400">/</span>
                <input
                    ref={yearRef}
                    id={`${id}-year`}
                    type="text"
                    inputMode="numeric"
                    maxLength="4"
                    value={value.year}
                    placeholder="YYYY"
                    onChange={(e) => handleInputChange('year', e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, 'year')}
                    onFocus={handleFocus}
                    className="w-1/3 px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-slate-900 font-medium text-base text-center"
                />
            </div>
            <p className="text-xs text-slate-500 mt-1">{helperText}</p>
        </div>
    );
};

const NumberInput = ({ id, label, value, unit, onChange, helperText }) => {
    const handleFocus = (e) => e.target.select();

    const handleChange = (e) => {
        const val = e.target.value;
        if (val === '') {
            onChange('');
        } else {
            const numericVal = parseInt(val.replace(/[^0-9]/g, ''), 10);
            if (!isNaN(numericVal)) {
                 onChange(Math.max(0, numericVal));
            }
        }
    };

    return (
        <div className="group">
            <label htmlFor={id} className="block text-base font-bold text-slate-700 mb-1">{label}</label>
            <div className="relative">
                <input
                    id={id}
                    type="text"
                    inputMode="numeric"
                    value={value}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    className="w-full pr-16 pl-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-slate-900 font-medium text-base"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">{unit}</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{helperText}</p>
        </div>
    );
};

const PolicySelector = ({ id, label, value, onChange, options, helperText }) => (
    <div className="group">
        <label htmlFor={id} className="block text-base font-bold text-slate-700 mb-1">{label}</label>
        <div className="relative">
            <select
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-slate-900 font-medium appearance-none text-base pr-10"
            >
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </div>
        </div>
        <p className="text-xs text-slate-500 mt-1">{helperText}</p>
    </div>
);

// Komponen Kalkulator Utama
export default function CutiProporsional() {
    // --- STATE ---
    const [annualEntitlement, setAnnualEntitlement] = useState(12);
    const [startDate, setStartDate] = useState({ day: '', month: '', year: '' });
    const [calculationDate, setCalculationDate] = useState({ day: '', month: '', year: '' });
    const [policyType, setPolicyType] = useState('ACCRUAL_MONTHLY');
    const [calculationResult, setCalculationResult] = useState({
        monthsForProrata: 0,
        entitlement: 12,
        accruedLeave: 0,
        daysRaw: 0,
        formulaText: "Lengkapi semua data untuk melihat hasil."
    });
    
    // State untuk Live Counting
    const [displayLeave, setDisplayLeave] = useState(0);

    const handleCalculate = () => {
        const parseDate = (dateObject) => {
            if (!dateObject || !dateObject.day || !dateObject.month || !dateObject.year) return null;
            
            const day = parseInt(dateObject.day, 10);
            const month = parseInt(dateObject.month, 10);
            const year = parseInt(dateObject.year, 10);

            // Basic validation
            if (isNaN(day) || isNaN(month) || isNaN(year) || year < 1000 || month < 1 || month > 12 || day < 1 || day > 31) {
                return null;
            }
            // In JS, month is 0-indexed
            return new Date(year, month - 1, day);
        };

        const start = parseDate(startDate);
        const end = parseDate(calculationDate);
        const entitlement = parseInt(annualEntitlement, 10) || 0;

        if (!start || !end || start > end || entitlement <= 0) {
            setCalculationResult({
                monthsForProrata: 0,
                entitlement: entitlement || 12,
                accruedLeave: 0,
                daysRaw: 0,
                formulaText: "Lengkapi semua data untuk melihat hasil."
            });
            return;
        }
        
        let monthsForProrata = 0;
        let accruedLeave = 0;
        let formulaText = "";

        switch (policyType) {
            case 'RESET_JAN': {
                const startMonth = start.getMonth() + 1; // 1-12
                const endMonth = end.getMonth() + 1;
                
                // Menghitung bulan penuh yang dilalui dari tgl start ke akhir tahun.
                monthsForProrata = 12 - startMonth + 1;
                
                // Jika tgl perhitungan (end) di tahun yang sama
                if (end.getFullYear() === start.getFullYear()) {
                     monthsForProrata = Math.min(endMonth - startMonth + 1, monthsForProrata);
                } 
                
                // Pastikan minimal 0 dan maksimal 12
                monthsForProrata = Math.min(12, Math.max(0, monthsForProrata));
                
                accruedLeave = (monthsForProrata / 12) * entitlement;
                formulaText = `(${monthsForProrata} bulan / 12 bulan) × ${entitlement} hari`;
                break;
            }

            case 'ANNIVERSARY': {
                // Diambil bulan penuh yang telah dilewati sejak tgl bergabung
                const monthsTotal = getFullMonthsWorked(start, end);
                monthsForProrata = Math.min(12, monthsTotal);
                accruedLeave = (monthsForProrata / 12) * entitlement;
                formulaText = `(${monthsForProrata} bulan / 12 bulan) × ${entitlement} hari`;
                break;
            }

            case 'ACCRUAL_MONTHLY':
            default: {
                // Diambil bulan penuh yang telah dilewati sejak tgl bergabung, dibatasi 12
                monthsForProrata = getFullMonthsWorked(start, end);
                monthsForProrata = Math.min(12, monthsForProrata);
                accruedLeave = (monthsForProrata / 12) * entitlement;
                formulaText = `(${monthsForProrata} bulan / 12 bulan) × ${entitlement} hari`;
                break;
            }
        }
        
        const finalLeaveDays = Math.floor(accruedLeave);

        setCalculationResult({
            monthsForProrata,
            entitlement,
            accruedLeave,
            daysRaw: finalLeaveDays,
            formulaText: `${formulaText} ≈ ${accruedLeave.toFixed(2)} hari (sebelum pembulatan)`
        });
    };

    
    // --- LIVE COUNTING EFFECT ---
    useEffect(() => {
        let animationFrameId;
        let startValue = displayLeave;
        const endValue = calculationResult.daysRaw;
        const duration = 800; // milliseconds
        const startTime = performance.now();

        if (startValue === endValue) {
             setDisplayLeave(endValue);
             return;
        }

        const step = (timestamp) => {
            const elapsed = timestamp - startTime;
            const progress = Math.min(1, elapsed / duration);
            const currentValue = startValue + (endValue - startValue) * progress;

            // Mempercepat animasi jika perubahan angkanya besar
            const adjustedValue = endValue > startValue ? Math.ceil(currentValue) : Math.floor(currentValue);

            setDisplayLeave(Math.max(0, adjustedValue));

            if (progress < 1) {
                animationFrameId = requestAnimationFrame(step);
            } else {
                setDisplayLeave(endValue);
            }
        };

        animationFrameId = requestAnimationFrame(step);

        return () => cancelAnimationFrame(animationFrameId);
    }, [calculationResult.daysRaw]);
    
    // Perbaikan: Pastikan POLICY_TYPES sudah didefinisikan secara global.
    const currentPolicyDesc = POLICY_TYPES.find(p => p.value === policyType)?.desc || "Pilih kebijakan cuti untuk melihat detail perhitungan.";

    return (
        <div className="min-h-screen w-full bg-slate-50 font-sans text-slate-900 pb-20">
            {/* Header Gradient */}
            <div className="w-full bg-[#1E0137] pb-32 pt-12 px-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#28024B] to-[#5E0DC6] opacity-80"></div>
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
                <div className="relative max-w-6xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 shadow-sm mb-6">
                        <CalculatorIcon className="w-5 h-5 text-purple-300" />
                        <span className="text-xs font-medium text-white">HR Calculator Tool</span>
                    </div>
                    {/* Judul Utama dengan warna Kuning - Font besar */}
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                        Kalkulator <span className="text-yellow-400">Cuti Proporsional</span>
                    </h1>
                    {/* Deskripsi - Font kecil */}
                    <p className="text-purple-200 max-w-2xl mx-auto text-sm leading-relaxed">
                        Estimasi hak cuti tahunan bagi karyawan yang bergabung di tengah periode kerja, berdasarkan berbagai kebijakan perusahaan.
                    </p>
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
                <div className="grid lg:grid-cols-12 gap-8 items-start">
                    
                    {/* LEFT (lg:col-span-7): INPUT FORM & ADDITIONAL INFO CARDS */}
                    <div className="lg:col-span-7 space-y-6">
                        
                        {/* 1. INPUT FORM CARD - MENGGUNAKAN ClipboardListIcon */}
                        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                                <h2 className="font-bold text-slate-800 text-2xl flex items-center gap-2">
                                    <ClipboardListIcon className="w-6 h-6 text-slate-500" /> Input Data Perhitungan
                                </h2>
                                <p className="text-sm text-slate-500 mt-1">Lengkapi data di bawah untuk menghitung jatah cuti.</p>
                            </div>
                            <div className="p-6 space-y-6">
                                {/* Semua input diatur dalam satu stack vertikal (space-y-6) */}
                                <ResponsiveDateInput 
                                    id="startDate" 
                                    label="Tanggal Mulai Kerja" 
                                    value={startDate} 
                                    onChange={setStartDate} 
                                    helperText="Tanggal efektif karyawan pertama kali bekerja."
                                />
                                <ResponsiveDateInput 
                                    id="calculationDate" 
                                    label="Tanggal Perhitungan" 
                                    value={calculationDate} 
                                    onChange={setCalculationDate} 
                                    helperText="Tanggal di mana hak cuti ingin dihitung (misal: akhir tahun)."
                                />
                                <PolicySelector
                                    id="policyType"
                                    label="Pilih Jenis Kebijakan Cuti"
                                    value={policyType}
                                    onChange={setPolicyType}
                                    options={POLICY_TYPES.map(p => ({ value: p.value, label: p.label }))}
                                    helperText={currentPolicyDesc}
                                />
                                <NumberInput 
                                    id="annualEntitlement" 
                                    label="Jatah Cuti Tahunan Penuh (Maksimum)" 
                                    value={annualEntitlement} 
                                    unit="Hari"
                                    onChange={setAnnualEntitlement} 
                                    helperText="Jumlah hari cuti penuh yang diberikan perusahaan per tahun (misal: 12 hari)."
                                />
                                <button
                                    onClick={handleCalculate}
                                    className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 transition-all"
                                >
                                    Hitung Cuti
                                </button>
                            </div>
                        </div>

                        
                        {/* 2. PERBANDINGAN CUTI KHUSUS CARD */}
                        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                                <h2 className="font-bold text-slate-800 text-xl flex items-center gap-2">
                                    <ScaleIcon className="w-5 h-5 text-indigo-600" /> Perbandingan Cuti Tahunan & Cuti Khusus
                                </h2>
                                <p className="text-sm text-slate-500 mt-1">Jenis cuti lain yang umumnya diatur dalam Undang-Undang Ketenagakerjaan dan kebijakan perusahaan.</p>
                            </div>
                            <div className="p-4"> 
                                <table className="min-w-full text-xs text-left text-slate-600 border-collapse">
                                    <thead className="text-xs text-slate-700 uppercase bg-slate-100/70">
                                        <tr>
                                            <th scope="col" className="px-2 py-3 font-semibold w-1/3">Jenis Cuti</th>
                                            <th scope="col" className="px-2 py-3 font-semibold w-1/3">Maks. Hari Kerja</th>
                                            <th scope="col" className="px-2 py-3 font-semibold w-1/3">Terkait Proporsional?</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="bg-white border-b border-slate-100">
                                            <th scope="row" className="px-2 py-3 font-medium text-slate-900">Cuti Tahunan (Reguler)</th>
                                            <td className="px-2 py-3">Min. 12 Hari</td>
                                            <td className="px-2 py-3"><span className="text-green-600 font-medium">Ya</span></td>
                                        </tr>
                                        <tr className="bg-white border-b border-slate-100">
                                            <th scope="row" className="px-2 py-3 font-medium text-slate-900">Cuti Melahirkan (Istri)</th>
                                            <td className="px-2 py-3">±3 Bulan</td>
                                            <td className="px-2 py-3"><span className="text-red-600 font-medium">Tidak</span></td>
                                        </tr>
                                        <tr className="bg-white border-b border-slate-100">
                                            <th scope="row" className="px-2 py-3 font-medium text-slate-900">Cuti Menikah</th>
                                            <td className="px-2 py-3">2-3 Hari</td>
                                            <td className="px-2 py-3"><span className="text-red-600 font-medium">Tidak</span></td>
                                        </tr>
                                        <tr className="bg-white border-b border-slate-100">
                                            <th scope="row" className="px-2 py-3 font-medium text-slate-900">Cuti Khitanan/Baptis Anak</th>
                                            <td className="px-2 py-3">2 Hari</td>
                                            <td className="px-2 py-3"><span className="text-red-600 font-medium">Tidak</span></td>
                                        </tr>
                                        <tr className="bg-white">
                                            <th scope="row" className="px-2 py-3 font-medium text-slate-900">Cuti Kedukaan</th>
                                            <td className="px-2 py-3">2-5 Hari</td>
                                            <td className="px-2 py-3"><span className="text-red-600 font-medium">Tidak</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* DASAR HUKUM CARD */}
                        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                                <h2 className="font-bold text-slate-800 text-xl flex items-center gap-2">
                                    <ScaleIcon className="w-5 h-5 text-indigo-600" /> Dasar Hukum
                                </h2>
                            </div>
                            <div className="p-6">
                                <p className="text-sm text-slate-800 font-semibold mb-3">
                                    Peraturan Pemerintah Pengganti Undang-Undang (Perpu) Nomor 2 Tahun 2022 tentang Cipta Kerja - Pasal 79 ayat 3:
                                </p>
                                <blockquote className="border-l-4 border-indigo-100 pl-4 mb-4">
                                    <p className="text-sm text-slate-600 leading-relaxed text-justify italic">
                                        "Cuti sebagaimana dimaksud pada ayat (1) huruf b yang wajib diberikan kepada Pekerja/Buruh, yaitu cuti tahunan, paling sedikit 12 (dua belas) hari kerja setelah Pekerja/Buruh yang bersangkutan bekerja selama 12 (dua belas) bulan secara terus menerus."
                                    </p>
                                </blockquote>
                                <a href="https://peraturan.bpk.go.id/Details/234926/perpu-no-2-tahun-2022" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors inline-flex items-center gap-1">
                                    Lihat Peraturan Selengkapnya 
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* 3. PANDUAN MANAJEMEN CUTI CARD (Icon Lampu) */}
                        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                                <h2 className="font-bold text-slate-800 text-xl flex items-center gap-2">
                                    <span className="text-xl">💡</span> Panduan Manajemen Cuti
                                </h2>
                                <p className="text-sm text-slate-500 mt-1">Langkah-langkah untuk manajemen cuti yang efektif dan sesuai regulasi.</p>
                            </div>
                            <div className="p-6">
                                <ol className="divide-y divide-slate-100 text-slate-700">
                                    {[
                                        "Pastikan rincian kebijakan cuti tercantum jelas dalam kontrak kerja atau Peraturan Perusahaan.",
                                        "Sampaikan informasi kebijakan cuti secara transparan kepada karyawan baru saat penyambutan agar tidak ada kesalahpahaman.",
                                        "Dokumentasikan setiap perubahan kebijakan cuti secara tertulis dan informasikan ke seluruh karyawan secepatnya.",
                                        "Lakukan review dan pembaruan kebijakan cuti secara berkala sesuai perkembangan bisnis dan regulasi terbaru.",
                                    ].map((item, index) => (
                                        <li key={index} className="flex items-start py-3 space-x-2">
                                            <CheckIcon className="flex-shrink-0 mt-1 w-4 h-4" /> 
                                            <span className="text-sm leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </div>

                        {/* 4. SIMULASI DOKUMEN CUTI CARD - ICON BARU */}
                        <div className="bg-white rounded-2xl shadow-xl shadow-purple-900/10 border border-slate-100 overflow-hidden">
                            <div className="px-6 py-4 bg-purple-900">
                                <h2 className="font-semibold text-white text-xl flex items-center gap-2">
                                    <DocumentIcon className="w-5 h-5 text-purple-300" /> Simulasi Dokumen Cuti
                                </h2>
                                <p className="text-purple-300 text-sm mt-1">Contoh pasal mengenai hak cuti yang wajib dicantumkan dalam dokumen legal perusahaan.</p>
                            </div>
                            {/* Scrollable Content Area */}
                            <div className="p-6 bg-slate-50 h-96 overflow-y-scroll border-t border-purple-200 shadow-inner">
                                <div className="text-slate-800 text-xs space-y-4">
                                    <p className="text-center text-xs font-normal uppercase text-slate-500 mb-6">
                                        [CUPLIKAN DOKUMEN PERJANJIAN KERJA BERSAMA (PKB) ATAU PERATURAN PERUSAHAAN]
                                    </p>

                                    <div className="space-y-1">
                                        <p className="font-extrabold text-sm mb-1">BAB VI - HAK CUTI DAN IJIN</p>
                                        <p className="font-bold text-purple-700">Pasal 12 - Hak Cuti Tahunan</p>
                                    </div>

                                    <div className="space-y-3 pl-4">
                                        <p>
                                            <span className="font-bold">(1)</span> Setiap Pekerja berhak atas Cuti Tahunan setelah bekerja selama 12 (dua belas) bulan secara terus menerus, yaitu sebanyak 12 (dua belas) hari kerja.
                                        </p>
                                        <p>
                                            <span className="font-bold">(2)</span> Bagi Pekerja yang baru bergabung dan belum mencapai masa kerja 12 (dua belas) bulan, hak Cuti Tahunan akan diberikan secara proporsional (prorata) berdasarkan jumlah bulan kerja penuh yang telah dilalui dalam periode cuti yang berlaku.
                                        </p>
                                        <div className="bg-purple-100 p-3 rounded-lg border border-purple-300">
                                            <p className="font-semibold">Rumus Prorata yang Digunakan:</p>
                                            <p className="text-xs mt-1">Cuti Proporsional = (Jumlah Bulan Kerja Penuh / 12) x Jatah Cuti Penuh Tahunan.</p>
                                        </div>
                                        <p>
                                            <span className="font-bold">(3)</span> Perusahaan menetapkan bahwa hasil perhitungan cuti proporsional yang mengandung pecahan hari akan dibulatkan ke bawah (floor function) ke bilangan bulat terdekat.
                                        </p>
                                        <p>
                                            <span className="font-bold">(4)</span> Masa cuti yang telah diambil akan mengurangi hak cuti tahunan yang tersisa. Permintaan cuti harus diajukan setidaknya 7 (tujuh) hari kerja sebelumnya.
                                        </p>
                                        <p className="text-center text-xs text-slate-400 pt-4 border-t border-slate-200">
                                            --- Akhir Cuplikan Pasal ---
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>

                    {/* RIGHT (lg:col-span-5): RESULTS (Sticky) */}
                    <div className="lg:col-span-5 lg:sticky lg:top-8 space-y-6">
                        
                        {/* Main Result Card - MENGGUNAKAN TrophyIcon */}
                        <div className="bg-white rounded-2xl shadow-2xl shadow-purple-900/10 border border-slate-100 overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
                            
                            <div className="p-6 bg-slate-50 border-b border-slate-100">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Hak Cuti Yang Diperoleh</p>
                                <div className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                    <TrophyIcon className="w-5 h-5 text-yellow-500" /> Total Cuti Proporsional
                                </div>
                            </div>

                            <div className="p-8 flex flex-col items-center justify-center text-center space-y-2">
                                <CalendarIcon className="w-12 h-12 text-purple-600 mb-2" />
                                <div className="text-7xl font-extrabold text-slate-900 tracking-tight transition-all duration-300 ease-out">
                                    {displayLeave.toFixed(0)}
                                </div>
                                <p className="text-base text-slate-500">Hari Cuti yang Dapat Diambil</p>
                            </div>

                            {/* Breakdown Table */}
                            <div className="border-t border-slate-100">
                                <div className="p-4 bg-white flex flex-col text-center space-y-1">
                                    <span className="text-xs font-medium text-slate-500">Perhitungan Formula:</span>
                                    <span className="text-sm font-semibold text-slate-700">{calculationResult.formulaText}</span>
                                </div>
                                <div className="grid grid-cols-2 divide-x divide-slate-100">
                                    <div className="p-4 text-center hover:bg-slate-50 transition">
                                        <p className="text-xs text-slate-500 mb-1">Bulan Dihitung Prorata</p>
                                        <p className="font-bold text-slate-800 text-lg">{calculationResult.monthsForProrata} Bulan</p>
                                    </div>
                                    <div className="p-4 text-center hover:bg-slate-50 transition">
                                        <p className="text-xs text-slate-500 mb-1">Jatah Cuti Penuh</p>
                                        <p className="font-bold text-slate-800 text-lg">{calculationResult.entitlement} Hari</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* 5. CATATAN PENTING CARD - Teks diperpendek */}
                        <div className="bg-white rounded-2xl border border-red-200 p-4 shadow-sm">
                            <h3 className="text-base font-bold text-red-700 flex items-center gap-2 mb-2">
                                <WarningIcon className="w-5 h-5 text-red-600" /> Catatan Penting
                            </h3>
                            {/* Teks diperpendek dan lebih lugas */}
                            <p className="text-xs text-slate-700 leading-relaxed">
                                Hasil ini adalah estimasi teoritis. Hak cuti aktual sangat bergantung pada Peraturan Perusahaan (PP) atau Perjanjian Kerja Bersama (PKB) yang berlaku di tempat kerja Anda. Selalu rujuk ke dokumen legal perusahaan.
                            </p>
                        </div>

                    </div>
                </div>
            </main>

            {/* CTA Banner at the Bottom - Buttons made shorter/smaller */}
            <div className="mt-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="p-8 md:p-10 bg-gradient-to-r from-purple-700 to-indigo-700 rounded-2xl shadow-2xl shadow-purple-900/50 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-8">
                    
                    <div className="flex flex-col text-center md:text-left">
                        <h2 className="text-xl font-bold text-white leading-snug">
                            Jangan Ribet Hitung Manual, Pakai KantorKu HRIS agar Lebih Praktis!
                        </h2>
                        <p className="text-sm text-purple-200 mt-1">
                            Stop repot hitung manual! KantorKu HRIS membantu HR mengelola cuti, absensi, dan data karyawan secara cepat dan akurat
                        </p>
                    </div>
                    
                    <div className="flex space-x-3">
                        {/* Minimalist Button Styling */}
                        <a href="#" onClick={(e) => { e.preventDefault(); console.log('CTA Coba Gratis Clicked!'); }} className="group px-3 py-1.5 text-sm font-semibold rounded-lg text-indigo-900 bg-white shadow-md hover:bg-purple-50 transition duration-150 ease-in-out whitespace-nowrap">
                            Coba Gratis
                        </a>
                        <a href="#" onClick={(e) => { e.preventDefault(); console.log('CTA Hubungi Sales Clicked!'); }} className="group px-3 py-1.5 text-sm font-semibold rounded-lg text-white bg-transparent border border-white hover:bg-white/20 transition duration-150 ease-in-out whitespace-nowrap">
                            Hubungi Sales
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}