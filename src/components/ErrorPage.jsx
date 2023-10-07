import { Link } from "react-router-dom";
import errorimg from "../assets/404.webp"

const ErrorPage = () => {
  return (
    <div className="error-page">
      <Link to="/">
        <img src={errorimg} />
        <div id="info">
          <h3>This page could not be found</h3>
        </div>
      </Link>
    </div>
  );
};

export default ErrorPage;
