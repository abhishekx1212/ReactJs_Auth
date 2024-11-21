import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { auth, db } from "../config/fireBaseConfig"
import { Form, Table } from 'react-bootstrap';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const AddData = () => {
  const [user, setUser] = useState({});
  const [editId, setEditId] = useState("");
  const [data, setData] = useState([]);
  const [btnValue, setBtnValue] = useState("Add")
  
  useEffect(() => {
    getData()
  }, [])

  const handleInput = (e) => {
    let { name, value } = e.target;
    setUser({ ...user, [name]: value })
  }

  const getData = async () => {
    try {
      const getSnapShot = await getDocs(collection(db, "users"))
      const getDocData = getSnapShot.docs.map((val) => {
        return { id: val.id, ...val.data() }
      })
      setData(getDocData)
    } catch (error) {
      console.log(error);
    }
  }

  const deleteData = async (id) => {
    try {
      const docRef = doc(db, "users", id);
      await deleteDoc(docRef);
      console.log("Deleted");
      getData();
    } catch (error) {
      console.log(error);
    }
  }

  const editData = (val) => {
    setUser(val);
    setEditId(val.id)
    setBtnValue("Update")
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId == "") {
      try {
        const docRef = await addDoc(collection(db, "users"), user)
        console.log("Data Added");
        getData()
      } catch (error) {
        console.log(error.message || error);
      }
    } else {
      const docRef = doc(db, "users", editId);
      await updateDoc(docRef, user);
      getData();
      setEditId("")
      setBtnValue("Add")
    }
    setUser({})
  }
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out successfully");
      navigate("/")
      // You can redirect the user to a login screen or show a message
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };
  return (
    <div>
      <div className="container py-3">
        <div className="row justify-content-center">
          <div className="col-5">
            <div className="form-content">
              <Form onSubmit={handleSubmit} className='border p-2 rounded'>
                <input type="text" className='form-control' placeholder='Enter Email' name='email' value={user.email || ""} onChange={handleInput} />
                <input type="text" className='form-control my-2' placeholder='Enter Password' name='password' value={user.password || ""} onChange={handleInput} />
                <input type="submit" value={btnValue} className='btn btn-primary' />
              </Form>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
          <div className="col-6">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Password</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  data.map((val, index) => (
                    <tr key={val.password + index}>
                      <td>{val.email}</td>
                      <td>{val.password}</td>
                      <td>
                        <button className='btn btn-danger py-1 me-1' onClick={() => deleteData(val.id)}>Delete</button>
                        <button className='btn btn-warning py-1' onClick={() => editData(val)}>Edit</button>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </Table>
          </div>
        </div>
      </div>


    </div>
  )
}

export default AddData
