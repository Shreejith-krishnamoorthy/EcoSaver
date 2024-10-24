import AsyncStorage from '@react-native-async-storage/async-storage';

const storeData = async (value) => {
    try {
      await AsyncStorage.setItem('reporter', JSON.stringify(value));
    } catch (e) {
      // saving error
    }
  };

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('reporter');
      if (value !== null) {
        return JSON.parse(value)
      }
      return {};
    } catch (e) {
      // error reading value
      return {};
    }
  };
  export {storeData,getData};