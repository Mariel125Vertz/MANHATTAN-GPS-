from flask import Flask
import mimetypes # Importa aquí arriba

from configuracion import Configuracion
from routes import registrar_rutas

def crear_aplicacion(configuracion_prueba=None):
    # Definimos los tipos MIME antes de crear la instancia de Flask
    mimetypes.add_type('application/javascript', '.js')
    mimetypes.add_type('text/css', '.css')
    
    aplicacion = Flask(
        __name__,
        template_folder="templates",
        static_folder="static",
    )
    
    aplicacion.config.from_object(Configuracion)

    if configuracion_prueba:
        aplicacion.config.update(configuracion_prueba)

    registrar_rutas(aplicacion)
    return aplicacion

aplicacion = crear_aplicacion()

if __name__ == "__main__":
    aplicacion.run(
        host=aplicacion.config["SERVIDOR"],
        port=aplicacion.config["PUERTO"],
        debug=aplicacion.config["DEPURACION"],
    )