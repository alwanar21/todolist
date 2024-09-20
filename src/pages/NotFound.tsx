import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-lg">
          <h1 className="text-3xl sm:text-5xl font-bold ">404 - Not Found</h1>
          <p className="py-6">
            Sorry, the page you're looking for can't be found. It may have been removed, renamed, or
            is temporarily unavailable. Please check the URL you entered, or return to the homepage
            to find what you're looking for. If you need further assistance, feel free to contact
            us.
          </p>
          <Link to={"/"} className="btn btn-primary btn-sm ">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
