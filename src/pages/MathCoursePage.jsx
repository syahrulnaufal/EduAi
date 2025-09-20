import React from "react";
import Topbar from "../components/Topbar";
import { useState } from "react";
import '../style.css'; 
import Sidebar from "../components/Sidebar";
import BurgerMenu from "../components/BurgerMenu";
import { useParams } from "react-router";
import dataKelas from "../components/MathCourse"
import ThumbnailVideoMathCourse from "../components/ThumbnailVideoMathCourse";

function MathCoursePage(){
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

    const id = useParams().id;

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
            <div className="w-screen min-h-screen bg-[#F9F9F9] nunito-base">
                
                {/* AI Soal */}
                <div className=" flex justify-center flex-col items-center py-5">
                    <div className="flex items-center justify-center flex-col cursor-pointer select-none hover:bg-grey1/20 active:bg-grey1/3 rounded-lg px-2 py-1 transition-colors duration-100">
                        <img src="/img/ikonAiSoal.png" alt="AI" className="w-10 mt-1"/>
                        <div className="text-my-text">AI Soal</div>
                    </div>
                </div>

                {/* thumbnail video */}
                <ThumbnailVideoMathCourse
                    title="Maths - for Standard 3 Students"
                    lessons={49}
                    completionTime="1 month"
                    teacher="Xabi Alonso"
                    studentsLearned="12.000+"
                    price="100k"
                />
                {/* <div className="w-full px-2 md:px-4 flex justify-center">
                    <div className="w-fit bg-white rounded-lg min-h-40 p-4 flex flex-col sm:flex-row justify-center gap-8" style={{boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'}}>
                        <div className="max-w-100 relative flex items-center justify-center sm:ms-5 ">
                            <img src="/img/videoPembelajaran.png" alt="video pembelajaran" className="rounded-lg"/>
                            <div className="absolute"><img src="/img/PlayButton.svg" alt=">" /></div>
                        </div>
                        <div className="w-fit flex flex-col gap-2 font-light sm:pe-10">
                            <div className="font-semibold text-lg">Maths - for Standard 3 Students | Episode 2</div>
                            <div>Number of Lessons: <span className="font-semibold">49 Lessons</span></div>
                            <div>Completion Time: <span className="font-semibold">1 month</span></div>
                            <div>Teacher: <span className="font-semibold text-[#9B51E0]">Xabi Alonso</span></div>
                            <div>Student have Learned: <span className="font-semibold">12.000+</span></div>
                            <div className="flex gap-1">Review: <span className="flex gap-1">
                                <img src="/img/star.svg" alt="v" className="w-5"/>
                                <img src="/img/star.svg" alt="v" className="w-5"/>
                                <img src="/img/star.svg" alt="v" className="w-5"/>
                                <img src="/img/star.svg" alt="v" className="w-5"/>
                                <img src="/img/star.svg" alt="v" className="w-5"/>
                            </span></div>
                            <div>Price: <span className="font-semibold">100k</span></div>
                            <div className="flex gap-2 mt-5 w-full">
                                <div className="cursor-pointer rounded-md bg-[#150B89] px-4 py-2 text-white hover:bg-[#40389e] transition-colors duration-150 font-medium">Add to Cart</div>
                                <div className="cursor-pointer rounded-md bg-[#FFF7E0] px-4 py-2 hover:bg-[#ffeebd] transition-colors duration-150 font-medium">Free Trial Lesson</div>
                            </div>
                        </div>
                    </div>
                </div> */}

                {/* course description */}
                <div className="h-15"></div>
                <div className="sm:px-30 px-4 text-gray-700 font-medium">

                    <div className="text-xl font-semibold text-gray-900 mb-4">Course Details</div>
                    <div className="mb-6">Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem ratione aliquid dicta dolorem exercitationem animi praesentium odit architecto quod at nam ad officiis neque unde, obcaecati expedita? Molestiae, earum recusandae? Lorem ipsum dolor, sit amet consectetur adipisicing elit. At, officiis optio. Corrupti error est deserunt minima soluta, at, consequatur aperiam voluptas ab obcaecati fugiat voluptatem, sint quibusdam? Quam, expedita provident! Lorem ipsum dolor sit, amet consectetur adipisicing elit. Debitis mollitia, porro quia nostrum culpa perferendis a iusto corporis ullam aut accusantium repellat dolores possimus obcaecati! Quam ipsam distinctio molestias libero.</div>
                    <div className="text-xl font-semibold text-gray-900 mb-4">Certification</div>
                    <div className="mb-6">Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem ratione aliquid dicta dolorem exercitationem animi praesentium odit architecto quod at nam ad officiis neque unde, obcaecati expedita? Molestiae, earum recusandae?</div>
                    <div className="text-xl font-semibold text-gray-900 mb-4">Who's this course for</div>
                    <div className="mb-6">Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem ratione aliquid dicta dolorem exercitationem animi praesentium odit architecto quod at nam ad officiis neque unde, obcaecati expedita? Molestiae, earum recusandae? Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita voluptatibus reiciendis optio reprehenderit exercitationem distinctio dicta temporibus repellendus in illum, aliquam provident, nam error inventore? Vel optio laudantium asperiores eius!</div>
                    <div className="text-xl font-semibold text-gray-900 mb-4">What you'll learn in this course</div>
                    <div className="mb-6">
                        <ul className="list-disc list-image-[url('/img/Checkbox.svg')] ms-5">
                            <li className="ps-3 pb-2">Understanding the fundamentals of mathematics</li>
                            <li className="ps-3 pb-2">Problem-solving techniques</li>
                            <li className="ps-3 pb-2">Advanced topics in algebra and geometry</li>
                            <li className="ps-3 pb-2">Preparation for standardized tests</li>
                        </ul>
                    </div>

                </div>

                {/* any questions? */}
                <div className="sm:px-30 px-4 w-full mt-10">
                    <div className="w-full p-4 rounded-2xl bg-[#211903] h-100 flex flex-col justify-center items-center gap-3 text-white relative">
                        <div className="font-semibold text-3xl z-2">Do you still have any questions?</div>
                        <div className="max-w-120 text-center text-white/80 z-2">Don't hesitate to leave us your phone number. We will contact you to discuss any questions you may have</div>
                        <div className="flex max-w-120 h-13 z-2">
                            <input type="text" className="rounded-tl-lg rounded-bl-lg bg-white/10 ps-4 w-full z-2" placeholder="Enter your phone number"/>
                            <div className="rounded-tr-lg rounded-br-lg bg-[#150B89] cursor-pointer p-2 px-4 z-2 transition-colors duration-150 hover:bg-[#433c90] active:bg-[#2a218a] flex items-center">Subscribe</div>
                        </div>
                        <img src="/img/user1.png" alt="" className="w-13 absolute z-0 sm:left-20 sm:top-10 top-5 left-5"/>
                        <img src="/img/user2.png" alt="" className="w-13 absolute z-0 sm:left-40 top-8 sm:top-auto left-30"/>
                        <img src="/img/user3.png" alt="" className="w-13 absolute z-0 sm:left-35 sm:bottom-8 bottom-5 left-5"/>
                        <img src="/img/user4.png" alt="" className="w-13 absolute z-0 sm:right-35 sm:top-10 top-5 right-5"/>
                        <img src="/img/user5.png" alt="" className="w-13 absolute z-0 sm:right-40 bottom-8 sm:bottom-auto right-30"/>
                        <img src="/img/user6.png" alt="" className="w-13 absolute z-0 sm:right-20 sm:bottom-8 bottom-5 right-5"/>

                    </div>
                </div>

                <div className="h-30"></div>
            </div>
        </div>
    );
}

export default MathCoursePage;