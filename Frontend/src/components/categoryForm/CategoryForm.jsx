
import "./CategoryForm.css";
import { useContext, useEffect, useState } from "react";
import { assets } from "../../assets/assets.js";
import toast from "react-hot-toast";
import { addCategory } from "../../service/CategoryService.js";
import { AppContext } from "../../context/AppContext.jsx";

const CategoryForm = () => {
    const { categories, setCategories } = useContext(AppContext);

    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);

    const [data, setData] = useState({
        name: "",
        description: "",
        bgColor: "#2c2c2c",
    });

    useEffect(() => {
        console.log(data);
    }, [data]);

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
            toast.error("Select image for Category");
            return;
        }

        setLoading(true);

        const formData = new FormData();

        formData.append("category", JSON.stringify(data));
        formData.append("file", image);

        try {
            const response = await addCategory(formData);

            if (response.status === 201) {
                setCategories([...categories,response.data])

                toast.success("Category Added");

                setData({
                    name: "",
                    description: "",
                    bgColor: "#2c2c2c",
                });

                setImage(null);
            }
        } catch (error) {
            console.error("Error adding category:", error);
            toast.error("Error adding Category");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-2 mt-2">
            <div className="row">
                <div className="card col-md-12 form-container">
                    <div className="card-body">

                        <form onSubmit={onSubmitHandler}>

                            {/* Image */}
                            <div className="mb-3">
                                <label htmlFor="image" className="form-label">
                                    <img
                                        src={
                                            image
                                                ? URL.createObjectURL(image)
                                                : assets.upload
                                        }
                                        alt="Category"
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
                                        setImage(e.target.files[0])
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
                                    placeholder="Category Name"
                                    onChange={onChangeHandler}
                                    value={data.name}
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
                                ></textarea>
                            </div>

                            {/* Background Color */}
                            <div className="mb-3">
                                <label
                                    htmlFor="bgColor"
                                    className="form-label"
                                >
                                    Background color
                                </label>

                                <br />

                                <input
                                    type="color"
                                    name="bgColor"
                                    id="bgColor"
                                    onChange={onChangeHandler}
                                    value={data.bgColor}
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-warning w-100"
                            >
                                {loading ? "Loading..." : "Submit"}
                            </button>

                        </form>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryForm;