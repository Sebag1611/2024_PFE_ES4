/* core */
import {useEffect, useState} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import {
    Button,
    Container,
    Form,
    Input,
    Label,
    ListGroup,
    ListGroupItem,
    Row
} from 'reactstrap'

/* component: view */
function App() {
    const [usuarios, setUsuarios] = useState([])
    const [nuevoUsuarioId, setNuevoUsuarioId] = useState('')
    const [nuevoUsuarioNombre, setNuevoUsuarioNombre] = useState('')
    const [nuevoUsuarioGenero, setNuevoUsuarioGenero] = useState('')
    const [nuevoUsuarioDireccion, setNuevoUsuarioDireccion] = useState('')
    const [editandoUsuario, setEditandoUsuario] = useState(null)

    const handleNuevoUsuario = (e) => {
        setNuevoUsuarioId(e.target.value)
    }

    const handleNuevoNombre = (e) => {
        setNuevoUsuarioNombre(e.target.value)
    }

    const handleNuevoGenero = (e) => {
        setNuevoUsuarioGenero(e.target.value)
    }

    const handleNuevaDireccion = (e) => {
        setNuevoUsuarioDireccion(e.target.value)
    }

    const handleAgregarUsuario = () => {
        if (usuarios.some(usuario => usuario.id === nuevoUsuarioId)) {
            return false;
        }
        // Crear objeto con los datos del nuevo usuario
        const nuevoUsuario = {
            id: nuevoUsuarioId,
            nombre: nuevoUsuarioNombre,
            genero: nuevoUsuarioGenero,
            direccion: nuevoUsuarioDireccion
        }
        console.log('Datos del usuario nuevo:', nuevoUsuario)

        // Actualizar el estado de usuarios y guardar en localStorage
        setUsuarios(prev => { // prev se ocupa para obtener el antiguo valor del estado "usuarios"
            const nuevoArreglo = [...prev, nuevoUsuario] // Crear nuevo array con todos los usuarios anteriores más el nuevo usando desestructuración
            localStorage.setItem("usuarios", JSON.stringify(nuevoArreglo)) // Guardar en localStorage
            return nuevoArreglo // Actualizar el estado, se modificará el estado "usuarios"
        })

        // Limpiar los campos del formulario después de agregar
        setNuevoUsuarioId('')
        setNuevoUsuarioNombre('')
        setNuevoUsuarioGenero('')
        setNuevoUsuarioDireccion('')
    }

    const handleEliminarUsuario = (idUsuario) => {
        setUsuarios(prev => { // prev se ocupa para obtener el antiguo valor del estado "usuarios"
            // Filtrar el array para excluir el usuario con el ID especificado
            const resultadosEliminados = prev.filter(objeto => objeto.id !== idUsuario)
            localStorage.setItem("usuarios", JSON.stringify(resultadosEliminados)) // Actualizar localStorage
            return resultadosEliminados // Actualizar el estado
        })
    }

    const handleEditarUsuario = (usuario) => {
        setEditandoUsuario(usuario) // Marcar qué usuario se está editando
        setNuevoUsuarioId(usuario.id) // Llenar el campo de ID con el valor actual
        setNuevoUsuarioNombre(usuario.nombre) // Llenar el campo de nombre con el valor actual
        setNuevoUsuarioGenero((usuario.genero))
        setNuevoUsuarioDireccion(usuario.direccion)
    }

    const handleGuardarEdicion = () => {
        setUsuarios(prev => {
            // Mapear a través de los usuarios, actualizando el que se está editando
            const usuariosActualizados = prev.map(u =>
                u.id === editandoUsuario.id ? { ...u, id: nuevoUsuarioId, nombre: nuevoUsuarioNombre, genero:nuevoUsuarioGenero, direccion: nuevoUsuarioDireccion } : u
            )
            localStorage.setItem("usuarios", JSON.stringify(usuariosActualizados)) // Actualizar localStorage
            return usuariosActualizados // Actualizar el estado
        })
        // Resetear el estado de edición y limpiar los campos
        setEditandoUsuario(null)
        setNuevoUsuarioId('')
        setNuevoUsuarioNombre('')
        setNuevoUsuarioGenero('')
        setNuevoUsuarioDireccion('')
    }

    const handleCancelarEdicion = () => {
        setEditandoUsuario(null) // Quitar el marcador de edición
        setNuevoUsuarioId('') // Limpiar campo de ID
        setNuevoUsuarioNombre('') // Limpiar campo de nombre
        setNuevoUsuarioGenero('')
        setNuevoUsuarioDireccion('')
    }

    // Efecto que se ejecuta al montar el componente para cargar usuarios desde localStorage
    useEffect(() => {
        const usuariosAlmacenados = JSON.parse(localStorage.getItem("usuarios") || "[]")
        setUsuarios(usuariosAlmacenados)
        console.log("Usuarios cargados desde localStorage:", usuariosAlmacenados)
    }, []) // El array vacío significa que este efecto solo se ejecuta una vez al montar el componente

    return (
        <>
            <Container>
                <Row>
                    <Form onSubmit={(e) => e.preventDefault()}>
                        <Label for={'idUsuario'}>Id Usuario:</Label>
                        <Input
                            name={'idUsuario'}
                            type={'number'}
                            onChange={handleNuevoUsuario}
                            value={nuevoUsuarioId}
                        />
                        <br/>
                        <Label for={'nombreUsuario'}>Nombre Usuario:</Label>
                        <Input
                            name={'nombreUsuario'}
                            type={'text'}
                            onChange={handleNuevoNombre}
                            value={nuevoUsuarioNombre}
                        />
                        <br/>
                        <Label>Género:</Label><br />
                        <Input
                            type="radio"
                            name="generoUsuario"
                            value="Hombre"
                            checked={nuevoUsuarioGenero === "Hombre"}
                            onChange={handleNuevoGenero}
                        /> Hombre<br />
                        <Input
                            type="radio"
                            name="generoUsuario"
                            value="Mujer"
                            checked={nuevoUsuarioGenero === "Mujer"}
                            onChange={handleNuevoGenero}
                        /> Mujer<br />
                        <Label for={'direccionUsuario'}>Direccion Usuario:</Label>
                        <Input
                            name={'direccionUsuario'}
                            type={'text'}
                            onChange={handleNuevaDireccion}
                            value={nuevoUsuarioDireccion}
                        />
                        {editandoUsuario ? (
                            <>
                                <Button type="button" style={{ marginRight: '10px' }} onClick={handleGuardarEdicion}>Guardar Cambios</Button>
                                <Button type="button" onClick={handleCancelarEdicion}>Cancelar</Button>
                            </>
                        ) : (
                            <Button type="button" onClick={handleAgregarUsuario}>Añadir usuario</Button>
                        )}
                    </Form>
                </Row>
                <Row>
                <h3>Lista de usuarios</h3>
                    <ListGroup>
                        {usuarios.map((usu) => (
                            <ListGroupItem key={usu.id}>
                                ID: {usu.id}, NOMBRE: {usu.nombre}, GENERO: {usu.genero}, DIRECCIÓN:{usu.direccion}
                                <Button type="button" onClick={() => handleEditarUsuario(usu)}
                                        style={{marginLeft: '10px', marginRight: '10px'}}>Editar
                                </Button>
                                <Button type="button" onClick={() => handleEliminarUsuario(usu.id)}>Eliminar</Button>
                            </ListGroupItem>
                        ))}
                    </ListGroup>
                </Row>
            </Container>
        </>
    )
}

export default App
