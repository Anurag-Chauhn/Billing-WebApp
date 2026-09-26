import { createContext, useEffect, useState } from "react";
import { fetchCategories } from "../service/CategoryService.js";
import { fetchItems } from "../service/ItemService.js";

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext(null);

export const AppContextProvider = (props) => {
    const [categories, setCategories] = useState([]);
    const [itemsData, setItemsData] = useState([]);

    const [auth, setAuth] = useState({
        token: null,
        role: null,
    });

    const [cartItems, setCartItems] = useState([]);

    // Add item to cart
    const addToCart = (item) => {
        setCartItems((prevCartItems) => {
            const existingItem = prevCartItems.find(
                (cartItem) => cartItem.itemId === item.itemId
            );

            if (existingItem) {
                return prevCartItems.map((cartItem) =>
                    cartItem.itemId === item.itemId
                        ? {
                            ...cartItem,
                            quantity: cartItem.quantity + 1,
                        }
                        : cartItem
                );
            }

            return [
                ...prevCartItems,
                {
                    ...item,
                    quantity: 1,
                },
            ];
        });
    };

    // Remove item from cart
    const removeFromCart = (itemId) => {
        setCartItems((prevCartItems) =>
            prevCartItems.filter(
                (item) => item.itemId !== itemId
            )
        );
    };

    // Update item quantity
    const updateQuantity = (itemId, newQuantity) => {
        if (newQuantity < 1) {
            return;
        }

        setCartItems((prevCartItems) =>
            prevCartItems.map((item) =>
                item.itemId === itemId
                    ? {
                        ...item,
                        quantity: newQuantity,
                    }
                    : item
            )
        );
    };

    // Set authentication data
    const setAuthData = (token, role) => {
        setAuth({
            token,
            role,
        });
    };

    //clear the cart
    const clearCart = () => {
        setCartItems([]);
    }

    // Load categories and items
    useEffect(() => {
        const loadData = async () => {
            try {
                const token = localStorage.getItem("token");
                const role = localStorage.getItem("role");

                if (token && role) {
                    setAuthData(token, role);
                }

                const response = await fetchCategories();
                const itemResponse = await fetchItems();

                setCategories(response.data);
                setItemsData(itemResponse.data);
            } catch (error) {
                console.error("Error loading data:", error);
            }
        };

        loadData();
    }, []);

    const contextValue = {
        categories,
        setCategories,

        itemsData,
        setItemsData,

        auth,
        setAuthData,

        cartItems,
        setCartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart
    };

    return (
        <AppContext.Provider value={contextValue}>
            {props.children}
        </AppContext.Provider>
    );
};