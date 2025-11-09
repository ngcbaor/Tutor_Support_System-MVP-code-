module.exports = {
  plugins: [
    // Use the PostCSS adapter package for Tailwind
    require('@tailwindcss/postcss')(),
    require('autoprefixer')(),
  ],
}

