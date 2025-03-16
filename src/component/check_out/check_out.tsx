import { useEffect, useState } from "react";

const login: any = sessionStorage.getItem("login");
const token = JSON.parse(login);

const CheckOut = () => {
  const [historyItem, setHistoryItem] = useState<any>();
  const [isLoading, setisLoading] = useState(false);

  const getHistory = async () => {
    setisLoading(true)
    const existingTable: any = sessionStorage.getItem('table');
    const table = JSON.parse(existingTable);

    const rawPayload = {
      "tableId":  table?._id
    }

    const requestOptions: any = {
      method: "POST",
      body: JSON.stringify(rawPayload),
      headers: {
        Authorization: `Bearer ${token.token}`,
        "Content-Type": "application/json",
      },
      redirect: "follow",
    };
    await fetch(
      "https://backend-nwcq.onrender.com/api/bills/create",
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
        setisLoading(false)
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
      {historyItem && <div>
        <div className="lg:p-12 p-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-12 md:gap-8 gap-1 border-b-1">
          {historyItem &&
            historyItem?.bill?.items.map((menu: any) => (
              <div
                key={menu?._id}
                className="flex justify-between items-center py-2"
              >
                {/* Item Details */}
                <div className="w-1/2">
                  <span className="font-semibold">{menu?.name}</span>
                </div>

                <div className="font-serif text-lg">
                  ✖<span className="mx-1">{menu?.quantity}</span>
                </div>

                {/* Price */}
                <span className="text-black font-semibold">
                  {menu?.total}
                </span>
              </div>
            ))}
        </div>
        <div className="mt-2 flex flex-row justify-between">
          <div className="text-red-500 text-mono font-bold">
              Sub-total:
          </div>
          <div className="text-serif">
              {historyItem?.bill?.subtotal}
          </div>
        </div>
        <div className="mt-2 flex flex-row justify-between">
          <div className="text-mono font-bold">
              Tax:
          </div>
          <div className="text-serif">
              {historyItem?.bill?.tax}
          </div>
        </div>
        <div className="mt-2 pb-2 flex flex-row justify-between border-b-1">
          <div className="text-mono font-bold">
              Service Charge:
          </div>
          <div className="text-serif">
              {historyItem?.bill?.serviceCharge}
          </div>
        </div>
        <div className="mt-2 flex flex-row justify-between">
          <div className="text-red-500 text-mono font-bold">
              Grand Total:
          </div>
          <div className="text-serif font-semi-bold">
              {historyItem?.bill?.totalAmount}
          </div>
        </div>

        <div className="mt-6 flex flex-row justify-start gap-4">
            <button className="px-6 py-2 rounded-lg shadow-md text-sm font-bold bg-red-500 text-white">
              Pay Now
            </button>
            {/* <button className="px-6 py-2 rounded-lg border-2 border-red-500 text-sm font-bold bg-transparent text-red-500">
              Reset
            </button> */}
          </div>
      </div>}
    </div>
  );
};

export default CheckOut;
