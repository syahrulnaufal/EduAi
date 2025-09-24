import { Children } from "react";
import { NavLink } from "react-router";

function FiturCard({img, className, description, price, student, date, discount = 0, children, id}){
     
    const elements = Children.toArray(children);

    // main
    return (
    <div className="flex flex-col bg-white rounded-xl" style={{boxShadow: '0px 10px 60px 0px rgba(38, 45, 118, 0.08)'}}>
        <img src={img} alt="preview" className="w-full rounded-xl rounded-b-none" />
        <div className="relative p-3 flex justify-center h-full">

            {/* jumlah murid */}
            <div className="absolute -top-4 bg-white rounded-full p-1 pe-3 w-fit max-w-[90%] ">
                {student >= 3 ? (
                    <div className="flex items-center">
                        <div className="relative w-16 sm:w-12 h-8 pe-6 ">
                            {Array.from({length:3}).map((_, index) =>
                                <img key={index} src={`./img/student${index+1}.png`} className={`rounded-full h-full border-2 border-white absolute`} style={{left: `${index/5.5*100}%`}}></img>
                            )}
                        </div>
                        <span className="text-sm text-my-text w-fit md:ps-0.5 sm:ps-2">+{student-1} students </span>
                    </div>
                ) : (
                    <div className="flex items-center">
                        <div className="relative w-18 sm:w-20 h-8 pe-6 ">
                            {Array.from({length:student}).map((item, index) =>
                                <img key={index} src={`./img/student${index+1}.png`} className={`rounded-full h-full border-2 border-white absolute`} style={{left: `${index/5.5*100}%`}}></img>
                            )}
                        </div>
                        <span className="text-sm text-my-text w-fit md:ps-0.5 sm:ps-2">+{student-1} students </span>
                    </div>
                )}
            </div>

            <div className="w-full flex flex-col justify-between ">
                {/* tanggal */}
                <div className="text-xs md:text-sm lg:text-base raleway-thin text-grey1 mt-5">{new Date(date).toLocaleDateString('id-ID',{day:'numeric', month:'long', year:'numeric'})}</div>
                
                {/* title */}
                <div className="text-xs md:text-base lg:text-lg mt-2 mb-1 font-semibold text-hijau">{className}</div>

                {/* description */}
                <div className="text-xs md:text-sm lg:text-base text-grey1 max-h-25 overflow-ellipsis overflow-y-auto">{description}</div>

                {/* harga diskon, harga asli, button */}
                <div className="flex justify-between mt-5 items-center">
                    <div className=" flex gap-2 items-center flex-col sm:flex-row">
                        <div className="text-jingga text-xl font-semibold">${price}</div>
                        <div className="text-grey1 text-sm line-through">${price}</div>
                    </div>
                    {elements.length <= 0 ?
                    <NavLink to={`/fitur/${id}`} className="rounded-lg cursor-pointer select-none bg-hijau text-white hover:bg-hijau/85 active:bg-hijau px-4 py-2 h-fit transition-colors duration-200">Enroll</NavLink>
                    : elements[0]}
                </div>
            </div>

            
        
        </div>
    </div>
    );
}

export default FiturCard;