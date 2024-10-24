import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {Snackbar} from 'react-native-paper';

const SnackBar = ({show, message, timeout}) => {
  const [visible, setVisible] = React.useState(show);

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);
  useEffect(() => {
    setTimeout(() => {
      onToggleSnackBar();
    }, timeout);
  }, []);
  return (
    <View style={styles.container}>
      <Snackbar visible={visible} onDismiss={onDismissSnackBar}>
        {message}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
});

export default SnackBar;
