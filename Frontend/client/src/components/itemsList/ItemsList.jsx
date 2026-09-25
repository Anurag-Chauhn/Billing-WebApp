import "./ItemsList.css";
import {useContext, useState} from "react";
import {AppContext} from "../../context/AppContext.jsx";
import toast from "react-hot-toast";
import {deleteItem} from "../../service/ItemService.js";

const ItemsList = () => {


    const { itemsData, setItemsData} = useContext(AppContext);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredItems= itemsData.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const deleteByItemId = async (itemId) => {
        try {

            const response = await deleteItem(itemId);

            if (response.status === 204) {

                const updatedItems = itemsData.filter(
                    item => item.itemId !== itemId
                );

                setItemsData(updatedItems);

                toast.success("Item deleted.");

            }

        } catch (error) {

            console.log(error);
            toast.error("Unable to delete Items");

        }
    };
    return (
        <div
            className="items-list"
            style={{
                height: "100vh",
                overflowY: "auto",
                overflowX: "hidden"
            }}
        >

            <div className="row pe-2">

                <div className="input-group mb-3">

                    <input
                        type="text"
                        name="keyword"
                        id="keyword"
                        placeholder="Search by keyword"
                        className="form-control"
                        onChange={(e) => setSearchTerm(e.target.value)}
                        value={searchTerm}
                    />

                    <span className="input-group-text bg-warning">
                        <i className="bi bi-search"></i>
                    </span>

                </div>

            </div>

            <div className="row g-3 pe-2">

                {filteredItems.map((item,index) => (

                    <div
                        key={index}
                        className="col-12"
                    >

                        <div className="card p-3 bg-dark">

                            <div className="d-flex align-items-center">

                                <div style={{ marginRight: "15px" }}>
                                    <img src={item.imgUrl}
                                        alt={item.name}
                                        className="item-image"/>
                                </div>

                                <div className="flex-grow-1">

                                    <h5 className="mb-1 text-white">{item.name}</h5>

                                    <p className="mb-0 text-white">{item.categoryName}</p>
                                    <span className="mb-0 text-block badge rounded-pill text-bg-warning">
                                        &#8377;{item.price}
                                    </span>

                                </div>

                                <div>

                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() =>
                                            deleteByItemId(
                                                item.itemId
                                            )
                                        }
                                    >
                                        <i className="bi bi-trash"></i>
                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </div>
    )
}
export default ItemsList;