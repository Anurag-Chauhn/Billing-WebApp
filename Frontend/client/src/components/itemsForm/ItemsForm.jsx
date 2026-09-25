import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { assets } from "../../assets/assets.js";
import { AppContext } from "../../context/AppContext.jsx";
import { addItem } from "../../service/ItemService.js";

const ItemsForm = () => {

    const {
        categories,
        itemsData,
        setItemsData,
        setCategories,
    } = useContext(AppContext);

    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);

    const [data, setData] = useState({
        name: "",
        categoryId: "",
        price: "",
        description: "",
    });

    const onChangeHandler = (e) => {

        const { name, value } = e.target;

        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const onSubmitHandler = async (e) => {

        e.preventDefault();

        if (!image) {
            toast.error("Select image for item");
            return;
        }

        setLoading(true);

        try {

            const formData = new FormData();

            formData.append(
                "item",
                JSON.stringify(data)
            );

            formData.append(
                "file",
                image
            );

            const response = await addItem(formData);

            if (response.status === 201) {

                setItemsData([
                    ...itemsData,
                    response.data
                ]);
                setCategories((prevCategories) =>
                    prevCategories.map((category)=>category.categoryId===category.id ? {...category,items:category.items+1} : category));

                toast.success("Item added successfully.");

                setData({
                    name: "",
                    categoryId: "",
                    price: "",
                    description: "",
                });

                setImage(null);

                // Reset file input
                document.getElementById("image").value = "";

            } else {

                toast.error("Unable to add item.");
            }

        } catch (error) {

            console.error("Error adding item:", error);

            toast.error(
                error?.response?.data?.message ||
                "Error adding item"
            );

        } finally {

            setLoading(false);
        }
    };

    return (
        <div
            className="item-form-container"
            style={{
                height: "100vh",
                overflow: "auto",
                overflowX: "hidden"
            }}
        >

            <div className="mx-2 mt-2">

                <div className="row">

                    <div className="card col-md-12 form-container">

                        <div className="card-body">

                            <form onSubmit={onSubmitHandler}>

                                {/* Image */}
                                <div className="mb-3">

                                    <label
                                        htmlFor="image"
                                        className="form-label"
                                    >
                                        <img
                                            src={
                                                image
                                                    ? URL.createObjectURL(image)
                                                    : assets.upload
                                            }
                                            alt="item"
                                            width="48px"
                                        />
                                    </label>

                                    <input
                                        type="file"
                                        name="image"
                                        id="image"
                                        className="form-control"
                                        hidden
                                        accept="image/*"
                                        onChange={(e) =>
                                            setImage(
                                                e.target.files[0]
                                            )
                                        }
                                    />

                                </div>

                                {/* Name */}
                                <div className="mb-3">

                                    <label
                                        htmlFor="name"
                                        className="form-label"
                                    >
                                        Name
                                    </label>

                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="form-control"
                                        placeholder="Item Name"
                                        onChange={onChangeHandler}
                                        value={data.name}
                                        required
                                    />

                                </div>

                                {/* Category */}
                                <div className="mb-3">

                                    <label
                                        htmlFor="categoryId"
                                        className="form-label"
                                    >
                                        Category
                                    </label>

                                    <select
                                        name="categoryId"
                                        id="categoryId"
                                        className="form-control"
                                        onChange={onChangeHandler}
                                        value={data.categoryId}
                                        required
                                    >

                                        <option value="">
                                            --SELECT CATEGORY--
                                        </option>

                                        {categories.map((category) => (

                                            <option
                                                key={category.categoryId}
                                                value={category.categoryId}
                                            >
                                                {category.name}
                                            </option>

                                        ))}

                                    </select>

                                </div>

                                {/* Price */}
                                <div className="mb-3">

                                    <label
                                        htmlFor="price"
                                        className="form-label"
                                    >
                                        Price
                                    </label>

                                    <input
                                        type="number"
                                        name="price"
                                        id="price"
                                        className="form-control"
                                        placeholder="₹200.00"
                                        onChange={onChangeHandler}
                                        value={data.price}
                                        min="0"
                                        required
                                    />

                                </div>

                                {/* Description */}
                                <div className="mb-3">

                                    <label
                                        htmlFor="description"
                                        className="form-label"
                                    >
                                        Description
                                    </label>

                                    <textarea
                                        rows="5"
                                        id="description"
                                        name="description"
                                        className="form-control"
                                        placeholder="Write Content Here."
                                        onChange={onChangeHandler}
                                        value={data.description}
                                        required
                                    />

                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn btn-warning w-100"
                                >
                                    {loading
                                        ? "Saving..."
                                        : "Save"}
                                </button>

                            </form>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default ItemsForm;