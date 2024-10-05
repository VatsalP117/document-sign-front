"use client";

import { useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileIcon, XIcon } from "lucide-react";

interface FilePickerProps {
  onFileSelect: (file: File | null) => void;
  accept?: string;
}

export default function FilePicker({
  onFileSelect,
  accept = "*",
}: FilePickerProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-row justify-center">
      <div className="flex items-center space-x-2">
        <Input
          type="file"
          id="file-upload"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept={accept}
        />
        <Button onClick={handleButtonClick} variant="outline">
          <FileIcon className="w-4 h-4 mr-2" />
          Choose File
        </Button>
        {selectedFile && (
          <div className="flex items-center bg-secondary text-secondary-foreground px-3 py-1 rounded-md">
            <span className="text-sm truncate max-w-[200px]">
              {selectedFile.name}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 h-auto p-0"
              onClick={handleRemoveFile}
            >
              <XIcon className="w-4 h-4" />
              <span className="sr-only">Remove file</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
