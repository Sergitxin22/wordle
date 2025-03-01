// Configuración cifrada de Firebase (generada automáticamente)
(function() {
  // Datos cifrados de Firebase
  const encryptedData = "fd9d426d43b45f200e31511de61484dc:3db2ecc994df9eb201255846228c2df11ba1d2441749a952d66fc4c02bba650a7ffd0a80b133cec4cda5d0456351c0077eb54d35f5e7f3095df7421d3a5b65a60a744de145cde3c07ba7967d36855a1904fadc4534bd2ee55364edffbb60c2f34a4394e5bf1a556326338b80012cbb32";
  
  // Función para descifrar los datos (se ejecuta solo cuando se necesita)
  window.getFirebaseConfig = async function() {
    try {
      // Clave de compilación incrustada en el código (suficiente para este caso de uso)
      const buildKey = "326412aa94ba56a2";
      
      // Separar el IV y los datos cifrados
      const [ivHex, encryptedHex] = encryptedData.split(':');
      
      // Desencriptar los datos usando Web Crypto API que está disponible en navegadores modernos
      async function decrypt() {
        try {
          // Convertir los datos hexadecimales a ArrayBuffer
          const iv = hexToArrayBuffer(ivHex);
          const encryptedData = hexToArrayBuffer(encryptedHex);
          
          // Generar una clave a partir del buildKey
          const keyMaterial = await window.crypto.subtle.importKey(
            "raw",
            new TextEncoder().encode(buildKey),
            { name: "PBKDF2" },
            false,
            ["deriveBits", "deriveKey"]
          );
          
          // Derivar la clave de cifrado
          const key = await window.crypto.subtle.deriveKey(
            {
              name: "PBKDF2",
              salt: new TextEncoder().encode("firebase-config-salt"),
              iterations: 1000,
              hash: "SHA-256",
            },
            keyMaterial,
            { name: "AES-CBC", length: 256 },
            false,
            ["decrypt"]
          );
          
          // Desencriptar los datos
          const decrypted = await window.crypto.subtle.decrypt(
            { name: "AES-CBC", iv },
            key,
            encryptedData
          );
          
          // Convertir los datos desencriptados a texto
          const decryptedText = new TextDecoder().decode(decrypted);
          
          // Parsear el JSON de configuración
          return JSON.parse(decryptedText);
        } catch (error) {
          console.error("Error al desencriptar la configuración:", error);
          return {};
        }
      }
      
      // Función auxiliar para convertir hexadecimal a ArrayBuffer
      function hexToArrayBuffer(hex) {
        const bytes = new Uint8Array(hex.length / 2);
        for (let i = 0; i < hex.length; i += 2) {
          bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
        }
        return bytes.buffer;
      }
      
      // Realizar el desencriptado
      return await decrypt();
    } catch (error) {
      console.error("Error al obtener la configuración de Firebase:", error);
      return {};
    }
  };
})();
