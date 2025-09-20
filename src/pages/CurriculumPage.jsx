import React from "react";
import Topbar from "../components/Topbar";
import { useState } from "react";
import '../style.css'; 
import Sidebar from "../components/Sidebar";
import BurgerMenu from "../components/BurgerMenu";
import { useParams } from "react-router";

// --- Helper Icons ---
const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-lock-fill text-gray-400" viewBox="0 0 16 16">
        <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2"/>
    </svg>
);

const PreviewIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#fa8441" className="bi bi-play-circle-fill" viewBox="0 0 16 16">
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z"/>
    </svg>
);


function Curriculum(){
    // Sidebar state
    const [left, setLeft] = useState('-left-70');
    const [bg, setBg] = useState('bg-transparent -z-10');
    const [isSidebarHidden, setIsSidebarHidden] = useState(true);
    const iconSize = '20px';
    const menuButton = <svg xmlns="http://www.w3.org/2000/svg" id='menu' height={iconSize} viewBox="0 -960 960 960" width={iconSize} className="fill-my-text dark:fill-my-text-dark"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg>;
    const closeButton = <svg xmlns="http://www.w3.org/2000/svg" id='close' height={iconSize} viewBox="0 -960 960 960" width={iconSize} className="fill-my-text dark:fill-my-text-dark"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>;
    const [menuIcon, setMenuIcon] = useState(isSidebarHidden? menuButton : closeButton);

    // Param from URL
    const param = useParams();
    
    // Function to hide sidebar
    function hideSidebar (){
        if(isSidebarHidden){
            setLeft('left-0')
            setBg('bg-my-bg-dark/70 z-20')
            setIsSidebarHidden(false)
            setMenuIcon(closeButton)
          }else{
            setLeft('-left-70')
            setIsSidebarHidden(true)
            setBg('bg-transparent -z-10')
            setMenuIcon(menuButton)
        }
    }

    // --- Data for all courses ---
    const allCourseData = [{
        title: "UI/UX Design Course",
        description: "Welcome to the UI/UX Design Course! This comprehensive program will equip you with the knowledge and skills to create intuitive, user-friendly, and visually appealing digital experiences. Learn the entire design process, from user research and wireframing to prototyping and usability testing.",
        videoThumbnail: "/img/gambarfp7.png",
        modules: [{
            id: "01",
            title: "Introduction to UI/UX Design",
            lessons: [
                { title: "Understanding User-Centered Design Principles", duration: "1h 37min", isPreview: false },
                { title: "The Importance of User-Centered Design", duration: "48min", isPreview: true },
                { title: "The Role of a UI/UX Designer in a Team", duration: "1h 12min", isPreview: false },
            ]
        }, {
            id: "02",
            title: "User Research and Analysis",
            lessons: [
                { title: "Conducting User Research and Interviews", duration: "2h 15min", isPreview: false },
                { title: "Analyzing User Needs and Behavior", duration: "1h 55min", isPreview: false },
                { title: "Creating User Personas and Scenarios", duration: "1h 30min", isPreview: false },
            ]
        }, {
            id: "03",
            title: "Wireframing and Prototyping",
            lessons: [
                { title: "Introduction to Wireframing Tools & Techniques", duration: "1h 45min", isPreview: false },
                { title: "Creating Low-Fidelity Wireframes", duration: "2h 5min", isPreview: false },
                { title: "Developing Interactive Prototypes", duration: "2h 30min", isPreview: false },
            ]
        }, {
            id: "04",
            title: "Visual Design and Branding",
            lessons: [
                { title: "Color Theory and Typography in UI Design", duration: "1h 50min", isPreview: false },
                { title: "Visual Elements and Layout Design", duration: "2h 10min", isPreview: false },
                { title: "Creating a Strong Brand Identity", duration: "1h 40min", isPreview: false },
            ]
        }, {
            id: "05",
            title: "Usability Testing and Iteration",
            lessons: [
                { title: "Planning and Conducting Usability Tests", duration: "2h 20min", isPreview: false },
                { title: "Analyzing Usability Test Results", duration: "1h 50min", isPreview: false },
                { title: "Iterating on Designs Based on Feedback", duration: "2h 0min", isPreview: false },
            ]
        }]
    },
    {
        title: "Web Development",
        description: "This course covers all the essentials of modern web development. You'll learn to build responsive and interactive websites from the ground up using HTML, CSS, JavaScript, and popular frameworks like React.",
        videoThumbnail: "/img/gambarfp7.png",
        modules: [{
            id: "01",
            title: "HTML Fundamentals",
            lessons: [
                { title: "Introduction to Web Structure", duration: "1h 15min", isPreview: false },
                { title: "Semantic HTML and Accessibility", duration: "1h 45min", isPreview: true },
                { title: "Creating Forms and Tables", duration: "1h 20min", isPreview: false },
            ]
        }, {
            id: "02",
            title: "CSS Styling and Layouts",
            lessons: [
                { title: "Selectors and the Box Model", duration: "2h 10min", isPreview: false },
                { title: "Flexbox and Grid for Modern Layouts", duration: "2h 30min", isPreview: false },
                { title: "Responsive Design with Media Queries", duration: "1h 50min", isPreview: false },
            ]
        }, {
            id: "03",
            title: "JavaScript Basics",
            lessons: [
                { title: "Variables, Data Types, and Functions", duration: "2h 40min", isPreview: false },
                { title: "DOM Manipulation and Events", duration: "2h 15min", isPreview: false },
                { title: "Introduction to ES6+ Features", duration: "1h 45min", isPreview: false },
            ]
        }, {
            id: "04",
            title: "Advanced JavaScript & Frameworks",
            lessons: [
                { title: "Asynchronous JavaScript (Promises, async/await)", duration: "2h 5min", isPreview: false },
                { title: "Fetching Data with APIs", duration: "1h 55min", isPreview: false },
                { title: "Introduction to React and Components", duration: "3h 0min", isPreview: false },
            ]
        }, {
            id: "05",
            title: "Project Building and Deployment",
            lessons: [
                { title: "Building a Complete Website Project", duration: "4h 0min", isPreview: false },
                { title: "Version Control with Git and GitHub", duration: "1h 30min", isPreview: false },
                { title: "Deploying Your Site to the Web", duration: "1h 10min", isPreview: false },
            ]
        }]
    },
    {
        title: "Mobile App Development",
        description: "Dive into the world of mobile apps. This course will teach you how to build native applications for both iOS and Android, covering UI design, programming fundamentals, and deployment to the app stores.",
        videoThumbnail: "/img/gambarfp7.png",
        modules: [{
            id: "01",
            title: "Introduction to Mobile Development",
            lessons: [
                { title: "Mobile Ecosystem: iOS vs Android", duration: "1h 10min", isPreview: false },
                { title: "Setting Up Your Development Environment (Xcode/Android Studio)", duration: "1h 30min", isPreview: true },
                { title: "Native vs. Cross-Platform Apps", duration: "1h 0min", isPreview: false },
            ]
        }, {
            id: "02",
            title: "Building User Interfaces",
            lessons: [
                { title: "UI Components and Layouts in Swift (iOS)", duration: "2h 20min", isPreview: false },
                { title: "UI Components and Layouts in Kotlin (Android)", duration: "2h 20min", isPreview: false },
                { title: "Navigation and User Flow", duration: "1h 40min", isPreview: false },
            ]
        }, {
            id: "03",
            title: "Programming for Mobile",
            lessons: [
                { title: "Swift Programming Fundamentals", duration: "3h 0min", isPreview: false },
                { title: "Kotlin Programming Fundamentals", duration: "3h 0min", isPreview: false },
                { title: "Object-Oriented Programming Concepts", duration: "2h 0min", isPreview: false },
            ]
        }, {
            id: "04",
            title: "Working with Data and APIs",
            lessons: [
                { title: "Local Data Storage (UserDefaults, Room)", duration: "2h 10min", isPreview: false },
                { title: "Networking and Fetching Data from APIs", duration: "2h 30min", isPreview: false },
                { title: "Parsing JSON Data", duration: "1h 45min", isPreview: false },
            ]
        }, {
            id: "05",
            title: "App Deployment",
            lessons: [
                { title: "Preparing Your App for Release", duration: "1h 50min", isPreview: false },
                { title: "Submitting to the Apple App Store", duration: "1h 30min", isPreview: false },
                { title: "Publishing on the Google Play Store", duration: "1h 30min", isPreview: false },
            ]
        }]
    },
    {
        title: "Graphic Design for Beginners",
        description: "Unleash your creativity in this introductory course on graphic design. You'll learn the core principles of design, master essential tools, and create stunning visuals for digital and print media.",
        videoThumbnail: "/img/gambarfp7.png",
        modules: [{
            id: "01",
            title: "Core Principles of Design",
            lessons: [
                { title: "Composition, Balance, and Hierarchy", duration: "1h 40min", isPreview: false },
                { title: "Introduction to Design Theory", duration: "1h 10min", isPreview: true },
                { title: "Contrast, Repetition, and Proximity", duration: "1h 25min", isPreview: false },
            ]
        }, {
            id: "02",
            title: "Typography and Color Theory",
            lessons: [
                { title: "Choosing and Pairing Fonts", duration: "1h 50min", isPreview: false },
                { title: "The Psychology of Color", duration: "1h 30min", isPreview: false },
                { title: "Creating Effective Color Palettes", duration: "1h 40min", isPreview: false },
            ]
        }, {
            id: "03",
            title: "Introduction to Design Software",
            lessons: [
                { title: "Navigating Adobe Illustrator", duration: "2h 0min", isPreview: false },
                { title: "Working with Vector Shapes and the Pen Tool", duration: "2h 30min", isPreview: false },
                { title: "Layers, Masks, and Effects", duration: "2h 10min", isPreview: false },
            ]
        }, {
            id: "04",
            title: "Image Editing and Manipulation",
            lessons: [
                { title: "Navigating Adobe Photoshop", duration: "1h 50min", isPreview: false },
                { title: "Photo Retouching and Color Correction", duration: "2h 20min", isPreview: false },
                { title: "Creating Composite Images", duration: "2h 0min", isPreview: false },
            ]
        }, {
            id: "05",
            title: "Creating Real-World Projects",
            lessons: [
                { title: "Designing a Professional Logo", duration: "3h 0min", isPreview: false },
                { title: "Creating a Business Card and Brand Guide", duration: "2h 30min", isPreview: false },
                { title: "Designing a Social Media Graphic", duration: "2h 0min", isPreview: false },
            ]
        }]
    }
];

    const initialCourseData = allCourseData[param.id - 1];
    const [courseData, setCourseData] = useState(initialCourseData);

    function handleLessonClick(clickedModuleIndex, clickedLessonIndex) {
        const updatedCourseData = {
            ...courseData,
            modules: courseData.modules.map((module, moduleIndex) => ({
                ...module,
                lessons: module.lessons.map((lesson, lessonIndex) => ({
                    ...lesson,
                    isPreview: moduleIndex === clickedModuleIndex && lessonIndex === clickedLessonIndex
                }))
            }))
        };
        setCourseData(updatedCourseData);
    }

    return(
        <div>
            <Sidebar className='absolute' hideSidebar={hideSidebar} left={left} bg={bg}>
                <BurgerMenu icon={menuIcon} handleClick={hideSidebar}/>
            </Sidebar>

            <Topbar>
                <BurgerMenu icon={menuIcon} handleClick={hideSidebar}/>
                <div></div>
            </Topbar>

            <main className="bg-gray-50 min-h-screen">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    
                    <div className="md:flex md:items-center md:justify-between mb-8">
                        <div className="flex-1 min-w-0">
                            <h1 className="text-4xl font-bold leading-tight text-gray-900">{courseData.title}</h1>
                        </div>
                        <div className="mt-4 flex md:mt-0 md:ml-4 max-w-md">
                            <p className="text-sm text-gray-500">{courseData.description}</p>
                        </div>
                    </div>

                    <div className="relative mb-12 cursor-pointer group">
                        <img src={courseData.videoThumbnail} alt="Course thumbnail" className="w-full rounded-lg shadow-lg" />
                        <div className="absolute inset-0 bg-black/30 hover:bg-black/10 flex items-center justify-center rounded-lg transition-colors duration-300 ">
                            <div className="bg-white rounded-full h-20 w-20 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-play-fill text-gray-800 ml-1" viewBox="0 0 16 16">
                                    <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"/>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                        {courseData.modules.map((module, moduleIndex) => (
                            <div key={module.id} className="flex flex-col space-x-6 p-6 bg-white rounded-lg" style={{boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'}}>
                                <div className="text-5xl font-bold flex justify-end text-gray-800">{module.id}</div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-800 ps-2 mb-6">{module.title}</h3>
                                    <div className="space-y-3">
                                        {module.lessons.map((lesson, lessonIndex) => (
                                            <div 
                                                key={lesson.title}
                                                onClick={() => handleLessonClick(moduleIndex, lessonIndex)}
                                                className={`flex items-center justify-between p-3 rounded-md border cursor-pointer transition-colors duration-200 ${lesson.isPreview ? 'border-orange-200 bg-[#fffcf8]' : 'border-[#F1F1F3] bg-white hover:bg-gray-50'}`}
                                            >
                                                <p className="text-sm font-medium text-gray-700">{lesson.title}</p>
                                                <div className="flex items-center space-x-3 text-xs">
                                                    {lesson.isPreview ? (
                                                        <span className="text-orange-500 bg-orange-100 rounded-md p-2 flex items-center gap-1.5 w-max font-semibold">
                                                            <PreviewIcon/>
                                                            <span>{lesson.duration}</span>
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-500 p-2 bg-gray-100 rounded-md flex items-center gap-1.5 w-max">
                                                            <img src="/img/clock.svg" alt="" className="w-4 h-4"/>
                                                            <span>{lesson.duration}</span>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Curriculum;