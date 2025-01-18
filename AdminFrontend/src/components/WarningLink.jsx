import { Link } from "react-router-dom";

export const WarningLink = ({ label, buttonText, to }) => {
  return (
    <p className="text-md font-light text-center text-gray-500">
      {label}{" "}
      <Link className="font-medium text-emerald-900 hover:underline" to={to}>
        {buttonText}
      </Link>
    </p>
  );
};
