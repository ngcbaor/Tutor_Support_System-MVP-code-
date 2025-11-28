import React, { useState, useEffect, useRef } from 'react';
import { getFileIcon, FilePreview } from './util/files';

import apiClient from '../../services/apiClient'

function StudentResources() {
  // 1. State for API data
  const [classes, setClasses] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [classFiles, setClassFiles] = useState([]); // Files for the specific selected class
  
  // 2. UI State
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedSource, setSelectedSource] = useState(null); // 'bookmarks' | 'shared' | null
  const [loading, setLoading] = useState(true);

  const selectedFileRef = useRef(null); 
  const wrapperRef = useRef(null);

  // Sync ref
  useEffect(() => {
    selectedFileRef.current = selectedFile;
  }, [selectedFile]);

  // 3. FETCH: Initial Data (Classes & Bookmarks)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [classesRes, bookmarksRes] = await Promise.all([
          apiClient.get('/classes'),
          apiClient.get('/bookmarks')
        ]);
        setClasses(classesRes.data);
        setBookmarks(bookmarksRes.data);
      } catch (error) {
        console.error("Failed to load resources:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // 4. FETCH: Class Specific Resources
  useEffect(() => {
    if (!selectedClass) {
      setClassFiles([]);
      return;
    }

    const fetchClassResources = async () => {
      try {
        const res = await apiClient.get(`/classes/${selectedClass}/resources`);
        setClassFiles(res.data);
      } catch (error) {
        console.error(`Failed to load resources for ${selectedClass}:`, error);
        setClassFiles([]);
      }
    };

    fetchClassResources();
  }, [selectedClass]);

  // Click Outside Handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setSelectedClass(null);
        if (!selectedFileRef.current) {
          setSelectedSource(null);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getResourceUrl = (filename) => {
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    return `${baseURL}/data/resources/${filename}`;
  };

  const openFile = (f, source, classCode = null) => {
    const fileWithUrl = { ...f, url: getResourceUrl(f.filename) };
    
    setSelectedFile(fileWithUrl);
    selectedFileRef.current = fileWithUrl;
    setSelectedSource(source);
    
    if (classCode) setSelectedClass(classCode);
    else if (source === 'bookmarks') setSelectedClass(null);

    requestAnimationFrame(() => {
      const el = wrapperRef.current?.querySelector('[data-material-viewer]');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const closeFileView = () => {
    setSelectedFile(null);
    selectedFileRef.current = null;
    setSelectedSource(null);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading resources...</div>;
  }

  return (
    <div ref={wrapperRef} className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Resources</h1>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 md:gap-8">
          {/* LEFT COLUMN: Classes List or File Viewer */}
          <div className="space-y-4">
            {selectedFile ? (
              <div data-material-viewer>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold text-gray-800">Material</h2>
                  <div className="flex items-center gap-2">
                    {selectedSource && <span className="text-sm text-gray-600">Source: {selectedSource}</span>}
                    <button onClick={closeFileView} className="px-3 py-1 text-sm bg-gray-100 rounded-md">Close</button>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white">
                  <div className="mb-3">
                    <p className="text-sm font-medium text-blue-600">{selectedFile.subject}</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedFile.filename}</p>
                  </div>

                  {/* Pass the file with the constructed backend URL */}
                  <FilePreview file={selectedFile} />

                  <div className="flex items-center justify-end gap-3 mt-4">
                    <a href={selectedFile.url} target="_blank" rel="noreferrer" className="text-sm text-blue-600">Open in new tab</a>
                    <a href={selectedFile.url} download className="text-sm text-gray-700">Download</a>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Classes</h2>
                <div className="divide-y divide-gray-200 rounded-md overflow-hidden">
                  {classes.length === 0 && <div className="py-6 text-gray-600">No classes found.</div>}
                  {classes.map((c) => {
                    const isSelected = selectedClass === c.code;
                    return (
                      <button
                        key={c.code}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedClass(isSelected ? null : c.code);
                          setSelectedFile(null);
                          selectedFileRef.current = null;
                          setSelectedSource(null);
                        }}
                        aria-pressed={isSelected}
                        className={`w-full text-left flex items-center justify-between py-5 px-3 hover:bg-gray-50 ${isSelected ? 'bg-blue-50 ring-1 ring-blue-200' : ''}`}
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-blue-600">{c.code}</p>
                          {/* Name comes directly from API now */}
                          <p className="text-lg font-semibold text-gray-900 mt-1 truncate">{c.name}</p>
                        </div>

                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${c.item_count === 0 ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-700'}`}>
                          {c.item_count} {c.item_count !== 1 ? 'items' : 'item'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Bookmarks or Class Resources */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {selectedFile ? (selectedSource === 'bookmarks' ? 'Bookmarks' : 'Shared Materials') : (selectedClass ? 'Shared Materials' : 'Bookmarks')}
            </h2>

            <div className="space-y-4">
              {/* VIEW: BOOKMARKS */}
              {(selectedSource === 'bookmarks' || (!selectedClass && selectedSource !== 'shared' && !selectedFile)) && (
                <div>
                  {bookmarks.length === 0 ? (
                    <div className="py-6 text-gray-600">No bookmarks available.</div>
                  ) : (
                    bookmarks.map((f) => (
                      <div
                        key={f.id}
                        onClick={() => openFile(f, 'bookmarks')}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openFile(f, 'bookmarks')}
                        className="border border-gray-200 rounded-lg p-4 shadow-sm cursor-pointer hover:bg-gray-50"
                      >
                        <div className="mb-3">
                          <p className="text-sm font-medium text-blue-600">{f.subject}</p>
                          <p className="text-md font-semibold text-gray-800 truncate">{f.filename}</p>
                        </div>
                        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                          <div className="flex items-center gap-3 min-w-0">
                            {getFileIcon(f.filename)}
                            <p className="text-sm font-medium text-gray-900 truncate" title={f.filename}>{f.filename}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* VIEW: SHARED CLASS FILES */}
              {(selectedClass || selectedSource === 'shared') && (
                <div>
                  {(() => {
                    if (classFiles.length === 0) {
                      return <div className="py-6 text-gray-600">No shared resources for this class.</div>;
                    }
                    return classFiles.map((f) => (
                      <div
                        key={f.id}
                        onClick={() => openFile(f, 'shared', selectedClass)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openFile(f, 'shared', selectedClass)}
                        className="border border-gray-200 rounded-lg p-4 shadow-sm cursor-pointer hover:bg-gray-50"
                      >
                        <div className="mb-3">
                          <p className="text-sm font-medium text-blue-600">{f.subject}</p>
                          <p className="text-md font-semibold text-gray-800 truncate">{f.filename}</p>
                        </div>
                        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                          <div className="flex items-center gap-3 min-w-0">
                            {getFileIcon(f.filename)}
                            <p className="text-sm font-medium text-gray-900 truncate" title={f.filename}>{f.filename}</p>
                          </div>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentResources;
