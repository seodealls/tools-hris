import React, { useState, useMemo, useEffect } from "react";

// --- GLOBAL UTILITY FUNCTION ---
const getFullMonthsWorked = (start, end) => {
    if (start > end) return 0;
    let months;
    months = (end.getFullYear() - start.getFullYear()) * 12;
    months -= start.getMonth();
    months += end.getMonth();
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

// --- Icons ---
const CalendarIcon = ({ className = "w-5 h-5 text-purple-600" }) => (
    <svg width="24" height="24" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h.01M12 11h.01M15 11h.01M7 21h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const NumberListIcon = ({ className = "w-5 h-5 text-gray-500" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
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
        <div className="group mb-5">
            <label htmlFor={id} className="block text-sm font-semibold text-gray-800 mb-1">{label}</label>
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
                    className="w-1/3 px-4 py-3.5 bg-gray-50 border-transparent rounded-xl focus:ring-4 focus:ring-purple-100 focus:bg-white focus:border-purple-500 transition-all text-gray-900 font-bold text-center outline-none"
                />
                <span className="text-gray-400 font-bold">/</span>
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
                    className="w-1/3 px-4 py-3.5 bg-gray-50 border-transparent rounded-xl focus:ring-4 focus:ring-purple-100 focus:bg-white focus:border-purple-500 transition-all text-gray-900 font-bold text-center outline-none"
                />
                <span className="text-gray-400 font-bold">/</span>
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
                    className="w-1/3 px-4 py-3.5 bg-gray-50 border-transparent rounded-xl focus:ring-4 focus:ring-purple-100 focus:bg-white focus:border-purple-500 transition-all text-gray-900 font-bold text-center outline-none"
                />
            </div>
            <p className="text-xs text-gray-500 mt-1">{helperText}</p>
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
        <div className="group mb-5">
            <label htmlFor={id} className="block text-sm font-semibold text-gray-800 mb-1">{label}</label>
            <div className="relative">
                <input
                    id={id}
                    type="text"
                    inputMode="numeric"
                    value={value}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    className="w-full pr-16 pl-4 py-3.5 bg-gray-50 border-transparent rounded-xl focus:ring-4 focus:ring-purple-100 focus:bg-white focus:border-purple-500 transition-all text-gray-900 font-bold outline-none"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold pointer-events-none">{unit}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{helperText}</p>
        </div>
    );
};

const PolicySelector = ({ id, label, value, onChange, options, helperText }) => (
    <div className="group mb-5">
        <label htmlFor={id} className="block text-sm font-semibold text-gray-800 mb-1">{label}</label>
        <div className="relative">
            <select
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-50 border-transparent rounded-xl focus:ring-4 focus:ring-purple-100 focus:bg-white focus:border-purple-500 transition-all text-gray-900 font-bold appearance-none pr-10 outline-none"
            >
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">{helperText}</p>
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

                monthsForProrata = 12 - startMonth + 1;

                if (end.getFullYear() === start.getFullYear()) {
                    monthsForProrata = Math.min(endMonth - startMonth + 1, monthsForProrata);
                }

                monthsForProrata = Math.min(12, Math.max(0, monthsForProrata));

                accruedLeave = (monthsForProrata / 12) * entitlement;
                formulaText = `(${monthsForProrata} bulan / 12 bulan) × ${entitlement} hari`;
                break;
            }

            case 'ANNIVERSARY': {
                const monthsTotal = getFullMonthsWorked(start, end);
                monthsForProrata = Math.min(12, monthsTotal);
                accruedLeave = (monthsForProrata / 12) * entitlement;
                formulaText = `(${monthsForProrata} bulan / 12 bulan) × ${entitlement} hari`;
                break;
            }

            case 'ACCRUAL_MONTHLY':
            default: {
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

    const currentPolicyDesc = POLICY_TYPES.find(p => p.value === policyType)?.desc || "Pilih kebijakan cuti untuk melihat detail perhitungan.";

    return (
        <div className="w-full min-h-screen bg-[#0f0e17]">
            <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-medium text-purple-200 mb-4">
                            <span>KANTORKU HRIS TOOLS</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
                            Kalkulator <span className="text-[#FACC15]">Cuti Proporsional</span>
                        </h1>
                        <p className="text-purple-200/80 text-lg mb-6 leading-relaxed">
                            Estimasi hak cuti tahunan bagi karyawan yang bergabung di tengah periode kerja, berdasarkan berbagai kebijakan perusahaan.
                        </p>
                    </div>
                    <div className="hidden md:block bg-[#1e1b4b] border border-white/10 p-6 rounded-2xl shadow-2xl max-w-xs">
                        <div className="text-[10px] font-bold text-purple-300 uppercase tracking-wider mb-3">Terintegrasi Dengan</div>
                        <div className="flex items-center gap-3 mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#FACC15]"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" /><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" /><path d="M10 6h4" /><path d="M10 10h4" /><path d="M10 14h4" /><path d="M10 18h4" /></svg>
                            <span className="text-2xl font-bold text-white">KantorKu HRIS</span>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed">Otomatisasi hitung cuti, absensi, dan data karyawan langsung dari sistem HR Anda.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    <div className="lg:col-span-7 bg-white rounded-[2rem] p-6 md:p-8 shadow-2xl text-gray-900">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            Input Data Perhitungan
                        </h2>

                        <div className="space-y-6">
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
                                className="w-full bg-purple-600 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-purple-700 transition-all text-base shadow-lg shadow-purple-200 mt-4"
                            >
                                Hitung Cuti
                            </button>
                        </div>
                    </div>

                    <div className="lg:col-span-5 lg:sticky lg:top-8">
                        <div className="bg-[#1e1b4b] border border-white/5 rounded-[2rem] p-6 md:p-8 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>
                            <h3 className="text-xl font-bold text-white mb-1">Hasil Perhitungan</h3>
                            <p className="text-purple-300 text-sm mb-6 border-b border-white/10 pb-4">Hak Cuti yang Diperoleh</p>

                            <div className="space-y-2 animate-fade-in">
                                <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wider text-purple-200/80 font-bold mb-1">Bulan Dihitung Prorata</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-white">{calculationResult.monthsForProrata} Bulan</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wider text-purple-200/80 font-bold mb-1">Jatah Cuti Penuh Tahunan</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-white">{calculationResult.entitlement} Hari</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/10 border border-[#FACC15]/30 rounded-xl p-5 mb-3 mt-2 shadow-[0_0_15px_rgba(250,204,21,0.1)]">
                                    <p className="text-[10px] uppercase tracking-wider text-purple-200 mb-1">Total Cuti Proporsional</p>
                                    <p className="text-5xl font-bold text-[#FACC15]">{displayLeave.toFixed(0)} <span className="text-2xl text-purple-200">Hari</span></p>
                                </div>

                                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                    <p className="text-[10px] uppercase tracking-wider text-purple-200/80 font-bold mb-2">Formula Perhitungan</p>
                                    <p className="text-sm text-white">{calculationResult.formulaText}</p>
                                </div>

                                <div className="mt-6 flex items-start gap-3 p-4 bg-purple-900/30 rounded-xl border border-purple-500/20">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#FACC15] flex-shrink-0"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" /><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" /><path d="M10 6h4" /><path d="M10 10h4" /><path d="M10 14h4" /><path d="M10 18h4" /></svg>
                                    <div>
                                        <p className="text-[11px] text-purple-200 leading-relaxed mb-1 font-bold">Ingin proses ini otomatis setiap bulan?</p>
                                        <p className="text-[11px] text-purple-300 leading-relaxed">Gunakan <strong>KantorKu HRIS</strong> untuk integrasi cuti, absensi, dan data karyawan yang akurat.</p>
                                        <p className="text-[10px] text-purple-400 mt-3 pt-3 border-t border-purple-500/30 italic">Hasil ini adalah estimasi teoritis. Hak cuti aktual sangat bergantung pada Peraturan Perusahaan (PP) atau PKB yang berlaku.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Content removed for brevity/focus, replaced with standard disclaimer */}
                <div className="mt-12 text-center text-xs text-gray-600 max-w-2xl mx-auto pb-8"><p>Disclaimer: Kalkulator ini adalah alat simulasi. Hasil perhitungan adalah estimasi teoritis berdasarkan kebijakan yang dipilih. Angka aktual dapat berbeda tergantung kebijakan perusahaan.</p></div>
            </div>
        </div>
    );
}