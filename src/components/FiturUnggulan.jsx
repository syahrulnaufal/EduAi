import { useState } from "react";

function FiturUnggulan() {

    const [curr, setCurr] = useState(0)

    const listFitur = [
        {
            id: 1,
            img: './img/tryout.png'
        },
        {
            id: 2,
            img: './img/progres.png'
        },
        {
            id: 3,
            img: './img/minatBakat.png'
        },
        {
            id: 4,
            img: './img/laporanBelajar.png'
        },
        {
            id: 5,
            img: './img/tryout.png'
        },
        {
            id: 6,
            img: './img/progres.png'
        },
        {
            id: 7,
            img: './img/minatBakat.png'
        },
        {
            id: 8,
            img: './img/laporanBelajar.png'
        },
        {
            id: 9,
            img: './img/progres.png'
        },
        {
            id: 10,
            img: './img/minatBakat.png'
        },
        {
            id: 11,
            img: './img/laporanBelajar.png'
        },
    ];

    // const Containerfitur = []; // buat container untuk membagi item di fitur ke div yang masing2 berisi maksimal 4 item

    // for (let i = 0; i < Math.ceil(listFitur.length / 4); i++) {
    //     let fitur = []; // loop masing2 fitur
    //     for (let j = i * 4; j < 4 * (i + 1); j++) {
    //         if (j >= listFitur.length) {
    //             fitur.push(<div key={j + 1} className="flex-1/4"></div>);
    //         } else {
    //             fitur.push(
    //                 <div key={listFitur[j].id} className="flex-1/4">
    //                     <img src={listFitur[j].img} className="w-full" />
    //                 </div>
    //             );
    //         }
    //     }

    //     Containerfitur.push(
    //         <div className=" h-20 flex gap-4 w-[77vw] justify-evenly" key={i}>{fitur}</div>
    //     );

    //     fitur = [];
    // }

    function prev() {
        setCurr((curr) => (curr == 0 ? listFitur.length - 1 : curr - 1))
    }

    function next() {
        setCurr((curr) => (curr == listFitur.length - 1 ? 0 : curr + 1))
    }

    return (
        <div className="w-[90vw] sm:w-[70vw] bg-white p-2 rounded-lg flex flex-col ">
            <div className="w-full flex flex-col sm:flex-row gap-2 justify-between px-2 pt-2 font-semibold text-lg relative">
                <div className="w-max">Fitur Unggulan Edu AI </div>
                <div className="sm:flex gap-2 w-fit hidden">
                    <div onClick={prev} className=" rounded-full border-2 flex items-center border-amber-500 bg-white hover:bg-amber-100 transition-colors duration-200 active:bg-amber-300 cursor-pointer"><img src="./img/orangeArrow.png" alt="prev" className="sm:w-[25px] w-[20px]"/></div>
                    <div onClick={next} className=" rounded-full border-2 flex items-center border-amber-500 bg-amber-500 hover:bg-amber-400 transition-colors duration-200 active:bg-amber-700 hover:border-amber-400 cursor-pointer active:border-amber-700"><img className="sm:w-[25px] w-[20px]" src="./img/whiteArrow.png" alt="prev" /></div>
                </div>
            </div>
            <div className="flex w-full overflow-y-hidden h-30 relative">
                {/* <div className="w-full"> */}
                {/* w-[${Math.ceil(listFitur.length/4)*100}%] */}
                    <div className={`w-max h-30 absolute gap-4 flex transition-transform ease-in-out duration-500`} style={{transform: `translateX(-${curr * 100 / listFitur.length}%)`,}}>
                        {/* {Containerfitur.map((e) =>
                            e
                        )} */}
                        {listFitur.map((fitur) => 
                            <div key={fitur.id} className='w-50 sm:w-60 py-4'>
                                <img src={fitur.img} className="w-full" />
                            </div>
                        )}
                    </div>
                {/* </div> */}
            </div>
        </div>
    );
}

export default FiturUnggulan;