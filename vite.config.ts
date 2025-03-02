import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { obfuscator } from 'rollup-obfuscator'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    obfuscator({
      // Opciones avanzadas de ofuscación
      // Estas configuraciones hacen que el código sea extremadamente difícil de leer
      compact: true,
      controlFlowFlattening: true,
      controlFlowFlatteningThreshold: 1,
      deadCodeInjection: true,
      deadCodeInjectionThreshold: 1,
      debugProtection: false, // Desactivado para evitar problemas de bloqueo
      debugProtectionInterval: 0, // Valor 0 para desactivarlo (debe ser un número)
      disableConsoleOutput: true,
      identifierNamesGenerator: 'hexadecimal',
      log: false,
      numbersToExpressions: true,
      renameGlobals: false,
      selfDefending: false, // También desactivamos esto que puede causar problemas similares
      simplify: true,
      splitStrings: true,
      splitStringsChunkLength: 5,
      stringArray: true,
      stringArrayCallsTransform: true,
      stringArrayCallsTransformThreshold: 1,
      stringArrayEncoding: ['rc4'],
      stringArrayIndexShift: true,
      stringArrayRotate: true,
      stringArrayShuffle: true,
      stringArrayWrappersCount: 5,
      stringArrayWrappersChainedCalls: true,
      stringArrayWrappersParametersMaxCount: 5,
      stringArrayWrappersType: 'function',
      stringArrayThreshold: 1,
      transformObjectKeys: true,
      unicodeEscapeSequence: false
    })
  ],
  base: './', // Esto asegura que se usen rutas relativas
  build: {
    outDir: 'docs', // Configura la salida del build en la carpeta 'docs'
    minify: 'esbuild', // Usar esbuild (más moderno y predeterminado) en lugar de terser
    target: 'es2020', // Optimizar para navegadores modernos
    cssMinify: true, // Minificar CSS
    assetsInlineLimit: 0, // No inlinear activos para mejor minificación
    reportCompressedSize: false, // Acelerar el proceso de build
    chunkSizeWarningLimit: 1000, // Aumentar límite de advertencia para chunks
    cssCodeSplit: false, // Un solo archivo CSS para máxima minificación
    sourcemap: false, // Sin sourcemap para producción
    rollupOptions: {
      output: {
        manualChunks: undefined, // Desactivar la división en chunks
        inlineDynamicImports: true, // Inlinear importaciones dinámicas
        compact: true, // Salida compacta
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
        // Mejora la ofuscación general
        generatedCode: {
          objectShorthand: true,
          constBindings: true,
          arrowFunctions: true,
        }
      }
    }
  },
  esbuild: {
    // Configuraciones para máxima minificación con esbuild
    drop: ['console', 'debugger'], // Elimina todos los console.log y debugger
    minifyIdentifiers: true, // Minimizar nombres de variables e identidades
    minifySyntax: true, // Aplicar minificación sintáctica avanzada
    minifyWhitespace: true, // Eliminar espacios en blanco
    treeShaking: true, // Eliminar código no utilizado
    keepNames: false, // No mantener nombres para máxima minificación
    legalComments: 'none', // No incluir comentarios legales
    pure: ['console.debug', 'console.log', 'console.info'], // Considera estas funciones como puras y podrían eliminarse
    charset: 'utf8',
    ignoreAnnotations: true, // Ignorar comentarios de anotación que podrían evitar minificación
    color: false, // Desactivar colores en la salida para reducir tamaño
    logLevel: 'error', // Solo mostrar errores
    mangleProps: /^_/ // Ofuscar propiedades que comienzan con guión bajo
  },
  define: {
    // Definir que estamos en producción para eliminar código específico de desarrollo
    'process.env.NODE_ENV': JSON.stringify('production'),
    __VUE_OPTIONS_API__: JSON.stringify(false),
    __VUE_PROD_DEVTOOLS__: JSON.stringify(false)
  }
})
