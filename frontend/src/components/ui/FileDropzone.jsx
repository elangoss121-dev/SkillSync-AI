import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import { Upload, FileText, X } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function FileDropzone({
  onFile,
  file,
  onClear,
  accept = { 'image/*': [] },
  label = 'Drop UI screenshot here or click to select',
  hint = 'Supports PNG, JPG, WEBP designs',
  maxSize = 10 * 1024 * 1024,
  id = 'file-dropzone',
}) {
  const { theme } = useApp()
  const isDark = theme === 'dark'

  const onDrop = useCallback(accepted => {
    if (accepted.length > 0) onFile(accepted[0])
  }, [onFile])

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
  })

  const isImage = file?.type?.startsWith('image/')

  return (
    <div>
      {file ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-lg border p-4 transition-all duration-300"
          style={{
            backgroundColor: isDark ? 'rgba(255, 107, 53, 0.03)' : 'rgba(99, 102, 241, 0.03)',
            borderColor: isDark ? '#FF6B35' : '#6366F1'
          }}
        >
          <button
            onClick={onClear}
            className="absolute top-2.5 right-2.5 text-zinc-400 hover:text-red-500 transition-colors z-10"
            aria-label="Remove file"
          >
            <X className="w-4 h-4" />
          </button>

          {isImage ? (
            <div className="flex items-start gap-3 font-mono">
              <div className="flex-shrink-0 w-16 h-16 rounded overflow-hidden bg-zinc-950 border" style={{ borderColor: 'var(--border)' }}>
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-xs font-bold text-[var(--text-primary)] truncate max-w-[180px]">{file.name}</p>
                <p className="text-[10px] text-zinc-500 mt-0.5">{(file.size / 1024).toFixed(1)} KB · Image</p>
                <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded text-[9px] font-bold bg-green-500/10 text-green-500 border border-green-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  STAGED
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 font-mono">
              <div className="flex-shrink-0 w-10 h-10 rounded bg-[#FF6B35]/10 dark:bg-zinc-850 border border-[#FF6B35]/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#FF6B35]" />
              </div>
              <div>
                <p className="text-xs font-bold text-[var(--text-primary)]">{file.name}</p>
                <p className="text-[10px] text-zinc-500 mt-0.5">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
          )}
        </motion.div>
      ) : (
        <div
          {...getRootProps()}
          id={id}
          className={`rounded-lg border-2 border-dashed transition-all duration-300 cursor-pointer p-8 text-center`}
          style={{
            backgroundColor: isDragActive 
              ? (isDark ? 'rgba(255, 107, 53, 0.04)' : 'rgba(99, 102, 241, 0.04)') 
              : 'transparent',
            borderColor: isDragActive
              ? (isDark ? '#FF6B35' : '#6366F1')
              : 'var(--border-solid)',
          }}
        >
          <input {...getInputProps()} />
          <motion.div
            animate={isDragActive ? { scale: 1.05 } : { scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="flex flex-col items-center gap-3 font-mono"
          >
            <div 
              className="w-10 h-10 rounded border flex items-center justify-center transition-all duration-300"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border)'
              }}
            >
              <Upload className="w-4 h-4 text-zinc-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-[var(--text-primary)] uppercase">{label}</p>
              <p className="text-[10px] text-zinc-500 mt-1 uppercase">{hint}</p>
            </div>
          </motion.div>

          {fileRejections.length > 0 && (
            <p className="mt-3 text-[10px] text-red-500 uppercase font-bold">
              File exceeds size limits or is unsupported format
            </p>
          )}
        </div>
      )}
    </div>
  )
}
