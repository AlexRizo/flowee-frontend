# Funcionamiento de la API

La api por defecto mostrará un mensaje en consola cuando ocurra algun error a la hora de hacer el fetching.

### Importante:
* #### Fetching del lado del cliente: 
  Por defecto, el navegador incluirá las cookies a la hora de ejecutar alguna llamada del lado del cliente.

* ### Fetching del lado del servidor:
  Al hacer fetching del lado del servidor, hay incluír la cookie en los headers de la petición, ya que la cookie no existe en este entorno.