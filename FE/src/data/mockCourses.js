export const mockCourses = [
  {
    id: "CO3001",
    code: "CO3001",
    name: "Software Engineering",
    department: "Faculty of Computer Science and Engineering",
    credits: 3,
    prerequisites: ["CO1027"],
    description: "LO.1: Understanding that software systems need to be developed methodologically and professionally.\nLO.2: Elicit requirements & perform architectural design.\nLO.3: Carry out detailed design, coding, testing.\nLO.4: Use the UML language effectively in software development.",
    tutorsInCharge: ["Nguyen Van A", "Nguyen Van B", "Nguyen Hoang C"],
    classes: [
      { id: "L01", tutor: "Nguyen Van A", role: "Lecturer", time: "Mon 08:00-10:00", rating: 4.9, reviewCount: 54, enrolled: 0, max: 30 },
      { id: "L02", tutor: "Nguyen Van B", role: "Senior Student", time: "Mon 08:00-10:00", rating: 4.7, reviewCount: 31, enrolled: 5, max: 30 },
      { id: "L03", tutor: "Doan Van C", role: "Senior Student", time: "Mon 07:00-09:00", rating: 4.5, reviewCount: 42, enrolled: 12, max: 30 },
      { id: "L04", tutor: "Nguyen Van D", role: "Lecturer", time: "Mon 11:00-13:00", rating: 4.8, reviewCount: 20, enrolled: 28, max: 30 }, // Gần đầy
    ]
  },
  {
    id: "CO2013",
    code: "CO2013",
    name: "Database Systems",
    department: "Faculty of Computer Science and Engineering",
    credits: 3,
    prerequisites: ["CO1023"],
    description: "Introduction to database concepts, relational models, SQL, and database design.",
    tutorsInCharge: ["Lê Nguyễn Bảo Minh"],
    classes: [
      { id: "L01", tutor: "Lê Nguyễn Bảo Minh", role: "Lecturer", time: "Tue 09:00-11:00", rating: 4.6, reviewCount: 15, enrolled: 10, max: 40 },
    ]
  },
  {
    id: "CO2014",
    code: "CO2014",
    name: "Operating Systems",
    department: "Faculty of Computer Science and Engineering",
    credits: 3,
    prerequisites: ["CO2003"],
    description: "Process management, memory management, file systems, and I/O systems.",
    tutorsInCharge: ["Le Van C"],
    classes: [
      { id: "L01", tutor: "Le Van C", role: "Lecturer", time: "Wed 13:00-15:00", rating: 4.2, reviewCount: 10, enrolled: 30, max: 50 },
    ]
  },
  {
    id: "CO3005",
    code: "CO3005",
    name: "Computer Networks",
    department: "Faculty of Computer Science and Engineering",
    credits: 3,
    prerequisites: ["CO2014"],
    description: "Network layers, protocols (TCP/IP), routing algorithms, and network security basics.",
    tutorsInCharge: ["Pham Van D"],
    classes: [
      { id: "L01", tutor: "Pham Van D", role: "Lecturer", time: "Thu 07:00-09:00", rating: 4.8, reviewCount: 60, enrolled: 40, max: 45 },
    ]
  },
  {
    id: "CO1027",
    code: "CO1027",
    name: "Programming Fundamentals",
    department: "Faculty of Computer Science and Engineering",
    credits: 3,
    prerequisites: [],
    description: "Basic programming concepts: variables, loops, functions, pointers in C++.",
    tutorsInCharge: ["Hoang Van E"],
    classes: [
      { id: "L01", tutor: "Hoang Van E", role: "Lecturer", time: "Fri 08:00-11:00", rating: 4.9, reviewCount: 100, enrolled: 80, max: 100 },
    ]
  },
  {
    id: "CO4001",
    code: "CO4001",
    name: "Artificial Intelligence",
    department: "Faculty of Computer Science and Engineering",
    credits: 3,
    prerequisites: ["CO3001", "CO2001"],
    description: "Search algorithms, knowledge representation, machine learning basics.",
    tutorsInCharge: ["Ngo Van F"],
    classes: [
      { id: "L01", tutor: "Ngo Van F", role: "Lecturer", time: "Mon 13:00-16:00", rating: 5.0, reviewCount: 25, enrolled: 20, max: 30 },
    ]
  }
];