import { useEffect, useState } from "react";

interface HeaderListProps{
  tables: any
}

const Header: React.FC<HeaderListProps> = ({ tables }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [table, tableSet] = useState<any>()

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    const table: any = sessionStorage.getItem('table');
    const tab = JSON.parse(table);
    tableSet(tab);
  };

  let setTable = (table: any) => {
    const tab = JSON.stringify(table)
    sessionStorage.setItem('table', tab);
    toggleSidebar()
  }

  useEffect(()=>{
    const table: any = sessionStorage.getItem('table');
    const tab = JSON.parse(table);
    tableSet(tab);
  },[])

  return (
    <div className="sticky top-0 bg-white z-50 shadow-md">
      <header className="fixed container py-4 relative !pr-0">
        {/* Breadcrumb + Icon */}
        <div className="w-full flex items-center gap-2 text-red-500 text-sm mb-2">
          {/* Menu Icon (for Sidebar Toggle) */}
          <button onClick={toggleSidebar} className="text-2xl">
            <img
              src="assets/breadcrumb.svg"
              className="w-6 h-6"
              alt="breadcrumb"
            />
          </button>

          <div className="w-full flex flex-row gap-2 justify-between items-center">
            {/* Restaurant Name */}
            <h1 className="text-2xl font-bold truncate">Clifford restaurant</h1>
            {table && <p className="font-mono font-bold text-lg text-right text-white bg-red-500 rounded-l-lg px-6 lg:px-12">Table {table?.tableNumber}</p>}
          </div>
        </div>

        {/* Sidebar (Hidden by default, toggles on click) */}
        {isSidebarOpen && (
          <div className="fixed left-0 w-full md:w-96 h-full bg-opacity-40 backdrop-blur mt-4 text-white shadow-lg p-6 transition-transform">
            <div className="flex justify-end">
              <button
                onClick={toggleSidebar}
                className="text-red-500 text-xl mb-4 cursor-pointer"
              >
                ✖
              </button>
            </div>
            <ul className="grid grid-cols-2 gap-6 py-6">
              {tables?.map((table: any) => <li>
                <button key={table?.tableNumber} onClick={()=>setTable(table)} className="w-full px-4 py-2 rounded-lg text-white text-lg font-bold font-mono bg-red-500 hover:text-red-500 hover:bg-white hover:border-1 cursor-pointer">
                  Table {table?.tableNumber}
                </button>
              </li>)}
            </ul>
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;
