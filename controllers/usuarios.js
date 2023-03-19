const {response,request}=require('express')

const usuariosGet=(req=request,res=response)=>{
    const query=req.query;
    res.json({msj:'get API-Controlador'})
}

const usuariosPost=(req=request,res=response)=>{
    const body =req.body;
    res.json({msj:'post API-Controlador',body})
}

const usuariosPut=(req=request,res=response)=>{
    const id =req.param.id;
    res.json({msj:'put API-Controlador',body})
}


module.exports={
    usuariosGet,
    usuariosPost,
    usuariosPut,
}