import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFileIcon, FilePreview } from './util/files';
import apiClient from '../../services/apiClient';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const getResourceUrl = (filename) => {
  return `${baseURL}/data/resources/${filename}`;
};

const withResolvedUrl = (file) => {
  if (!file) return file;
  const resolvedUrl = file.url
    ? file.url.startsWith('http') || file.url.startsWith('blob:')
      ? file.url
      : `${baseURL}${file.url.startsWith('/') ? '' : '/'}${file.url}`
    : getResourceUrl(file.filename);
  return { ...file, url: resolvedUrl };
};

function TutorResources() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [classFiles, setClassFiles] = useState([]);
  const [resourceCache, setResourceCache] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [materialsLoading, setMaterialsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddOptions, setShowAddOptions] = useState(false);

  const wrapperRef = useRef(null);
  const fileInputRef = useRef(null);
  const objectUrlsRef = useRef([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await apiClient.get('/classes');
        setClasses(res.data);
      } catch (error) {
        console.error('Failed to load classes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    if (!selectedClass) {
      setClassFiles([]);
      setSelectedFile(null);
      setIsEditing(false);
      setShowAddOptions(false);
      return;
    }

    const cached = resourceCache[selectedClass];
    if (cached) {
      setClassFiles(cached);
      return;
    }

    let cancelled = false;
    const loadResources = async () => {
      setMaterialsLoading(true);
      try {
        const res = await apiClient.get(`/classes/${selectedClass}/resources`);
        if (cancelled) return;
        setClassFiles(res.data);
        setResourceCache((prev) => ({ ...prev, [selectedClass]: res.data }));
      } catch (error) {
        if (cancelled) return;
        console.error(`Failed to load resources for ${selectedClass}:`, error);
        setClassFiles([]);
        setResourceCache((prev) => ({ ...prev, [selectedClass]: [] }));
      } finally {
        if (!cancelled) setMaterialsLoading(false);
      }
    };
    loadResources();

    return () => {
      cancelled = true;
    };
  }, [selectedClass, resourceCache]);

  useEffect(() => () => {
    objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  const selectedClassName = useMemo(() => {
    const found = classes.find((c) => c.code === selectedClass);
    return found?.name || '';
  }, [classes, selectedClass]);

  const openFile = (file) => {
    const fileWithUrl = withResolvedUrl(file);
    setSelectedFile(fileWithUrl);
    requestAnimationFrame(() => {
      const el = wrapperRef.current?.querySelector('[data-material-viewer]');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const updateResourcesForClass = (classCode, updater) => {
    if (!classCode) return;
    const currentList = resourceCache[classCode] || (classCode === selectedClass ? classFiles : []);
    const nextList = typeof updater === 'function' ? updater(currentList) : updater;

    setResourceCache((prev) => ({ ...prev, [classCode]: nextList }));
    if (classCode === selectedClass) {
      setClassFiles(nextList);
    }
    setClasses((prev) => prev.map((c) => (c.code === classCode ? { ...c, item_count: nextList.length } : c)));
  };

  const handleSelectClass = (code) => {
    setSelectedClass(code === selectedClass ? null : code);
    setSelectedFile(null);
    setIsEditing(false);
    setShowAddOptions(false);
  };

  const handleDelete = (id) => {
    if (!selectedClass) return;
    updateResourcesForClass(selectedClass, (items) => items.filter((f) => f.id !== id));
    if (selectedFile?.id === id) {
      setSelectedFile(null);
    }
  };

  const handlePublish = () => {
    console.info('Publishing resources for', selectedClass, resourceCache[selectedClass]);
    setIsEditing(false);
    setShowAddOptions(false);
  };

  const handleAddUpload = (event) => {
    if (!selectedClass) return;
    const file = event.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    objectUrlsRef.current.push(objectUrl);

    const newResource = {
      id: `local-${Date.now()}`,
      class_code: selectedClass,
      filename: file.name,
      type: 'file',
      author: 'You',
      subject: selectedClassName || 'Shared Material',
      size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
      createdAt: new Date().toISOString(),
      url: objectUrl,
    };

    updateResourcesForClass(selectedClass, (items) => [newResource, ...items]);
    setShowAddOptions(false);
    event.target.value = '';
  };

  const handleHcmutLibrary = () => {
    if (!selectedClass) return;
    localStorage.setItem('tutorResourcesEditingClass', selectedClass);
    navigate('/tutor/resources/hcmut-library', { state: { classCode: selectedClass } });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading tutor resources...</div>;
  }

  return (
    <div ref={wrapperRef} className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tutor Resources</h1>
        <p className="text-gray-600">Manage and publish shared materials for your classes.</p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 md:gap-8">
          {/* LEFT: Shared materials / Viewer */}
          <div className="flex flex-col space-y-4">
            {selectedFile ? (
              <div data-material-viewer>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800">Material</h2>
                    {selectedClass && <p className="text-sm text-gray-600">{selectedClass}</p>}
                  </div>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="px-3 py-1 text-sm bg-gray-100 rounded-md"
                  >
                    Close
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white">
                  <div className="mb-3">
                    <p className="text-sm font-medium text-blue-600">{selectedFile.subject}</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedFile.filename}</p>
                  </div>
                  <FilePreview file={selectedFile} />
                  <div className="flex items-center justify-end gap-3 mt-4">
                    <a href={selectedFile.url} target="_blank" rel="noreferrer" className="text-sm text-blue-600">
                      Open in new tab
                    </a>
                    <a href={selectedFile.url} download className="text-sm text-gray-700">
                      Download
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800">Shared Materials</h2>
                    {selectedClass && <p className="text-sm text-gray-600">{selectedClassName || selectedClass}</p>}
                  </div>
                  {selectedClass && (
                    <span className="text-sm text-gray-600">{classFiles.length} item{classFiles.length !== 1 ? 's' : ''}</span>
                  )}
                </div>

                <div className="space-y-3 flex-1">
                  {!selectedClass && (
                    <div className="py-10 text-center text-gray-500 border border-dashed border-gray-200 rounded-lg">
                      Select a course to view and manage shared materials.
                    </div>
                  )}

                  {selectedClass && materialsLoading && (
                    <div className="py-6 text-gray-600">Loading materials...</div>
                  )}

                  {selectedClass && !materialsLoading && classFiles.length === 0 && (
                    <div className="py-6 text-gray-600">No shared resources for this class.</div>
                  )}

                  {selectedClass && !materialsLoading && classFiles.map((f) => (
                    <div
                      key={f.id}
                      onClick={() => openFile(f)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openFile(f)}
                      className="relative border border-gray-200 rounded-lg p-4 shadow-sm cursor-pointer hover:bg-gray-50"
                    >
                      {isEditing && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(f.id);
                          }}
                          className="absolute top-3 right-3 text-red-600 text-sm hover:text-red-700"
                          aria-label="Remove material"
                        >
                          Delete
                        </button>
                      )}
                      <div className="mb-3">
                        <p className="text-sm font-medium text-blue-600">{f.subject}</p>
                        <p className="text-md font-semibold text-gray-800 truncate">{f.filename}</p>
                      </div>
                      <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                        <div className="flex items-center gap-3 min-w-0">
                          {getFileIcon(f.filename)}
                          <p className="text-sm font-medium text-gray-900 truncate" title={f.filename}>{f.filename}</p>
                        </div>
                        <span className="text-xs text-gray-500">{f.size || '-'}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 mt-4 border-t border-gray-200 flex items-center justify-start gap-3 relative"> {/* **1. Added 'relative' here** */}
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => setShowAddOptions((prev) => !prev)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Add
                      </button>

                      {showAddOptions && (
                        <div className="absolute bottom-full mb-2 z-10 w-auto bg-white border border-gray-200 rounded-lg shadow-xl p-2 flex flex-row gap-2"> {/* Changed to flex-row and added gap-2 */}
                          <button
                            onClick={() => {
                              fileInputRef.current?.click();
                              setShowAddOptions(false);
                            }}
                            className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-150 ease-in-out whitespace-nowrap" // Added bg, text, and whitespace-nowrap
                          >
                            Upload file
                          </button>
                          <button
                            onClick={() => {
                              handleHcmutLibrary();
                              setShowAddOptions(false);
                            }}
                            className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-150 ease-in-out whitespace-nowrap" // Added bg, text, and whitespace-nowrap
                          >
                            HCMUT Library
                          </button>

                          <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            onChange={handleAddUpload}
                          />
                        </div>
                      )}

                      <button
                        onClick={handlePublish}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Publish
                      </button>
                    </>
                  ) : (
                    selectedClass && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Edit
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Courses */}
          <div className="space-y-4 md:order-first">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Courses</h2>
            <div className="divide-y divide-gray-200 rounded-md overflow-hidden">
              {classes.length === 0 && <div className="py-6 text-gray-600">No courses found.</div>}
              {classes.map((c) => {
                const isSelected = selectedClass === c.code;
                return (
                  <button
                    key={c.code}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectClass(c.code);
                    }}
                    aria-pressed={isSelected}
                    className={`w-full text-left flex items-center justify-between py-5 px-3 hover:bg-gray-50 ${isSelected ? 'bg-blue-50 ring-1 ring-blue-200' : ''}`}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-blue-600">{c.code}</p>
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
        </div>
      </div>
    </div>
  );
}

export default TutorResources;
