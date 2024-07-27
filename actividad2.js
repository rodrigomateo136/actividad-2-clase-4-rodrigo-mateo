const fs = require('fs');
const crypto = require('crypto');

class UserManager {
    constructor(path){
        this.path = path;
    }
    async agregarUsuario(usuario) {
        if(!usuario.nombre || !usuario.apellido || !usuario.password || !usuario.nombreUsuario) {
            return console.log("usuario incompleto")
        }
const {nombre, apellido, password, nombreUsuario}=usuario;
const usuarios= await this.obtenerUsuario();
const passwordSecurizada= await this.securizarPassword(password);
const nuevoUsuario ={
    nombre,
    apellido,
    password: passwordSecurizada,
    nombreUsuario
}
    usuarios.push(nuevoUsuario);
    await fs.promises.writeFile(this.path, JSON.stringify(usuarios) ,'utf-8')
    }

    async obtenerUsuario(){
        try {
            const resultado= await fs.promises.readFile(this.path,'utf-8');
            const usuarios =JSON.parse(resultado);
            return usuarios
        } catch (error) {
            
            return [];
        }
    }
    async securizarPassword(password){
        const hash= crypto.createHash('sha256');
        hash.update(password);
        const passwordSecurizada= hash.digest('hex');
        return passwordSecurizada;
    }
    async validarUsuario(nombreUsuario, password){
        const users= await this.obtenerUsuario();
        const user= users.find(u => u.nombreUsuario == nombreUsuario);
        if(!user){
            return console.log("usuario no existe");
        }
        const bdPassword= user.password;
        const passwordSecurizada= await this.securizarPassword(password);
        if(bdPassword===passwordSecurizada){
            console.log("te logaste correctamente")
        }
        else{
            console.log("error de constraseña")
        }
    }
}

const test= async()=>{
 const userManager= new UserManager('./user.json');
 await userManager.agregarUsuario({
    nombre:'rodrigo',
    apellido:'mateo',
    password:'123456789',
    nombreUsario:'romateo'
 });

 await userManager.agregarUsuario({
    nombre:"martin",
    apellido:"cardone",
    password:"987654321",
    nombreUsario:"cartu"
 });
console.log("usuario : romateo, constraseña 123456789");
 await userManager.validarUsuario("romateo", "123456789");

 console.log("usuario : rodrigo mateo, constraseña pepe");
 await userManager.validarUsuario("rolando", "pepe");
}

test();