import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, signInAnonymously } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, setLogLevel } from 'firebase/firestore';

// Variables globales para almacenar las instancias de Firebase
// Se inicializan como null y se asignan en la función initializeFirebase.
let app = null;
let db = null;
let auth = null;

/**
 * Inicializa la aplicación Firebase, Firestore y el servicio de autenticación.
 * Realiza el inicio de sesión inicial con el token personalizado o de forma anónima.
 * @param {object} firebaseConfig - La configuración de Firebase.
 * @param {string | null} initialAuthToken - Token de autenticación personalizado.
 * @param {object} authInstance - Referencia global de auth.
 * @param {object} dbInstance - Referencia global de db.
 * @param {function} setError - Función para establecer mensajes de error en el componente.
 */
export const initializeFirebase = async (firebaseConfig, initialAuthToken, authInstance, dbInstance, setError) => {
    try {
        if (!app) {
            // 1. Inicializar la aplicación
            app = initializeApp(firebaseConfig);
            
            // 2. Inicializar servicios
            auth = getAuth(app);
            db = getFirestore(app);
            
            // Opcional: Establecer el nivel de log para depuración de Firestore
            setLogLevel('debug'); 

            // 3. Autenticación inicial
            if (initialAuthToken) {
                await signInWithCustomToken(auth, initialAuthToken);
            } else {
                await signInAnonymously(auth);
            }
        }
    } catch (error) {
        console.error("Error al inicializar o autenticar Firebase:", error);
        if (setError) {
            setError(`Fallo en la conexión de Firebase: ${error.message}`);
        }
    }
};

/**
 * Obtiene la ruta para colecciones de datos públicos.
 * Convención: /artifacts/{appId}/public/data/{collectionName}
 * @param {string} appId - El ID de la aplicación.
 * @param {string} collectionName - El nombre de la colección.
 * @returns {string} La ruta completa de la colección.
 */
export const getPublicDataCollectionPath = (appId, collectionName) => {
    return `artifacts/${appId}/public/data/${collectionName}`;
};

/**
 * Obtiene la ruta para colecciones de datos privados del usuario.
 * Convención: /artifacts/{appId}/users/{userId}/{collectionName}
 * NOTA: Esta función es un ejemplo. 'userId' debe obtenerse de 'auth.currentUser.uid'.
 * @param {string} appId - El ID de la aplicación.
 * @param {string} userId - El ID del usuario actual.
 * @param {string} collectionName - El nombre de la colección.
 * @returns {string} La ruta completa de la colección.
 */
export const getPrivateDataCollectionPath = (appId, userId, collectionName) => {
    return `artifacts/${appId}/users/${userId}/${collectionName}`;
};

// Exportar las instancias después de que se inicialicen
// Nota: En React, estas instancias se usan en los `useEffect` después de llamar a `initializeFirebase`.
export { db, auth };