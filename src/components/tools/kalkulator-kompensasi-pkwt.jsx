import React, { useState, useMemo } from "react";

const CaretDownIcon = () => (
    <svg className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" fill="currentColor" viewBox="0 0 256 256"><path d="M215.39,92.91l-80,72a12,12,0,0,1-14.78,0l-80-72a12,12,0,1,1,14.78-17.82L128,143.31l72.61-65.22a12,12,0,1,1,14.78,17.82Z"></path></svg>
);

const InfoIcon = () => (
    <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm-8,56a16,16,0,1,1,16,16A16,16,0,0,1,120,80Zm40,88H112a8,8,0,0,1,0-16h24v-40H112a8,8,0,0,1,0-16h48a8,8,0,0,1,0,16v56A8,8,0,0,1,160,168Z"></path></svg>
);

const MoneyIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 256 256"><path d="M240,128a11.84,11.84,0,0,0-10.34-11.8,112.26,112.26,0,0,0-219.32,0A11.84,11.84,0,0,0,0,128a12,12,0,0,0,12,12H24A112.12,112.12,0,0,0,128,240a112.12,112.12,0,0,0,104-99.95h12a12,12,0,0,0,12-12Zm-12,0H216.05A112.12,112.12,0,0,0,128,40a112.12,112.12,0,0,0-88.05,39.95H24V128a88.1,88.1,0,0,1,88-88,88.1,88.1,0,0,1,88,88v12Zm-96,80a88.1,88.1,0,0,1-88-88v-1.95A112.12,112.12,0,0,0,40,216.05V228H128a112.12,112.12,0,0,0,88.05-39.95H140a12,12,0,0,0-12,12Zm-4-60a36,36,0,1,1,36-36A36,36,0,0,1,128,148Zm0-48a12,12,0,1,0,12,12A12,12,0,0,0,128,100Z"></path></svg>
);

const GavelIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 256 256"><path d="M247.4,131.86,156.45,40.91a20,20,0,0,0-28.29,0L40.91,128.16a20,20,0,0,0,0,28.29L128.16,243.7a20,20,0,0,0,28.29,0l90.95-90.95a20,20,0,0,0,0-28.29ZM149.31,232.56,62.06,145.31l20-20,87.25,87.25Zm0-115.51L168,98.34l-20,20-18.69-18.7,20-20,18.69,18.7,11.31-11.31-18.69-18.7a20,20,0,0,0-28.29,0l-20,20-11.31-11.31,20-20a44,44,0,0,1,62.23,0l18.68,18.7-11.31,11.31-18.69-18.7-20,20,18.69,18.7,20-20,18.68,18.7-11.31,11.31-18.69-18.7-18.69,18.7,11.31,11.31,18.69-18.7,20,20L192,142.34l-42.69-42.68ZM53.22,136.69,32.69,116.16,84.16,64.69l20.53,20.53ZM145.31,53.22l20.53,20.53-51.47,51.47-20.53-20.53ZM215.31,148,192,171.31l-23.31-23.3,23.3-23.31Z"></path></svg>
);

const CheckCircleIcon = () => (
    <svg className="w-5 h-5 text-emerald-500 mt-1 shrink-0" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z"></path></svg>
);

const QuestionIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm8-44a12,12,0,1,1-12-12A12,12,0,0,1,136,172Zm-8-100a28,28,0,0,0-28,28,12,12,0,0,0,24,0,4,4,0,0,1,4-4,4.12,4.12,0,0,1,2.83,1.17,12,12,0,0,0,17,17A28,28,0,0,0,128,72Z"></path></svg>
);


