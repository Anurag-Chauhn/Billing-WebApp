import "./CartSummary.css";
import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext.jsx";
import ReceiptPopup from "../receiptPopup/ReceiptPopup.jsx";
import { creatOrder, deleteOrder } from "../../service/OrderService.js";
import toast from "react-hot-toast";
import { creatRazorpayOrder, verifyPayment } from "../../service/PaymentService.js";
import { AppConstants } from "../../util/Constacts.js";

const CartSummary = ({ customerName, setCustomerName, mobileNumber, setMobileNumber }) => {
    const { cartItems, clearCart } = useContext(AppContext);

    const [isProcessing, setIsProcessing] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const tax = totalAmount * 0.01;
    const grandTotal = totalAmount + tax;

    const clearAll = () => {
        setCustomerName("");
        setMobileNumber("");
        clearCart();
    };

    // Only open the receipt. Cart/customer data is cleared when the popup closes,
    // so the receipt can still use it.
    const placeOrder = () => {
        if (!orderDetails) {
            toast.error("Complete the payment first!");
            return;
        }
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        setOrderDetails(null);
        clearAll();
    };

    const handlePrintReceipt = () => {
        window.print();
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.head.appendChild(script);
        });
    };

    const deleteOrderOnFailure = async (orderId) => {
        try {
            await deleteOrder(orderId);
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong!");
        }
    };

    // Throws on failure so the caller can handle it (no more swallowed errors
    // or duplicate success toasts).
    const verifyPaymentHandler = async (response, savedData) => {
        const paymentData = {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            orderId: savedData.orderId,
        };

        const paymentResponse = await verifyPayment(paymentData);
        if (paymentResponse.status !== 200) {
            throw new Error("Payment verification failed");
        }

        return {
            ...savedData,
            paymentDetails: {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
            },
        };
    };

    const completePayment = async (paymentMode) => {
        if (!customerName || !mobileNumber) {
            toast.error("Please enter valid customer details!");
            return;
        }
        if (cartItems.length === 0) {
            toast.error("Your cart is empty!");
            return;
        }

        const orderData = {
            customerName,
            phoneNumber: mobileNumber,
            cartItems,
            subtotal: totalAmount,
            tax,
            grandTotal,
            paymentMethod: paymentMode.toUpperCase(),
        };

        setIsProcessing(true);
        let savedData = null;

        try {
            const response = await creatOrder(orderData);
            savedData = response.data;

            if (response.status !== 201) {
                toast.error("Unable to create order!");
                return;
            }

            // ---------- CASH ----------
            if (paymentMode === "cash") {
                toast.success("Cash received!");
                setOrderDetails(savedData);
                return;
            }

            // ---------- UPI ----------
            if (paymentMode === "upi") {
                const razorpayLoaded = await loadRazorpayScript();
                if (!razorpayLoaded) {
                    toast.error("Unable to load Razorpay");
                    await deleteOrderOnFailure(savedData.orderId);
                    return;
                }

                const razorpayResponse = await creatRazorpayOrder({
                    amount: Number(grandTotal.toFixed(2)),
                    currency: "INR",
                });
                const razorpayOrder = razorpayResponse.data;

                // Prevents double-deleting / deleting after success
                let settled = false;

                const options = {
                    key: AppConstants.RAZORPAY_KEY_ID,
                    amount: razorpayOrder.amount,
                    currency: razorpayOrder.currency,
                    order_id: razorpayOrder.id,
                    name: "My Retail Shop",
                    description: "Order Payment",

                    handler: async (paymentResponse) => {
                        try {
                            const verifiedOrder = await verifyPaymentHandler(paymentResponse, savedData);
                            settled = true;
                            toast.success("Payment successful!");
                            setOrderDetails(verifiedOrder);
                        } catch (error) {
                            console.error("Payment verification failed:", error);
                            settled = true;
                            await deleteOrderOnFailure(savedData.orderId);
                            toast.error("Payment verification failed!");
                        }
                    },

                    prefill: {
                        name: customerName,
                        contact: mobileNumber,
                    },

                    theme: { color: "#3399cc" },

                    modal: {
                        ondismiss: async () => {
                            if (settled) return;
                            settled = true;
                            await deleteOrderOnFailure(savedData.orderId);
                            toast.error("Payment cancelled");
                        },
                    },
                };

                const rzp = new window.Razorpay(options);

                // Don't delete the order here: Razorpay lets the user retry inside the
                // modal. If they give up, ondismiss cleans the order up.
                rzp.on("payment.failed", (failure) => {
                    console.error("Payment failed:", failure.error.description);
                    toast.error("Payment failed! You can try again.");
                });

                rzp.open();
            }
        } catch (error) {
            console.error("Order/payment processing error:", error);
            if (savedData?.orderId && !orderDetails) {
                await deleteOrderOnFailure(savedData.orderId);
            }
            toast.error("Payment processing failed!");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="mt-2">
            <div className="cart-summary-details">
                <div className="d-flex justify-content-between mb-2">
                    <span className="text-light">Item:</span>
                    <span className="text-light">₹{totalAmount.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                    <span className="text-light">Tax (1%):</span>
                    <span className="text-light">₹{tax.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                    <span className="text-light">Total:</span>
                    <span className="text-light">₹{grandTotal.toFixed(2)}</span>
                </div>
            </div>

            <div className="d-flex gap-3">
                <button
                    className="btn btn-success flex-grow-1"
                    onClick={() => completePayment("cash")}
                    disabled={isProcessing || !!orderDetails}
                >
                    {isProcessing ? "Processing.." : "Cash"}
                </button>

                <button
                    className="btn btn-primary flex-grow-1"
                    onClick={() => completePayment("upi")}
                    disabled={isProcessing || !!orderDetails}
                >
                    {isProcessing ? "Processing.." : "UPI"}
                </button>
            </div>

            <div className="d-flex gap-3 mt-3">
                <button
                    className="btn btn-warning flex-grow-1"
                    onClick={placeOrder}
                    disabled={isProcessing || !orderDetails}
                >
                    Place Order
                </button>
            </div>

            {showPopup && (
                <ReceiptPopup
                    orderDetails={{
                        ...orderDetails,
                        razorpayOrderId: orderDetails.paymentDetails?.razorpayOrderId,
                        razorpayPaymentId: orderDetails.paymentDetails?.razorpayPaymentId
                    }}
                    onClose={handleClosePopup}
                    onPrint={handlePrintReceipt}
                />
            )}
        </div>
    );
};

export default CartSummary;
