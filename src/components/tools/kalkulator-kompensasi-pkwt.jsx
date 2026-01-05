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
        document.documentElement.lang = 'id';

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

        return () => {};
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
        <div className="w-full min-h-screen bg-[#0f0e17]">
            <style>{`
                .input-field { transition: all 0.2s; }
                .input-field:focus { border-color: #7E22CE; box-shadow: 0 0 0 3px rgba(126, 34, 206, 0.1); }
                input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
                details > summary { list-style: none; }
                details > summary::-webkit-details-marker { display: none; }
                details[open] summary ~ * { animation: sweep .3s ease-in-out; }
                @keyframes sweep { 0% {opacity: 0; transform: translateY(-10px)} 100% {opacity: 1; transform: translateY(0)} }
            `}</style>

            <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-12">
                <div className="max-w-3xl mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-medium text-purple-200 mb-4">
                        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                        <span className="uppercase tracking-wide">Kantorku HRIS Tools</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">Kalkulator Perhitungan <span className="text-[#FACC15]">Kompensasi PKWT</span></h1>
                    <p className="text-purple-200/80 text-lg leading-relaxed">
                        Kalkulator ini memberikan estimasi terperinci berdasarkan masa kontrak kerja dan gaji terakhir, untuk membantu memahami hak kompensasi sesuai PP No. 35 Tahun 2021.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10">
                    <div className="lg:col-span-7 bg-white rounded-[2rem] p-6 md:p-8 shadow-2xl text-gray-900">
                        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">DATA KARYAWAN</h2>
                        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-500 uppercase mb-2">JENIS KONTRAK KERJA (PKWT)</label>
                                <div className="relative">
                                    <select value={contractType} onChange={(e) => setContractType(e.target.value)} className="input-field w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-base font-medium text-gray-700 appearance-none outline-none cursor-pointer focus:bg-white focus:border-purple-500">
                                        <option value="new">PKWT Baru (Pertama Kali)</option>
                                        <option value="extension">Perpanjangan PKWT</option>
                                    </select>
                                    <div className="absolute right-4 top-3.5 text-gray-400 pointer-events-none"><CaretDownIcon /></div>
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 items-start">
                                <InfoIcon />
                                <div>
                                    <p className="text-sm font-bold text-gray-800 mb-1">Dasar Hukum & Ketentuan:</p>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        Pasal 15 PP 35/2021: Pengusaha wajib memberikan uang kompensasi kepada pekerja PKWT pada saat berakhirnya jangka waktu perjanjian kerja. Besaran: (Masa Kerja / 12) x 1 Bulan Upah
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-500 uppercase mb-2">TANGGAL MULAI</label>
                                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input-field w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-base font-medium text-gray-700 outline-none focus:bg-white focus:border-purple-500" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-500 uppercase mb-2">TANGGAL BERAKHIR</label>
                                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input-field w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-base font-medium text-gray-700 outline-none focus:bg-white focus:border-purple-500" required />
                                </div>
                            </div>

                            <div className="border-t border-gray-100 my-2"></div>

                            <div>
                                <h3 className="text-sm font-bold text-purple-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <MoneyIcon /> KOMPONEN UPAH BULANAN
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-2">Gaji Pokok + Tunjangan Tetap</label>
                                        <div className="relative group">
                                            <span className="absolute left-4 top-3 text-gray-400 font-semibold group-focus-within:text-purple-600">Rp</span>
                                            <input type="text" inputMode="numeric" value={formatNumberDisplay(salary)} onChange={(e) => setSalary(parseFormattedNumber(e.target.value))} placeholder="0" className="input-field w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl text-xl font-bold text-gray-800 outline-none placeholder:text-gray-300 focus:bg-white focus:border-purple-500" required />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Tunjangan Lain (Opsional/Tidak Tetap)</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-3 text-gray-300 font-semibold">Rp</span>
                                            <input type="number" disabled placeholder="0" className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-xl font-bold text-gray-400 outline-none cursor-not-allowed" />
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1 italic">*Tidak masuk hitungan kompensasi</p>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className="lg:col-span-5 lg:sticky lg:top-8">
                        <div className="bg-[#1e1b4b] border border-white/5 rounded-[2rem] p-6 md:p-8 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>
                            
                            <div className="relative z-10">
                                <div className="mb-8">
                                    <p className="text-[10px] uppercase tracking-wider text-purple-200/80 font-bold mb-2">ESTIMASI MASA KERJA</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-extrabold text-white">{calculation.years} Tahun</span>
                                        <span className="text-4xl font-extrabold text-white/30 mx-2">|</span>
                                        <span className="text-4xl font-extrabold text-white">{calculation.months} Bulan</span>
                                    </div>
                                    <p className="text-sm text-purple-200/60 mt-1">Detail: {calculation.days} Hari berjalan (Total Durasi: {calculation.totalDays} Hari)</p>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                        <div className="flex justify-between items-end mb-1">
                                            <span className="text-[10px] uppercase tracking-wider text-purple-200/80 font-bold">Kompensasi PKWT</span>
                                            <span className="text-xl font-bold text-white">{formatRupiah(calculation.compensation)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm text-purple-300">
                                            <span>{calculation.totalMonthsDecimal.toFixed(2)} / 12 x Upah</span>
                                            <span>(Sesuai PP 35/2021)</span>
                                        </div>
                                    </div>
                                    
                                    <div className="border-t border-white/10"></div>
                                    
                                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                        <div className="flex justify-between items-end mb-1">
                                            <span className="text-[10px] uppercase tracking-wider text-purple-200/80 font-bold">Hak Lainnya</span>
                                            <span className="text-xl font-bold text-white/40">Rp 0</span>
                                        </div>
                                        <p className="text-xs text-purple-200/50">Uang Penggantian Hak (Cuti, dll) dihitung terpisah.</p>
                                    </div>
                                </div>

                                <div className="bg-white/10 border border-[#FACC15]/30 rounded-xl p-5 mb-4 shadow-[0_0_15px_rgba(250,204,21,0.1)]">
                                    <p className="text-[10px] uppercase tracking-wider text-purple-200 mb-1">TOTAL ESTIMASI DITERIMA</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-purple-200/60">Gross (Sebelum Pajak)</span>
                                        <span className="text-3xl md:text-4xl font-extrabold text-[#FACC15]">{formatRupiah(calculation.compensation)}</span>
                                    </div>
                                </div>

                                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                                    <p className="text-xs text-purple-200/70 leading-relaxed">
                                        <strong className="text-purple-200">Disclaimer:</strong> Hasil perhitungan ini merupakan estimasi berdasarkan aturan normatif PP No. 35 Tahun 2021. Nilai akhir dapat berbeda tergantung pada perjanjian kerja bersama (PKB), peraturan perusahaan, dan kebijakan perpajakan yang berlaku di masing-masing perusahaan.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="my-12">
                    <div className="bg-[#1e1b4b] border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
                        <div className="flex-1 space-y-3">
                            <h3 className="text-lg font-bold text-white mb-2">
                                Hitung kompensasi PKWT kini lebih rapi dan pasti
                            </h3>
                            <p className="text-base text-purple-200/80 leading-relaxed mb-4">
                                Akurasi terjaga setiap langkah berjalan, memudahkan HR menyelesaikan pekerjaan dengan nyaman dan menyeluruh.
                            </p>
                            <a
                                href="https://kantorku.id/daftar/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center bg-[#FACC15] hover:bg-yellow-400 text-gray-900 font-semibold text-base px-5 py-3 rounded-xl transition-all shadow-md hover:shadow-lg"
                            >
                                Coba KantorKu Gratis!
                            </a>
                        </div>
                        <div className="shrink-0 self-center">
                            <img
                                src="/asset-fitur-kantorku.png"
                                alt="Icon HRIS KantorKu"
                                className="w-40 h-40 object-contain"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700">
                                <GavelIcon />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Ringkasan Aturan Kompensasi PKWT</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <CheckCircleIcon />
                                <div>
                                    <h3 className="text-base font-bold text-gray-800">Syarat Penerima</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed mt-1">Diberikan kepada pekerja PKWT yang telah memiliki masa kerja minimal 1 bulan secara terus menerus.</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <CheckCircleIcon />
                                <div>
                                    <h3 className="text-base font-bold text-gray-800">Waktu Pemberian</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed mt-1">Dibayarkan pada saat berakhirnya jangka waktu PKWT sebelum perpanjangan, dan setelah selesai perpanjangan.</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <CheckCircleIcon />
                                <div>
                                    <h3 className="text-base font-bold text-gray-800">Rumus Perhitungan</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed mt-1 bg-gray-50 p-2 rounded border border-gray-100 inline-block">
                                        (Masa Kerja / 12) x 1 Bulan Upah
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                                <QuestionIcon />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Frequently Asked Question</h2>
                        </div>

                        <div className="space-y-3">
                            <details className="group border border-gray-200 rounded-xl p-2 transition-all open:bg-gray-50">
                                <summary className="flex justify-between items-center font-bold text-base text-gray-800 cursor-pointer p-2">
                                    <h3>Apakah kompensasi kena pajak?</h3>
                                    <CaretDownIcon />
                                </summary>
                                <div className="text-sm text-gray-600 leading-relaxed px-2 pb-2 mt-1 border-t border-gray-100 pt-2 group-open:border-gray-200">
                                    Ya, uang kompensasi PKWT merupakan objek pajak penghasilan (PPh 21). Perusahaan biasanya akan memotong pajak dari jumlah bruto yang diterima.
                                </div>
                            </details>

                            <details className="group border border-gray-200 rounded-xl p-2 transition-all open:bg-gray-50">
                                <summary className="flex justify-between items-center font-bold text-base text-gray-800 cursor-pointer p-2">
                                    <h3>Bagaimana jika kontrak diperpanjang?</h3>
                                    <CaretDownIcon />
                                </summary>
                                <div className="text-sm text-gray-600 leading-relaxed px-2 pb-2 mt-1 border-t border-gray-100 pt-2 group-open:border-gray-200">
                                    Pengusaha wajib membayar kompensasi untuk kontrak pertama terlebih dahulu sebelum perpanjangan dimulai. Setelah masa perpanjangan selesai, kompensasi dibayarkan lagi untuk periode tersebut.
                                </div>
                            </details>

                            <details className="group border border-gray-200 rounded-xl p-2 transition-all open:bg-gray-50">
                                <summary className="flex justify-between items-center font-bold text-base text-gray-800 cursor-pointer p-2">
                                    <h3>Apakah jika resign dapat kompensasi?</h3>
                                    <CaretDownIcon />
                                </summary>
                                <div className="text-sm text-gray-600 leading-relaxed px-2 pb-2 mt-1 border-t border-gray-100 pt-2 group-open:border-gray-200">
                                    Ya. Jika salah satu pihak mengakhiri hubungan kerja sebelum kontrak berakhir, pengusaha tetap wajib memberikan kompensasi sesuai jangka waktu PKWT yang telah dijalankan (Pasal 17 PP 35/2021).
                                </div>
                            </details>

                            <details className="group border border-gray-200 rounded-xl p-2 transition-all open:bg-gray-50">
                                <summary className="flex justify-between items-center font-bold text-base text-gray-800 cursor-pointer p-2">
                                    <h3>Apakah kontrak di bawah 1 bulan dapat kompensasi?</h3>
                                    <CaretDownIcon />
                                </summary>
                                <div className="text-sm text-gray-600 leading-relaxed px-2 pb-2 mt-1 border-t border-gray-100 pt-2 group-open:border-gray-200">
                                    Tidak. Kompensasi PKWT hanya wajib dibayarkan jika masa kerja minimal 1 bulan penuh.
                                </div>
                            </details>

                            <details className="group border border-gray-200 rounded-xl p-2 transition-all open:bg-gray-50">
                                <summary className="flex justify-between items-center font-bold text-base text-gray-800 cursor-pointer p-2">
                                    <h3>Apa yang terjadi jika kontrak diperbarui lebih dari 1 kali?</h3>
                                    <CaretDownIcon />
                                </summary>
                                <div className="text-sm text-gray-600 leading-relaxed px-2 pb-2 mt-1 border-t border-gray-100 pt-2 group-open:border-gray-200">
                                    Setiap masa kontrak yang berakhir wajib dibayarkan kompensasinya terlebih dahulu. Perusahaan tidak boleh menggabungkan kompensasi beberapa periode menjadi satu.
                                </div>
                            </details>

                            <details className="group border border-gray-200 rounded-xl p-2 transition-all open:bg-gray-50">
                                <summary className="flex justify-between items-center font-bold text-base text-gray-800 cursor-pointer p-2">
                                    <h3>Jika perusahaan memutus kontrak sepihak, apakah kompensasi berubah?</h3>
                                    <CaretDownIcon />
                                </summary>
                                <div className="text-sm text-gray-600 leading-relaxed px-2 pb-2 mt-1 border-t border-gray-100 pt-2 group-open:border-gray-200">
                                    Tidak. Rumus kompensasi tetap sama yaitu 1 bulan upah × (masa kerja/12), tanpa tambahan penalti kecuali diatur dalam perjanjian.
                                </div>
                            </details>

                            <details className="group border border-gray-200 rounded-xl p-2 transition-all open:bg-gray-50">
                                <summary className="flex justify-between items-center font-bold text-base text-gray-800 cursor-pointer p-2">
                                    <h3>Komponen upah apa saja yang digunakan untuk menghitung kompensasi?</h3>
                                    <CaretDownIcon />
                                </summary>
                                <div className="text-sm text-gray-600 leading-relaxed px-2 pb-2 mt-1 border-t border-gray-100 pt-2 group-open:border-gray-200">
                                    Upah terakhir yang dipakai meliputi gaji pokok + tunjangan tetap. Tunjangan tidak tetap tidak termasuk perhitungan.
                                </div>
                            </details>

                            <details className="group border border-gray-200 rounded-xl p-2 transition-all open:bg-gray-50">
                                <summary className="flex justify-between items-center font-bold text-base text-gray-800 cursor-pointer p-2">
                                    <h3>Apakah pekerja paruh waktu (part-time) dapat kompensasi?</h3>
                                    <CaretDownIcon />
                                </summary>
                                <div className="text-sm text-gray-600 leading-relaxed px-2 pb-2 mt-1 border-t border-gray-100 pt-2 group-open:border-gray-200">
                                    Tidak. Kompensasi PKWT hanya berlaku untuk pekerja yang terikat perjanjian kerja PKWT penuh, bukan paruh waktu atau freelance.
                                </div>
                            </details>

                            <details className="group border border-gray-200 rounded-xl p-2 transition-all open:bg-gray-50">
                                <summary className="flex justify-between items-center font-bold text-base text-gray-800 cursor-pointer p-2">
                                    <h3>Bagaimana jika gaji berubah di tengah kontrak?</h3>
                                    <CaretDownIcon />
                                </summary>
                                <div className="text-sm text-gray-600 leading-relaxed px-2 pb-2 mt-1 border-t border-gray-100 pt-2 group-open:border-gray-200">
                                    Upah yang digunakan adalah upah terakhir saat kontrak berakhir. Jika terjadi kenaikan gaji, kompensasi tetap mengikuti gaji terbaru.
                                </div>
                            </details>

                            <details className="group border border-gray-200 rounded-xl p-2 transition-all open:bg-gray-50">
                                <summary className="flex justify-between items-center font-bold text-base text-gray-800 cursor-pointer p-2">
                                    <h3>Apakah kompensasi PKWT boleh dibayarkan sebelum kontrak selesai?</h3>
                                    <CaretDownIcon />
                                </summary>
                                <div className="text-sm text-gray-600 leading-relaxed px-2 pb-2 mt-1 border-t border-gray-100 pt-2 group-open:border-gray-200">
                                    Tidak boleh. Kompensasi wajib diberikan setelah masa kontrak berakhir atau sebelum perpanjangan dimulai, bukan di tengah masa kontrak.
                                </div>
                            </details>
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center max-w-3xl mx-auto px-6 border-t border-white/10 pt-8">
                    <p className="text-sm text-purple-200/50 mt-2">© 2025 HR Tools Indonesia. Seluruh perhitungan dilakukan di sisi pengguna (Client-side).</p>
                </div>
            </div>
        </div>
    );
}
