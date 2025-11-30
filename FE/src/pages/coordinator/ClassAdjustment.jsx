import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockCoordinatorClasses, moveStudents } from '../../data/mockCoordinator';

function ClassAdjustment() {
    const { courseId, classId } = useParams();
    const navigate = useNavigate();
    const course = mockCoordinatorClasses.find(c => c.id === courseId);
    const currentClass = course?.classes.find(c => c.id === classId);

    const [selectedStudents, setSelectedStudents] = useState([]);
    const [targetClassId, setTargetClassId] = useState('');

    if (!currentClass) return <div>Class not found</div>;

    const otherClasses = course.classes.filter(c => c.id !== classId);

    const handleCheckboxChange = (studentId) => {
        setSelectedStudents(prev =>
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    const handleSubmit = () => {
        if (selectedStudents.length === 0) return alert("Please select at least one student.");
        if (!targetClassId) return alert("Please select a destination class.");

        const targetClass = otherClasses.find(c => c.id === targetClassId);

        const confirmMsg = `Confirm moving ${selectedStudents.length} students to class ${targetClass.id}?`;

        if (confirm(confirmMsg)) {
            moveStudents(courseId, classId, targetClassId, selectedStudents);

            alert("Students moved successfully! Class status updated.");

            navigate('/coordinator/registration');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 font-sans">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">

                <div className="bg-blue-900 p-6 text-white flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Class Load Balancing</h1>
                        <p className="text-blue-200 mt-1">{course.name} - Class {currentClass.id}</p>
                    </div>
                    <button onClick={() => navigate(-1)} className="text-sm bg-blue-800 px-4 py-2 rounded hover:bg-blue-700">Cancel</button>
                </div>

                <div className="p-6">
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                        <h3 className="font-bold text-red-700">Underloaded Class Detected</h3>
                        <p className="text-sm text-red-600">
                            This class has <strong>{currentClass.enrolled}/{currentClass.max}</strong> students.
                            Please move students to another class to balance the load.
                        </p>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-gray-800 mb-3">1. Select Students to Move</h3>
                        <div className="border rounded-lg divide-y max-h-60 overflow-y-auto">
                            {currentClass.students.map(student => (
                                <label key={student.id} className="flex items-center p-4 hover:bg-gray-50 cursor-pointer transition">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                        checked={selectedStudents.includes(student.id)}
                                        onChange={() => handleCheckboxChange(student.id)}
                                    />
                                    <div className="ml-4">
                                        <p className="font-bold text-gray-800">{student.name}</p>
                                        <p className="text-xs text-gray-500">ID: {student.id}</p>
                                    </div>
                                </label>
                            ))}
                            {currentClass.students.length === 0 && <p className="p-4 text-gray-500 italic">No students left in this class.</p>}
                        </div>
                        <p className="text-sm text-gray-500 mt-2 text-right">Selected: {selectedStudents.length}</p>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-gray-800 mb-3">2. Select Destination Class</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {otherClasses.map(cls => (
                                <div
                                    key={cls.id}
                                    onClick={() => setTargetClassId(cls.id)}
                                    className={`border-2 rounded-lg p-4 cursor-pointer transition relative ${targetClassId === cls.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                                        }`}
                                >
                                    <div className="flex justify-between mb-2">
                                        <span className="font-bold text-gray-800">{cls.tutor}</span>
                                        <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{cls.id}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{cls.schedule}</p>

                                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                                        <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${(cls.enrolled / cls.max) * 100}%` }}></div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1 text-right">{cls.enrolled}/{cls.max} filled</p>

                                    {targetClassId === cls.id && (
                                        <div className="absolute top-2 right-2 text-blue-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t">
                        <button
                            onClick={handleSubmit}
                            disabled={selectedStudents.length === 0 || !targetClassId}
                            className={`px-8 py-3 rounded-lg text-white font-bold shadow-lg transition transform ${selectedStudents.length === 0 || !targetClassId
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-900 hover:bg-blue-800 hover:-translate-y-1'
                                }`}
                        >
                            Confirm Move
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ClassAdjustment;