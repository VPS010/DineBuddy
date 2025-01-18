
const ShortlistedItem = ({ name, quantity, status }) => {
    const getProgressWidth = () => {
      switch (status) {
        case "Pending": return "w-0";
        case "In Progress": return "w-1/2";
        case "Prepared": return "w-full";
        default: return "w-0";
      }
    };
  
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">{name}</h3>
          <span className="text-lg font-bold">{quantity}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className={`bg-emerald-600 h-2 rounded-full transition-all ${getProgressWidth()}`} />
        </div>
      </div>
    );
  };



export default ShortlistedItem;