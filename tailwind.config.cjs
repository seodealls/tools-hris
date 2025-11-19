module.exports = {
  content: [
    './src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte}',
    './public/**/*.html',
  ],
  safelist: [
    // dynamic status color classes used by calculators
    'text-emerald-600', 'bg-emerald-50', 'border-emerald-100', 'bg-emerald-500',
    'text-blue-600', 'bg-blue-50', 'border-blue-100', 'bg-blue-500',
    'text-orange-600', 'bg-orange-50', 'border-orange-100',
    'text-red-600', 'bg-red-50', 'border-red-100', 'bg-red-500',

    // hero / gradient / arbitrary values
    'bg-[#1E0137]', 'bg-purple-500/20', 'text-purple-100', 'bg-purple-50',
    'bg-gradient-to-br', 'from-[#28024B]', 'to-[#5E0DC6]'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
