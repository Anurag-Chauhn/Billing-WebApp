import "./login.css";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext.jsx";
import { login } from "../../service/AuthService.js";

const Login = () => {
    const navigate = useNavigate();

    const { setAuthData } = useContext(AppContext);

    const [loading, setLoading] = useState(false);

    const [data, setData] = useState({
        email: "",
        password: ""
    });

    const onChangeHandler = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setData((data) => ({
            ...data,
            [name]: value
        }));
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            const response = await login(data);

            if (response.status === 200) {
                toast.success("Login Successfully");

                localStorage.setItem("token", response.data.token);
                localStorage.setItem("role", response.data.role);

                setAuthData(
                    response.data.token,
                    response.data.role
                );

                navigate("/dashboard");
            }
        } catch (error) {
            console.error(error);
            toast.error("Email/Password Invalid");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-light d-flex align-items-center justify-content-center vh-100 login-background">
            <div
                className="card shadow-lg w-100"
                style={{ maxWidth: "480px" }}
            >
                <div className="card-body">

                    <div className="text-center">
                        <h1 className="card-title">
                            Sign in
                        </h1>

                        <p className="card-text text-muted">
                            Sign in below to access your account
                        </p>
                    </div>

                    <div className="mt-4">
                        <form onSubmit={onSubmitHandler}>

                            {/* Email */}
                            <div className="mb-4">
                                <label
                                    htmlFor="email"
                                    className="form-label text-muted"
                                >
                                    Email address
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    className="form-control"
                                    placeholder="nobody@gmail.com"
                                    onChange={onChangeHandler}
                                    value={data.email}
                                    required
                                />
                            </div>

                            {/* Password */}
                            <div className="mb-4">
                                <label
                                    htmlFor="password"
                                    className="form-label text-muted"
                                >
                                    Password
                                </label>

                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    className="form-control"
                                    placeholder="*************"
                                    onChange={onChangeHandler}
                                    value={data.password}
                                    required
                                />
                            </div>

                            {/* Submit */}
                            <div className="d-grid">
                                <button
                                    type="submit"
                                    className="btn btn-dark btn-lg"
                                    disabled={loading}
                                >
                                    {loading ? "Signing in..." : "Sign in"}
                                </button>
                            </div>

                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Login;