function Alert({
    mensaje,
    tipo = 'error'
}) {

    return (

    <div className={`alert alert--${tipo}`}>

        {mensaje}

    </div>
    );
}

export default Alert;