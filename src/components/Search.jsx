import { Children } from "react";


const Search = ({searchTerm, setSearchTerm, children}) => {
    const elements = Children.toArray(children);

    return(
        <div className="search bg-white rounded-xl p-4 shadow-sm flex flex-col border border-gray-100 sm:flex-row gap-4 sm:gap-2 w-[80%]" style={{boxShadow: '0px 6px 20px 4px rgba(113, 130, 164, 0.24)'}}>
            <div className="relative flex items-center flex-1">

                <img className="absolute left-2" src="./img/search_icon.png" alt="search" width={'25px'} />
                
                <input
                    // ref={refToUse}
                    className='flex-1 rounded-full px-4 ps-10 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors duration-300 
                            dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400
                            text-my-text placeholder-gray-400 border-gray-200 focus:border-indigo-300 shadow-sm
                            border '
                    type="text"
                    placeholder="Coba cari materi belajarmu disini..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                
            </div>
            <div className="ps-2 flex sm:items-center flex-col sm:flex-row items-start gap-2 sm:gap-0">
                <div className="me-4 w-fit ps-1"> Pilih kelas : </div>
                {elements[0]}
            </div>
        </div>
    )
}

export default Search