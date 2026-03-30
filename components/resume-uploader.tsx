"use client"

import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, FileUp } from "lucide-react"

interface ResumeUploaderProps {
  onFileSelect: (file: File) => void
}

export function ResumeUploader({ onFileSelect }: ResumeUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0])
    }
  }, [onFileSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300
        ${isDragActive 
          ? "border-primary bg-primary/10 scale-[1.02] glow-primary" 
          : "border-border hover:border-primary/50 hover:bg-secondary/30"
        }
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        <div className={`
          w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300
          ${isDragActive 
            ? "bg-primary/20 text-primary scale-110" 
            : "bg-secondary text-muted-foreground"
          }
        `}>
          {isDragActive ? (
            <FileUp className="w-7 h-7 animate-bounce" />
          ) : (
            <Upload className="w-7 h-7" />
          )}
        </div>
        <div>
          <p className="font-medium text-foreground">
            {isDragActive ? "Drop your resume here" : "Drag & drop your resume"}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            or click to browse
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="px-2 py-1 rounded bg-secondary/50">PDF only</span>
          <span className="px-2 py-1 rounded bg-secondary/50">Max 10MB</span>
        </div>
      </div>
    </div>
  )
}
