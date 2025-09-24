import FiturCard from "./FiturCard";
import { NavLink } from "react-router";

const listSemuaKelas = [
    {
        id: 1,
        gambar: './img/mathclass1.png',
        namaKelas: 'Math Course for 1st grade children',
        kelasDeskripsi: 'Course summarizing semester 1 knowledge for 1st graders according to the program at school. The course includes 100 lessons, which students study for 3 months',
        harga: 300,
        jumlahSiswa: 50,
        tanggal: '2025-06-23',
        diskon: 20,
        kategori: 'data',
    },
    {
        id: 2,
        gambar: './img/mathclass2.png',
        namaKelas: 'Math Course for 2nd grade children',
        kelasDeskripsi: 'Course summarizing semester 1 knowledge for 2nd graders according to the program at school. The course includes 110 lessons, which students study for 3 months',
        harga: 123,
        jumlahSiswa: 40,
        tanggal: '2025-07-28',
        diskon: 15,
        kategori: 'essay',
    },
    {
        id: 3,
        gambar: './img/mathclass3.png',
        namaKelas: 'Math Course for 3rd grade children',
        kelasDeskripsi: 'Course summarizing semester 1 knowledge for 3rd graders according to the program at school. The course includes 120 lessons, which students study for 3 months',
        harga: 678,
        jumlahSiswa: 60,
        tanggal: '2025-07-28',
        diskon: 22,
        kategori: 'infografis',
    },
    {
        id: 4,
        gambar: './img/mathclass4.png',
        namaKelas: 'Math Course for 4th grade children',
        kelasDeskripsi: 'Course summarizing semester 1 knowledge for 4th graders according to the program at school. The course includes 150 lessons, which students study for 3 months',
        harga: 380,
        jumlahSiswa: 70,
        tanggal: '2025-06-28',
        diskon: 18,
        kategori: 'ui/ux',
    },
];

// main
function MathCourse () {
    return(
        <div className="w-screen flex flex-col items-center">
            {/* math course text */}
            <div className="w-full flex px-8 sm:px-10 lg:px-20 justify-between items-end">
                <div className="text-2xl font-semibold">Math Course</div>
                <div className="text-lg font-light hover:text-indigo-500 transition-colors duration-200 cursor-pointer select-none">see more  &gt;</div>
            </div>
            <div className="h-10"></div>

            {/* Cards */}
            <div className="w-screen flex justify-center">
                <div className="max-w-[90vw] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {listSemuaKelas.map((kelas) => 
                    <NavLink key={kelas.id} to={`/math-course/${kelas.id}`} className="cursor-pointer">
                        <FiturCard 
                            img={kelas.gambar}
                            className={kelas.namaKelas}
                            description={kelas.kelasDeskripsi}
                            student={kelas.jumlahSiswa}
                            date={kelas.tanggal}
                            price={kelas.harga}
                            discount={kelas.diskon}
                        >
                            <div className="rounded-xl p-2 bg-amber-100 hover:bg-amber-200 active:bg-amber-50 cursor-pointer transition-colors duration-200 flex items-center justify-center">
                                <img src="./img/shopping-cart.svg" alt="cart" className="w-7" />
                            </div>
                        </FiturCard>
                    </NavLink>
                    )}
                </div>
            </div>

        </div>
    );
}

export default MathCourse;