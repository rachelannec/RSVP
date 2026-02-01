import React, { useRef } from 'react';
import  * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import '../styles/FileUpload.css';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface FileUploadProps {
    onTextExtracted: (text: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onTextExtracted }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            let extractedText = '';

            if (file.type === 'text/plain') {
                extractedText = await extractTextFromTxt(file);
            } else if (file.type === 'application/pdf') {
                extractedText = await extractTextFromPdf(file);
            } else if (
                file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                file.name.endsWith('.docx')
            ) {
                extractedText = await extractTextFromDocx(file);
            } else {
                alert('Unsupported file type. Please upload a .txt, .pdf, or .docx file.');
                return;
            }

            onTextExtracted(extractedText);
            
            // Reset input so the same file can be uploaded again
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error('Error reading file:', error);
            alert('Failed to read file. Please try again.');
        }
    };

    const extractTextFromTxt = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.onerror = reject;
            reader.readAsText(file);
        });
    };

    const extractTextFromPdf = async (file: File): Promise<string> => {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
                .map((item: any) => item.str)
                .join(' ');
            fullText += pageText + ' ';
        }

        return fullText.trim();
    };

    const extractTextFromDocx = async (file: File): Promise<string> => {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value;
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="file-upload">
            <button 
                className="file-upload-button" 
                onClick={handleButtonClick}
                type="button"
            >
                <i className="fas fa-file-upload"></i>
                <span>Import File</span>
            </button>
            <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.pdf,.docx"
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />
        </div>
    );
};

export default FileUpload;

// npm install pdfjs-dist mammoth
// npm install --save-dev @types/pdfjs-dist