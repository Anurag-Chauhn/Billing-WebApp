import "./Explore.css"
import {useContext, useState} from "react";
import {AppContext} from "../../context/AppContext.jsx";
import DisplayCategory from "../../components/displayCategory/DisplayCategory.jsx";
import DisplayItem from "../../components/displayItems/DisplayItem.jsx";
import CustomerForm from "../../components/customerForm/CustomerForm.jsx";
import CardItem from "../../components/cardItems/CardItem.jsx";
import CartSummary from "../../components/cardSummary/CartSummary.jsx";
const Explore=()=>{
    const {categories}=useContext(AppContext);
    const [selectedCategory,setSelectedCategory]=useState("");
    const [customerName,setCustomerName]=useState("");
    const [mobileNumber,setMobileNumber]=useState("");
    return(
       <div className="explore-container text-light">
           <div className="left-column">
               <div className="first-row" style={{overflow:'auto'}} >
                   <DisplayCategory
                       selectedCategory={selectedCategory}
                       setSelectedCategory={setSelectedCategory}
                       categories={categories} />
               </div>
               <div className="horizontal-line"></div>
               <div className="second-row">
                   <DisplayItem selectedCategory={selectedCategory} />

               </div>
           </div>
           <div className="right-column flex-column">
               <div className="customer-form-container" style={{ height:"15%"}}>
                   <CustomerForm customerName={customerName}
                                 setCustomerName={setCustomerName}
                                 mobileNumber={mobileNumber}
                                 setMobileNumber={setMobileNumber}

                   />

               </div>
               <hr className="my-3 text-light"/>
               <div className="cart-items-container" style={{height:"55%",opacity:"auto"}}>
                   <CardItem/>

               </div>
                <div className="cart-summary-container" style={{height:"30%"}}>
                    <CartSummary
                        customerName={customerName}
                        setCustomerName={setCustomerName}
                        mobileNumber={mobileNumber}
                        setMobileNumber={setMobileNumber}

                    />
                </div>


           </div>
       </div>
    )
}
export default Explore;