export default function KalkulatorKompensasiPkwt() {
    const [contractType, setContractType] = useState('new'); // eslint-disable-line no-unused-vars
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [salary, setSalary] = useState(0);

    const formatRupiah = (num) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0
        }).format(num || 0);
    };

    const formatNumberDisplay = (num) => {
        if (num === null || num === undefined) return '';
        return new Intl.NumberFormat('id-ID').format(num);
    };

    const parseFormattedNumber = (str) => {
        const cleaned = String(str).replace(/\D/g, '');
        const number = parseInt(cleaned, 10);
        return isNaN(number) ? 0 : number;
    };

    React.useEffect(() => {
        // 0. Set HTML lang attribute
        document.documentElement.lang = 'id';

        // 1. Canonical Tag
        const canonicalUrl = "https://kantorku.id/tools/kalkulator-kompensasi-pkwt";
        let canonicalLink = document.querySelector("link[rel='canonical']");

        if (canonicalLink) {
            canonicalLink.setAttribute("href", canonicalUrl);
        } else {
            canonicalLink = document.createElement("link");
            canonicalLink.setAttribute("rel", "canonical");
            canonicalLink.setAttribute("href", canonicalUrl);
            document.head.appendChild(canonicalLink);
        }

        // 2. Robots Tag
        const robotsContent = "index, follow";
        let robotsMeta = document.querySelector("meta[name='robots']");

        if (robotsMeta) {
            robotsMeta.setAttribute("content", robotsContent);
        } else {
            robotsMeta = document.createElement("meta");
            robotsMeta.setAttribute("name", "robots");
            robotsMeta.setAttribute("content", robotsContent);
            document.head.appendChild(robotsMeta);
        }

        return () => {
            // Opsional: Hapus tag saat komponen di-unmount jika berada dalam SPA
        };
    }, []);

    const calculation = useMemo(() => {
        if (!startDate || !endDate) {
            return { years: 0, months: 0, days: 0, totalDays: 0, compensation: 0, totalMonthsDecimal: 0 };
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (end <= start) {
            return { years: 0, months: 0, days: 0, totalDays: 0, compensation: 0, totalMonthsDecimal: 0 };
        }

        let years = end.getFullYear() - start.getFullYear();
        let months = end.getMonth() - start.getMonth();
        let days = end.getDate() - start.getDate();

        if (days < 0) {
            months--;
            let prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
            days += prevMonth.getDate();
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        const daysInMonth = new Date(end.getFullYear(), end.getMonth() + 1, 0).getDate();
        const totalMonthsDecimal = (years * 12) + months + (days / daysInMonth);
        
        const numericSalary = salary || 0;
        const compensation = (totalMonthsDecimal / 12) * numericSalary;

        const diffTime = Math.abs(end - start);
        const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return { years, months, days, totalDays, compensation, totalMonthsDecimal };
    }, [startDate, endDate, salary]);


    return (
        <div className="text-slate-800 font-sans">
            {/* Styles */}
            <style>{`
                .input-field { transition: all 0.2s; }
                .input-field:focus { border-color: #7E22CE; box-shadow: 0 0 0 3px rgba(126, 34, 206, 0.1); }
                input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
                details > summary { list-style: none; }
                details > summary::-webkit-details-marker { display: none; }
                details[open] summary ~ * { animation: sweep .3s ease-in-out; }
                @keyframes sweep { 0% {opacity: 0; transform: translateY(-10px)} 100% {opacity: 1; transform: translateY(0)} }
            `}</style>

            {/* 1. HEADER SECTION */}
            <div className="bg-header text-white pb-32 pt-10 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #2E0259 0%, #4C0590 100%)' }}>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full max-w-4xl bg-purple-500 opacity-20 blur-[100px] pointer-events-none"></div>
                <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-1.5 rounded-full backdrop-blur-sm mb-6">
                        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                        <span className="text-sm font-semibold tracking-wide uppercase">Kantorku.id Tool</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-3">Kalkulator Perhitungan Kompensasi PKWT</h1>
                    <p className="text-purple-200 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
                        Kalkulator ini memberikan estimasi terperinci berdasarkan masa kontrak kerja dan gaji terakhir, untuk membantu memahami hak kompensasi sesuai PP No. 35 Tahun 2021.
                    </p>
                </div>
            </div>

            {/* 2. MAIN CONTENT WRAPPER */}
            <main className="-mt-20 max-w-6xl mx-auto px-4 md:px-6 pb-20 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-10">
                    {/* LEFT CARD: INPUT FORM */}
                    <div className="lg:col-span-7 bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
                        <div className="p-6 md:p-8">
                            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6">DATA KARYAWAN</h2>
                            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-500 uppercase mb-2">JENIS KONTRAK KERJA (PKWT)</label>
                                    <div className="relative">
                                        <select value={contractType} onChange={(e) => setContractType(e.target.value)} className="input-field w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-base font-medium text-slate-700 appearance-none outline-none cursor-pointer">
                                            <option value="new">PKWT Baru (Pertama Kali)</option>
                                            <option value="extension">Perpanjangan PKWT</option>
                                        </select>
                                        <div className="absolute right-4 top-3.5 text-slate-400 pointer-events-none"><CaretDownIcon /></div>
                                    </div>
                                </div>

                                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 items-start">
                                    <InfoIcon />
                                    <div>
                                        <p className="text-sm font-bold text-slate-800 mb-1">Dasar Hukum & Ketentuan:</p>
                                        <p className="text-sm text-slate-600 leading-relaxed">
                                            Pasal 15 PP 35/2021: Pengusaha wajib memberikan uang kompensasi kepada pekerja PKWT pada saat berakhirnya jangka waktu perjanjian kerja. Besaran: (Masa Kerja / 12) x 1 Bulan Upah
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-500 uppercase mb-2">TANGGAL MULAI</label>
                                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input-field w-full px-4 py-3 border border-slate-200 rounded-lg text-base font-medium text-slate-700 outline-none" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-500 uppercase mb-2">TANGGAL BERAKHIR</label>
                                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input-field w-full px-4 py-3 border border-slate-200 rounded-lg text-base font-medium text-slate-700 outline-none" required />
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 my-2"></div>

                                <div>
                                    <h3 className="text-sm font-bold text-purple-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <MoneyIcon /> KOMPONEN UPAH BULANAN
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-500 mb-2">Gaji Pokok + Tunjangan Tetap</label>
                                            <div className="relative group">
                                                <span className="absolute left-4 top-3 text-slate-400 font-semibold group-focus-within:text-purple-600">Rp</span>
                                                <input type="text" inputMode="numeric" value={formatNumberDisplay(salary)} onChange={(e) => setSalary(parseFormattedNumber(e.target.value))} placeholder="0" className="input-field w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg text-xl font-bold text-slate-800 outline-none placeholder:text-slate-300" required />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-2">Tunjangan Lain (Opsional/Tidak Tetap)</label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-3 text-slate-300 font-semibold">Rp</span>
                                                <input type="number" disabled placeholder="0" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-lg text-xl font-bold text-slate-400 outline-none cursor-not-allowed" />
                                            </div>
                                            <p className="text-xs text-slate-400 mt-1 italic">*Tidak masuk hitungan kompensasi</p>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* RIGHT CARD: RESULT */}
                    <div className="lg:col-span-5 bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 relative flex flex-col h-full min-h-[400px]">
                        <div className="h-2 bg-gradient-to-r from-purple-600 to-indigo-600 w-full"></div>
                        <div className="p-6 md:p-8 flex flex-col h-full">
                            <div className="mb-8">
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">ESTIMASI MASA KERJA</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-extrabold text-slate-900">{calculation.years} Tahun</span>
                                    <span className="text-4xl font-extrabold text-slate-300 mx-2">|</span>
                                    <span className="text-4xl font-extrabold text-slate-900">{calculation.months} Bulan</span>
                                </div>
                                <p className="text-sm text-slate-400 mt-1">Detail: {calculation.days} Hari berjalan (Total Durasi: {calculation.totalDays} Hari)</p>
                            </div>

                            <div className="space-y-6 mb-8 flex-grow">
                                <div>
                                    <div className="flex justify-between items-end mb-1">
                                        <span className="text-base font-bold text-slate-700">Kompensasi PKWT</span>
                                        <span className="text-xl font-bold text-slate-900">{formatRupiah(calculation.compensation)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm text-purple-600">
                                        <span>{calculation.totalMonthsDecimal.toFixed(2)} / 12 x Upah</span>
                                        <span>(Sesuai PP 35/2021)</span>
                                    </div>
                                </div>
                                <div className="border-t border-slate-100"></div>
                                <div>
                                    <div className="flex justify-between items-end mb-1">
                                        <span className="text-base font-medium text-slate-500">Hak Lainnya</span>
                                        <span className="text-xl font-bold text-slate-400">Rp 0</span>
                                    </div>
                                    <p className="text-xs text-slate-400">Uang Penggantian Hak (Cuti, dll) dihitung terpisah.</p>
                                </div>
                            </div>

                            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 mt-auto mb-4">
                                <p className="text-sm font-bold text-slate-500 uppercase mb-1">TOTAL ESTIMASI DITERIMA</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-400">Gross (Sebelum Pajak)</span>
                                    <span className="text-3xl md:text-4xl font-extrabold text-purple-700">{formatRupiah(calculation.compensation)}</span>
                                </div>
                            </div>

                            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    <strong>Disclaimer:</strong> Hasil perhitungan ini merupakan estimasi berdasarkan aturan normatif PP No. 35 Tahun 2021. Nilai akhir dapat berbeda tergantung pada perjanjian kerja bersama (PKB), peraturan perusahaan, dan kebijakan perpajakan yang berlaku di masing-masing perusahaan.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. BOTTOM SECTION: INFO & FAQ */}
                <div className="grid grid-cols-1 gap-6">
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700">
                                <GavelIcon />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">Ringkasan Aturan Kompensasi PKWT</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <CheckCircleIcon />
                                <div>
                                    <h3 className="text-base font-bold text-slate-800">Syarat Penerima</h3>
                                    <p className="text-sm text-slate-600 leading-relaxed mt-1">Diberikan kepada pekerja PKWT yang telah memiliki masa kerja minimal 1 bulan secara terus menerus.</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <CheckCircleIcon />
                                <div>
                                    <h3 className="text-base font-bold text-slate-800">Waktu Pemberian</h3>
                                    <p className="text-sm text-slate-600 leading-relaxed mt-1">Dibayarkan pada saat berakhirnya jangka waktu PKWT sebelum perpanjangan, dan setelah selesai perpanjangan.</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <CheckCircleIcon />
                                <div>
                                    <h3 className="text-base font-bold text-slate-800">Rumus Perhitungan</h3>
                                    <p className="text-sm text-slate-600 leading-relaxed mt-1 bg-slate-50 p-2 rounded border border-slate-100 inline-block">
                                        (Masa Kerja / 12) x 1 Bulan Upah
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 md:p-8">
    <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
            <QuestionIcon />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Frequently Asked Question</h2>
    </div>

    <div className="space-y-3">

        {/* 1 */}
        <details className="group border border-slate-200 rounded-xl p-2 transition-all open:bg-slate-50">
            <summary className="flex justify-between items-center font-bold text-base text-slate-800 cursor-pointer p-2">
                <h3>Apakah kompensasi kena pajak?</h3>
                <CaretDownIcon />
            </summary>
            <div className="text-sm text-slate-600 leading-relaxed px-2 pb-2 mt-1 border-t border-slate-100 pt-2 group-open:border-slate-200">
                Ya, uang kompensasi PKWT merupakan objek pajak penghasilan (PPh 21). Perusahaan biasanya akan memotong pajak dari jumlah bruto yang diterima.
            </div>
        </details>

        {/* 2 */}
        <details className="group border border-slate-200 rounded-xl p-2 transition-all open:bg-slate-50">
            <summary className="flex justify-between items-center font-bold text-base text-slate-800 cursor-pointer p-2">
                <h3>Bagaimana jika kontrak diperpanjang?</h3>
                <CaretDownIcon />
            </summary>
            <div className="text-sm text-slate-600 leading-relaxed px-2 pb-2 mt-1 border-t border-slate-100 pt-2 group-open:border-slate-200">
                Pengusaha wajib membayar kompensasi untuk kontrak pertama terlebih dahulu sebelum perpanjangan dimulai. Setelah masa perpanjangan selesai, kompensasi dibayarkan lagi untuk periode tersebut.
            </div>
        </details>

        {/* 3 */}
        <details className="group border border-slate-200 rounded-xl p-2 transition-all open:bg-slate-50">
            <summary className="flex justify-between items-center font-bold text-base text-slate-800 cursor-pointer p-2">
                <h3>Apakah jika resign dapat kompensasi?</h3>
                <CaretDownIcon />
            </summary>
            <div className="text-sm text-slate-600 leading-relaxed px-2 pb-2 mt-1 border-t border-slate-100 pt-2 group-open:border-slate-200">
                Ya. Jika salah satu pihak mengakhiri hubungan kerja sebelum kontrak berakhir, pengusaha tetap wajib memberikan kompensasi sesuai jangka waktu PKWT yang telah dijalankan (Pasal 17 PP 35/2021).
            </div>
        </details>

        {/* 4 */}
        <details className="group border border-slate-200 rounded-xl p-2 transition-all open:bg-slate-50">
            <summary className="flex justify-between items-center font-bold text-base text-slate-800 cursor-pointer p-2">
                <h3>Apakah kontrak di bawah 1 bulan dapat kompensasi?</h3>
                <CaretDownIcon />
            </summary>
            <div className="text-sm text-slate-600 leading-relaxed px-2 pb-2 mt-1 border-t border-slate-100 pt-2 group-open:border-slate-200">
                Tidak. Kompensasi PKWT hanya wajib dibayarkan jika masa kerja minimal 1 bulan penuh.
            </div>
        </details>

        {/* 5 */}
        <details className="group border border-slate-200 rounded-xl p-2 transition-all open:bg-slate-50">
            <summary className="flex justify-between items-center font-bold text-base text-slate-800 cursor-pointer p-2">
                <h3>Apa yang terjadi jika kontrak diperbarui lebih dari 1 kali?</h3>
                <CaretDownIcon />
            </summary>
            <div className="text-sm text-slate-600 leading-relaxed px-2 pb-2 mt-1 border-t border-slate-100 pt-2 group-open:border-slate-200">
                Setiap masa kontrak yang berakhir wajib dibayarkan kompensasinya terlebih dahulu. Perusahaan tidak boleh menggabungkan kompensasi beberapa periode menjadi satu.
            </div>
        </details>

        {/* 6 */}
        <details className="group border border-slate-200 rounded-xl p-2 transition-all open:bg-slate-50">
            <summary className="flex justify-between items-center font-bold text-base text-slate-800 cursor-pointer p-2">
                <h3>Jika perusahaan memutus kontrak sepihak, apakah kompensasi berubah?</h3>
                <CaretDownIcon />
            </summary>
            <div className="text-sm text-slate-600 leading-relaxed px-2 pb-2 mt-1 border-t border-slate-100 pt-2 group-open:border-slate-200">
                Tidak. Rumus kompensasi tetap sama yaitu 1 bulan upah × (masa kerja/12), tanpa tambahan penalti kecuali diatur dalam perjanjian.
            </div>
        </details>

        {/* 7 */}
        <details className="group border border-slate-200 rounded-xl p-2 transition-all open:bg-slate-50">
            <summary className="flex justify-between items-center font-bold text-base text-slate-800 cursor-pointer p-2">
                <h3>Komponen upah apa saja yang digunakan untuk menghitung kompensasi?</h3>
                <CaretDownIcon />
            </summary>
            <div className="text-sm text-slate-600 leading-relaxed px-2 pb-2 mt-1 border-t border-slate-100 pt-2 group-open:border-slate-200">
                Upah terakhir yang dipakai meliputi gaji pokok + tunjangan tetap. Tunjangan tidak tetap tidak termasuk perhitungan.
            </div>
        </details>

        {/* 8 */}
        <details className="group border border-slate-200 rounded-xl p-2 transition-all open:bg-slate-50">
            <summary className="flex justify-between items-center font-bold text-base text-slate-800 cursor-pointer p-2">
                <h3>Apakah pekerja paruh waktu (part-time) dapat kompensasi?</h3>
                <CaretDownIcon />
            </summary>
            <div className="text-sm text-slate-600 leading-relaxed px-2 pb-2 mt-1 border-t border-slate-100 pt-2 group-open:border-slate-200">
                Tidak. Kompensasi PKWT hanya berlaku untuk pekerja yang terikat perjanjian kerja PKWT penuh, bukan paruh waktu atau freelance.
            </div>
        </details>

        {/* 9 */}
        <details className="group border border-slate-200 rounded-xl p-2 transition-all open:bg-slate-50">
            <summary className="flex justify-between items-center font-bold text-base text-slate-800 cursor-pointer p-2">
                <h3>Bagaimana jika gaji berubah di tengah kontrak?</h3>
                <CaretDownIcon />
            </summary>
            <div className="text-sm text-slate-600 leading-relaxed px-2 pb-2 mt-1 border-t border-slate-100 pt-2 group-open:border-slate-200">
                Upah yang digunakan adalah upah terakhir saat kontrak berakhir. Jika terjadi kenaikan gaji, kompensasi tetap mengikuti gaji terbaru.
            </div>
        </details>

        {/* 10 */}
        <details className="group border border-slate-200 rounded-xl p-2 transition-all open:bg-slate-50">
            <summary className="flex justify-between items-center font-bold text-base text-slate-800 cursor-pointer p-2">
                <h3>Apakah kompensasi PKWT boleh dibayarkan sebelum kontrak selesai?</h3>
                <CaretDownIcon />
            </summary>
            <div className="text-sm text-slate-600 leading-relaxed px-2 pb-2 mt-1 border-t border-slate-100 pt-2 group-open:border-slate-200">
                Tidak boleh. Kompensasi wajib diberikan setelah masa kontrak berakhir atau sebelum perpanjangan dimulai, bukan di tengah masa kontrak.
            </div>
        </details>

    </div>
</div>
                </div>

                <div className="mt-12 text-center max-w-3xl mx-auto px-6 border-t border-slate-200 pt-8">
                    <p className="text-sm text-slate-400 mt-2">© 2025 HR Tools Indonesia. Seluruh perhitungan dilakukan di sisi pengguna (Client-side).</p>
                </div>
            </main>
        </div>
    );
}