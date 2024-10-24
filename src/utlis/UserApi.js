import AsyncStorage from '@react-native-async-storage/async-storage';


const storeData = async (email, password, name, phone) => {
  try {
    let existingData = await AsyncStorage.getItem('reporters');
    existingData = existingData ? JSON.parse(existingData) : {};

    existingData[email] = { password, name, phone };
    
    await AsyncStorage.setItem('reporters', JSON.stringify(existingData));
  } catch (e) {
    console.log('Error saving data', e);
  }
};

const getData = async (email) => {
  try {
    const storedData = await AsyncStorage.getItem('reporters');
    const users = storedData ? JSON.parse(storedData) : {};
    return users[email] || null;
  } catch (e) {
    console.log('Error reading value', e);
    return null;
  }
};

export { storeData, getData };
