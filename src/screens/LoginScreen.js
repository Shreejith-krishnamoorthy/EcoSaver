import React, { useState, useRef } from 'react';
import { View, StyleSheet, Text, ImageBackground, Image } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { TextInput, Button } from 'react-native-paper';
import { useNavigation, useTheme } from '@react-navigation/native';
import { ROUTES_NAME, SESSION_DATA } from '../utlis/constants';
import SnackBar from '../components/SnackBar';
import { getData } from '../utlis/UserApi';

const loginValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email Address is Required'),
  password: yup
    .string()
    .min(8, ({ min }) => `Password must be at least ${min} characters`)
    .required('Password is required'),
});

const LoginScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const formikRef = useRef();
  const [formSubmitSuccessful, setFormSubmitSuccessful] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const formSubmit = async ({ email, password }) => {
    const user = await getData(email);
    SESSION_DATA.email = email;
    SESSION_DATA.password = password;
    
    if (user || (email === 'admin@cleantownship.com' && password === 'wecleantown1')) {
      setFormSubmitSuccessful(true);
      setErrorMessage(''); // Clear error message on successful login
      setTimeout(() => {
        formikRef.current?.resetForm();
        navigation.replace(ROUTES_NAME.DASH.name);
      }, 500);
    } else {
      setErrorMessage('Invalid email or password. Please try again or register.');
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/images/bg2.png')}
        resizeMode="cover"
        style={styles.image}>
        <View style={styles.container1}>
          <View style={styles.loginContainer}>
            <Image
              style={{ width: '80%', height: '20%', paddingLeft: 20 }}
              source={require('../assets/images/titlelogo.png')}
            />
            <Formik
              innerRef={formikRef}
              validationSchema={loginValidationSchema}
              initialValues={{ email: '', password: '' }}
              onSubmit={formSubmit}
              validateOnMount={true}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, isValid, touched }) => (
                <>
                  <TextInput
                    mode="outlined"
                    name="email"
                    label="Email Address"
                    placeholder="Email Address"
                    style={styles.textInput}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                    keyboardType="email-address"
                  />
                  {errors.email && touched.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}

                  <TextInput
                    mode="outlined"
                    name="password"
                    placeholder="Password"
                    label="Password"
                    style={styles.textInput}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    secureTextEntry
                  />
                  {errors.password && touched.password && (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  )}
                  {errorMessage ? (
                    <Text style={styles.errorText}>{errorMessage}</Text>
                  ) : null}

                  <Button
                    mode="contained"
                    onPress={handleSubmit}
                    disabled={!isValid}
                    buttonColor={isValid ? colors.green : colors.disabled}
                    style={{ width: '70%', marginVertical: '5%' }}>
                    LOGIN
                  </Button>

                  <Button
                    mode="contained"
                    onPress={() => navigation.navigate('Register')}
                    buttonColor={colors.green} 
                    style={{ width: '70%', marginVertical: '5%' }}>
                    REGISTER
                  </Button>
                </>
              )}
            </Formik>
            {formSubmitSuccessful && (
              <SnackBar
                message={'Logged in successfully'}
                show={formSubmitSuccessful}
                timeout={500}
              />
            )}
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginContainer: {
    width: '80%',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    elevation: 10,
    borderRadius: 5,
  },
  textInput: {
    height: 40,
    width: '100%',
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  errorText: {
    fontSize: 10,
    color: 'red',
  },
  image: {
    flex: 1,
  },
});

export default LoginScreen;
