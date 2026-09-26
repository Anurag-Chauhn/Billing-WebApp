import "./UsersForm.css";
import {useState} from "react";
import toast from "react-hot-toast";
import {addUser} from "../../service/UserService.js";
const UsersForm= ({setUsers}) => {

    const [loading,setLoading]=useState(false);
    const [data,setData]=useState({
        name:"",
        email:"",
        password:"",
        role:"ROLE_USER"
    });

    const onChangeHandler=(e)=>{
        const value=e.target.value;
        const name=e.target.name;
        setData((data)=>({...data, [name]:value}));
    }
    const onSubmitHandler=async (e)=>{
        e.preventDefault();
        setLoading(true);
        try {
            const response= await addUser(data);
            setUsers((prevUsers)=>[...prevUsers,response]);
            toast.success("User added successfully.");
            setData({
                name: "",
                email: "",
                password: "",
                role:"ROLE_USER"

            })

        }catch (error){
            console.log(error);
            toast.error("Unable to add a user");
        }finally {
            setLoading(false);
        }
    }
    return (
        <div className="mx-2 mt-2">
            <div className="row">
                <div className="card col-md-12 form-container">
                    <div className="card-body">
                        <form onSubmit={onSubmitHandler}>

                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Name</label>
                                <input type="text"
                                       id="name"
                                       name="name"
                                       className="form-control"
                                       placeholder="Jhon Doe"
                                       onChange={onChangeHandler}
                                       value={data.name}

                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input type="email"
                                       id="email"
                                       name="email"
                                       className="form-control"
                                       placeholder="Nobody@gmail.com"
                                       onChange={onChangeHandler}
                                       value={data.email}

                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input type="password"
                                       id="password"
                                       name="password"
                                       className="form-control"
                                       placeholder="*************"
                                       onChange={onChangeHandler}
                                       value={data.password}

                                />
                            </div>
                            <button type="submit" className="btn btn-warning w-100" disabled={loading}>{loading ? "Saving..." : "Save"}</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )

}
export default UsersForm;