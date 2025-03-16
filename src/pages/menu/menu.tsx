import { useCallback, useEffect, useState } from "react";
import FooterMenu from "../../component/footer/footer";
import Header from "../../component/header/header";
import AddOrder from "../../component/add_order/add_order";
import OrderBasket from "../../component/order_basket/order_basket";
import OrderHistory from "../../component/order_history/order_history";
import CheckOut from "../../component/check_out/check_out";

const login: any = sessionStorage.getItem("login");
const token = JSON.parse(login);

function Menu() {
  const [tables, setTables] = useState<any>();
  const [menus, setMenus] = useState<any>([]);
  const [cate, setCate] = useState<any>();
  const [menu_category, setMenucategory] = useState<any>([]);
  const [activeCate, setActiveCate] = useState<any>();
  const [activeTab, setActiveTab] = useState("Add order");
  const [basketButton, setBasketButton] = useState<boolean>(false);
  const [isLoading, setisLoading] = useState(false);

  let fetchmenu = useCallback(async () => {
    const requestOptions: any = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.token}`,
        "Content-Type": "application/json",
      },
      redirect: "follow",
    };
    await fetch(
      "https://backend-nwcq.onrender.com/api/menu-items/",
      requestOptions
    )
      .then((response) => response.json()) // Use .json() to parse response
      .then((result) => setMenus(result))
      .catch((error) => console.error(error));

    await fetch("https://backend-nwcq.onrender.com/api/tables/", requestOptions)
      .then((response) => response.json())
      .then((result) => setTables(result))
      .catch((error) => console.log(error));
  }, []);

  const getBasketButton = () => {
    if (!sessionStorage.getItem("menu-basket")) {
      setBasketButton(false);
    } else {
      setBasketButton(true);
    }
  };

  useEffect(() => {
    fetchmenu();
  }, [fetchmenu]);

  const showMenu = (cate: any) => {
    const menu = menus?.filter((item: any) => item?.category === cate);
    setMenucategory(menu);
    if (cate) {
      setActiveCate(cate);
    }
  };

  useEffect(() => {
    if (menus?.length) {
      const uniqueCategories = Array.from(
        new Set(menus.map((item: any) => item?.category))
      );
      setCate(uniqueCategories);
      showMenu(uniqueCategories[0]);
    }
  }, [menus]); // Runs when `menus` changes

  const transformData = (apiData: any[]) => {
    return {
      tableId: apiData[0]?.tableId, // Use provided tableId
      items: apiData.map((item) => ({
        menuItemId: item._id,
        quantity: item.quantity,
        price: item.price,
        total: item.quantity * item.price,
      })),
      discount: 10,
      notes: "Extra spicy!",
    };
  };

  const removeMenuItem = (menuBasket: any[], tableId: string, menuId?: string, removeAll?: boolean) => {
    if(removeAll){
      return menuBasket.filter(item => !(item.tableId === tableId));
    }else{
      return menuBasket.filter(item => !(item.tableId === tableId && item._id === menuId));
    }
  };

  const place_order = async () => {
    setisLoading(true);
    const existingItem: any = sessionStorage.getItem("menu-basket");
    const existingTable: any = sessionStorage.getItem('table');

    const item = JSON.parse(existingItem);
    const table = JSON.parse(existingTable);
    const tableMatchedItem = item.filter((item: any) => (item.tableId === table?._id));

    const updatedBasket = removeMenuItem(item, table._id, '', true);

    const orderItems = transformData(tableMatchedItem);
    const raw = JSON.stringify(orderItems);

    const requestOptions: any = {
      method: "POST",
      body: raw,
      headers: {
        Authorization: `Bearer ${token.token}`,
        "Content-Type": "application/json",
      },
      redirect: "follow",
    };
    await fetch(
      "https://backend-nwcq.onrender.com/api/orders/create",
      requestOptions
    )
      .then((response) => response.json()) // Use .json() to parse response
      .then((result) => {
        setisLoading(false);
        if (result) {
          // sessionStorage.removeItem("menu-basket");
          sessionStorage.setItem("menu-basket", JSON.stringify(updatedBasket));
          sessionStorage.setItem("order-history", JSON.stringify(tableMatchedItem));
          getBasketButton();
        }
      })
      .catch((error) => {
        setisLoading(false);
        console.error(error)
      });
  };

  return (
    <div>
      {isLoading && (
            <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-40 backdrop-blur-sm z-50">
                <div className="p-4 bg-white rounded-full shadow-lg">
                <img src="assets/loading.gif" className="w-20 h-20" alt="Loading..." />
                </div>
            </div>
      )}
      <Header tables={tables} />
      {activeTab === "Add order" && (
        <div className="container !pt-0 !pl-0">
          <div className="w-full overflow-x-auto bg-white fixed flex justify-start gap-4 items-center px-4 py-4">
            {cate &&
              cate?.map((category: any) => (
                <p
                  key={category}
                  className={`text-red-500 text-lg font-mono cursor-pointer ${
                    activeCate === category ? "border-b-2 border-red-500" : ""
                  }`}
                  onClick={() => showMenu(category)}
                >
                  {category}
                </p>
              ))}
          </div>
        </div>
      )}

      <div className="container">
        <div className="my-2 lg:my-8">
          <div className="mb-16 pb-24">
            {activeTab === "Add order" && (
              <div>
                <AddOrder menu_category={menu_category} />
              </div>
            )}
            {activeTab === "Order basket" && (
              <OrderBasket place_order={place_order} />
            )}
            {activeTab === "Order history" && <OrderHistory />}
            {activeTab === "check_out" && <CheckOut />}
          </div>

          {/* <div className="border border-1 border-red-500 h-[50vh] md:h-[60vh] lg:h-[70vh] xl:h-[55vh] overflow-y-scroll "></div> */}
        </div>
      </div>
      <div>
        <FooterMenu setActiveTab={setActiveTab} activeTab={activeTab} />
      </div>
    </div>
  );
}

export default Menu;
