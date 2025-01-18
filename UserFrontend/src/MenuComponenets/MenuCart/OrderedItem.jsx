export const OrderedItem = ({ item }) => (
    <div className="flex items-center gap-3 p-4 my-2 border-b border-[#E8E1D3]">
      <div className="flex-shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-14 h-14 object-cover rounded-md border border-[#E8E1D3]"
        />
      </div>
      <div className="flex-1 flex items-center justify-between">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
          <h4 className="text-[#2D3436] font-medium text-sm md:text-base truncate">
            {item.name}
          </h4>
          <div className="flex flex-wrap gap-1">
            {item.customizations &&
              Object.entries(item.customizations).map(([key, value]) => (
                <span
                  key={key}
                  className="text-xs text-[#666666] bg-[#F9F6F0] px-2 py-0.5 rounded-full"
                >
                  {value}
                </span>
              ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-[#F9F6F0] rounded-lg px-2 py-0.5">
            <span className="text-center text-sm font-medium">
              {item.quantity}
            </span>
          </div>
          <span className="text-[#2D6A4F] font-semibold text-sm md:text-base">
            ₹{(item.price * item.quantity).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );