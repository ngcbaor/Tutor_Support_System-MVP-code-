export const mockCoordinatorClasses = [
    {
        id: "CO3001",
        name: "Software Engineering",
        classes: [
            {
                id: "L01",
                tutor: "Nguyen Van A",
                role: "Lecturer",
                schedule: "Mon 08:00-10:00",
                enrolled: 4,
                max: 30,
                status: "Underloaded",
                students: [
                    { id: "SV001", name: "Le Nguyen Gia Phuc" },
                    { id: "SV002", name: "Mai Trung Kien" },
                    { id: "SV003", name: "Nguyen Thanh Dat" },
                    { id: "SV004", name: "Tran Ngoc Bao" }
                ]
            },
            {
                id: "L02",
                tutor: "Nguyen Van B",
                role: "Senior Student",
                schedule: "Tue 09:00-11:00",
                enrolled: 28,
                max: 30,
                status: "Balanced",
                students: []
            },
            {
                id: "L03",
                tutor: "Doan Van C",
                role: "Senior Student",
                schedule: "Wed 08:00-10:00",
                enrolled: 26,
                max: 30,
                status: "Balanced",
                students: []
            }
        ]
    },
];

export const moveStudents = (courseId, sourceClassId, targetClassId, studentIds) => {
    const course = mockCoordinatorClasses.find(c => c.id === courseId);
    if (!course) return;

    const sourceClass = course.classes.find(c => c.id === sourceClassId);
    const targetClass = course.classes.find(c => c.id === targetClassId);

    if (sourceClass && targetClass) {
        sourceClass.enrolled -= studentIds.length;
        targetClass.enrolled += studentIds.length;

        sourceClass.students = sourceClass.students.filter(s => !studentIds.includes(s.id));

        sourceClass.status = "Balanced";
    }
};