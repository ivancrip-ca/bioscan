import bcrypt from 'bcrypt'

const usuarios = [
    {
        Usu_Usuario: 'admin',
        Usu_Password: bcrypt.hashSync('holahola', 10)
    }
]

export default usuarios
