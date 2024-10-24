import React, { useRef } from 'react';
import { View, StyleSheet, Text, ImageBackground, Image, Alert } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { TextInput, Button } from 'react-native-paper';
import { useNavigation, useTheme } from '@react-navigation/native';
import { storeData, getData } from '../utlis/UserApi';

const registerValidationSchema = yup.object().shape({
    email: yup
        .string()
        .email('Please enter a valid email')
        .required('Email Address is Required'),
    password: yup
        .string()
        .min(8, ({ min }) => `Password must be at least ${min} characters`)
        .required('Password is required'),
});

const RegisterScreen = () => {
    const { colors } = useTheme();
    const navigation = useNavigation();
    const formikRef = useRef();

    const handleRegister = async ({ email, password, name, phone }) => {
        const existingUser = await getData(email);
        if (existingUser) {
            Alert.alert('User already registered. Please log in.');
            return;
        }
        await storeData(email, password, name, phone);

        formikRef.current?.resetForm();
        navigation.navigate('Login');
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
                            validationSchema={registerValidationSchema}
                            initialValues={{ email: '', password: '', name:'', phone:'' }}
                            onSubmit={handleRegister}
                            validateOnMount={true}
                        >
                            {({
                                handleChange,
                                handleBlur,
                                handleSubmit,
                                values,
                                errors,
                                isValid,
                                touched,
                            }) => (
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
                                    <TextInput
                                        mode="outlined"
                                        name="name"
                                        label="Name"
                                        placeholder="Your Name"
                                        style={styles.textInput}
                                        onChangeText={handleChange('name')}
                                        onBlur={handleBlur('name')}
                                        value={values.name}
                                    />
                                    {errors.name && touched.name && <Text style={styles.errorText}>{errors.name}</Text>}
                                    {/* Phone Number Field */}
                                    <TextInput
                                        mode="outlined"
                                        name="phone"
                                        label="Phone Number"
                                        placeholder="Your Phone Number"
                                        style={styles.textInput}
                                        onChangeText={handleChange('phone')}
                                        onBlur={handleBlur('phone')}
                                        value={values.phone}
                                        keyboardType="phone-pad"
                                    />
                                    {errors.phone && touched.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
                                    <Button
                                        mode="contained"
                                        onPress={handleSubmit}
                                        disabled={!isValid}
                                        buttonColor={isValid ? colors.green : colors.disabled}
                                        style={{ width: '70%', marginVertical: '5%' }}>
                                        REGISTER
                                    </Button>
                                </>
                            )}
                        </Formik>
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

export default RegisterScreen;
