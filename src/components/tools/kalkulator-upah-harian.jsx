import React, { useState, useMemo } from "react";

// --- UTILITY & CONFIG ---
const formatCurrency = (value) => {
    const numberValue = Number(value) || 0;
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(numberValue);
};

const ASSUMPTIONS = {
    HOURS_PER_DAY: 8,
    DAYS_PER_WEEK: 5,
    DAYS_PER_MONTH: 22,
    DAYS_PER_YEAR: 264, // 52 weeks * 5 days
};

// --- ICONS ---
const CalculatorIcon = ({ className = "w-5 h-5 text-purple-300" }) => (
    <svg width="24" height="24" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
);

const PlusIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

const TrashIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const BuildingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#FACC15]">
        <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
        <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
        <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
        <path d="M10 6h4"/>
        <path d="M10 10h4"/>
        <path d="M10 14h4"/>
        <path d="M10 18h4"/>
    </svg>
);


// --- FORM COMPONENTS ---

const CurrencyInput = ({ value, onChange }) => {
    const [displayValue, setDisplayValue] = useState("0");

    React.useEffect(() => {
        setDisplayValue(Number(value).toLocaleString('id-ID'));
    }, [value]);

    const handleFocus = (e) => e.target.select();
    const handleChange = (e) => {
        const val = e.target.value.replace(/[^0-9]/g, '');
        onChange(parseInt(val, 10) || 0);
    };

    return (
        <div>
            <label htmlFor="wageAmount" className="block text-sm font-semibold text-gray-800 mb-1">Jumlah Upah *</label>
            <div className="relative group">
                <span className="absolute left-4 top-3.5 text-gray-500 font-bold group-focus-within:text-purple-600 pointer-events-none">Rp</span>
                <input
                    id="wageAmount"
                    type="text"
                    inputMode="numeric"
                    value={displayValue}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    className="w-full pl-10 pr-4 py-3.5 border rounded-xl text-gray-900 font-bold focus:ring-4 focus:ring-purple-100 transition-all outline-none bg-gray-50 border-transparent focus:bg-white focus:border-purple-500"
                />
            </div>
            <p className="text-xs text-gray-500 mt-1">Masukkan nominal upah yang Anda terima</p>
        </div>
    );
};

const WageTypeToggle = ({ value, onChange }) => (
    <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2">Jenis Upah *</label>
        <div className="grid grid-cols-2 gap-2 bg-gray-50 p-1 rounded-2xl border border-gray-100">
            <button
                onClick={() => onChange('daily')}
                className={`py-3 rounded-xl text-sm font-bold transition-all ${value === 'daily' ? 'bg-white text-purple-700 shadow-sm ring-1 ring-purple-100' : 'text-gray-500 hover:bg-gray-100'}`}
            >
                Harian
            </button>
            <button
                onClick={() => onChange('hourly')}
                className={`py-3 rounded-xl text-sm font-bold transition-all ${value === 'hourly' ? 'bg-white text-purple-700 shadow-sm ring-1 ring-purple-100' : 'text-gray-500 hover:bg-gray-100'}`}
            >
                Per Jam
            </button>
        </div>
    </div>
);

const ResultRow = ({ label, value, highlight = false, subtext }) => (
    <div className={`bg-white/5 border border-white/10 rounded-xl p-4 mb-3 ${highlight ? 'border-[#FACC15]/30 bg-[#FACC15]/5' : ''}`}>
        <div className="flex justify-between items-start">
            <div>
                <p className="text-[10px] uppercase tracking-wider text-purple-200/80 font-bold mb-1">{label}</p>
                {subtext && <p className="text-xs text-purple-300/70">{subtext}</p>}
            </div>
            <div className="text-right">
                <p className={`text-lg font-bold ${highlight ? 'text-[#FACC15]' : 'text-white'}`}>
                    {formatCurrency(value)}
                </p>
            </div>
        </div>
    </div>
);


