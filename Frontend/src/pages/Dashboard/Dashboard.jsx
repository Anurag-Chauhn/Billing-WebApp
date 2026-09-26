
import "./Dashboard.css";
import { useEffect, useState } from "react";
import { fetchDashboardData } from "../../service/DashboardService.js";
import toast from "react-hot-toast";

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await fetchDashboardData();
                setData(response.data);
            } catch (error) {
                console.error("Dashboard error:", error);
                toast.error("Unable to view the data!");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) {
        return <div className="loading">Loading Dashboard...</div>;
    }

    if (!data) {
        return (
            <div className="error">
                Failed to load the dashboard data...
            </div>
        );
    }

    return (
        <div className="dashboard-wrapper">
            <div className="dashboard-container">

                {/* Dashboard Statistics */}
                <div className="stats-grid">

                    {/* Today's Sales */}
                    <div className="stat-card">
                        <div className="stat-icon">
                            <i className="bi bi-currency-rupee"></i>
                        </div>

                        <div className="stat-content">
                            <h3>Today's Sales</h3>
                            <p>
                                ₹{Number(data.todaySales || 0).toFixed(2)}
                            </p>
                        </div>
                    </div>

                    {/* Today's Orders */}
                    <div className="stat-card">
                        <div className="stat-icon">
                            <i className="bi bi-cart-check"></i>
                        </div>

                        <div className="stat-content">
                            <h3>Today's Orders</h3>
                            <p>
                                {data.todayOrderCount || 0}
                            </p>
                        </div>
                    </div>

                </div>

                {/* Recent Orders */}
                <div className="recent-orders-card">

                    <h3 className="recent-order-title">
                        <i className="bi bi-clock-history"></i>
                        Recent Orders
                    </h3>

                    <div className="order-table-container">
                        <table className="order-table">

                            <thead>
                            <tr>
                                <th>Order Id</th>
                                <th>Customer</th>
                                <th>Amount</th>
                                <th>Payment</th>
                                <th>Status</th>
                                <th>Time</th>
                            </tr>
                            </thead>

                            <tbody>
                            {(data.recentOrders || []).map((order) => {

                                const orderId = String(
                                    order.orderId ?? ""
                                );

                                const paymentMethod =
                                    order.paymentMethod || "UNKNOWN";

                                const paymentStatus =
                                    order.paymentDetails?.status ||
                                    "PENDING";

                                return (
                                    <tr key={order.orderId}>

                                        {/* Order ID */}
                                        <td>
                                            {orderId.length > 8
                                                ? `${orderId.substring(0, 8)}...`
                                                : orderId}
                                        </td>

                                        {/* Customer */}
                                        <td>
                                            {order.customerName || "N/A"}
                                        </td>

                                        {/* Amount */}
                                        <td>
                                            ₹
                                            {Number(
                                                order.grandTotal || 0
                                            ).toFixed(2)}
                                        </td>

                                        {/* Payment Method */}
                                        <td>
                                                <span
                                                    className={`payment-method ${paymentMethod.toLowerCase()}`}
                                                >
                                                    {paymentMethod}
                                                </span>
                                        </td>

                                        {/* Payment Status */}
                                        <td>
                                                <span
                                                    className={`status-badge ${paymentStatus.toLowerCase()}`}
                                                >
                                                    {paymentStatus}
                                                </span>
                                        </td>

                                        {/* Time */}
                                        <td>
                                            {order.createdAt
                                                ? new Date(
                                                    order.createdAt
                                                ).toLocaleString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })
                                                : "N/A"}
                                        </td>

                                    </tr>
                                );
                            })}
                            </tbody>

                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;