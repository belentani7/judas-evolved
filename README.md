
## Belentani Lab: provider adapters

La interfaz del laboratorio funciona como una experiencia de frontend y el servidor expone tres contratos bajo `lab`: `status`, `runRole` y `generateImage`. El catálogo de 300 instrumentos se genera de forma determinista en `client/src/pages/Home.tsx`, mientras que las respuestas reales se mantienen detrás del servidor.

Para activar un modelo local compatible con la API de chat de OpenAI, configura `LOCAL_MODEL_BASE_URL` con la URL del endpoint, `LOCAL_MODEL_NAME` con el nombre del modelo y, si el endpoint lo exige, `LOCAL_MODEL_TOKEN`. El adaptador envía el rol elegido como mensaje de sistema y el fragmento del visitante como mensaje de usuario. Los cinco roles incluidos son The Muse, The Mirror, The Producer, The Oracle y The Scribe.

Para activar un generador de imágenes externo, configura `IMAGE_PROVIDER_BASE_URL` y, si procede, `IMAGE_PROVIDER_TOKEN`. El adaptador llama a `POST /generate` con `{ prompt, style, brand }`, por lo que puedes colocar delante un servicio compatible con ese contrato o cambiar la función `callImageProvider` para ajustarla al formato del proveedor elegido. Ninguna credencial se incluye en el bundle del navegador.

Mientras las variables no existan, la web no falla: muestra el estado de preparación y permite seguir explorando la experiencia. Las pruebas de servidor en `server/lab.test.ts` cubren los estados no configurados y el contrato de autenticación existente.