export default function KalkulatorUpahHarian() {
    const [wageAmount, setWageAmount] = useState(100000);
    const [wageType, setWageType] = useState('daily'); // 'daily' or 'hourly'
    const [workData, setWorkData] = useState([]); // array of numbers

    const {
        dailyRate,
        hourlyRate,
        totalWorkUnits,
        totalPay,
        weeklyProjection,
        monthlyProjection,
        annualProjection
    } = useMemo(() => {
        const amount = Number(wageAmount) || 0;
        let daily = 0;
        let hourly = 0;

        if (wageType === 'daily') {
            daily = amount;
            hourly = amount / ASSUMPTIONS.HOURS_PER_DAY;
        } else {
            hourly = amount;
            daily = amount * ASSUMPTIONS.HOURS_PER_DAY;
        }

        const totalUnits = workData.reduce((sum, val) => sum + Number(val || 0), 0);
        const calculatedTotalPay = wageType === 'daily' ? totalUnits * daily : totalUnits * hourly;

        return {
            dailyRate: daily,
            hourlyRate: hourly,
            totalWorkUnits: totalUnits,
            totalPay: calculatedTotalPay,
            weeklyProjection: daily * ASSUMPTIONS.DAYS_PER_WEEK,
            monthlyProjection: daily * ASSUMPTIONS.DAYS_PER_MONTH,
            annualProjection: daily * ASSUMPTIONS.DAYS_PER_YEAR,
        };
    }, [wageAmount, wageType, workData]);

    const addWorkEntry = () => {
        setWorkData([...workData, '']);
    };

    const updateWorkEntry = (index, value) => {
        const newData = [...workData];
        newData[index] = value;
        setWorkData(newData);
    };

    const removeWorkEntry = (index) => {
        const newData = workData.filter((_, i) => i !== index);
        setWorkData(newData);
    };

    const workUnitLabel = wageType === 'daily' ? 'Hari' : 'Jam';

    return (
        <div className="w-full min-h-screen bg-[#0f0e17]">
            <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-medium text-purple-200 mb-4">
                            <CalculatorIcon className="w-4 h-4" />
                            <span>KANTORKU HRIS TOOLS</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
                            Kalkulator <span className="text-[#FACC15]">Upah Harian/Per Jam</span>
                        </h1>
                        <p className="text-purple-200/80 text-lg mb-6 leading-relaxed">
                            Konversi perhitungan otomatis antara upah harian dan per jam, lengkap dengan proyeksi pendapatan mingguan, bulanan, dan tahunan.
                        </p>
                    </div>
                    <div className="hidden md:block bg-[#1e1b4b] border border-white/10 p-6 rounded-2xl shadow-2xl max-w-xs">
                        <div className="text-[10px] font-bold text-purple-300 uppercase tracking-wider mb-3">Terintegrasi Dengan</div>
                        <div className="flex items-center gap-3 mb-3">
                            <BuildingIcon />
                            <span className="text-2xl font-bold text-white">KantorKu HRIS</span>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed">Otomatisasi hitung payroll, BPJS, dan PPh 21 langsung dari sistem HR Anda.</p>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left: Input Cards */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-2xl text-gray-900">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                                    <span className="text-sm font-bold">1</span>
                                </div>
                                Masukkan Data Upah
                            </h2>
                            <div className="pl-10 space-y-6">
                                <CurrencyInput value={wageAmount} onChange={setWageAmount} />
                                <WageTypeToggle value={wageType} onChange={setWageType} />
                            </div>
                        </div>

                        <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-2xl text-gray-900">
                            <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                                    <span className="text-sm font-bold">2</span>
                                </div>
                                Data Hari/Jam Kerja
                            </h2>
                            <p className="text-sm text-gray-500 mb-4 pl-10">Tambahkan data kerja untuk menghitung total pendapatan.</p>
                            <div className="pl-10">
                                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                    {workData.map((value, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <div className="relative flex-grow">
                                                <input
                                                    type="number"
                                                    value={value}
                                                    onChange={(e) => updateWorkEntry(index, e.target.value)}
                                                    className="w-full pl-4 pr-14 py-3.5 bg-gray-50 border-transparent rounded-xl focus:ring-4 focus:ring-purple-100 focus:bg-white focus:border-purple-500 transition-all outline-none font-bold text-gray-900"
                                                    placeholder={`Jumlah ${workUnitLabel}`}
                                                />
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">{workUnitLabel}</span>
                                            </div>
                                            <button onClick={() => removeWorkEntry(index)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                                                <TrashIcon />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={addWorkEntry} className="w-full mt-4 bg-purple-100 text-purple-700 font-bold py-3 px-4 rounded-xl hover:bg-purple-200 transition-all flex items-center justify-center space-x-2">
                                    <PlusIcon />
                                    <span>Tambah Data Kerja</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right: Results */}
                    <div className="lg:col-span-5 lg:sticky lg:top-8">
                        <div className="bg-[#1e1b4b] border border-white/5 rounded-[2rem] p-6 md:p-8 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>
                            <h3 className="text-xl font-bold text-white mb-1">Hasil Perhitungan</h3>
                            <p className="text-purple-300 text-sm mb-6 border-b border-white/10 pb-4">Mode: Upah {wageType === 'daily' ? 'Harian' : 'Per Jam'}</p>

                            <div className="space-y-2">
                                {wageAmount <= 0 || workData.length === 0 ? (
                                    <div className="text-center py-10">
                                        <p className="text-purple-200/80">Masukkan data upah untuk melihat hasil.</p>
                                        {workData.length === 0 && <p className="text-purple-300/60 text-sm mt-1">Tambahkan minimal satu data kerja.</p>}
                                    </div>
                                ) : (
                                    <>
                                        <div className="bg-white/5 border border-purple-500/30 rounded-xl p-4 mb-3">
                                            <p className="text-xs text-purple-200 mb-1">Tarif upah Anda setara dengan</p>
                                            <p className="text-lg font-bold text-purple-300">
                                                {formatCurrency(wageType === 'daily' ? hourlyRate : dailyRate)} / {wageType === 'daily' ? 'jam' : 'hari'}
                                            </p>
                                        </div>

                                        <div className="bg-white/10 border border-[#FACC15]/30 rounded-xl p-5 mb-3 mt-2 shadow-[0_0_15px_rgba(250,204,21,0.1)]">
                                            <p className="text-[10px] uppercase tracking-wider text-purple-200 mb-1">Total Upah Periode Ini ({totalWorkUnits} {workUnitLabel})</p>
                                            <p className="text-3xl font-bold text-[#FACC15]">{formatCurrency(totalPay)}</p>
                                        </div>

                                        <div className="pt-4 border-t border-white/10">
                                            <h4 className="font-bold text-white mb-3">Proyeksi Pendapatan</h4>
                                            <ResultRow label="Mingguan" value={weeklyProjection} subtext={`${ASSUMPTIONS.DAYS_PER_WEEK} hari kerja`} />
                                            <ResultRow label="Bulanan" value={monthlyProjection} subtext={`${ASSUMPTIONS.DAYS_PER_MONTH} hari kerja`} />
                                            <ResultRow label="Tahunan" value={annualProjection} subtext={`${ASSUMPTIONS.DAYS_PER_YEAR} hari kerja`} highlight />
                                        </div>
                                    </>
                                )}

                                <div className="mt-6 flex items-start gap-3 p-4 bg-purple-900/30 rounded-xl border border-purple-500/20">
                                    <BuildingIcon />
                                    <div>
                                        <p className="text-[11px] text-purple-200 leading-relaxed mb-1 font-bold">Ingin proses ini otomatis setiap bulan?</p>
                                        <p className="text-[11px] text-purple-300 leading-relaxed">Gunakan <strong>KantorKu HRIS</strong> untuk integrasi payroll, absensi, dan pajak yang akurat.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* About Section */}
                <div className="mt-12 bg-white rounded-[2rem] p-6 md:p-8 shadow-2xl text-gray-900">
                    <h2 className="text-xl font-bold text-gray-900 mb-3">Petunjuk dan Informasi Kalkulator</h2>
                    <p className="text-sm text-gray-600 mb-6 text-justify">
                        Kalkulator ini adalah alat bantu untuk mengonversi upah harian atau per jam ke dalam proyeksi pendapatan mingguan, bulanan, dan tahunan. Tujuannya adalah untuk memberikan estimasi cepat yang dapat membantu Anda dalam perencanaan keuangan.
                    </p>

                    <hr className="my-6 border-gray-200" />

                    <div className="space-y-8">
                        <div>
                            <h3 className="text-base font-bold text-gray-700 mb-3">Langkah-langkah Penggunaan</h3>
                            <div className="overflow-hidden border border-gray-200 rounded-xl">
                                <table className="min-w-full text-sm">
                                    <tbody className="bg-white">
                                        <tr className="border-b border-gray-200">
                                            <td className="px-3 py-3 font-bold text-purple-800 bg-purple-50 text-center w-12">1</td>
                                            <td className="px-4 py-3 font-medium text-gray-700 w-1/3">Isi Jumlah Upah</td>
                                            <td className="px-4 py-3 text-gray-600">Masukkan nominal upah di kolom yang tersedia.</td>
                                        </tr>
                                        <tr className="border-b border-gray-200">
                                            <td className="px-3 py-3 font-bold text-purple-800 bg-purple-50 text-center w-12">2</td>
                                            <td className="px-4 py-3 font-medium text-gray-700 w-1/3">Tentukan Jenis Upah</td>
                                            <td className="px-4 py-3 text-gray-600">Pilih antara "Harian" atau "Per Jam".</td>
                                        </tr>
                                        <tr className="border-b border-gray-200">
                                            <td className="px-3 py-3 font-bold text-purple-800 bg-purple-50 text-center w-12">3</td>
                                            <td className="px-4 py-3 font-medium text-gray-700 w-1/3">Catat Waktu Kerja</td>
                                            <td className="px-4 py-3 text-gray-600">Klik "Tambah Data Kerja" untuk memasukkan data jam/hari kerja.</td>
                                        </tr>
                                        <tr>
                                            <td className="px-3 py-3 font-bold text-purple-800 bg-purple-50 text-center w-12">4</td>
                                            <td className="px-4 py-3 font-medium text-gray-700 w-1/3">Lihat Hasil</td>
                                            <td className="px-4 py-3 text-gray-600">Proyeksi pendapatan akan langsung ditampilkan di panel hasil.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-base font-bold text-gray-700 mb-3">Asumsi Perhitungan</h3>
                            <div className="overflow-hidden border border-gray-200 rounded-xl">
                                <table className="min-w-full divide-y divide-gray-200 text-sm">
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        <tr>
                                            <td className="px-4 py-3 font-medium text-gray-700 bg-gray-50 w-1/3 md:w-1/4">Hari Kerja</td>
                                            <td className="px-4 py-3 text-gray-600"><strong>{ASSUMPTIONS.HOURS_PER_DAY}</strong> jam</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 font-medium text-gray-700 bg-gray-50 w-1/3 md:w-1/4">Minggu Kerja</td>
                                            <td className="px-4 py-3 text-gray-600"><strong>{ASSUMPTIONS.DAYS_PER_WEEK}</strong> hari</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 font-medium text-gray-700 bg-gray-50 w-1/3 md:w-1/4">Bulan Kerja</td>
                                            <td className="px-4 py-3 text-gray-600"><strong>{ASSUMPTIONS.DAYS_PER_MONTH}</strong> hari</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 font-medium text-gray-700 bg-gray-50 w-1/3 md:w-1/4">Tahun Kerja</td>
                                            <td className="px-4 py-3 text-gray-600"><strong>{ASSUMPTIONS.DAYS_PER_YEAR}</strong> hari</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-xs text-gray-500 mt-3 italic">
                                *Disclaimer: Angka asumsi ini bersifat umum. Harap sesuaikan dengan kontrak kerja atau kebijakan perusahaan Anda.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="mt-12 text-center text-xs text-gray-600 max-w-2xl mx-auto pb-8">
                    <p>Disclaimer: Kalkulator ini adalah alat simulasi. Angka aktual dapat berbeda tergantung kebijakan perusahaan.</p>
                </div>
            </div>
        </div>
    );
}
