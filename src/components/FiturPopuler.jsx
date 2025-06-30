import { useState } from "react";

const listFilter = [
    {
        id: 1,
        label: 'All Program',
        filter: 'all',
    },
    {
        id: 2,
        label: 'UI/UX Design',
        filter: 'ui/ux',
    },
    {
        id: 3,
        label: 'Program Design',
        filter: 'design',
    },
    {
        id: 4,
        label: 'Essay',
        filter: 'essay',
    },
    {
        id: 5,
        label: 'Infografis',
        filter: 'infografis',
    },
    {
        id: 6,
        label: 'Data Science',
        filter: 'data',
    }
];

const listKelas = [
    {
        id: 1,
        gambar: './img/kelas1.png',
        namaKelas: 'Python for Everybody Specialization',
        kelasDeskripsi: 'Product Management Masterclass, you will learn with Sarah Johnson - Head of Product Customer Platform Gojek Indonesia.',
        harga: 300,
        jumlahSiswa: 343,
        tanggal: '2025-06-23'
    }
]
const date = new Date(listKelas[0].tanggal);
const tampilkanTanggal = date.toLocaleDateString('id-ID',{day:'numeric', month:'long', year:'numeric'});
console.log(date)

// main
function FiturPopuler () {

    const [selectedFilter, setSelectedFilter] = useState(['all', 'data']);

    function isSelected(filter){
        let res = false;
        for(let i=0; i < selectedFilter.length; i++){
            if(selectedFilter[i] == filter){
                res = true;
                break
            }
        }
        return res;
    }

    function filter(teks){
        if(isSelected(teks)){ // kalo filter udah ter select maka hapus
            setSelectedFilter(selectedFilter.filter(e => e !== teks))
        }else{
            setSelectedFilter([...selectedFilter, teks])
        }
    }

    return(
        <div className="w-screen flex flex-col items-center">
            
            <div className="text-5xl font-bold text-[#FD661F]">Fitur Populer</div>
            
            <div className="h-10"></div>

            <div className="w-screen flex px-2 justify-start overflow-scroll sm:justify-center">
                <div className="w-max flex gap-2 py-2">
                    <div onClick={()=> setSelectedFilter(['all'])} className="me-4 w-fit px-2 py-1 rounded-lg cursor-pointer hover:bg-hijau/80 transition-colors duration-200 bg-hijau text-white active:bg-hijau">Clear</div>
                    {listFilter.map((item) => {
                        if(isSelected(item.filter)){
                            return <div key={item.id} onClick={()=>filter(item.filter)} className="w-max px-2 py-1 rounded-lg border cursor-pointer bg-hijau border-hijau text-white hover:bg-hijau/90 transition-colors duration-200">{item.label}</div>
                            
                        }else{
                            return <div key={item.id} onClick={()=>filter(item.filter)} className="w-max px-2 py-1 rounded-lg border cursor-pointer border-gray-300 hover:bg-hijau/10 transition-colors duration-200">{item.label}</div>
                        }
                    })}
                </div>
            </div>

            <div className="h-10"></div>

            

        </div>
    );
}

export default FiturPopuler;