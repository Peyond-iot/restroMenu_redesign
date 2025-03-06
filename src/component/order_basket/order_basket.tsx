import { useEffect, useState } from "react";


const OrderBasket = () => {
    const [basketItem, setBasket] = useState<any>();

    useEffect(()=>{
        const existingItem: any = sessionStorage.getItem('menu-basket');
        const item = JSON.parse(existingItem);

        setBasket(item)
    },[]);

    return(
        <div className="lg:p-12 p-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-12 md:gap-8 gap-4">
            {basketItem && basketItem?.map((menu:any)=>(<div className="flex justify-between items-center border-b py-2">
                {/* Item Details */}
                <div className="w-1/2">
                    <span className="font-semibold">{menu?.title}</span>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center gap-2">
                    <button
                    >
                        <img
                            src="assets/minus.svg"
                            className="w-6 h-6"
                            alt="minus"
                        />
                    </button>
                    <span>{menu?.quantity}</span>
                    <button
                    >
                        <img
                            src="assets/plus.svg"
                            className="w-6 h-6"
                            alt="plus"
                        />
                    </button>
                </div>

                {/* Price */}
                <span className="text-black font-semibold">{menu?.price}</span>
            </div>))}

        </div>
    )
}

export default OrderBasket;