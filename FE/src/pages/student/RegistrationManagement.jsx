import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockRegistrations } from '../../data/mockRegistration';
import { mockCourses } from '../../data/mockCourses';

function RegistrationManagement() {
    const navigate = useNavigate();
    const [registrations, setRegistrations] = useState(mockRegistrations);
    const [selectedReg, setSelectedReg] = useState(null); // Registration đang chọn để xem detail
    const [isChangeMode, setIsChangeMode] = useState(false); // Chế độ đổi lớp

    // 1. Xử lý mở Modal chi tiết (Figure 1.17)
    const handleModifyClick = (reg) => {
        setSelectedReg(reg);
        setIsChangeMode(false);
    };

    // 2. Xử lý Hủy đăng ký (Delete)
    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this course registration?")) {
            setRegistrations(registrations.filter(r => r.id !== selectedReg.id));
            setSelectedReg(null);
        }
    };

    // 3. Xử lý chuyển sang màn hình chọn lớp mới (Figure 1.18)
    const handleChangeClassMode = () => {
        setIsChangeMode(true);
    };

    // 4. Xử lý xác nhận đổi lớp (Figure 1.19 -> Update)
    const handleConfirmChange = (newClass) => {
        const updatedRegistrations = registrations.map(reg => {
            if (reg.id === selectedReg.id) {
                return {
                    ...reg,
                    classId: newClass.id,
                    tutor: newClass.tutor,
                    time: newClass.time,
                    role: newClass.role
                };
            }
            return reg;
        });
        setRegistrations(updatedRegistrations);
        setSelectedReg(null);
        setIsChangeMode(false);
        alert(`Successfully changed to class ${newClass.id} with ${newClass.tutor}`);
    };

    // Lấy danh sách các lớp khác của môn học đang chọn (cho chức năng đổi lớp)
    const getAvailableClasses = () => {
        if (!selectedReg) return [];
        const course = mockCourses.find(c => c.code === selectedReg.courseId);
        return course ? course.classes : [];
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-blue-900">Registration Management</h1>
                    <button onClick={() => navigate('/student/registration')} className="text-gray-500 hover:text-blue-900">
                        Back to Course List
                    </button>
                </div>

                {/* --- MAIN LIST (Figure 1.16) --- */}
                <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                    <h2 className="text-lg font-bold text-gray-700 mb-4">My Registered Courses</h2>
                    <div className="space-y-4">
                        {registrations.map((reg) => (
                            <div key={reg.id} className="border border-blue-100 rounded-lg p-4 flex flex-col md:flex-row justify-between items-center bg-white hover:shadow-md transition">
                                <div className="flex items-center gap-4">
                                    <div className="bg-blue-900 text-white p-3 rounded text-center min-w-[80px]">
                                        <span className="block text-sm font-bold">{reg.courseId}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-blue-900 text-lg">{reg.courseName}</h3>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-semibold">Tutor:</span> {reg.tutor} ({reg.role})
                                        </p>
                                        <p className="text-sm text-gray-500">{reg.time}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleModifyClick(reg)}
                                    className="mt-3 md:mt-0 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium shadow-sm"
                                >
                                    Modify
                                </button>
                            </div>
                        ))}
                        {registrations.length === 0 && <p className="text-center text-gray-500">No courses registered yet.</p>}
                    </div>
                </div>
            </div>

            {/* --- MODAL CHI TIẾT & ĐỔI LỚP --- */}
            {selectedReg && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">

                        {/* Header */}
                        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-800">
                                {isChangeMode ? 'Change Tutor / Class' : 'Registration Detail'}
                            </h3>
                            <button onClick={() => setSelectedReg(null)} className="text-gray-400 hover:text-gray-600 font-bold text-xl">&times;</button>
                        </div>

                        <div className="p-6">
                            {!isChangeMode ? (
                                // --- VIEW: DETAIL (Figure 1.17) ---
                                <div className="space-y-4">
                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                        <p><strong>Student Name:</strong> {selectedReg.studentName}</p>
                                        <p><strong>Student ID:</strong> {selectedReg.studentId}</p>
                                        <p><strong>Course:</strong> {selectedReg.courseName} ({selectedReg.courseId})</p>
                                        <p><strong>Current Tutor:</strong> {selectedReg.tutor} - {selectedReg.role}</p>
                                        <p><strong>Time Slot:</strong> {selectedReg.time}</p>
                                    </div>

                                    <div className="flex justify-end gap-3 mt-6">
                                        <button
                                            onClick={handleDelete}
                                            className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 font-medium"
                                        >
                                            Delete Registration
                                        </button>
                                        <button
                                            onClick={handleChangeClassMode}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm"
                                        >
                                            Change Class
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // --- VIEW: CHANGE CLASS LIST (Figure 1.18) ---
                                <div>
                                    <p className="text-sm text-gray-500 mb-4">Select a new tutor/class for <strong>{selectedReg.courseName}</strong>:</p>
                                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                                        {getAvailableClasses().map((cls) => {
                                            const isCurrent = cls.tutor === selectedReg.tutor;
                                            const isFull = cls.enrolled >= cls.max;
                                            return (
                                                <div key={cls.id} className={`border rounded-lg p-4 flex justify-between items-center ${isCurrent ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                                                    <div>
                                                        <p className="font-bold text-gray-800">{cls.tutor} <span className="text-xs font-normal text-gray-500">({cls.role})</span></p>
                                                        <p className="text-sm text-gray-600">{cls.time}</p>
                                                        <p className={`text-xs font-bold mt-1 ${isFull ? 'text-red-500' : 'text-green-600'}`}>
                                                            {cls.enrolled}/{cls.max} Slots
                                                        </p>
                                                    </div>
                                                    {isCurrent ? (
                                                        <span className="text-blue-600 text-sm font-bold bg-white px-3 py-1 rounded border border-blue-200">Current</span>
                                                    ) : (
                                                        <button
                                                            disabled={isFull}
                                                            onClick={() => handleConfirmChange(cls)}
                                                            className={`px-4 py-1.5 rounded text-sm font-medium ${isFull
                                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                                                }`}
                                                        >
                                                            Select
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="mt-6 pt-4 border-t flex justify-start">
                                        <button onClick={() => setIsChangeMode(false)} className="text-gray-500 hover:underline text-sm">
                                            &larr; Back to Detail
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RegistrationManagement;