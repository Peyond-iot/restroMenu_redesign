import { useEffect, useState } from "react";

const login: any = sessionStorage.getItem("login");
const token = JSON.parse(login);

const OrderHistory = () => {
  const [historyItem, setHistoryItem] = useState<any>();
  const [isLoading, setisLoading] = useState(false);


  const getHistory = async () => {
    setisLoading(true)
    const existingTable: any = sessionStorage.getItem('table');
    const table = JSON.parse(existingTable);

    const requestOptions: any = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.token}`,
        "Content-Type": "application/json",
      },
      redirect: "follow",
    };
    await fetch(
      `https://backend-nwcq.onrender.com/api/orders/table/${table?._id}`,
      requestOptions
    )
      .then((response) => response.json()) // Use .json() to parse response
      .then((result) => {
        setisLoading(false)
        if (result) {
          setHistoryItem(result);
        }
      })
      .catch((error) => {
        setisLoading(false);
        console.error(error)
      });
  };

  useEffect(() => {
    getHistory()
  }, []);

  return (
    <div>
      {isLoading && (
            <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-40 backdrop-blur-sm z-50">
                <div className="p-4 bg-white rounded-full shadow-lg">
                <img src="assets/loading.gif" className="w-20 h-20" alt="Loading..." />
                </div>
            </div>
      )}
      {!historyItem?.length && (
        <div className="flex justify-center items-center h-[60vh] lg:h-[50vh]">
          <p className="text-red-500 font-semibold">No Item Ordered</p>
        </div>
      )}

      <div className="lg:p-12 p-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-12 md:gap-8 gap-4">
        {historyItem &&
          historyItem[0]?.items.map((menu: any) => (
            <div
              key={menu?._id}
              className="flex justify-between items-center border-b py-2"
            >
              {/* Item Details */}
              <div className="w-1/2">
                <span className="font-semibold">{menu?.menuItemId.title}</span>
              </div>

              <div className="font-serif text-lg">✖<span className="mx-1">{menu?.quantity}</span></div>

              {/* Price */}
              <span className="text-black font-semibold">{menu?.price * menu?.quantity}</span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default OrderHistory;
