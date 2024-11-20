import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/fireBaseConfig';

const AuthPage = () => {
    const [user, setUser] = useState({});
    const [login, setLogin] = useState(false);
    const navigator = useNavigate();

    let handleChnage = (e) => {
        let { name, value } = e.target;
        setUser((prevstate) => ({ ...prevstate, [name]: value }));
    };

    let handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (login) {
                await signInWithEmailAndPassword(auth, user.email, user.password);
                setUser({});
                navigator("/add");
            } else {
                try {
                    let res = await createUserWithEmailAndPassword(
                        auth,
                        user.email,
                        user.password
                    ).catch((err) => {
                        alert(err.code);
                    });

                    if (res) {
                        setUser({});
                        navigator("/add");
                    }

                } catch (error) {
                    console.log(error);

                }

            }
        } catch (error) {
            alert(error.code);
        }
    };

    return (
        <div>
            <div className="container my-4">
                <div className="row justify-content-center">
                    <div className="col-4">
                        <div className="form-content border p-2 rounded">
                            <h3>{!login ? "SignUp" : "Login"} Form</h3>
                            <form onSubmit={handleSubmit}>
                                <input type="text" name="email" id="" className='form-control' placeholder='Enter Email' value={user.email || ""} onChange={handleChnage} />
                                <input type="password" name="password" className='form-control my-2' placeholder='Enter Password' id="" value={user.password || ""} onChange={handleChnage} />
                                <input type="submit" value={!login ? "SignUp" : "Login"} className='btn btn-primary' />
                                <span className='d-block mt-3'>{login ? "Don't have an account?" : "Already have an account?"}<span style={{ cursor: "pointer" }} className='ms-1' onClick={() => setLogin(!login)}>{login ? "SignUp" : "Login"}</span></span>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthPage
