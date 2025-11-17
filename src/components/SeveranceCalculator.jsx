import React, { useState, useMemo } from "react";

export default function SeveranceCalculator() {
  const [baseSalary, setBaseSalary] = useState(6000000);
  const [allowances, setAllowances] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [yearsInput, setYearsInput] = useState(0);
  const [monthsInput, setMonthsInput] = useState(0);
  const [useDirectMasaKerja, setUseDirectMasaKerja] = useState(false);
  const [workWeek, setWorkWeek] = useState(6); // 6 or 5
  const [sisaCuti, setSisaCuti] = useState(0);
  const [transport, setTransport] = useState(0);
  const [includeHousingMedical, setIncludeHousingMedical] = useState(true);

  // helper: parse currency number inputs (allow user to input plain number)
  const parseNumber = (v) => {
    const n = Number(String(v).replace(/[^0-9.-]+/g, ""));
    return Number.isFinite(n) ? n : 0;
  };

  const totalMonthly = useMemo(() => {
    return Math.max(0, parseNumber(baseSalary) + parseNumber(allowances));
  }, [baseSalary, allowances]);

  // compute tenure in months either from dates or direct input
  const tenureMonths = useMemo(() => {
    if (useDirectMasaKerja) {
      const y = Math.max(0, Math.floor(Number(yearsInput) || 0));
      const m = Math.max(0, Math.floor(Number(monthsInput) || 0));
      return y * 12 + m;
    }

    if (!startDate || !endDate) return 0;
    try {
      const s = new Date(startDate + "T00:00:00");
      const e = new Date(endDate + "T00:00:00");
      if (!(s instanceof Date) || !(e instanceof Date) || isNaN(s) || isNaN(e) || e <= s) return 0;
      let months = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
      // adjust if day of month in end is >= start's day -> count extra month fraction as month
      if (e.getDate() >= s.getDate()) months += 1;
      return Math.max(0, months);
    } catch (err) {
      return 0;
    }
  }, [useDirectMasaKerja, yearsInput, monthsInput, startDate, endDate]);

  // Formatting currency
  const fmt = (v) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Math.round(v || 0));

  // law-based tables (PP No.35/2021 & implementasi Kemnaker)
  const getUPMonths = (months) => {
    // Uang Pesangon (UP) table
    if (months < 12) return 1;
    if (months < 24) return 2;
    if (months < 36) return 3;
    if (months < 48) return 4;
    if (months < 60) return 5;
    if (months < 72) return 6;
    if (months < 84) return 7;
    if (months < 96) return 8;
    return 9; // 8 tahun atau lebih = 9 bulan upah
  };

  const getUPMKMonths = (months) => {
    // Uang Penghargaan Masa Kerja (UPMK) table
    if (months < 36) return 0; // belum memenuhi syarat
    if (months < 72) return 2; // 3-<6 tahun
    if (months < 108) return 3; // 6-<9
    if (months < 144) return 4; // 9-<12
    if (months < 180) return 5; // 12-<15
    if (months < 216) return 6; // 15-<18
    if (months < 252) return 7; // 18-<21
    if (months < 288) return 8; // 21-<24
    return 10; // >=24 tahun => 10 bulan upah (PP/implementasi)
  };

  const upMonths = getUPMonths(tenureMonths);
  const upmkMonths = getUPMKMonths(tenureMonths);

  const UP = upMonths * totalMonthly;
  const UPMK = upmkMonths * totalMonthly;

  // Uang Penggantian Hak: sisa cuti + transport + housing/medical (15% dari UP + UPMK if eligible)
  const divisor = workWeek === 6 ? 25 : 21; // per Kepmenaker 102/2004 and common implementation
  const cutiValue = (sisaCuti > 0 ? (totalMonthly / divisor) * parseNumber(sisaCuti) : 0);
  const transportValue = parseNumber(transport);
  const housingMedicalValue = includeHousingMedical ? 0.15 * (UP + UPMK) : 0;

  const UPH = cutiValue + transportValue + housingMedicalValue;
  const total = UP + UPMK + UPH;

  return (
    <div className="min-h-screen p-6" style={{ background: "linear-gradient(180deg,#1E0137 0%, #28024B 50%, #5E0DC6 100%)" }}>
      <div className="max-w-4xl mx-auto bg-white/95 rounded-2xl shadow-2xl p-6">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#1E0137]">Kalkulator Pesangon</h1>
            <p className="text-sm text-gray-600">Berbasis PP No.35/2021 — Perhitungan otomatis: Uang Pesangon, UPMK, dan Uang Penggantian Hak.</p>
          </div>
          <div className="text-right">
            <div className="inline-block px-3 py-1 rounded-md bg-gradient-to-r from-[#A35CFF] to-[#42027D] text-white text-sm">Kantorku.id Tool</div>
          </div>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Gaji Bulanan (gaji pokok + tunjangan tetap)</label>
              <input type="number" value={baseSalary} onChange={(e)=>setBaseSalary(e.target.value)} className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm p-2" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Tunjangan Tetap (total)</label>
              <input type="number" value={allowances} onChange={(e)=>setAllowances(e.target.value)} className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm p-2" />
            </div>

            <div className="flex items-center gap-3">
              <label className="inline-flex items-center">
                <input type="checkbox" checked={useDirectMasaKerja} onChange={(e)=>setUseDirectMasaKerja(e.target.checked)} className="mr-2" />
                Masukkan masa kerja langsung (alternatif)
              </label>
            </div>

            {useDirectMasaKerja ? (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm text-gray-700">Tahun</label>
                  <input type="number" value={yearsInput} onChange={(e)=>setYearsInput(e.target.value)} className="mt-1 block w-full rounded-lg p-2 border-gray-200" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">Bulan</label>
                  <input type="number" value={monthsInput} onChange={(e)=>setMonthsInput(e.target.value)} className="mt-1 block w-full rounded-lg p-2 border-gray-200" />
                </div>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm text-gray-700">Tanggal Mulai Bekerja</label>
                  <input type="date" value={startDate} onChange={(e)=>setStartDate(e.target.value)} className="mt-1 block w-full rounded-lg p-2 border-gray-200" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">Tanggal Berhenti / PHK</label>
                  <input type="date" value={endDate} onChange={(e)=>setEndDate(e.target.value)} className="mt-1 block w-full rounded-lg p-2 border-gray-200" />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm text-gray-700">Sisa Cuti Tahunan (hari)</label>
              <input type="number" value={sisaCuti} onChange={(e)=>setSisaCuti(e.target.value)} className="mt-1 block w-full rounded-lg p-2 border-gray-200" />
            </div>

            <div>
              <label className="block text-sm text-gray-700">Sistem Kerja / Hari Kerja per Minggu</label>
              <select value={workWeek} onChange={(e)=>setWorkWeek(Number(e.target.value))} className="mt-1 block w-full rounded-lg p-2 border-gray-200">
                <option value={6}>6 hari kerja / minggu (divisor 25)</option>
                <option value={5}>5 hari kerja / minggu (divisor 21)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700">Ongkos Pulang (transport) (opsional)</label>
              <input type="number" value={transport} onChange={(e)=>setTransport(e.target.value)} className="mt-1 block w-full rounded-lg p-2 border-gray-200" />
            </div>

            <div className="flex items-center gap-3">
              <input id="hm" type="checkbox" checked={includeHousingMedical} onChange={(e)=>setIncludeHousingMedical(e.target.checked)} />
              <label htmlFor="hm" className="text-sm text-gray-700">Termasuk penggantian perumahan & pengobatan (15% dari UP+UPMK jika berlaku)</label>
            </div>

          </section>

          <aside className="space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#A35CFF] to-[#5E0DC6] text-white shadow">
              <h3 className="text-lg font-semibold">Hasil Perhitungan</h3>
              <p className="text-sm opacity-90 mt-1">Masa kerja terhitung: <strong>{Math.floor(tenureMonths/12)} tahun {tenureMonths%12} bulan</strong></p>

              <div className="mt-3 space-y-2">
                <div className="flex justify-between">
                  <span>Uang Pesangon ({upMonths} bulan)</span>
                  <strong>{fmt(UP)}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Uang Penghargaan Masa Kerja ({upmkMonths} bulan)</span>
                  <strong>{fmt(UPMK)}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Uang Penggantian Hak (cuti)</span>
                  <strong>{fmt(cutiValue)}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Ongkos Pulang</span>
                  <strong>{fmt(transportValue)}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Perumahan & Pengobatan (15%)</span>
                  <strong>{fmt(housingMedicalValue)}</strong>
                </div>
                <hr className="border-white/30" />
                <div className="flex justify-between text-xl">
                  <span>Total Kompensasi</span>
                  <strong>{fmt(total)}</strong>
                </div>
              </div>

              <div className="mt-3 text-xs opacity-90">
                <em>Catatan:</em> Perhitungan ini mengikuti ketentuan umum PP No.35/2021 & pedoman Kemnaker. Untuk kasus khusus (pelanggaran berat, gugatan, ketentuan kontrak, pensiun terdaftar, dll) hasil dapat berbeda—lihat referensi resmi.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border">
              <h4 className="font-semibold text-gray-800">Ringkasan Aturan yang Digunakan</h4>
              <ul className="list-disc pl-5 mt-2 text-sm text-gray-600 space-y-1">
                <li>Uang Pesangon: dihitung berdasarkan masa kerja (s.d. ≥8 tahun = 9 bulan upah).</li>
                <li>Uang Penghargaan Masa Kerja: dimulai bila masa kerja ≥3 tahun; naik bertahap, ≥24 tahun = 10 bulan (implementasi PP).</li>
                <li>Uang Penggantian Hak: mencakup sisa cuti, ongkos pulang, dan penggantian perumahan & pengobatan (15% jika memenuhi syarat).</li>
              </ul>
            </div>

            <div className="p-3 text-xs text-gray-500">
              <strong>Sumber:</strong> PP No.35/2021 & Simulasi Kemnaker (disertakan di bawah halaman). Hasil hanya sebagai simulasi — konsultasikan bagian hukum/SDM untuk kasus kompleks.
            </div>

          </aside>

          <section className="my-16 bg-white/5 rounded-2xl p-10">
            <h2 className="text-2xl font-semibold mb-6 text-white">Ringkasan Aturan Pesangon di Indonesia</h2>
            <p className="text-white/80 mb-4">Berikut ringkasan ketentuan pesangon berdasarkan PP No. 35 Tahun 2021:</p>
            <table className="w-full text-white/90 border border-white/20 rounded-xl overflow-hidden">
              <thead className="bg-white/10">
                <tr>
                  <th className="p-3 text-left">Komponen</th>
                  <th className="p-3 text-left">Ketentuan</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-white/10">
                  <td className="p-3">Uang Pesangon (UP)</td>
                  <td className="p-3">1–9 bulan gaji tergantung masa kerja (&lt;1 th hingga ≥8 th).</td>
                </tr>
                <tr className="border-t border-white/10">
                  <td className="p-3">Uang Penghargaan Masa Kerja (UPMK)</td>
                  <td className="p-3">2–10 bulan gaji untuk masa kerja ≥3 tahun.</td>
                </tr>
                <tr className="border-t border-white/10">
                  <td className="p-3">Uang Penggantian Hak (UPH)</td>
                  <td className="p-3">Sisa cuti, ongkos pulang, dan opsi 15% (perumahan & pengobatan).</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="my-16 bg-white/5 rounded-2xl p-10">
            <h2 className="text-2xl font-semibold mb-6 text-white">FAQ</h2>
            <div className="space-y-6 text-white/90">
              <div>
                <h3 className="font-semibold text-lg">Bagaimana cara menghitung pesangon?</h3>
                <p className="opacity-80">Pesangon dihitung berdasarkan masa kerja, gaji terakhir, penghargaan masa kerja, dan hak-hak lain sesuai PP 35/2021.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Apakah kalkulator ini mengikuti peraturan terbaru?</h3>
                <p className="opacity-80">Ya. Kalkulator ini mengikuti ketentuan PP No. 35 Tahun 2021 yang mengatur formula pesangon dan kompensasi PHK.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Apakah hasil perhitungan bisa dijadikan dasar legal?</h3>
                <p className="opacity-80">Hasil ini merupakan estimasi otomatis. Untuk keputusan hukum final, disarankan melakukan konsultasi dengan tim HR atau legal perusahaan.</p>
              </div>
            </div>
          </section>

        </main>

        <footer className="mt-6 text-center text-sm text-gray-500">Kalkulator ini dibuat untuk tujuan informasi — Kantorku.id</footer>
      </div>
    </div>
  );
}
