import "./ManageItems.css"
import ItemsList from "../../components/itemsList/ItemsList.jsx";
import ItemsForm from "../../components/itemsForm/ItemsForm.jsx";
const ManageItems=()=>{
    return(
        <div className="items-container text-light">
            <div className="left-column">
                <ItemsForm/>

            </div>
            <div className="right-column">
                <ItemsList/>
            </div>

        </div>
    )
}
export default ManageItems;