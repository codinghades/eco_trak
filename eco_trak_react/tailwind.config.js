module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      },
      spacing: {
        // Add custom spacing values (used for padding, margin, width, height, gap, etc.)
        '18': '4.5rem',    // 72px
        '42': '10.5rem',   // 168px
        '68': '17rem',     // 272px
        '84': '21rem',     // 336px
        '96': '24rem',     // 384px
        '128': '32rem',    // 512px
        // Add more as needed...
      }
    },
  },
  plugins: [],
}