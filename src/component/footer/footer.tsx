
type FooterMenuProps = {
    setActiveTab: (tab: string) => void;
    place_order: () => void;
    activeTab: string
  };
  
  const FooterMenu: React.FC<FooterMenuProps> = ({ setActiveTab, activeTab, place_order }) => {
    const menuButtons = [
        { text: "Add order" },
        { text: "Order basket" },
        { text: "Call Staff" },
        { text: "Order history" },
      ];

      let getBasketData = () => {
        if (!sessionStorage.getItem("menu-basket")) {
          return false;
        } else {
          return true;
        }
      }

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg border-t border-red-300 rounded-xl">
      <div className="container mx-auto flex md:flex-row flex-col gap-4 justify-between items-center px-4 py-6 bg-white">
        {/* Buttons */}
        <div className="flex gap-2 lg:gap-4">
            {menuButtons.map((item, index) => (
            <button
                key={index}
                onClick={() => setActiveTab(item.text)}
                className={`px-4 py-2 rounded-lg shadow-md text-sm font-bold 
                ${activeTab === item.text ? "bg-red-500 text-white" : "bg-white text-red-500 border-2 border-red-500"}`}
            >
                {item.text}
            </button>
            ))}
        </div>

        {/* Checkout Button with Notification */}
        <div className="relative align-right">
          <button className={`px-4 py-2 rounded-lg shadow-md  font-bold ${
            getBasketData()? 'bg-red-500 text-white': 'bg-gray-300 text-gray-600'
          }`} onClick={()=> getBasketData()?place_order(): ''}>
            Check out
          </button>
          {getBasketData() && <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            !
          </span>}
        </div>
      </div>
    </div>
  );
};

export default FooterMenu;
