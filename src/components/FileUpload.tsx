import React, { useRef, useState } from 'react';
import mammoth from 'mammoth';
import '../styles/FileUpload.css';

interface FileUploadProps {
    onTextExtracted: (text: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onTextExtracted }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const showPopup = (msg: string, error: boolean = false) => {
        setMessage(msg);
        setIsError(error);
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000);
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            let extractedText = '';

            if (file.type === 'text/plain') {
                extractedText = await extractTextFromTxt(file);
            } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
                extractedText = await extractTextFromPdf(file);
            } else if (
                file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                file.name.endsWith('.docx')
            ) {
                extractedText = await extractTextFromDocx(file);
            } else {
                showPopup('Unsupported file type. Please upload a .txt, .pdf, or .docx file.', true);
                return;
            }

            if (extractedText.trim().length === 0) {
                showPopup('The file appears to be empty or could not be read.', true);
                return;
            }

            onTextExtracted(extractedText);
            showPopup(`Successfully imported ${file.name}!`);
            
            // Reset input so the same file can be uploaded again
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error('Error reading file:', error);
            showPopup('Failed to read file. Please try again.', true);
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
        try {
            // Dynamic import to avoid worker issues
            const pdfjsLib = await import('pdfjs-dist');
            
            // Use unpkg for worker
            pdfjsLib.GlobalWorkerOptions.workerSrc = 
                `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

            const arrayBuffer = await file.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({
                data: arrayBuffer,
            });
            const pdf = await loadingTask.promise;
            let fullText = '';

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items
                    .map((item: any) => {
                        if ('str' in item) {
                            return item.str;
                        }
                        return '';
                    })
                    .join(' ');
                fullText += pageText + '\n';
            }

            return fullText.trim();
        } catch (error) {
            console.error('PDF extraction error:', error);
            throw new Error('Failed to extract text from PDF. The file may be corrupted or password-protected.');
        }
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
            
            {/* Success/Error Message Popup */}
            {showMessage && (
                <div className={`message-popup ${isError ? 'error' : 'success'}`}>
                    <i className={`fas ${isError ? 'fa-exclamation-circle' : 'fa-check-circle'}`}></i>
                    <span>{message}</span>
                </div>
            )}
        </div>
    );
};

export default FileUpload;