import "./DisplayItem.css";
import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext.jsx";
import Items from "../items/Items.jsx";
import SearchBox from "../searchbox/SearchBox.jsx";

const DisplayItem = ({selectedCategory}) => {
    const { itemsData = [] } = useContext(AppContext);

    const [searchText, setSearchText] = useState("");

    const filteredItems = itemsData.filter((item) => {
       if(!selectedCategory) return true;
       return item.categoryId===selectedCategory;
    }).filter(item =>
        item.name.toLowerCase().includes(searchText.toLowerCase()));


    return (
        <div className="p-3">

            {/* Search Box */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div></div>

                <div>
                    <SearchBox onSearch={setSearchText} />
                </div>
            </div>

            {/* Items */}
            <div className="row g-3">
                {filteredItems.map((item) => (
                    <div
                        key={item.itemId}
                        className="col-md-4 col-sm-6"
                    >
                        <Items
                            itemName={item.name}
                            itemPrice={item.price}
                            itemImage={item.imgUrl}
                            itemId={item.itemId}
                        />
                    </div>
                ))}
            </div>

        </div>
    );
};

export default DisplayItem;