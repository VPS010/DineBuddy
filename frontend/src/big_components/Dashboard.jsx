import {
    Menu, Search, Bell, ChevronDown, Home, User, Settings,
    Clock, Utensils, FileText, Star, AlertCircle, TrendingUp,
    LogOut, Layout
  } from 'lucide-react';
  import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer
  } from 'recharts';
  import { useNavigate } from 'react-router-dom';




  
  const  Dashboard=()=>{


    const salesData = [
        { day: 'Mon', sales: 2400 },
        { day: 'Tue', sales: 1398 },
        { day: 'Wed', sales: 3800 },
        { day: 'Thu', sales: 3908 },
        { day: 'Fri', sales: 4800 },
        { day: 'Sat', sales: 5800 },
        { day: 'Sun', sales: 4000 },
      ];
      

// Mock data for cards
const orderStats = {
    totalOrders: 156,
    activeOrders: 23,
    completedOrders: 128,
    pendingOrders: 5
  };

  const salesStats = {
    totalSales: 8459.99,
    avgOrderValue: 54.23,
  };

  const feedback = {
    todayCount: 45,
    avgRating: 4.8,
    recentComment: "The food was amazing and the service was excellent!"
  };

  const topDishes = [
    { name: "Grilled Salmon", orders: 42, rating: 4.9 },
    { name: "Beef Wellington", orders: 38, rating: 4.8 },
    { name: "Truffle Pasta", orders: 35, rating: 4.7 }
  ];

  const activeTables = {
    total: 8,
    tables: [1, 4, 7, 12, 15, 18, 22, 25]
  };

  const alerts = [
    { type: 'warning', message: 'Low stock: Truffle Oil' },
    { type: 'info', message: 'New menu item pending approval' },
    { type: 'success', message: 'Daily reports generated' }
  ];

 


     return(<>
      
  <main className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Orders Overview Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Orders Overview</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Orders</span>
                  <span className="font-semibold">{orderStats.totalOrders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active</span>
                  <span className="font-semibold text-emerald-600">{orderStats.activeOrders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed</span>
                  <span className="font-semibold text-blue-600">{orderStats.completedOrders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending</span>
                  <span className="font-semibold text-orange-600">{orderStats.pendingOrders}</span>
                </div>
              </div>
              <button className="mt-4 text-sm text-emerald-600 hover:text-emerald-700">
                View All Orders →
              </button>
            </div>

            {/* Sales Summary Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Sales</span>
                  <span className="font-semibold flex">₹{salesStats.totalSales.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg. Order Value</span>
                  <span className="font-semibold flex">₹{salesStats.avgOrderValue}</span>
                </div>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="sales" stroke="#059669" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <button className="mt-4 text-sm text-emerald-600 hover:text-emerald-700">
                View Sales Report →
              </button>
            </div>

            {/* Customer Feedback Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Feedback</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Today's Feedback</span>
                  <span className="font-semibold">{feedback.todayCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Rating</span>
                  <span className="font-semibold flex items-center">
                    {feedback.avgRating}
                    <Star size={16} className="text-yellow-400 ml-1" fill="currentColor" />
                  </span>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 italic">"{feedback.recentComment}"</p>
                </div>
              </div>
              <button className="mt-4 text-sm text-emerald-600 hover:text-emerald-700">
                View All Feedback →
              </button>
            </div>

            {/* Active Tables Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Active Tables</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Active</span>
                  <span className="font-semibold">{activeTables.total}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeTables.tables.map((table) => (
                    <span
                      key={table}
                      className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm"
                    >
                      Table {table}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Top Performing Dishes */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Performing Dishes</h3>
              <div className="space-y-4">
                {topDishes.map((dish, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-gray-800">{dish.name}</span>
                      <div className="flex items-center mt-1">
                        <Star size={16} className="text-yellow-400" fill="currentColor" />
                        <span className="text-sm text-gray-600 ml-1">{dish.rating}</span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-600">{dish.orders} orders</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications Panel */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Notifications</h3>
              <div className="space-y-4">
                {alerts.map((alert, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg flex items-center
                      ${alert.type === 'warning' ? 'bg-yellow-50 text-yellow-700' :
                        alert.type === 'info' ? 'bg-blue-50 text-blue-700' :
                        'bg-green-50 text-green-700'}`}
                  >
                    <AlertCircle size={20} className="mr-3" />
                    <span>{alert.message}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
     </>)

       

  }
  
export default Dashboard