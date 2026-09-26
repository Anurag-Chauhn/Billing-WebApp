import "./ManageCategoty.css";
import CategoryList from "../../components/categoryList/CategoryList.jsx";
import CategoryForm from "../../components/categoryForm/CategoryForm.jsx";
const ManageCategories=()=>{
    return(
        <div className="category-container text-light">
            <div className="left-column">
                <CategoryForm/>

            </div>
            <div className="right-column">
                <CategoryList/>
            </div>

        </div>

    )
}
export default ManageCategories;