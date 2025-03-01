// Configuración cifrada de Firebase (generada automáticamente)
(function() {
  // Datos cifrados de Firebase
  const encryptedData = "023e26285106364a9fbf308718ce7ca2:2bdf3d15a99a04715300cdf424a2c961d6b3f583c35e79eae06394a63ba6080770984ecb66109ae7e6f6b3d1225eba495e1d3d8d2bc1cc371afcab399761557cf0a453cfd66d2d464be3a9eb379f3dc85c0a1c791bc3e242333f47968f5389c9c2a09a0e09eccd995992b1aec9546adf";
  
  // Función para descifrar los datos (se ejecuta solo cuando se necesita)
  window.getFirebaseConfig = async function() {
    try {
      // Clave de compilación incrustada en el código (suficiente para este caso de uso)
      const buildKey = "22c46aa4c14ccb8c";
      
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
