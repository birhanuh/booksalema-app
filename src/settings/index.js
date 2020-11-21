import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ListItem, Button, Divider, colors } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { MeContext } from "../context";

const Settings = ({ navigation }) => {
  const me = React.useContext(MeContext);

  const signOut = () => {
    // Remove token from async storage
    try {
      AsyncStorage.removeItem('@kemetsehaftalem/token')
      navigation.navigate('Books')
    }
    catch (exception) {

      return false;
    }
  }

  const User = () => (<ListItem bottomDivider>
    <Icon name='user-circle' />
    <ListItem.Content>
      <ListItem.Title style={styles.listItemTitle} onPress={() => {
        navigation.push('User')
      }}>User</ListItem.Title>
    </ListItem.Content>
    <ListItem.Chevron />
  </ListItem>);

  const SignIn = () => (<ListItem bottomDivider>
    <Icon name='sign-in' />
    <ListItem.Content>
      <ListItem.Title style={styles.listItemTitle} onPress={() => () => {
        navigation.navigate('SignIn')
      }}>Sign In</ListItem.Title>
    </ListItem.Content>
    <ListItem.Chevron />
  </ListItem>);

  const CreateAccount = () => (<ListItem bottomDivider>
    <Icon name='user-plus' />
    <ListItem.Content>
      <ListItem.Title style={styles.listItemTitle} onPress={() => {
        navigation.navigate('CreateAccount')
      }}>Create account</ListItem.Title>
    </ListItem.Content>
    <ListItem.Chevron />
  </ListItem>);


  return (
    <View style={styles.container}>
      { me && <User />}

      { !me && <SignIn />}

      { !me && <CreateAccount />}

      <Divider style={{ marginTop: 30, marginBottom: 10 }} />

      { me && <Button
        type="outline"
        style={{ marginTop: 20 }}
        titleStyle={{ color: colors.error }}
        buttonStyle={{ borderColor: colors.error }}
        icon={
          <Icon
            size={20}
            name='sign-out'
            color={colors.error}
            style={{ marginRight: 10 }}
          />
        }
        onPress={signOut}
        title="Sign out"
      />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20
  },
  listItemTitle: {
    padding: 10
  },
});

export default Settings