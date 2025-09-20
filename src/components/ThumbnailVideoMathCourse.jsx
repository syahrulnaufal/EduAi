function ThumbnailVideoMathCourse({title, lessons, completionTime, teacher, studentsLearned, price}) {
    return (
        // thumbnail video 
        <div className="w-full px-2 md:px-4 flex justify-center">
            <div className="w-fit bg-white rounded-lg min-h-40 p-4 flex flex-col sm:flex-row justify-center gap-8" style={{boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'}}>
                <div className="max-w-100 relative flex items-center justify-center sm:ms-5 ">
                    <img src="/img/videoPembelajaran.png" alt="video pembelajaran" className="rounded-lg"/>
                    <div className="absolute"><img src="/img/PlayButton.svg" alt=">" /></div>
                </div>
                <div className="w-fit flex flex-col gap-2 font-light sm:pe-10">
                    <div className="font-semibold text-lg">{title}</div>
                    <div>Number of Lessons: <span className="font-semibold">{lessons} Lessons</span></div>
                    <div>Completion Time: <span className="font-semibold">{completionTime}</span></div>
                    <div>Teacher: <span className="font-semibold text-[#9B51E0]">{teacher}</span></div>
                    <div>Student have Learned: <span className="font-semibold">{studentsLearned}</span></div>
                    <div className="flex gap-1">Review: <span className="flex gap-1">
                        <img src="/img/star.svg" alt="v" className="w-5"/>
                        <img src="/img/star.svg" alt="v" className="w-5"/>
                        <img src="/img/star.svg" alt="v" className="w-5"/>
                        <img src="/img/star.svg" alt="v" className="w-5"/>
                        <img src="/img/star.svg" alt="v" className="w-5"/>
                    </span></div>
                    <div>Price: <span className="font-semibold">{price}</span></div>
                    <div className="flex gap-2 mt-5 w-full">
                        <div className="cursor-pointer rounded-md bg-[#150B89] px-4 py-2 text-white hover:bg-[#40389e] transition-colors duration-150 font-medium">Add to Cart</div>
                        <div className="cursor-pointer rounded-md bg-[#FFF7E0] px-4 py-2 hover:bg-[#ffeebd] transition-colors duration-150 font-medium">Free Trial Lesson</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ThumbnailVideoMathCourse;