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
    const [contractType, setContractType] = useState('new');
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

        return () => { };
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
                        <span>KANTORKU HRIS TOOLS</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">Kalkulator Perhitungan <span className="text-[#FACC15]">Kompensasi PKWT</span></h1>
                    <p className="text-purple-200/80 text-lg leading-relaxed">
                        Kalkulator ini memberikan estimasi terperinci berdasarkan masa kontrak kerja dan gaji terakhir, untuk membantu memahami hak kompensasi sesuai PP No. 35 Tahun 2021.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10">
                    <div className="lg:col-span-7 bg-white rounded-[2rem] p-6 md:p-8 shadow-2xl text-gray-900">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            Data Karyawan
                        </h2>
                        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">Jenis Kontrak Kerja (PKWT)</label>
                                <div className="relative">
                                    <select value={contractType} onChange={(e) => setContractType(e.target.value)} className="w-full px-4 py-3.5 bg-gray-50 border border-transparent rounded-xl text-base font-bold text-gray-900 appearance-none outline-none cursor-pointer focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all">
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
                                    <label className="block text-sm font-semibold text-gray-800 mb-2">Tanggal Mulai</label>
                                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-4 py-3.5 bg-gray-50 border border-transparent rounded-xl text-base font-bold text-gray-900 outline-none focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-2">Tanggal Berakhir</label>
                                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-4 py-3.5 bg-gray-50 border border-transparent rounded-xl text-base font-bold text-gray-900 outline-none focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all" required />
                                </div>
                            </div>

                            <div className="border-t border-gray-100 my-2"></div>

                            <div>
                                <h3 className="text-sm font-bold text-purple-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <MoneyIcon /> Komponen Upah Bulanan
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-800 mb-2">Gaji Pokok + Tunjangan Tetap</label>
                                        <div className="relative group">
                                            <span className="absolute left-4 top-3.5 text-gray-500 font-bold group-focus-within:text-purple-600">Rp</span>
                                            <input type="text" inputMode="numeric" value={formatNumberDisplay(salary)} onChange={(e) => setSalary(parseFormattedNumber(e.target.value))} placeholder="0" className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-xl text-xl font-bold text-gray-900 outline-none placeholder:text-gray-300 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all" required />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-400 mb-2">Tunjangan Lain (Opsional)</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-3.5 text-gray-300 font-bold">Rp</span>
                                            <input type="number" disabled placeholder="0" className="w-full pl-10 pr-4 py-3.5 bg-gray-100 border border-gray-200 rounded-xl text-xl font-bold text-gray-400 outline-none cursor-not-allowed" />
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
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-40 h-40 text-purple-500 opacity-20" fill="currentColor" viewBox="0 0 256 256"><path d="M224,115.55V208a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-76.21a16,16,0,0,1,21.66,0l80,76.21A16,16,0,0,1,224,115.55Z" opacity="0.2"></path><path d="M224,115.55V208a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-76.21a16,16,0,0,1,21.66,0l80,76.21A16,16,0,0,1,224,115.55ZM208,115.55,128,39.33,48,115.55V208H208Z"></path></svg>
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
                        {/* FAQ and details code omitted for brevity as it is just text */}
                        <div className="prose prose-purple max-w-none text-gray-600">
                            <p>Berikut adalah poin-poin penting terkait pembayaran uang kompensasi PKWT (Perjanjian Kerja Waktu Tertentu) berdasarkan peraturan pemerintah:</p>
                            <ul className="list-disc pl-5 space-y-2 mt-4">
                                <li><strong>Wajib Dibayar:</strong> Pengusaha wajib membayar uang kompensasi kepada pekerja/buruh yang hubungan kerjanya berdasarkan PKWT (Kontrak).</li>
                                <li><strong>Saat Berakhir:</strong> Dibayarkan pada saat berakhirnya jangka waktu PKWT.</li>
                                <li><strong>Perpanjangan:</strong> Jika PKWT diperpanjang, uang kompensasi dibayarkan untuk jangka waktu PKWT yang lama sebelum perpanjangan. Setelah perpanjangan berakhir, kompensasi dibayarkan lagi untuk masa perpanjangan.</li>
                                <li><strong>Minimal 1 Bulan:</strong> Diberikan kepada pekerja yang telah mempunyai masa kerja paling sedikit 1 (satu) bulan secara terus menerus.</li>
                            </ul>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 mt-8 mb-4">FAQ (Tanya Jawab)</h3>
                        <div className="space-y-4">
                            <details className="group border border-gray-100 rounded-xl p-4 bg-gray-50 open:bg-white open:shadow-sm" open>
                                <summary className="flex items-center justify-between font-bold text-gray-800 cursor-pointer list-none">
                                    <span>Bagaimana jika kontrak diputus (reskign/PHK) sebelum waktunya?</span>
                                    <CaretDownIcon />
                                </summary>
                                <div className="mt-3 text-sm text-gray-600 leading-relaxed pl-1">
                                    Pasal 17 PP 35/2021 menyebutkan: Dalam hal salah satu pihak mengakhiri hubungan kerja sebelum berakhirnya jangka waktu PKWT, pengusaha wajib memberikan uang kompensasi yang besarannya dihitung berdasarkan jangka waktu PKWT yang <strong>telah dilaksanakan</strong> oleh Pekerja/Buruh.
                                </div>
                            </details>
                            <details className="group border border-gray-100 rounded-xl p-4 bg-gray-50 open:bg-white open:shadow-sm">
                                <summary className="flex items-center justify-between font-bold text-gray-800 cursor-pointer list-none">
                                    <span>Apakah pekerja asing (TKA) dapat kompensasi?</span>
                                    <CaretDownIcon />
                                </summary>
                                <div className="mt-3 text-sm text-gray-600 leading-relaxed pl-1">
                                    Tidak. Pasal 15 ayat (5) PP 35/2021 secara tegas menyatakan bahwa ketentuan mengenai uang kompensasi <strong>tidak berlaku</strong> bagi tenaga kerja asing (TKA) yang dipekerjakan berdasarkan PKWT.
                                </div>
                            </details>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
}
