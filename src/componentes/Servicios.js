import { database } from "@/credenciales/firebase";
import { ref, get } from "credenciales/database";

 export const getData = async () => {
    try {
      const headerRef = ref(database, 'usuarios'); // Get ref of 'data'
      const snapshot = await get(headerRef); // Get data of 'data'
      return snapshot.val();
    } catch (error) {
      console.error('Error getting data:', error);
      throw error;
    }
  };