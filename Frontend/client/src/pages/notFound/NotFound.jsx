import "./NotFound.css";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="not-found-wrapper">
            <div className="not-found-container">

                <h1 className="not-found-code">404</h1>

                <h2 className="not-found-title">
                    Page Not Found
                </h2>

                <p className="not-found-message">
                    Sorry, the page you are looking for does not exist
                    or may have been moved.
                </p>

                <Link to="/dashboard" className="not-found-button">
                    <i className="bi bi-house"></i>
                    Back to Dashboard
                </Link>

            </div>
        </div>
    );
};

export default NotFound;