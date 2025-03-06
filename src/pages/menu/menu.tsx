import { useCallback, useEffect, useState } from "react";
import FooterMenu from "../../component/footer/footer";
import Header from "../../component/header/header";
import AddOrder from "../../component/add_order/add_order";
import OrderBasket from "../../component/order_basket/order_basket";

function Menu() {
  const [tables, setTables] = useState<any>();
  const [menus, setMenus] = useState<any>([]);
  const [menu_category, setMenucategory] = useState<any>([]);
  const [active, setActive] = useState<any>();
  const [activeTab, setActiveTab] = useState("Add order");
  const [basketButton, setBasketButton] = useState<boolean>(false);

  let fetchmenu = useCallback(async () => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2JjNTVkZDgxNTZiMzZjYzk5NGUyYWMiLCJyb2xlIjoicmVzdGF1cmFudF9hZG1pbiIsInJlc3RhdXJhbnRJZCI6IjY3YmM1NDM5ODE1NmIzNmNjOTk0ZTJhNyIsImlhdCI6MTc0MTI1NTA5NywiZXhwIjoxNzQxMjk4Mjk3fQ.F52f8AqVVIqJw2w0fvz8ob2tlfveE1NCHAUE7kBCDX8";

    const requestOptions: any = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
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
      setActive(true);
    }
  };
  
  const getCategory = (menu: any): any => {
    return Array.from(new Set(menu?.map((item: any) => item?.category)));
  };
  
  // Use useEffect to set the initial category once
  useEffect(() => {
    const categories = getCategory(menus);
    if (categories.length > 0) {
      showMenu(categories[0]);
    }
  }, [menus]);

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

  const place_order = async () => {
    const existingItem: any = sessionStorage.getItem("menu-basket");
    const items = JSON.parse(existingItem);
    const orderItems = transformData(items);
    const raw = JSON.stringify(orderItems);
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2JjNTVkZDgxNTZiMzZjYzk5NGUyYWMiLCJyb2xlIjoicmVzdGF1cmFudF9hZG1pbiIsInJlc3RhdXJhbnRJZCI6IjY3YmM1NDM5ODE1NmIzNmNjOTk0ZTJhNyIsImlhdCI6MTc0MTI1NTA5NywiZXhwIjoxNzQxMjk4Mjk3fQ.F52f8AqVVIqJw2w0fvz8ob2tlfveE1NCHAUE7kBCDX8";
    const requestOptions: any = {
      method: "POST",
      body: raw,
      headers: {
        Authorization: `Bearer ${token}`,
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
        if (result) {
          sessionStorage.removeItem("menu-basket");
          getBasketButton();
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <Header tables={tables} />
      {activeTab === "Add order" && <div className="container !pt-0 !pl-0">
        <div className="w-full bg-white fixed flex justify-between items-center px-4 py-4">
          {getCategory(menus) &&
            getCategory(menus)?.map((category: any) => (
              <p
                key={category}
                className={`text-red-500 text-lg font-mono cursor-pointer ${
                  active ? "border-b-2 border-red-500" : ""
                }`}
                onClick={() => showMenu(category)}
              >
                {category}
              </p>
            ))}
        </div>
      </div>}
      
      <div className="container">
        <div className="my-2 lg:my-8">
          <div className="mb-16 pb-24">
            {activeTab === "Add order" && (
              <AddOrder
                menu_category={menu_category}
              />
            )}
            {activeTab === "Order basket" && <OrderBasket />}
            {activeTab === "Call Staff" && <div>Call Staff Component</div>}
            {activeTab === "Order history" && (
              <div>Order History Component</div>
            )}
          </div>

          {/* <div className="border border-1 border-red-500 h-[50vh] md:h-[60vh] lg:h-[70vh] xl:h-[55vh] overflow-y-scroll "></div> */}

          {activeTab === "Order basket" && basketButton && (
            <div className="flex flex-row justify-start gap-4 mb-12">
              <button
                className="px-4 py-2 rounded-lg bg-red-500 text-white font-bold"
                onClick={() => place_order()}
              >
                Place Order
              </button>
              <button
                className="px-6 py-2 rounded-lg bg-white border-1 border-red-500 text-red-500 font-bold"
                onClick={() => {
                  sessionStorage.removeItem("menu-basket");
                  getBasketButton();
                }}
              >
                Reset
              </button>
            </div>
          )}
        </div>
      </div>
      <div>
        <FooterMenu setActiveTab={setActiveTab} activeTab={activeTab} place_order={place_order}/>
      </div>
    </div>
  );
}

export default Menu;
