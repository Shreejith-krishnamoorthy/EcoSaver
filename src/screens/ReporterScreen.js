import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  BackHandler,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import {Formik} from 'formik';
import * as yup from 'yup';
import {TextInput, Button} from 'react-native-paper';
import {useNavigation, useTheme} from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import {CATEGORYS, ROUTES_NAME, SESSION_DATA} from '../utlis/constants';
import SnackBar from '../components/SnackBar';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {getData, storeData} from '../utlis/DataApi';
import {isEmpty, isUndefined} from 'lodash';
import moment from 'moment';
const loginValidationSchema = yup.object().shape({
  desc: yup.string(),
  /*  .min(50, ({min}) => `Descriptions must be at least ${min} characters`)
    .required('Descriptions is Required'), */
  address: yup.string().required('Address is Required'),
  image: yup.object(),
  datetime: yup.string(),
  coords: yup.string(),
});
const ReporterScreen = ({route}) => {
  const {
    address: {address, error},
    latitude,
    longitude,
  } = route.params;
  const {colors} = useTheme();
  const navigation = useNavigation();
  const [category, setCategory] = useState('TR');
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(
    CATEGORYS.map(({name, code}) => ({label: name, value: code})) 
  );
  const [formSubmitSuccessful, setFormSubmitSuccessful] = useState(false);
  const [image, setImage] = useState({});
  const pickerRef = useRef();
  const formSubmit = values => {
    setFormSubmitSuccessful(false);
    validateUserData(values);
  };
  function handleBackButtonClick() {
    navigation.goBack();
    return true;
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    };
  }, []);
  const validateUserData = async values => {
    let data = Object.assign(await getData());
    if (
      isEmpty(data[SESSION_DATA.email]) ||
      isUndefined(data[SESSION_DATA.email])
    ) {
      data[SESSION_DATA.email] = [];
      console.log('SESSION_DATA.email', data[SESSION_DATA.email]);
    }

    data[SESSION_DATA.email].push(values);

    storeData(data);
    navigation.navigate(ROUTES_NAME.DASH.name);
  };
  return (
    <ScrollView style={styles.container}>
      <ImageBackground
        source={require('../assets/images/bg2.png')}
        resizeMode="cover"
        style={styles.image}>
        <View style={styles.container1}>
          <View style={styles.loginContainer}>
            <Formik
              validateOnMount={true}
              validationSchema={loginValidationSchema}
              initialValues={{
                desc: '',
                address,
                image: '',
                datetime: moment().format('MMMM Do YYYY, h:mm:ss a'),
                coords: `${latitude},${longitude}`,
              }}
              onSubmit={formSubmit}>
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                isValid,
                touched,
                ...formProps
              }) => (
                <View style={{marginLeft: 5, marginRight: 5, marginTop: '1%'}}>
                  <TextInput
                    mode="outlined"
                    name="Coordinates"
                    label="Address"
                    style={{marginTop: '5%'}}
                    onChangeText={handleChange('coords')}
                    onBlur={handleBlur('coords')}
                    disabled={error === null}
                    value={values.coords}
                    keyboardType="default"
                  />
                  <TextInput
                    mode="outlined"
                    name="Address"
                    label="Address"
                    style={{marginTop: '5%'}}
                    onChangeText={handleChange('address')}
                    onBlur={handleBlur('address')}
                    disabled={error === null}
                    value={values.address}
                    keyboardType="default"
                    multiline={true}
                    numberOfLines={3}
                  />
                  {error && <Text style={styles.errorText}>{error}</Text>}
                  <Text
                    variant="headlineMedium"
                    style={{color: 'black', marginTop: '5%'}}>
                    Category
                  </Text>
                  <DropDownPicker
                    open={open}
                    value={category}
                    items={items}
                    setOpen={setOpen}
                    setValue={setCategory}
                    setItems={setItems}
                    style={{
                      borderColor: colors.green,
                      marginTop: '5%',
                    }}
                    dropDownContainerStyle={{
                      borderColor: colors.green,
                    }}
                  />
                  <TextInput
                    mode="outlined"
                    name="desc"
                    label="Descriptions"
                    style={{marginTop: '5%'}}
                    onChangeText={handleChange('desc')}
                    onBlur={handleBlur('desc')}
                    value={values.desc}
                    keyboardType="default"
                    multiline={true}
                    numberOfLines={5}
                  />
                  {errors.desc && touched.desc && (
                    <Text style={styles.errorText}>{errors.desc}</Text>
                  )}
                  <TextInput
                    mode="outlined"
                    name="datetime"
                    label="Date & time"
                    style={{marginTop: '5%'}}
                    value={values.datetime}
                    keyboardType="default"
                    multiline={false}
                    disabled={true}
                  />

                  {image?.raw && (
                    <Image
                      style={{width: '100%', height: 250,marginTop:'3%'}}
                      source={{uri: image?.raw?.uri}}
                    />
                  )}
                  <View style={{flexDirection: 'row'}}>
                    <View style={styles.buttonStyle}>
                      <Button
                        mode="contained"
                        onPress={() => {
                          launchCamera(
                            {
                              includeBase64: false,
                              cameraType: 'back',
                              mediaType: 'photo',
                            },
                            response => {
                              if (response.assets?.[0].uri) {
                                let data = {
                                  name: response.fileName,
                                  type: response.type,
                                  uri:
                                    Platform.OS === 'android'
                                      ? response.uri
                                      : response.uri.replace('file://', ''),
                                  raw: response.assets?.[0],
                                };
                                formProps.setFieldValue('image', data);
                                setImage(data);
                              }
                            },
                          );
                        }}
                        buttonColor={colors.green}>
                        Take Photo
                      </Button>
                    </View>
                    <View style={styles.buttonStyle}>
                      <Button
                        mode="contained"
                        onPress={handleSubmit}
                        disabled={!isValid}
                        buttonColor={isValid ? colors.green : colors.disabled}>
                        Submit
                      </Button>
                    </View>
                  </View>

                  {formSubmitSuccessful && (
                    <SnackBar
                      message={'Issue reported successfully'}
                      show={formSubmitSuccessful}
                      timeout={5000}
                    />
                  )}
                </View>
              )}
            </Formik>
          </View>
        </View>
      </ImageBackground>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container1: {
    flex: 1,
    marginRight: 10,
    marginLeft: 10,
    marginTop: 10,
  },
  loginContainer: {
    width: '100%',
    backgroundColor: 'white',
    elevation: 10,
    borderRadius: 5,
    opacity: 1,
    marginVertical: '5%',
  },
  textInput: {
    height: 40,
    width: '80%',
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    color: 'black',
  },
  errorText: {
    fontSize: 10,
    color: 'red',
  },
  image: {
    flex: 1,
  },
  buttonStyle: {
    marginVertical: '5%',
    marginHorizontal: '5%',
    width: '40%',
  },
});

export default ReporterScreen;
