import React, { useEffect, useState } from "react";
//import {Link} from "react-router-dom";
import firebaseapp from "../credenciales";
import {getAuth} from "firebase/auth";
import {getFirestore,collection,addDoc,getDoc,doc,deleteDoc,getDocs,setDoc } from "firebase/firestore";


const auth = getAuth(firebaseapp)
const db = getFirestore(firebaseapp)
const Perfil = () => {

  const valorInicial={
    Nombre:'',
    Prioridad:'',
    Area:'',
    Detalle:''
  }
  //variables de estado 
  const [user,setUser] = useState(valorInicial)
  //para recuperar los datos de la lista 
  const [lista,setLista] = useState([])
  //para recuperar los datos especificos de la lista 
  const [subId,setsubId] = useState('')
  
  //variable para capturar inputs 
  const capturarInputs = (e) =>{
    const {name,value} = e.target;
    setUser({...user,[name]:value})
  }
  //funcion para guardar los datos 
  const guardarDatos = async(e)=>{
    e.preventDefault();
    if (subId === '') {
      try {
        await addDoc(collection(db,'usuarios'),{
          ...user
        })
      } catch (error) {
        console.log(error)
      }
    }
    else{
      await setDoc(doc(db,'usuarios',subId),{
        ...user
      })
    }
    
    setUser({...valorInicial})
    setsubId('')
  }
  //funcion para reenderizar la lista de ususarios 
  useEffect(()=>{
    const getLista = async()=>{
      try {
        const querySnapshot = await getDocs(collection(db,'usuarios'))
        const docs =[]
        querySnapshot.forEach((doc)=>{
          docs.push({...doc.data(), id:doc.id})
        })
        setLista(docs)
      } catch (error) {
        
      }
    }
    getLista()
  },[lista])
  //funcion para eliminar ususario
  const deleteUser = async(id)=> {
   await deleteDoc(doc(db,'usuarios',id))
  }
  //funcion para traer los datos espeficios 
  const getOne = async(id)=>{
    try {
      const docRef = doc(db,'usuarios',id)
      const docSnap = await getDoc(docRef)
      setUser(docSnap.data())
    } catch (error) {
      console.log(error);
    }
 
  }
 

  useEffect(()=>{
    if (subId !== '') {
      getOne(subId)
    }

  },[subId])
    return(
        
<div className="container">
    
  <div className='row'>
  <div className="col-md-4">
  <h3 className="text-center mb-3">Perfil del usuario</h3>
   <form onSubmit={guardarDatos}>
     <div className='card card-body'>
       <div className='form-group '>
        <input type="text" name='Nombre' className='form-control mb-3' placeholder='Ingresar el nombre del usuario'
        onChange={capturarInputs} value={user.Nombre}/>
        <input type="text" name='Prioridad' className='form-control mb-3' placeholder='Ingresar el tipo de prioridad'
        onChange={capturarInputs} value={user.Prioridad}/>
        <input type="text" name='Area' className='form-control mb-3' placeholder='Ingresar el area'
        onChange={capturarInputs} value={user.Area}/>
        <input type="text" name='Detalle' className='form-control mb-3' placeholder='Ingresar el detalle'
        onChange={capturarInputs} value={user.Detalle}/>
       </div>
       <button className="btn btn-primary">{subId=== '' ? 'Guardar': 'Actualizar'}</button>
     </div>
   </form>
  </div>
  </div>
</div>

 )
}
export default Perfil