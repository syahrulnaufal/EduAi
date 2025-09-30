import { useState } from "react";
import '../style.css'; 
import Sidebar from "../components/Sidebar";
import BurgerMenu from "../components/BurgerMenu";
import Topbar from "../components/Topbar";
import { useParams } from "react-router";
import ThumbnailVideoMathCourse from "../components/ThumbnailVideoMathCourse"
import { NavLink } from "react-router";

const data = [
    {
        "id": 1,
        "title": "UI/UX Design Course",
        "description": "Learn the fundamentals of web design, including HTML, CSS, and responsive design principles. Develop the skills to create visually appealing and user-friendly websites.",
        "image": ["gambarfp1.png", "gambarfp2.png", "gambarfp3.png"],
        "curiculum": ["Introduction to HTML", "Styling with CSS", "Introduction to Responsive Design", "Design Principles for Web", "Building a Basic Website"],
        "courseDetails": "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "certificate": "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "whatyoulllearn": [
            "Understand the core principles of UI & UX design.",
            "Create user personas and journey maps.",
            "Develop wireframes and interactive prototypes.",
            "Apply visual design principles like typography and color theory.",
            "Implement basic designs using HTML and CSS."
        ],
        "targetCourse": "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "time": "4 Weeks",
        "teacher": "John Smith"
    },
    {
        "id": 2,
        "title": "Mobile App Development",
        "description": "Dive into the world of mobile app development. Learn to build native iOS and Android applications using industry-leading frameworks like Swift and Kotlin.",
        "image": ["gambarfp4.png", "gambarfp5.png", "gambarfp6.png"],
        "curiculum": ["Introduction to Mobile App Development", "Fundamentals of Swift Programming (iOS)", "Fundamentals of Kotlin Programming (Android)", "Building User Interfaces", "API Integration"],
        "courseDetails": "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "certificate": "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "whatyoulllearn": [
            "Build native applications for iOS using Swift.",
            "Develop native applications for Android using Kotlin.",
            "Design and implement responsive mobile user interfaces.",
            "Understand the full mobile development lifecycle.",
            "Connect your apps to external APIs to fetch data."
        ],
        "targetCourse": "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "time": "8 Weeks",
        "teacher": "David Brown"
    },
    {
        "id": 3,
        "title": "Graphic Design for Beginners",
        "description": "Discover the fundamentals of graphic design, including typography, color theory, layout design, and image manipulation techniques. Create visually stunning designs for print and digital media.",
        "image": ["gambarfp7.png", "gambarfp8.png", "gambarfp9.png"],
        "curiculum": ["Introduction to Graphic Design", "Typography and Color Theory", "Layout Design and Composition", "Image Editing and Manipulation", "Designing for Print and Digital Media"],
        "courseDetails": "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit",
        "certificate": "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "whatyoulllearn": [
            "Master the principles of typography, color, and layout.",
            "Utilize industry-standard software for image editing.",
            "Create compelling visual designs for web and print.",
            "Understand the process of creating a brand identity.",
            "Build a strong portfolio of graphic design work."
        ],
        "targetCourse": "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "time": "10 Weeks",
        "teacher": "Sarah Thompson"
    },
    {
        "id": 4,
        "title": "Web Development",
        "description": "Become proficient in front-end web development. Learn HTML, CSS, JavaScript, and popular frameworks like Bootstrap and React. Build interactive and responsive websites.",
        "image": ["gambarfp10.png", "gambarfp11.png", "gambarfp12.png"],
        "curiculum": ["HTML Fundamentals", "CSS Styling and Layouts", "JavaScript Basics", "Building Responsive Websites", "Introduction to Bootstrap and React"],
        "courseDetails": "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "certificate": "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "whatyoulllearn": [
            "Build semantic and accessible websites with HTML5.",
            "Create complex and responsive layouts using CSS3.",
            "Add dynamic functionality with JavaScript.",
            "Speed up development using the Bootstrap framework.",
            "Construct powerful single-page applications with React."
        ],
        "targetCourse": "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. UIntroduction to Bootstrap and Reactt enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "time": "10 Weeks",
        "teacher": "Michael Adam"
    }
];

