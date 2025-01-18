export function InputBox({ label, placeholder, onChange, ivalue, iname }) {
  return (
    <>
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-900 ">
          {label}{" "}
        </label>
        <input
          name={iname}
          value={ivalue}
          onChange={onChange}
          placeholder={placeholder}
          id="confirm-password"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 "
          required=""
        />
      </div>
    </>
  );
}
