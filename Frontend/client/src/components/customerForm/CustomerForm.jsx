import "./CustomerForm.css";

const CustomerForm = ({
                          customerName,
                          setCustomerName,
                          mobileNumber,
                          setMobileNumber,
                      }) => {
    return (
        <div className="p-3">
            <div className="mb-3">

                {/* Customer Name */}
                <div className="d-flex align-items-center gap-2 mb-3">
                    <label
                        htmlFor="customerName"
                        className="col-4"
                    >
                        Customer Name
                    </label>

                    <input
                        type="text"
                        className="form-control form-control-sm"
                        id="customerName"
                        placeholder="Enter customer name"
                        value={customerName}
                        onChange={(e) =>
                            setCustomerName(e.target.value)
                        }
                    />
                </div>

                {/* Mobile Number */}
                <div className="d-flex align-items-center gap-2">
                    <label
                        htmlFor="mobileNumber"
                        className="col-4"
                    >
                        Mobile Number
                    </label>

                    <input
                        type="tel"
                        className="form-control form-control-sm"
                        id="mobileNumber"
                        placeholder="Enter mobile number"
                        value={mobileNumber}
                        onChange={(e) =>
                            setMobileNumber(e.target.value)
                        }
                    />
                </div>

            </div>
        </div>
    );
};

export default CustomerForm;