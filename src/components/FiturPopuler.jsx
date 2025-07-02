import { useState, useEffect } from "react";
import FiturCard from "./FiturCard";

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

const listSemuaKelas = [
    {
        id: 1,
        gambar: './img/kelas1.png',
        namaKelas: 'Python for Everybody Specialization',
        kelasDeskripsi: 'Product Management Masterclass, you will learn with Sarah Johnson - Head of Product Customer Platform Gojek Indonesia.',
        harga: 300,
        jumlahSiswa: 343,
        tanggal: '2025-06-23',
        diskon: 20,
        kategori: 'data',
    },
    {
        id: 2,
        gambar: './img/kelas2.png',
        namaKelas: 'The Science of Well-Being',
        kelasDeskripsi: 'Product Management Masterclass, you will learn with Sarah Johnson - Head of Product Customer Platform Gojek Indonesia.',
        harga: 123,
        jumlahSiswa: 235,
        tanggal: '2025-07-28',
        diskon: 15,
        kategori: 'essay',
    },
    {
        id: 3,
        gambar: './img/kelas3.png',
        namaKelas: 'BM Data Science Professional Certificate',
        kelasDeskripsi: 'Product Management Masterclass, you will learn with Sarah Johnson - Head of Product Customer Platform Gojek Indonesia.',
        harga: 678,
        jumlahSiswa: 12,
        tanggal: '2025-07-28',
        diskon: 22,
        kategori: 'infografis',
    },
    {
        id: 4,
        gambar: './img/kelas4.png',
        namaKelas: 'Product Management Basic - Course',
        kelasDeskripsi: 'Product Management Masterclass, you will learn with Sarah Johnson - Head of Product Customer Platform Gojek Indonesia.',
        harga: 380,
        jumlahSiswa: 41,
        tanggal: '2025-06-28',
        diskon: 18,
        kategori: 'ui/ux',
    },
];

// main
function FiturPopuler () {

    const [selectedFilter, setSelectedFilter] = useState([]);
    const [listKelas, setListKelas] = useState(listSemuaKelas);

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

    // fungsi untuk filter listKelas
    useEffect(() => {
        if (selectedFilter.length === 0 || selectedFilter.includes('all')) {
          setListKelas(listSemuaKelas);
        } else {
          setListKelas(listSemuaKelas.filter(e => selectedFilter.includes(e.kategori)));
        }
      }, [selectedFilter]);

    // fungsi ketika filter kategori dipilih
    function filter(teks){
        if(isSelected(teks)){ // kalo filter udah ter select maka hapus
            setSelectedFilter(selectedFilter.filter(e => e !== teks))
        }else{ // menambahkan filter
            setSelectedFilter([...selectedFilter, teks])
        }
    }

    return(
        <div className="w-screen flex flex-col items-center">
            
            {/* title */}
            <div className="text-5xl font-bold text-[#FD661F]">Fitur Populer</div>
            <div className="h-10"></div>
            
            {/* filter kategori */}
            <div className="w-screen flex px-2 justify-start overflow-scroll sm:justify-center">
                <div className="w-max flex gap-2 py-2">
                    <div onClick={()=> setSelectedFilter([])} className="me-4 w-fit px-2 py-1 rounded-lg cursor-pointer hover:bg-hijau/80 transition-colors duration-100 bg-hijau text-white active:bg-hijau">Clear</div>
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

            {/* Cards */}
            <div className="w-screen flex justify-center">
                <div className="max-w-[90vw] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {listKelas.map((kelas) => 
                        <FiturCard 
                            key={kelas.id}
                            img={kelas.gambar}
                            className={kelas.namaKelas}
                            description={kelas.kelasDeskripsi}
                            student={kelas.jumlahSiswa}
                            date={kelas.tanggal}
                            price={kelas.harga}
                            discount={kelas.diskon}
                        />
                    )}
                </div>
            </div>

        </div>
    );
}

export default FiturPopuler;