
tailwind.config = {
  theme: {
    extend: {
      colors: {
        brand: { navy:'#0A1128', cyan:'#0052FF', amber:'#F5A623', purple:'#7B61FF', pink:'#FF2D55', bg:'#F8FAFC', text:'#0F172A' }
      },
      fontFamily: { 
        sans: ['Pretendard','Inter','system-ui','sans-serif'],
        display: ['"Plus Jakarta Sans"', '"Pretendard"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(10, 25, 48, 0.05), 0 0 3px rgba(10, 25, 48, 0.02)',
        'lift': '0 30px 60px -12px rgba(0, 82, 255, 0.12), 0 18px 36px -18px rgba(10, 25, 48, 0.1), 0 0 0 1px rgba(0, 82, 255, 0.1)',
        'glass': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.8), 0 8px 32px 0 rgba(10, 25, 48, 0.05)'
      },
      animation: {
        'blob': 'blob 14s infinite alternate cubic-bezier(0.4, 0, 0.2, 1)',
        'blob-rev': 'blob-rev 16s infinite alternate cubic-bezier(0.4, 0, 0.2, 1)'
      },
      keyframes: {
        blob: { '0%': { transform: 'translate(0,0) scale(1)' }, '50%': { transform: 'translate(60px,-60px) scale(1.15)' }, '100%': { transform: 'translate(-40px,40px) scale(0.95)' } },
        'blob-rev': { '0%': { transform: 'translate(0,0) scale(1)' }, '50%': { transform: 'translate(-50px,50px) scale(1.2)' }, '100%': { transform: 'translate(40px,-40px) scale(0.9)' } }
      }
    }
  }
}
