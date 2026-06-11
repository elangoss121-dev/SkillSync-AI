import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import { Upload, FileText, X } from 'lucide-react'

export default function FileDropzone({
  onFile,
  file,
  onClear,
  accept = { 'image/*': [], 'text/*': [] },
  label = 'Drop file here or click to browse',
  hint = 'Supports images, text files',
  maxSize = 10 * 1024 * 1024,
  id = 'file-dropzone',
}) {
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
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-4"
        >
          <button
            onClick={onClear}
            className="absolute top-2 right-2 text-zinc-500 hover:text-red-400 transition-colors z-10"
            aria-label="Remove file"
          >
            <X className="w-4 h-4" />
          </button>

          {isImage ? (
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800">
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-200">{file.name}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{(file.size / 1024).toFixed(1)} KB · Image</p>
                <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-xs bg-green-500/10 text-green-400 border border-green-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  Ready
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-200">{file.name}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
          )}
        </motion.div>
      ) : (
        <div
          {...getRootProps()}
          id={id}
          className={`rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer p-8 text-center
            ${isDragActive
              ? 'dropzone-active border-indigo-500'
              : 'border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900/30'
            }`}
        >
          <input {...getInputProps()} />
          <motion.div
            animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="flex flex-col items-center gap-3"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
              ${isDragActive ? 'bg-indigo-500/20' : 'bg-zinc-800'}`}>
              <Upload className={`w-5 h-5 ${isDragActive ? 'text-indigo-400' : 'text-zinc-500'}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-300">{label}</p>
              <p className="text-xs text-zinc-600 mt-1">{hint}</p>
            </div>
          </motion.div>

          {fileRejections.length > 0 && (
            <p className="mt-3 text-xs text-red-400">
              File too large or unsupported format
            </p>
          )}
        </div>
      )}
    </div>
  )
}
