module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production' ? {
      cssnano: {
        preset: ['default', {
          discardComments: {
            removeAll: true,
          },
          normalizeWhitespace: true,
          colormin: true,
          convertValues: true,
          calc: true,
          minifySelectors: true,
          mergeRules: true,
          mergeIdents: true,
          reducedIdents: true,
          discardEmpty: true,
          minifyFontValues: true,
          minifyGradients: true,
          uniqueSelectors: true,
          discardOverridden: true,
          mergeLonghand: true,
        }],
      },
    } : {})
  },
}