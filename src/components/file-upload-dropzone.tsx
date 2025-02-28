'use client';
import { useCallback, useState } from 'react';
import { useDropzone, FileRejection, DropzoneOptions } from 'react-dropzone';
import { UploadCloud, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Define the file with preview interface
interface FileWithPreview extends File {
  preview: string;
}

// Define the field props based on the form controller pattern seen in the parent component
interface FieldProps {
  value: FileWithPreview[];
  onChange: (value: FileWithPreview[]) => void;
}

// Props for the FileUploadDropzone component
interface FileUploadDropzoneProps {
  field: FieldProps;
}

// Main component
export default function FileUploadDropzone({ field }: FileUploadDropzoneProps) {
  const [fileError, setFileError] = useState<string>('');

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      // Clear previous errors
      setFileError('');

      // Check if files are rejected by the dropzone
      if (rejectedFiles && rejectedFiles.length > 0) {
        setFileError('Only CSV files are accepted');
        return;
      }

      // Further validate that these are actually CSV files
      const validFiles = acceptedFiles.filter((file) => file.name.toLowerCase().endsWith('.csv'));

      if (validFiles.length === 0) {
        setFileError('Please upload CSV files only');
        // Clear any existing files since none are valid
        field.onChange([]);
        return;
      }

      // Process valid files
      const filesWithPreview = validFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      ) as FileWithPreview[];

      field.onChange(filesWithPreview);
    },
    [field]
  );

  // Add specific accept property for CSV files
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
  } as DropzoneOptions);

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border border-dashed rounded-lg text-center cursor-pointer p-6 ${
          isDragActive ? 'border-primary bg-primary/10' : 'border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">Drag and drop CSV files only, or click to select files</p>
      </div>

      {fileError && <p className="text-sm font-medium text-red-500 mt-2">{fileError}</p>}

      {field.value && field.value.length > 0 ? (
        <div className="mt-6">
          <h4 className="text-sm font-medium">Selected Files</h4>
          <ul className="mt-3 space-y-2">
            {field.value.map((file, index) => (
              <li key={index} className="flex justify-between items-center text-sm">
                <span className="truncate">{file.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const newFiles = [...field.value];
                    newFiles.splice(newFiles.indexOf(file), 1);
                    field.onChange(newFiles);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
