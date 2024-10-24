import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  BackHandler,
  Alert,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Button,
} from 'react-native';
import {
  IconButton,
  Card,
  List,
  Text,
  Avatar,
} from 'react-native-paper';
import { ROUTES_NAME, SESSION_DATA } from '../utlis/constants';
import { getData as getUserData } from '../utlis/UserApi'; 
import { getData as getReporterData } from '../utlis/DataApi'; 
import { useIsFocused, useTheme } from '@react-navigation/native';

const DashboardScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [data, setData] = useState({});
  const [usersData, setUsersData] = useState([]);
  const [userNames, setUserNames] = useState({});
  const [loading, setLoading] = useState(true);
  const isAdmin = SESSION_DATA.email === 'admin@cleantownship.com';
  const isFocused = useIsFocused();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="logout"
          iconColor="red"
          size={24}
          onPress={logoutSession}
        />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (isFocused) {
      getIssueDetails();
    }
  }, [isFocused]);

  useEffect(() => {
    const backAction = () => {
      logoutSession();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const logoutSession = () => {
    Alert.alert('', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {
        text: 'YES',
        onPress: () => navigation.navigate(ROUTES_NAME.LOGIN.name),
      },
    ]);
  };

  const getIssueDetails = async () => {
    setLoading(true);
    try {
      const data = await getReporterData();
      if (data) {
        setUsersData(data[SESSION_DATA.email] || []);
        if (isAdmin) {
          setData(data);
          await fetchUserNames(data);
        }
      } else {
        console.warn("No data returned from getReporterData");
      }
    } catch (error) {
      console.error("Error fetching issue details:", error);
      Alert.alert("Error", "Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserNames = async (userWiseData) => {
    const names = {};
    await Promise.all(
      Object.keys(userWiseData).map(async (email) => {
        try {
          const userData = await getUserData(email);
          names[email] = userData ? userData.name : 'Unknown User';
        } catch (error) {
          console.error(`Error fetching user data for ${email}:`, error);
          names[email] = 'Unknown User';
        }
      })
    );
    setUserNames(names);
  };

  const renderListItem = (userData) => {
    return userData.map(({ address, desc, image, datetime, coords }, index) => {
      return (
        <List.Accordion
          title={`Ticket No # ${index + 1}`}
          style={styles.accordion}
          key={index}>
          <Card mode="elevated" style={styles.card}>
            <Card.Content>
              <List.Item
                title={address}
                titleNumberOfLines={10}
                left={props => <List.Icon {...props} icon="camera" color="green" />}
                style={styles.listItem}
              />
              <List.Item
                title={desc}
                left={props => <List.Icon {...props} icon="format-list-bulleted" color="green" />}
                style={styles.listItem}
                titleNumberOfLines={10}
              />
              <List.Item
                title={datetime}
                left={props => <List.Icon {...props} icon="clock-time-four-outline" color="green" />}
                style={styles.listItem}
              />
              <List.Item
                title={coords}
                titleNumberOfLines={2}
                left={props => <List.Icon {...props} icon="google-maps" color="green" />}
                style={styles.listItem}
              />
              {image?.raw && (
                <Image
                  style={styles.image}
                  source={{ uri: image?.raw?.uri }}
                />
              )}
            </Card.Content>
          </Card>
        </List.Accordion>
      );
    });
  };

  const renderUserListItem = (userWiseData) => {
    return Object.keys(userWiseData).map((email, index) => {
      const userName = userNames[email] || 'Loading...';
      return (
        <List.Accordion
          title={userName}
          style={styles.accordion}
          key={index}>
          <View style={styles.userListContainer}>
            {renderListItem(userWiseData[email])}
          </View>
        </List.Accordion>
      );
    });
  };

  const dataLength = Object.keys(data).length;
  const userDataLength = usersData.length;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        {dataLength > 0 && isAdmin && (
          <List.Section
            title={`Total No of users - ${dataLength} `}
            titleStyle={{ fontWeight: 'bold' }}>
            {renderUserListItem(data)}
          </List.Section>
        )}
        {userDataLength > 0 && !isAdmin && (
          <List.Section
            title={`Total No of tickets - ${userDataLength} `}
            titleStyle={{ fontWeight: 'bold' }}>
            {renderListItem(usersData)}
          </List.Section>
        )}
        {dataLength === 0 && isAdmin && (
          <View style={styles.emptyContainer}>
            <Avatar.Icon
              size={72}
              icon="alert-decagram-outline"
              color="red"
              style={{ backgroundColor: 'white' }}
            />
            <Text style={{ fontSize: 30 }}>No users found</Text>
          </View>
        )}
        {userDataLength === 0 && !isAdmin && (
          <View style={styles.emptyContainer}>
            <Avatar.Icon
              size={72}
              icon="alert-decagram-outline"
              color="red"
              style={{ backgroundColor: 'white' }}
            />
            <Text style={{ fontSize: 30 }}>No tickets found</Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity>
        <Button
          title="Report issue"
          color={colors.green}
          onPress={() => navigation.navigate(ROUTES_NAME.HOME.name)}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  accordion: {
    borderColor: 'grey',
    borderWidth: 0.5,
    marginHorizontal: 5,
    marginVertical: 5,
    borderRadius: 5,
  },
  card: {
    marginHorizontal: 10,
    marginVertical: 10,
  },
  listItem: {
    marginLeft: -15,
    marginTop: -15,
    marginRight: -15,
  },
  image: {
    width: '100%',
    height: 250,
  },
  userListContainer: {
    marginHorizontal: 10,
  },
  emptyContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DashboardScreen;
