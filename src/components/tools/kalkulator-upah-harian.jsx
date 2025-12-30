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

const InfoIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
            <label htmlFor="wageAmount" className="block text-base font-bold text-slate-700 mb-1">Jumlah Upah *</label>
            <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <span className="text-slate-500 text-base font-medium">Rp</span>
                </div>
                <input
                    id="wageAmount"
                    type="text"
                    inputMode="numeric"
                    value={displayValue}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-slate-900 font-medium text-base"
                />
            </div>
            <p className="text-xs text-slate-500 mt-1">Masukkan nominal upah yang Anda terima</p>
        </div>
    );
};

const WageTypeToggle = ({ value, onChange }) => (
    <div>
        <label className="block text-base font-bold text-slate-700 mb-2">Jenis Upah *</label>
        <div className="flex space-x-2">
            <button
                onClick={() => onChange('daily')}
                className={`flex-1 py-2.5 px-4 rounded-lg font-bold text-sm transition-all ${value === 'daily' ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
                Harian
            </button>
            <button
                onClick={() => onChange('hourly')}
                className={`flex-1 py-2.5 px-4 rounded-lg font-bold text-sm transition-all ${value === 'hourly' ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
                Per Jam
            </button>
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
        <div className="min-h-screen w-full bg-slate-50 font-sans text-slate-900 pb-20">
            {/* Header */}
            <div className="w-full bg-[#1E0137] pb-32 pt-12 px-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#28024B] to-[#5E0DC6] opacity-80"></div>
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
                <div className="relative max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 shadow-sm mb-6">
                        <CalculatorIcon />
                        <span className="text-xs font-medium text-white">HR Calculator Tool</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                        Kalkulator <span className="text-yellow-400">Upah Harian/Per Jam</span>
                    </h1>
                    <p className="text-purple-200 max-w-3xl mx-auto text-sm leading-relaxed">
                        Konversi perhitungan otomatis antara upah harian dan per jam, lengkap dengan proyeksi pendapatan mingguan, bulanan, dan tahunan.
                    </p>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 -mt-16 relative z-10 space-y-8">
                {/* Input & Results Grid */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Left: Input */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6">
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">Masukkan Data Upah</h2>
                            <div className="space-y-6">
                                <CurrencyInput value={wageAmount} onChange={setWageAmount} />
                                <WageTypeToggle value={wageType} onChange={setWageType} />
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6">
                            <h2 className="text-2xl font-bold text-slate-800 mb-1">Data Hari/Jam Kerja</h2>
                            <p className="text-sm text-slate-500 mb-4">Tambahkan data kerja untuk menghitung total pendapatan.</p>
                            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                {workData.map((value, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <div className="relative flex-grow">
                                            <input
                                                type="number"
                                                value={value}
                                                onChange={(e) => updateWorkEntry(index, e.target.value)}
                                                className="w-full pl-4 pr-14 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                                                placeholder={`Jumlah ${workUnitLabel}`}
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">{workUnitLabel}</span>
                                        </div>
                                        <button onClick={() => removeWorkEntry(index)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md">
                                            <TrashIcon />
                                        </button>
                                    </div>
                                ))}
                            </div>
                             <button onClick={addWorkEntry} className="w-full mt-4 bg-purple-100 text-purple-700 font-bold py-2.5 px-4 rounded-lg hover:bg-purple-200 transition-all flex items-center justify-center space-x-2">
                                <PlusIcon />
                                <span>Tambah Data Kerja</span>
                            </button>
                        </div>
                    </div>

                    {/* Right: Results */}
                     <div className="bg-white rounded-2xl shadow-2xl shadow-purple-900/10 border border-slate-100 p-6">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">Hasil Perhitungan</h2>
                        {wageAmount <= 0 || workData.length === 0 ? (
                            <div className="text-center py-10">
                                <p className="text-slate-500">Masukkan data upah untuk melihat hasil.</p>
                                {workData.length === 0 && <p className="text-slate-400 text-sm mt-1">Tambahkan minimal satu data kerja.</p>}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
                                    <p className="text-sm text-purple-800">
                                        Tarif upah Anda setara dengan <strong>{formatCurrency(wageType === 'daily' ? hourlyRate : dailyRate)}</strong> / {wageType === 'daily' ? 'jam' : 'hari'}.
                                    </p>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-4">
                                    <p className="text-sm text-slate-600">Total Upah Periode Ini ({totalWorkUnits} {workUnitLabel})</p>
                                    <p className="text-3xl font-extrabold text-slate-900">{formatCurrency(totalPay)}</p>
                                </div>
                                <div className="pt-4 border-t border-slate-100">
                                    <h3 className="font-bold text-slate-700 mb-2">Proyeksi Pendapatan</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between items-center p-2 rounded hover:bg-slate-50">
                                            <span className="text-slate-600">Mingguan</span>
                                            <span className="font-bold text-slate-800">{formatCurrency(weeklyProjection)}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-2 rounded hover:bg-slate-50">
                                            <span className="text-slate-600">Bulanan</span>
                                            <span className="font-bold text-slate-800">{formatCurrency(monthlyProjection)}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-2 rounded hover:bg-slate-50">
                                            <span className="text-slate-600">Tahunan</span>
                                            <span className="font-bold text-slate-800">{formatCurrency(annualProjection)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                                                                 {/* About Section */}

                                                                 <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 md:p-8">

                                                                     <h2 className="text-2xl font-bold text-slate-800 mb-3">Petunjuk dan Informasi Kalkulator</h2>

                                                                     <p className="text-sm text-slate-600 mb-6 text-justify">

                                                                         Kalkulator ini adalah alat bantu untuk mengonversi upah harian atau per jam ke dalam proyeksi pendapatan mingguan, bulanan, dan tahunan. Tujuannya adalah untuk memberikan estimasi cepat yang dapat membantu Anda dalam perencanaan keuangan.

                                                                     </p>

                                                                     

                                                                     <hr className="my-6 border-slate-200" />

                                                 

                                                                     <div className="space-y-8">

                                                                        <div>

                                                                            <h3 className="text-base font-bold text-slate-700 mb-3">Langkah-langkah Penggunaan</h3>

                                                                            <div className="overflow-hidden border border-slate-200 rounded-lg">

                                                                                <table className="min-w-full text-sm">

                                                                                    <tbody className="bg-white">

                                                                                        <tr className="border-b border-slate-200">

                                                                                            <td className="px-3 py-3 font-bold text-purple-800 bg-purple-50 text-center w-12">1</td>

                                                                                            <td className="px-4 py-3 font-medium text-slate-700 w-1/3">Isi Jumlah Upah</td>

                                                                                            <td className="px-4 py-3 text-slate-600">Masukkan nominal upah di kolom yang tersedia.</td>

                                                                                        </tr>

                                                                                        <tr className="border-b border-slate-200">

                                                                                            <td className="px-3 py-3 font-bold text-purple-800 bg-purple-50 text-center w-12">2</td>

                                                                                            <td className="px-4 py-3 font-medium text-slate-700 w-1/3">Tentukan Jenis Upah</td>

                                                                                            <td className="px-4 py-3 text-slate-600">Pilih antara "Harian" atau "Per Jam".</td>

                                                                                        </tr>

                                                                                        <tr className="border-b border-slate-200">

                                                                                            <td className="px-3 py-3 font-bold text-purple-800 bg-purple-50 text-center w-12">3</td>

                                                                                            <td className="px-4 py-3 font-medium text-slate-700 w-1/3">Catat Waktu Kerja</td>

                                                                                            <td className="px-4 py-3 text-slate-600">Klik "Tambah Data Kerja" untuk memasukkan data jam/hari kerja.</td>

                                                                                        </tr>

                                                                                        <tr>

                                                                                            <td className="px-3 py-3 font-bold text-purple-800 bg-purple-50 text-center w-12">4</td>

                                                                                            <td className="px-4 py-3 font-medium text-slate-700 w-1/3">Lihat Hasil</td>

                                                                                            <td className="px-4 py-3 text-slate-600">Proyeksi pendapatan akan langsung ditampilkan di panel hasil.</td>

                                                                                        </tr>

                                                                                    </tbody>

                                                                                </table>

                                                                            </div>

                                                                        </div>

                                                 

                                                                        <div>

                                                                            <h3 className="text-base font-bold text-slate-700 mb-3">Asumsi Perhitungan</h3>

                                                                            <div className="overflow-hidden border border-slate-200 rounded-lg">

                                                                                <table className="min-w-full divide-y divide-slate-200 text-sm">

                                                                                    <tbody className="divide-y divide-slate-200 bg-white">

                                                                                        <tr>

                                                                                            <td className="px-4 py-3 font-medium text-slate-700 bg-slate-50 w-1/3 md:w-1/4">Hari Kerja</td>

                                                                                            <td className="px-4 py-3 text-slate-600"><strong>{ASSUMPTIONS.HOURS_PER_DAY}</strong> jam</td>

                                                                                        </tr>

                                                                                        <tr>

                                                                                            <td className="px-4 py-3 font-medium text-slate-700 bg-slate-50 w-1/3 md:w-1/4">Minggu Kerja</td>

                                                                                            <td className="px-4 py-3 text-slate-600"><strong>{ASSUMPTIONS.DAYS_PER_WEEK}</strong> hari</td>

                                                                                        </tr>

                                                                                        <tr>

                                                                                            <td className="px-4 py-3 font-medium text-slate-700 bg-slate-50 w-1/3 md:w-1/4">Bulan Kerja</td>

                                                                                            <td className="px-4 py-3 text-slate-600"><strong>{ASSUMPTIONS.DAYS_PER_MONTH}</strong> hari</td>

                                                                                        </tr>

                                                                                        <tr>

                                                                                            <td className="px-4 py-3 font-medium text-slate-700 bg-slate-50 w-1/3 md:w-1/4">Tahun Kerja</td>

                                                                                            <td className="px-4 py-3 text-slate-600"><strong>{ASSUMPTIONS.DAYS_PER_YEAR}</strong> hari</td>

                                                                                        </tr>

                                                                                    </tbody>

                                                                                </table>

                                                                            </div>

                                                                            <p className="text-xs text-slate-500 mt-3 italic">

                                                                                *Disclaimer: Angka asumsi ini bersifat umum. Harap sesuaikan dengan kontrak kerja atau kebijakan perusahaan Anda.

                                                                            </p>

                                                                        </div>

                                                                    </div>

                                                                 </div>                 {/* CTA Banner */}
                <div className="p-8 md:p-10 bg-gradient-to-r from-purple-700 to-indigo-700 rounded-2xl shadow-2xl shadow-purple-900/50 flex flex-col md:flex-row items-center justify-between text-center md:text-left space-y-4 md:space-y-0 md:space-x-8">
                    <div>
                        <h2 className="text-xl font-bold text-white leading-snug">Kelola Payroll dengan KantorKu HRIS</h2>
                        <p className="text-sm text-purple-200 mt-1">Gunakan sistem KantorKu HRIS untuk mengelola perhitungan upah, gaji, dan payroll karyawan secara otomatis dan akurat.</p>
                    </div>
                    <div className="flex-shrink-0 flex space-x-3">
                        <a href="#" onClick={(e) => e.preventDefault()} className="px-4 py-2 text-sm font-semibold rounded-lg text-indigo-900 bg-white shadow-md hover:bg-purple-100 transition-colors duration-200">Coba Demo Gratis</a>
                        <a href="#" onClick={(e) => e.preventDefault()} className="px-4 py-2 text-sm font-semibold rounded-lg text-white bg-white/20 hover:bg-white/30 transition">Hubungi Sales</a>
                    </div>
                </div>
            </main>
        </div>
    );
}
