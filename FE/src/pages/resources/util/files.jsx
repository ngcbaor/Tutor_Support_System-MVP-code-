import React, { useEffect, useState } from 'react';

export const getFileIcon = (fileName) => {
  const extension = String(fileName || '').split('.').pop().toLowerCase();
  const baseClass = 'inline-block w-5 h-5 text-gray-600';
  switch (extension) {
    case 'pdf':
      return <span className={`${baseClass} text-red-500`} aria-hidden>📄</span>;
    case 'zip':
      return <span className={`${baseClass} text-yellow-500`} aria-hidden>🗜️</span>;
    case 'cpp':
    case 'js':
    case 'py':
    case 'java':
      return <span className={`${baseClass} text-blue-500`} aria-hidden>💻</span>;
    default:
      return <span className={baseClass} aria-hidden>📄</span>;
  }
};

export function FilePreview({ file }) {
  const ext = String(file?.filename || '').split('.').pop().toLowerCase();

  const [codeText, setCodeText] = useState(null);
  const [loadingCode, setLoadingCode] = useState(false);
  const [codeError, setCodeError] = useState(null);

  useEffect(() => {
    let mounted = true;
    if (!file || !file.url) return undefined;
    const previewable = ['js', 'jsx', 'ts', 'tsx', 'py', 'java', 'c', 'cpp', 'h', 'html', 'css', 'json', 'md', 'txt',];
    if (previewable.includes(ext)) {
      setLoadingCode(true);
      setCodeText(null);
      setCodeError(null);
      fetch(file.url)
        .then(async (r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          const text = await r.text();
          if (!mounted) return;
          setCodeText(text);
        })
        .catch((err) => {
          if (!mounted) return;
          setCodeError(err.message);
        })
        .finally(() => mounted && setLoadingCode(false));
    }
    return () => {
      mounted = false;
    };
  }, [file, ext]);

  if (!file) return null;

  if (ext === 'pdf') {
    return (
      <div className="w-full h-[70vh] border rounded-md overflow-hidden">
        <iframe title={file.filename} src={file.url} type="application/pdf" className="w-full h-full" />
      </div>
    );
  }

  if (['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(ext)) {
    return (
      <div className="w-full h-[70vh] border rounded-md overflow-hidden flex items-center justify-center bg-white">
        <img src={file.url} alt={file.filename} className="max-h-full max-w-full object-contain" />
      </div>
    );
  }

  if (['js', 'jsx', 'ts', 'tsx', 'py', 'java', 'c', 'cpp', 'h', 'html', 'css', 'json', 'md', 'txt'].includes(ext)) {
    return (
      <div className="w-full h-[70vh] border rounded-md overflow-auto bg-black text-white font-mono text-sm p-4">
        {loadingCode && <div>Loading code...</div>}
        {codeError && <div className="text-red-400">Could not fetch file for inline preview: {codeError}</div>}
        {codeText && (
          <pre className="whitespace-pre-wrap break-words">
            <code>{codeText}</code>
          </pre>
        )}
        {!loadingCode && !codeText && !codeError && <div className="text-gray-400">No preview available.</div>}
      </div>
    );
  }

  return (
    <div className="w-full h-[40vh] border rounded-md overflow-hidden p-6 flex flex-col justify-center items-start bg-gray-50">
      <p className="text-lg font-semibold">No inline preview available for this file type.</p>
      <p className="text-sm text-gray-600 mt-2">{file.filename}</p>
      <div className="mt-4">
        <a href={file.url} target="_blank" rel="noreferrer" className="text-blue-600">
          Open in new tab
        </a>
      </div>
    </div>
  );
}
