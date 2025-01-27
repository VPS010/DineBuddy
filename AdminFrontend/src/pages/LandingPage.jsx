import { useNavigate } from "react-router-dom";



const LandingPage = () => {
    const navigate = useNavigate();
  return (
    <>
      <div className="z-0 h-screen w-screen overflow-hidden ">
        <img
          src="/pngtree-sophisticated-bar-and-restaurant-boasting-luxurious-modern-design-featuring-elegant-furnishings-picture-image_5792289.jpg"
          className="h-full w-full object-cover"
          alt="bg image"
        />
      </div>
      <div className="absolute inset-0 gap-7 bg-stone-100 bg-opacity-90 min-h-screen md:flex flex-row justify-center ">
        <div className="flex items-center justify-center ">
          <img
            src="/herosec.png"
            className="h-[400px] w-[400px] mt-0 rounded-md  m-8"
            alt=""
          />
        </div>
        <div>
          {/* Content container */}
          <div className="flex max-w-7xl justify-center mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32  flex-col min-h-screen">
            {/* Text content */}
            <div className="max-w-3xl flex flex-col justify-center">
              <h1 className="text-7xl font-mono text-center flex flex-col sm:text-left font-extrabold text-stone-800 md:text-6xl">
                FoodInk
              </h1>
              <h1 className="flex flex-col text-center text-5xl text-maroon sm:text-left md:text-6xl font-serif font-medium mb-6 ">
              Your Digital Waiter
                <span className="block text-emerald-900">Effortless Ordering & Dining</span>
              </h1>

              <p className="text-xl md:text-2xl mb-8  text-stone-700 leading-relaxed">
              Discover a smarter way to dine with ServIt – where seamless ordering
              meets exceptional service, right at your fingertips.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 ">
                <button
                 className="group relative px-8 py-4 bg-emerald-900  border-gray-800 border text-stone-100 hover:bg-emerald-800 transition-all duration-300 rounded-md overflow-hidden focus:ring-1 focus: outline-none focus:ring-slate-600 font-medium  text-sm text-center transform active:scale-95">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Scan QR
                  </span>
                </button>

                <button
                onClick={()=>{
                    navigate("/admin/login")
                }}
                className=" group px-4 py-4 bg-[#c79059]  border-gray-800 border text-stone-100 font-medium rounded-md transition-all duration-300 hover:bg-[#dba064] transform active:scale-95">
                  Admin Login
                </button>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-stone-300/20 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute top-32 right-32 w-32 h-32 bg-gradient-to-bl from-emerald-900/10 to-transparent rounded-full blur-2xl"></div>
          </div>
        </div>
        {/* Bottom accent bar */}
      </div>
    </>
  );
};

export default LandingPage;