function FiturPopuler(){
    // Sidebar 
    const [left, setLeft] = useState('-left-70') 
    const [bg, setBg] = useState('bg-transparent -z-10')
    const [isSidebarHidden, setIsSidebarHidden] = useState(true)
    const iconSize = '20px'
    const menuButton = <svg xmlns="http://www.w3.org/2000/svg" id='menu' height={iconSize} viewBox="0 -960 960 960" width={iconSize} className="fill-my-text dark:fill-my-text-dark"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg>
    const closeButton = <svg xmlns="http://www.w3.org/2000/svg" id='close' height={iconSize} viewBox="0 -960 960 960" width={iconSize} className="fill-my-text dark:fill-my-text-dark"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>;
    const [menuIcon, setMenuIcon] = useState(isSidebarHidden? menuButton : closeButton)
    
    // Function to hide the sidebar
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

    const param = useParams();
    const course = data[param.id - 1];
    // console.log(course);

    return(
        <div>
            <Sidebar 
                className='absolute'
                hideSidebar={hideSidebar} 
                left={left} 
                bg={bg}
            >
                <BurgerMenu icon={menuIcon} handleClick={hideSidebar}/>
            </Sidebar>

            <Topbar>
                <BurgerMenu icon={menuIcon} handleClick={hideSidebar}/>
                <div></div>
            </Topbar>
            <div className="mt-5 bg-[#fefefe] min-h-screen h-max pb-10">
                
                {/* title and descirption */}
                <div className="flex flex-col md:flex-row px-6 justify-between">
                    <div className="py-2">
                        <div className="text-2xl font-bold py-2">{course.title}</div>
                        <div className="text-[#59595A]">{course.description}</div>
                    </div>
                    <div className="p-2 flex justify-center items-end pe-4 pb-4">
                        <NavLink to={`/fitur/${course.id}/curriculum`}>
                            <div className=" border rounded-lg cursor-pointer hover:bg-[#f0f0f0] transition-colors duration-150 border-[#dedede] p-3 w-max bg-[#FCFCFD] text-md">View Course</div>
                        </NavLink>
                    </div>
                </div>
                
                {/* image */}
                <div className="grid grid-cols-3 px-6 mt-10 gap-2">
                    {course.image.map((img, index) => (
                        <div key={index} className="">
                            {/* <img src={`/img/${img}`} alt={`Course ${index + 1}`} className="w-full h-auto rounded-lg" /> */}
                            <div className="w-full h-50 md:h-80 rounded-lg" style={{ backgroundImage: `url(/img/${img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col sm:flex-row px-6 p-2 justify-between">
                    <div className="flex gap-2">
                        <div className="border rounded-md p-1 border-[#F1F1F3]">Time: {course.time}</div>
                        <div className="border rounded-md p-1 border-[#F1F1F3]">Teacher: {course.teacher}</div>
                    </div>
                    <div className="p-1">By: {course.teacher}</div>
                </div>
                
                {/* curiculum */}
                <div className="font-bold text-xl mx-6 p-3 border-b-0 border-1  rounded-t-xl border-[#F1F1F3]">Curriculum</div>
                <div className="mx-6 p-2 grid md:grid-cols-5 grid-cols-3 border rounded-b-xl border-[#F1F1F3]">
                    {course.curiculum.map((kurikulum, index) => (
                        <div key={index} className="pe-2">
                            <div className="font-bold text-3xl">0{index + 1}</div>
                            <div className="max-w-40">{kurikulum}</div>
                        </div>
                    ))}
                </div>
                
                {/* thumbnail video */}
                <div className="h-10"></div>
                <ThumbnailVideoMathCourse 
                    title="Maths - for Standard 3 Students"
                    lessons={49}
                    completionTime="1 month"
                    teacher="Xabi Alonso"
                    studentsLearned="12.000+"
                    price="100k"
                />

                {/* detail */}
                <div className="text-lg font-semibold px-6 mt-10 mb-3">Course Details</div>
                <div className="px-6 text-[#63605c]">{course.courseDetails}</div>
                <div className="text-lg font-semibold px-6 mt-10 mb-3">Certification</div>
                <div className="px-6 text-[#63605c]">{course.certificate}</div>
                <div className="text-lg font-semibold px-6 mt-10 mb-3">Who's this course for</div>
                <div className="px-6 text-[#63605c]">{course.targetCourse}</div>
                <div className="text-lg font-semibold px-6 mt-10 mb-3">What you'll learn in this course</div>
                <div className="mb-20 px-6 ">
                    <ul className="list-disc list-image-[url('/img/Checkbox.svg')] ms-5 text-[#63605c]">
                        {course.whatyoulllearn.map((item, index) => (
                            <li className="ps-3 pb-2" key={index}>{item}</li>
                        ))}
                    </ul>
                </div>


            </div>
        </div>
    );
}

export default FiturPopuler;