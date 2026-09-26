import "./ManageUsers.css";
import UsersForm from "../../components/usersForm/UsersForm.jsx";
import UsersList from "../../components/usersList/UsersList.jsx";
import {useEffect, useState} from "react";
import {fetchUsers} from "../../service/UserService.js";
import toast from "react-hot-toast";
const ManageUsers=()=>{
    const [users,setUsers]=useState([]);
    const [loading,setLoading]=useState(false);

    useEffect(()=>{
        async function fetchData(){

            try {
                setLoading(true);
                const response=await fetchUsers();
                setUsers(response.data);
            }catch (error){
                console.log(error);
                toast.error("unable to fetch Users");
            }finally {
                setLoading(false);
            }

        }
        fetchData();
    },[])

    return(
        <div className="users-container text-light">
            <div className="left-column">
               <UsersForm setUsers={setUsers}/>

            </div>
            <div className="right-column">
                <UsersList users={users} setUsers={setUsers}/>
            </div>

        </div>
    )
}
export default ManageUsers;