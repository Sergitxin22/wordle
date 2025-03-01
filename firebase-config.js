// Configuración cifrada de Firebase (generada automáticamente)
(function() {
  // Datos cifrados de Firebase
  const encryptedData = "bbefb838789061d33532e9f91d6a7f14:faa3f2b1eac871db26417893b351ad1f7407a81333702a2926c55bf42075c24d824063177c22a3ed3902ba3322847baaac49d516c5e2065de92019dee18bef794abeb9b16f91a341a1323516c3bc452196e729af19588cba891be142b034f5ea06a5748491b86200a07108bd51886908";
  
  // Función para descifrar los datos (se ejecuta solo cuando se necesita)
  window.getFirebaseConfig = async function() {
    try {
      // Clave de compilación incrustada en el código (suficiente para este caso de uso)
      const buildKey = "88696cd280b74d04";
      
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
