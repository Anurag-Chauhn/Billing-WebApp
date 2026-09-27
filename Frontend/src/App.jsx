// import Menubar from "./components/Menubar/Menubar";
// import Dashboard from "./pages/Dashboard/Dashboard.jsx";
// import Explore from "./pages/Explore/Explore.jsx";
// import ManageCategories from "./pages/ManageCategories/ManageCategories.jsx";
// import ManageUsers from "./pages/ManageUsers/ManageUsers.jsx";
// import ManageItems from "./pages/ManageItems/ManageItems.jsx";
// import {Navigate, Route, Routes, useLocation} from "react-router-dom";
// import {Toaster} from "react-hot-toast";
// import Login from "./pages/login/Login.jsx";
// import OrderHistory from "./pages/orderHistory/OrderHistory.jsx";
// import {useContext} from "react";
// import {AppContext} from "./context/AppContext.jsx";
// import NotFound from "./pages/notFound/NotFound.jsx";
//
// const LoginRoute = ({element}) => {
//     const {auth} = useContext(AppContext);
//     if (auth.token) return <Navigate to="/dashboard" replace/>;
//     return element;
// };
//
// const ProtectedRoute = ({element, allowedRoles}) => {
//     const {auth} = useContext(AppContext);
//     if (!auth.token) return <Navigate to="/login" replace/>;
//     if (allowedRoles && !allowedRoles.includes(auth.role)) return <Navigate to="/dashboard" replace/>;
//     return element;
// };
//
// const App = () => {
//     const location = useLocation();
//
//     return (
//         <div>
//             {location.pathname !== "/login" && <Menubar/>}
//             <Toaster/>
//             <Routes>
//                 <Route path="/dashboard" element={<Dashboard />} />
//                 <Route path="/explore" element={<Explore/>}/>
//                 {/*Admin only routes*/}
//                 <Route path="/categories" element={<ProtectedRoute element={<ManageCategories/>} allowedRoles={["ROLE_ADMIN"]}/>}/>
//                 <Route path="/users" element={<ProtectedRoute element={<ManageUsers/> } allowedRoles={["ROLE_ADMIN"]}/>}/>
//                 <Route path="/items" element={<ProtectedRoute element={<ManageItems/>} allowedRoles={["ROLE_ADMIN"]}/>}/>
//
//                 <Route path="/login" element={<LoginRoute element={<Login/>}/>}/>
//                 <Route path="/orders" element={<OrderHistory/>}/>
//                 <Route path="/" element={<Dashboard/>}/>
//                 <Route path="*" element={<NotFound/>}/>
//             </Routes>
//         </div>
//     )
// }
//
// export default App;


import Menubar from "./components/Menubar/Menubar";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Explore from "./pages/Explore/Explore.jsx";
import ManageCategories from "./pages/ManageCategories/ManageCategories.jsx";
import ManageUsers from "./pages/ManageUsers/ManageUsers.jsx";
import ManageItems from "./pages/ManageItems/ManageItems.jsx";

import {
    Navigate,
    Route,
    Routes,
    useLocation
} from "react-router-dom";

import { Toaster } from "react-hot-toast";
import Login from "./pages/login/Login.jsx";
import OrderHistory from "./pages/orderHistory/OrderHistory.jsx";

import { useContext } from "react";
import { AppContext } from "./context/AppContext.jsx";

import NotFound from "./pages/notFound/NotFound.jsx";


/* =========================
   LOGIN ROUTE
========================= */

const LoginRoute = ({ element }) => {

    const { auth } = useContext(AppContext);

    if (auth?.token) {
        return <Navigate to="/dashboard" replace />;
    }

    return element;
};


/* =========================
   PROTECTED ROUTE
========================= */

const ProtectedRoute = ({ element, allowedRoles }) => {

    const { auth } = useContext(AppContext);

    /* No token → Login */
    if (!auth?.token) {
        return <Navigate to="/login" replace />;
    }

    /* Normalize role */
    const userRole = auth.role?.replace("ROLE_", "");

    const roles = allowedRoles?.map(
        role => role.replace("ROLE_", "")
    );

    /* Check role */
    if (roles && !roles.includes(userRole)) {
        return <Navigate to="/dashboard" replace />;
    }

    return element;
};


/* =========================
   APP
========================= */

const App = () => {

    const location = useLocation();

    return (
        <div>

            {/* Hide Menubar on Login page */}
            {location.pathname !== "/login" && <Menubar />}

            <Toaster />

            <Routes>

                {/* =====================
                    PUBLIC ROUTE
                ====================== */}

                <Route
                    path="/login"
                    element={
                        <LoginRoute
                            element={<Login />}
                        />
                    }
                />


                {/* =====================
                    PROTECTED USER ROUTES
                ====================== */}

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute
                            element={<Dashboard />}
                            allowedRoles={["USER", "ADMIN"]}
                        />
                    }
                />

                <Route
                    path="/explore"
                    element={
                        <ProtectedRoute
                            element={<Explore />}
                            allowedRoles={["USER", "ADMIN"]}
                        />
                    }
                />

                <Route
                    path="/orders"
                    element={
                        <ProtectedRoute
                            element={<OrderHistory />}
                            allowedRoles={["USER", "ADMIN"]}
                        />
                    }
                />


                {/* =====================
                    ADMIN ONLY ROUTES
                ====================== */}

                <Route
                    path="/categories"
                    element={
                        <ProtectedRoute
                            element={<ManageCategories />}
                            allowedRoles={["ADMIN"]}
                        />
                    }
                />

                <Route
                    path="/users"
                    element={
                        <ProtectedRoute
                            element={<ManageUsers />}
                            allowedRoles={["ADMIN"]}
                        />
                    }
                />

                <Route
                    path="/items"
                    element={
                        <ProtectedRoute
                            element={<ManageItems />}
                            allowedRoles={["ADMIN"]}
                        />
                    }
                />


                {/* =====================
                    ROOT
                ====================== */}

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/dashboard"
                            replace
                        />
                    }
                />


                {/* =====================
                    404
                ====================== */}

                <Route
                    path="*"
                    element={<NotFound />}
                />

            </Routes>

        </div>
    );
};

export default App;