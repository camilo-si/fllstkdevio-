import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ------------------------------------------------------------------
// 1. CONFIGURACIÓN DE FIREBASE
// Pega aquí tus credenciales reales de la consola de Firebase.
// Si usas variables de entorno (.env), usa process.env.REACT_APP_...
// ------------------------------------------------------------------
const firebaseConfig = {
    apiKey: "TU_API_KEY_AQUI",             // Ej: "AIzaSyD..."
    authDomain: "TU_PROYECTO.firebaseapp.com",
    projectId: "TU_PROYECTO_ID",
    storageBucket: "TU_PROYECTO.appspot.com",
    messagingSenderId: "TUS_NUMEROS",
    appId: "TU_APP_ID"
};

// 2. INICIALIZACIÓN INMEDIATA
// Inicializamos la app una sola vez al cargar el archivo
const app = initializeApp(firebaseConfig);

// 3. EXPORTACIÓN DE SERVICIOS
// Estas constantes ya están listas para usarse en cualquier componente
export const auth = getAuth(app);
export const db = getFirestore(app);


// ------------------------------------------------------------------
// 4. FUNCIONES DE UTILIDAD (Opcionales)
// Las dejo por si acaso tu código antiguo las usa, pero recomiendo
// usar colecciones directas como 'servicios' o 'planes'.
// ------------------------------------------------------------------

/**
 * Obtiene la ruta para colecciones. 
 * NOTA: Si tu base de datos es simple, puedes ignorar esto y usar 
 * simplemente el nombre de la colección (ej: "servicios") en tus componentes.
 */
export const getPublicDataCollectionPath = (appId, collectionName) => {
    // Simplificamos esto para que devuelva la colección directa si no usas "artifacts"
    // Si realmente usas la estructura compleja, descomenta la línea de abajo:
    // return `artifacts/${appId}/public/data/${collectionName}`;
    return collectionName; 
};

export const getPrivateDataCollectionPath = (appId, userId, collectionName) => {
    return `users/${userId}/${collectionName}`;
};

export default app;