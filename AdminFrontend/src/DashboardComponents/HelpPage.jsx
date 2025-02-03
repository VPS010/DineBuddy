const Help = () => {
  return (
    <>
      <div className="mt-8 bg-white border-2 mx-44 border-green-100 rounded-lg p-6 text-center">
        <h3 className="text-xl font-semibold mb-4 text-green-800">
          Need Help? We're Here for You 24/7
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-green-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            <p className="text-lg">
              Contact Support:{" "}
              <span className="font-medium">+91 9103123156</span>
            </p>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-green-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            <p className="text-lg">
              Email Us:{" "}
              <span className="font-medium">hellodinebuddy@gmail.com</span>
            </p>
          </div>
          <p className="text-gray-600 mt-4">
            Our dedicated support team is available around the clock to assist
            you with any questions or concerns. Don't hesitate to reach out -
            we're committed to your success!
          </p>
        </div>
      </div>
    </>
  );
};

export default Help;
