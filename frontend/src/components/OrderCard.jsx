const OrderCard = ({ order, onStatusUpdate }) => {
    const statusColors = {
      Pending: "bg-red-100 text-red-800",
      "In Progress": "bg-yellow-100 text-yellow-800",
      Completed: "bg-green-100 text-green-800"
    };
  
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xl text-black font-bold">Table {order.table}</span>
          <h3 className="text-lg font-bold">Order #{order.id}</h3>
        </div>
        
        <div className="mb-3">
          {Object.entries(order.items).map(([item, quantity]) => (
            <div key={item} className="flex justify-between text-sm py-1">
              <span>{item}</span>
              <span className="font-medium">×{quantity}</span>
            </div>
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <span className={`px-3 py-1 rounded-full text-sm ${statusColors[order.status]}`}>
            {order.status}
          </span>
          <select 
            className="border rounded px-2 py-1 text-sm"
            value={order.status}
            onChange={(e) => onStatusUpdate(order.id, e.target.value)}
          >
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </div>
      </div>
    );
  };


  export default OrderCard;