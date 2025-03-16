import { useEffect, useState } from "react";

interface HeaderListProps {
  tables: any;
}

const login: any = sessionStorage.getItem("login");
const token = JSON.parse(login);

const Header: React.FC<HeaderListProps> = ({ tables }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [table, tableSet] = useState<any>();
  const [isLoading, setisLoading] = useState(false);
  const [name, setName] = useState<string>();
  

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    const table: any = sessionStorage.getItem("table");
    const tab = JSON.parse(table);
    tableSet(tab);
  };

  let setTable = (table: any) => {
    const tab = JSON.stringify(table);
    sessionStorage.setItem("table", tab);
    toggleSidebar();
  };

  const getRestroName = async(table: any) => {
    const requestOptions: any = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.token}`,
        "Content-Type": "application/json",
      },
      redirect: "follow",
    };
    await fetch(
      `https://backend-nwcq.onrender.com/api/restaurants/${table?.restaurantId}`,
      requestOptions
    )
      .then((response) => response.json()) // Use .json() to parse response
      .then((result) => {
        setisLoading(false)
        if (result) {
          setName(result?.name);
        }
      })
      .catch((error) => {
        setisLoading(false);
        console.error(error)
      });
  }

  useEffect(() => {
    const table: any = sessionStorage.getItem("table");
    const tab: any = JSON.parse(table);
    getRestroName(tab);
    tableSet(tab);
  }, []);

  const logOut = () => {
    toggleSidebar()
    setisLoading(true)
    window.location.reload();
    sessionStorage.clear()
  }

  return (
    <div className="sticky top-0 bg-white z-50 shadow-md">
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-40 backdrop-blur-sm z-50">
          <div className="p-4 bg-white rounded-full shadow-lg">
            <img
              src="assets/loading.gif"
              className="w-20 h-20"
              alt="Loading..."
            />
          </div>
        </div>
      )}
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
            <h1 className="text-2xl font-bold truncate">{name}</h1>
            {table && (
              <p className="font-mono font-bold text-lg text-right text-white bg-red-500 rounded-l-lg px-4 lg:px-12">
                Table {table?.tableNumber}
              </p>
            )}
          </div>
        </div>

        {/* Sidebar (Hidden by default, toggles on click) */}
        {isSidebarOpen && (
          <div>
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
                {tables?.map((table: any) => (
                  <li>
                    <button
                      key={table?.tableNumber}
                      onClick={() => setTable(table)}
                      className="w-full px-4 py-2 rounded-lg text-white text-lg font-bold font-mono bg-red-500 hover:text-red-500 hover:bg-white hover:border-1 cursor-pointer"
                    >
                      Table {table?.tableNumber}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-64 fixed bottom-0 items-center flex flex-row gap-6 justify-start">
              <button className="w-full py-2 px-4 mb-6 rounded-lg border-2 border-red-500 text-sm font-bold bg-transparent text-red-500"
              onClick={()=>{
                sessionStorage.removeItem('table')
                toggleSidebar()
              }}>
                Reset Table
              </button>
              <button className="w-full py-2 px-4 mb-6 rounded-lg border-2 border-red-500 text-sm font-bold bg-transparent text-red-500"
              onClick={()=>{
                logOut()
              }}>
                Log-Out
              </button>
            </div>
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;
