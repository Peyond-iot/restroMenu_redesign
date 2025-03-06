import { useState } from "react";
import Modal from "../item_modal/item_modal";

interface AddOrderListProps{
    menu_category: any
}

const AddOrder: React.FC<AddOrderListProps> = ({ menu_category }) => {

    const [isOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [spicy_level, setLevel] = useState<string>("Low");
    const [inst, setInstruction] = useState<string>("");

    const openModal = (menu: any) => {
        setSelectedItem(menu);
        setInstruction("")
        const sessionKey = "menu-basket";
  
        // Get existing items from session storage
        const existingItems = sessionStorage.getItem(sessionKey);
        let menuBasket = existingItems ? JSON.parse(existingItems) : [];
    
        // Check if the item already exists
        const existingItemIndex = menuBasket.findIndex((item: any) => item._id === menu._id);
    
        if (existingItemIndex !== -1) {
            setSelectedItem((prevItem: any)=>({
                ...prevItem,
                quantity: menuBasket[existingItemIndex].quantity,
            })) 
            setLevel(menuBasket[existingItemIndex].spicy_level)
            setInstruction(menuBasket[existingItemIndex].notes)
        }
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setLevel("Low")
    };

    const addItem = (menu: any) =>{
        const sessionKey = "menu-basket";
  
        // Get existing items from session storage
        const existingItems = sessionStorage.getItem(sessionKey);
        const existingTable: any = sessionStorage.getItem('table');

        let table = JSON.parse(existingTable) || [];
        let menuBasket = existingItems ? JSON.parse(existingItems) : [];
    
        // Check if the item already exists
        const existingItemIndex = menuBasket.findIndex((item: any) => item._id === menu._id);
    
        if (existingItemIndex !== -1) {
            menuBasket[existingItemIndex].quantity = menu?.quantity;
            menuBasket[existingItemIndex].spicy_level = spicy_level;
            menuBasket[existingItemIndex].notes = inst;
        } else {
            menuBasket.push({ ...menu, tableNumber: table?.tableNumber, tableId: table?._id, spicy_level: spicy_level, notes: inst});
        }
    
        sessionStorage.setItem(sessionKey, JSON.stringify(menuBasket));
        setIsOpen(false);
    }

    return(
        <div>
            {/* Modal */}
            {isOpen && selectedItem && (
                <Modal
                isOpen={isOpen}
                onClose={closeModal}
                item={selectedItem}
                updateQuantity={(item: any, amount: number) => {
                    setSelectedItem((prevItem: any) => ({
                    ...prevItem,
                    quantity: Math.max(1, (prevItem?.quantity || 1) + amount),
                    }));
                }}
                addItem={addItem}
                setLevel={setLevel}
                spicy_level={spicy_level}
                setInstruction={setInstruction}
                inst={inst}
                />
            )}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-6">
                {menu_category && menu_category?.map((menu:any)=>(
                <div key={menu?._id} onClick={()=>{
                    openModal(menu)
                    }} className="bg-white rounded-xl shadow-lg p-2 w-40 text-center">
                    <div>
                        <img
                        src={menu?.image}
                        alt={menu?.altImage}
                        className="w-24 h-24 mx-auto rounded-full"
                        />
                    </div>
                    <h2 className="text-lg font-bold text-red-500 mt-2">{menu?.title}</h2>
                    <p className="text-lg font-bold text-red-500 mt-2">{menu?.price}</p>
                </div>
                ))}
            </div>
        </div>
    )
}

export default AddOrder;