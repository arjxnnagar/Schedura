import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const Notfound = () => {
    const navigate = useNavigate();
    useEffect(()=>{
        alert("error 404");
        navigate("/");
    })

  return (
    null
  )
}

export default Notfound