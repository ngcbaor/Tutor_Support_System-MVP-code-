import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function HcmutLibSearch() {
  const location = useLocation();
  const navigate = useNavigate();

  const [courseCode, setCourseCode] = useState(() => {
    return location.state?.classCode || localStorage.getItem('tutorResourcesEditingClass') || '';
  });
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [activeCategory, setActiveCategory] = useState('type');
  const [filters, setFilters] = useState(() => ({
    type: new Set(),
    subject: new Set(),
  }));

  const materials = useMemo(
    () => [
      { id: 'm1', title: 'Distributed Systems Overview', subject: 'Distributed Systems', author: 'Prof. Le', type: 'ebook', size: '2.3 MB' },
      { id: 'm2', title: 'Advanced Web Programming Guide', subject: 'Web Programming', author: 'Dr. Minh', type: 'ebook', size: '4.8 MB' },
      { id: 'm3', title: 'Database Replication Patterns', subject: 'Databases', author: 'Dr. Long', type: 'ebook', size: '1.2 MB' },
      { id: 'm4', title: 'React Hooks Audio Companion', subject: 'Web Programming', author: 'Dr. Hoa', type: 'audio book', size: '52 mins' },
      { id: 'm5', title: 'Algorithms Refresher', subject: 'Algorithms', author: 'Dr. Phuong', type: 'ebook', size: '12.0 MB' },
      { id: 'm6', title: 'Sorting Visualizer Code', subject: 'Algorithms', author: 'CS Lab', type: 'code', size: '650 KB' },
    ],
    []
  );
  const typeOptions = ['ebook', 'audio book', 'code'];
  const subjectOptions = useMemo(
    () => Array.from(new Set(materials.map((m) => m.subject))),
    [materials]
  );

  useEffect(() => {
    if (location.state?.classCode) {
      setCourseCode(location.state.classCode);
      localStorage.setItem('tutorResourcesEditingClass', location.state.classCode);
    }
  }, [location.state]);

  const toggleFilter = (category, value) => {
    setFilters((prev) => {
      const nextSet = new Set(prev[category]);
      if (nextSet.has(value)) nextSet.delete(value);
      else nextSet.add(value);
      return { ...prev, [category]: nextSet };
    });
  };

  const filteredMaterials = materials.filter((m) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      q === '' ||
      m.title.toLowerCase().includes(q) ||
      m.subject.toLowerCase().includes(q) ||
      m.author.toLowerCase().includes(q);

    const typeSet = filters.type;
    const subjectSet = filters.subject;
    const matchesType = typeSet.size === 0 || typeSet.has(m.type);
    const matchesSubject = subjectSet.size === 0 || subjectSet.has(m.subject);

    return matchesQuery && matchesType && matchesSubject;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">HCMUT Library</h1>
            <p className="text-gray-600">Search and attach materials from the university library.</p>
            <p className="text-sm text-gray-500 mt-1">
              Current course: <span className="font-semibold">{courseCode || 'Not set'}</span>
            </p>
          </div>
          <button
            onClick={() => navigate('/tutor/resources')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Tutor Resources
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1 border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search materials..."
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-700">Filters</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveCategory('type')}
                  className={`px-3 py-1 text-xs rounded-full border ${activeCategory === 'type' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-white text-gray-700 border-gray-300'}`}
                >
                  Type
                </button>
                <button
                  onClick={() => setActiveCategory('subject')}
                  className={`px-3 py-1 text-xs rounded-full border ${activeCategory === 'subject' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-white text-gray-700 border-gray-300'}`}
                >
                  Subject
                </button>
              </div>

              <div className="space-y-2">
                {(activeCategory === 'type' ? typeOptions : subjectOptions).map((opt) => {
                  const isChecked = filters[activeCategory].has(opt);
                  return (
                    <label key={opt} className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleFilter(activeCategory, opt)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <span className="capitalize">{opt}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="md:col-span-3 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold text-gray-900">Results</h2>
              <span className="text-sm text-gray-500">{filteredMaterials.length} found</span>
            </div>
            <div className="flex flex-col gap-3 flex-1">
              {filteredMaterials.map((m) => {
                const isSelected = selectedId === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedId(m.id)}
                    className={`text-left w-full border rounded-lg p-4 shadow-sm transition hover:shadow-md ${isSelected ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-200' : 'bg-white border-gray-200'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-blue-600">{m.subject}</p>
                      <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full capitalize">{m.type}</span>
                    </div>
                    <p className="text-base font-semibold text-gray-900 mb-1 truncate">{m.title}</p>
                    <p className="text-xs text-gray-600 mb-1">Author: {m.author}</p>
                    <p className="text-xs text-gray-500 mb-2">Size: {m.size}</p>
                  </button>
                );
              })}
              {filteredMaterials.length === 0 && (
                <div className="py-10 text-center text-gray-500 border border-dashed border-gray-200 rounded-lg">
                  No materials match your search.
                </div>
              )}
            </div>
            <div className="mt-4">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!selectedId}
              >
                Add selected
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HcmutLibSearch;
