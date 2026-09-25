
import "./OrderHistory.css";
import { useEffect, useState } from "react";
import { latestOrders } from "../../service/OrderService.js";

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await latestOrders();
                setOrders(response.data || []);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const formatItems = (items = []) => {
        return items
            .map((item) => `${item.name} x ${item.quantity}`)
            .join(", ");
    };

    const formatDate = (dateString) => {
        if (!dateString) {
            return "-";
        }

        const options = {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        };

        return new Date(dateString).toLocaleDateString("en-US", options);
    };

    if (loading) {
        return <div className="text-center py-4">Loading Orders...</div>;
    }

    if (orders.length === 0) {
        return <div className="text-center py-4">No orders found</div>;
    }

    return (
        <div className="order-history-container">
            <h2 className="mb-2 text-light">Recent Orders</h2>

            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead className="table-dark">
                    <tr>
                        <th>Order Id</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Payment</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>
                    </thead>

                    <tbody>
                    {orders.map((order) => (
                        <tr key={order.orderId}>
                            {/* Order ID */}
                            <td>{order.orderId}</td>

                            {/* Customer */}
                            <td>
                                {order.customerName}
                                <br />
                                <small className="text-muted">
                                    {order.phoneNumber}
                                </small>
                            </td>

                            {/* Items */}
                            <td>
                                {formatItems(order.items)}
                            </td>

                            {/* Total */}
                            <td>
                                ₹{Number(order.grandTotal || 0).toFixed(2)}
                            </td>

                            {/* Payment Method */}
                            <td>
                                {order.paymentMethod}
                            </td>

                            {/* Payment Status */}
                            <td>
                                    <span
                                        className={`badge ${
                                            order.paymentDetails?.status === "COMPLETED"
                                                ? "bg-success"
                                                : "bg-warning text-dark"
                                        }`}
                                    >
                                        {order.paymentDetails?.status || "PENDING"}
                                    </span>
                            </td>

                            {/* Date */}
                            <td>
                                {formatDate(order.createdAt)}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderHistory;


