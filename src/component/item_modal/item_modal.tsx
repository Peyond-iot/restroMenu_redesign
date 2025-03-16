import { useEffect, useState } from "react";

type ModalProps = {
    isOpen: boolean;
    onClose: ()=> void;
    item: any;
    updateQuantity: (item: any, q: number)=> void;
    addItem: (item: any)=> void;
    setLevel: (spicy_level: string) => void;
    spicy_level: string;
    setInstruction: (inst: string) => void;
    inst: string;
  };
  const Modal: React.FC<ModalProps> = ({ isOpen, onClose, item, updateQuantity, addItem, setLevel, spicy_level, setInstruction, inst }) => {
    if (!isOpen) return null;

    const getTable = () => {
      const getTable = sessionStorage.getItem('table');
      if(getTable){
        return true
      }else{
        return false;
      }
    }
  
    return (
      <div className="fixed inset-0 flex items-center justify-center backdrop-blur bg-opacity-40 z-50">
        <div className="bg-white rounded-lg p-4 lg:p-8 w-[90%] max-w-md shadow-lg">
          {/* Close Button */}
          <div className="flex justify-end">
            <button className="text-red-500 text-2xl" onClick={onClose}>
                ✖
            </button>
          </div>
  
          {/* Image */}
          <img src={item.image} alt={item.name} className="w-full h-auto object-cover rounded-lg" />
  
          {/* Item Name & Counter */}
          <div className="w-full flex flex-row justify-between mt-4">
            <div className="w-2/3">
                <h2 className="text-lg font-bold text-red-500">{item.title}</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item, -1)}
                className=""
              >
                <img
                    src="assets/minus.svg"
                    className="w-8 h-8"
                    alt="minus"
                />
              </button>
              <span className="text-lg font-bold">{item.quantity  || 1}</span>
              <button
                onClick={() => updateQuantity(item, 1)}
                className=""
              >
                <img
                    src="assets/plus.svg"
                    className="w-8 h-8"
                    alt="plus"
                />
              </button>
            </div>
          </div>
  
          {/* Description */}
          <p className="text-gray-600 mt-2">{item.desc}</p>
  
          {/* Spicy Level */}
          {item?.spicy_prefer && <div className="my-4">
            <h3 className="text-sm font-semibold text-gray-700">Spicy Level:</h3>
            <div className="flex gap-2 mt-1">
              {["Low", "Medium", "High"].map((level) => (
                <button
                  key={level}
                  className={`px-3 py-1 rounded-md ${
                    level===spicy_level? 'bg-red-500 text-white' : 'border border-red-500 text-red-500'
                  }`}
                  onClick={()=>setLevel(level)}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>}
  
          {/* Instruction Text Area */}
          <div className="mt-3">
            <textarea
              className="w-full h-20 p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
              placeholder="Add special instructions..."
              value={inst}
              onChange={(e)=>setInstruction(e?.target?.value)}
            />
          </div>
  
          {/* Add Item Button */}
          <button
            onClick={() => getTable()? addItem(item) : ''}
            className={`w-full mt-4 py-2 rounded-lg font-bold ${
              getTable()? "bg-red-500 text-white cursor-pointer" : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
          >
            Add Item
          </button>
        </div>
      </div>
    );
  };
  
  export default Modal;
  