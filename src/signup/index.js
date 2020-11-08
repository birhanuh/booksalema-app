import React from 'react';
import { View, SafeAreaView, ActivityIndicator, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Text, Input, Button } from 'react-native-elements';
import { graphql, gql } from '@apollo/react-hoc';
import { registrationSchema } from '../utils/validationSchema';
import { formatYupErrors, formatServerErrors } from '../utils/formatError';

const defaultState = {
  values: {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  },
  errors: {},
  isSubmitting: false,
  loading: false
}

class Signup extends React.PureComponent {
  state = defaultState;

  submit = async () => {
    if (this.state.isSubmitting) {
      return
    }

    // Validation
    try {
      await registrationSchema.validate(this.state.values, { abortEarly: false })
    } catch (err) {
      this.setState({ errors: formatYupErrors(err) })
    }

    const { errors } = this.state

    if (Object.keys(errors).length !== 0) {
      this.setState({ errors, isSubmitting: false })
      return
    } else {
      this.setState({ isSubmitting: true })
      const { name, email, password } = this.state.values

      const { data: { signup: { errors, user, token } } } = await this.props.mutate({ variables: { name, email, password } })

      if (errors) {
        this.setState({ errors: formatServerErrors(errors) })
        return
      }
      console.log("Resp: ", user, token)
    }

    this.setState(defaultState)
  }

  onChangeText = (key, value) => {
    // Clone errors form state to local variable
    let errors = Object.assign({}, this.state.errors);
    delete errors[key];

    this.setState(state => ({
      values: {
        ...state.values,
        [key]: value
      },
      errors,
      isSubmitting: false
    }))
  }

  render() {
    const { values: { name, email, password, confirmPassword }, loading, isSubmitting, errors } = this.state

    if (loading) {
      return (
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator />
        </SafeAreaView>
      );
    };

    return (
      <View style={styles.container}>
        <Text style={styles.title} h2>Signup</Text>
        <View style={styles.signupContainer}>
          <Input value={name} onChangeText={text => this.onChangeText('name', text)} placeholder="Name" errorStyle={{ color: 'red' }}
            errorMessage={errors.name} />
          <Input value={email} onChangeText={text => this.onChangeText('email', text)} autoCapitalize="none" placeholder="Email" errorStyle={{ color: 'red' }}
            errorMessage={errors.email} />
          <Input secureTextEntry={true} value={password} onChangeText={text => this.onChangeText('password', text)} placeholder="Password" errorStyle={{ color: 'red' }}
            errorMessage={errors.password} />
          <Input secureTextEntry={true} value={confirmPassword} onChangeText={text => this.onChangeText('confirmPassword', text)} placeholder="Confirm password" errorStyle={{ color: 'red' }}
            errorMessage={errors.confirmPassword} />
          <Button
            style={{ marginTop: 20 }}
            icon={
              <Icon
                name="check-circle"
                size={20}
                color="white"
                style={{ marginRight: 10 }}
              />
            }
            onPress={this.submit} disabled={isSubmitting}
            title="Sign up"
          />

        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 50
  },
  signupContainer: {
    marginTop: 10
  },
  title: {
    textAlign: 'center',
  }
});

const SIGNUP_MUTATION = gql`
  mutation($name: String!, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
      token
      user {
        name
        email
      }
      errors {
        path
        message
      }
    }
  } 
`;

export default graphql(SIGNUP_MUTATION)(Signup);
