import { useEffect, useState } from "react";

interface BasketMenuProps {
  place_order: () => void;
}


const OrderBasket: React.FC<BasketMenuProps> =({place_order}) => {
  const [basketItem, setBasket] = useState<any>(false);

  const getBasketData = () => {
    const existingItem: any = sessionStorage.getItem("menu-basket");
    const existingTable: any = sessionStorage.getItem('table');

    const item = JSON.parse(existingItem);
    const table = JSON.parse(existingTable);

    const tableMatchedItem = item?.filter((item: any) => item?.tableId === table?._id );

    if(tableMatchedItem && tableMatchedItem.length){
      setBasket(tableMatchedItem);
    }else{
      setBasket(false)
    }
  }

  useEffect(() => {
    setInterval(getBasketData, 200);
  }, []);

  const removeMenuItem = (menuBasket: any[], tableId: string, menuId?: string, removeAll?: boolean) => {
    if(removeAll){
      return menuBasket.filter(item => !(item.tableId === tableId));
    }else{
      return menuBasket.filter(item => !(item.tableId === tableId && item._id === menuId));
    }
  };
  
  let clearBasket = () => {
    // sessionStorage.removeItem('menu-basket');
    const existingItem: any = sessionStorage.getItem("menu-basket");
    const existingTable: any = sessionStorage.getItem('table');

    const item = JSON.parse(existingItem);
    const table = JSON.parse(existingTable);

    const updatedBasket = removeMenuItem(item, table._id, '', true);

    sessionStorage.setItem("menu-basket", JSON.stringify(updatedBasket));
    setBasket(false)
  }

  const increase = (menu: any) => {
    const existingItem: any = sessionStorage.getItem("menu-basket");
    const existingTable: any = sessionStorage.getItem('table');

    const item = JSON.parse(existingItem);
    const table = JSON.parse(existingTable);

    const existingItemIndex = item.findIndex((item: any) => (item._id === menu._id && item.tableId === table?._id));


    if (existingItemIndex !== -1) {
      item[existingItemIndex].quantity = menu?.quantity + 1;
      sessionStorage.setItem("menu-basket", JSON.stringify(item));
      getBasketData()
    }
  }

  const decrease = (menu: any) => {
    const existingItem: any = sessionStorage.getItem("menu-basket");
    const existingTable: any = sessionStorage.getItem('table');

    const item = JSON.parse(existingItem);
    const table = JSON.parse(existingTable);

    const existingItemIndex = item.findIndex((item: any) => (item._id === menu._id && item.tableId === table?._id));


    if (existingItemIndex !== -1) {
      item[existingItemIndex].quantity = menu?.quantity - 1;
      if(item[existingItemIndex].quantity<=0){
        const updatedBasket = removeMenuItem(item, table._id, menu._id, false);
        sessionStorage.setItem("menu-basket", JSON.stringify(updatedBasket));
      }else{
        sessionStorage.setItem("menu-basket", JSON.stringify(item));
      }
      getBasketData()
    }
  }

  const placeOrder = () =>{
    place_order()
  }

  return (
    <div key={'basket'}>
      <div className="lg:p-12 p-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-12 md:gap-8 gap-4">
        {basketItem &&
          basketItem?.map((menu: any) => (
            <div key={menu?._id} className="flex justify-between items-center border-b py-2">
              {/* Item Details */}
              <div className="w-1/2">
                <span className="font-semibold">{menu?.title}</span>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-2">
                <button onClick={()=> decrease(menu)}>
                  <img src="assets/minus.svg" className="w-6 h-6" alt="minus" />
                </button>
                <span>{menu?.quantity}</span>
                <button onClick={()=> increase(menu)}>
                  <img src="assets/plus.svg" className="w-6 h-6" alt="plus" />
                </button>
              </div>

              {/* Price */}
              <span className="text-black font-semibold">{menu?.price}</span>
            </div>
          ))}
      </div>

      {basketItem && (
          <div className="mt-6 flex flex-row justify-start gap-4">
            <button className="px-4 py-2 rounded-lg shadow-md text-sm font-bold bg-red-500 text-white" onClick={()=> placeOrder()}>
              Place Order
            </button>
            <button className="px-6 py-2 rounded-lg border-2 border-red-500 text-sm font-bold bg-transparent text-red-500" onClick={()=> clearBasket()}>
              Reset
            </button>
          </div>
        )}

      {!basketItem && (
          <div className="flex justify-center items-center h-[60vh] lg:h-[50vh]">
            <p className="text-red-500 font-semibold">No Item in the basket</p>
          </div>
        )}

    </div>
  );
};

export default OrderBasket;
