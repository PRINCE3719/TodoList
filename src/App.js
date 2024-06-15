import './index.css'
import { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';


const Geturl = "http://localhost:4000/api/get";

const posturl = "http://localhost:4000/api/post";

const deleteurl = "http://localhost:4000/api/delete";

const updateurl =  "http://localhost:4000/api/update";



function App() {



  const [getTask, setgetTask] = useState([]);
  const [postTask, setpostTask] = useState('');
 

  useEffect(() => {
    const todo = async () => {
      const res = await fetch(Geturl);
      const data = await res.json();
      setgetTask(data);

    }

    todo()

  }, [])

  const createTask = async () => {
    if (postTask.length > 3) {
      const res = await fetch(posturl, {
        "method": "POST",
        body: JSON.stringify({ data: postTask }),
        headers: {
          "Content-Type": "application/json"
        },
      });
      const newtodo = await res.json();
      console.log(newtodo);

      setpostTask("")
      setgetTask([...getTask, newtodo]);
    }

  }


  const deleteTask = async (id) => {
    const res = await fetch(`${deleteurl}/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    else {
      toast.success('Task deleted')
    }

    const deletedtask = await res.json();
    console.log(deletedtask);
    const updatedtask = getTask.filter((task) => task._id !== id)
    setgetTask(updatedtask);




  }
  const updateTask = async(id,todostatus)=>{
    const res = await fetch(`${updateurl}/${id}`,{
      method:"PUT",
      body: JSON.stringify({status:todostatus}),
      headers:{
        "Content-Type":"application/json"
      },
    });
    const response = await res.json();
    console.log(response);
    if(response.acknowledged){
      setgetTask(currentTodo=>{
        return currentTodo.map((current)=>{
          if(current._id === id){
            return {...current, status: !current.status }
          }
          return current;
        })
      })
    }
  
  


  }

 
 


  return (
   
    <div className="main">
      <div className='center-box'>
        <h1 className='center-head'>To Do List</h1>
        {getTask.length > 0 && getTask.map((val, index) => {
        
          return (
            <>
            <div className='input-sec' key={index}>
              <p className={!val.status ? "task":"task-stat"}>{val.data}</p>
              <div className='inner-box'>
                <span onClick={()=>updateTask(val._id,val.status)}>{!val.status ? <i class="fa-regular fa-square"></i>:<i class="fa-regular fa-square-check"></i>}</span>
                
                <span><i className="fa-solid fa-trash" onClick={() => deleteTask(val._id)}></i></span>
              </div>
              
            </div>
            <div className='line'></div>
            </>
            
          );
        })}



        
        <div className='adding-sec'>
          <input type='text' name='task' className='text-in' value={postTask} onChange={(e) => setpostTask(e.target.value)}></input>
          <button className='butn' onClick={createTask}>Add</button>
        </div>
      </div>
      <Toaster/>
    </div>

  );

}

export default App;
