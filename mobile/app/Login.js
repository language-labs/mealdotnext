import { Components } from 'exponent';
import {
  AsyncStorage,
  StyleSheet,
  Text,
  Image,
  View,
  TouchableHighlight,
  Alert,
  Dimensions,
} from 'react-native';

import React from 'react';
import t from 'tcomb-form-native';
import MealList from './MealList';
import styleVariables from '../styleVariables';

const { orange, gray } = styleVariables;
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

t.form.Form.stylesheet.textbox.normal = {
  color: 'white',
  fontSize: 14,
  height: 36,
  padding: 7,
  borderColor: 'rgba(255,255,255,.3)',
  borderWidth: 1,
  borderRadius: 2,
  marginBottom: 5,
  fontWeight: 'bold',
};

t.form.Form.stylesheet.controlLabel.normal = {
  color: 'white',
  fontSize: 17,
  marginBottom: 7,
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  container: {
    justifyContent: 'center',
    height: height * 0.7,
    width: width * 0.9,
    flexDirection: 'column',
    padding: 20,
    marginTop: height * 0.15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  title: {
    fontSize: 50,
    marginBottom: 50,
    backgroundColor: 'transparent',
    alignSelf: 'center',
    color: 'white',
    opacity: 1,
    textAlign: 'center',
    fontWeight: '100',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center',
  },
  button: {
    height: 36,
    backgroundColor: orange,
    borderRadius: 2,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  backgroundImage: {
    flex: 1,
  },
});
// ENV Variables
const loginUrl = 'https://mealdotnextxlabs.herokuapp.com/api/user/authenticate';
const signupUrl = 'https://mealdotnextxlabs.herokuapp.com/api/user';
const Form = t.form.Form;
const Person = t.struct({
  username: t.String,
  password: t.String,
});
const options = {
  fields: {
    username: {
      autoCapitalize: 'none',
    },
    password: {
      secureTextEntry: true,
    },
  },
};


const onValueChange = async (item, selectedValue) => {
  try {
    await AsyncStorage.setItem(item, selectedValue);
  } catch (error) {
    console.log(`AsyncStorage error: ${error.message}`);
  }
};

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.userInfo = null;
  }

  gotoNext() {
    this.props.navigator.push({
      component: MealList,
      name: 'mealList',
      passProps: {
      },
    });
  }

  authUser(url) {
    const value = this.refs.form.getValue();
    if (value) {
      fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: value.username,
          password: value.password,
        }),
      })
      .then(response => response.json())
      .then((responseData) => {
        const token = responseData.token;
        const userId = responseData.userId;
        onValueChange('token', token);
        onValueChange('userId', userId);
        this.props.updateToken(token);
        this.props.updateUserId(userId);
        this.gotoNext();
      })
      .catch(() => {
        Alert.alert('DO YOU EVEN LYFT BRUH?');
      })
      .done();
    }
  }

  render() {
    return (
      <View style={styles.main}>
        <Image
          // if background image doesn't appear test url, site may have dropped uploaded image
          source={{ uri: 'https://s21.postimg.org/azydn73pz/resized_background.jpg' }}
          style={styles.backgroundImage}
        >
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Components.BlurView
              tintEffect="default"
              style={styles.container}
            >
              <View style={styles.row}>
                <Text style={styles.title}>MEAL. LABS</Text>
              </View>
              <View style={styles.row}>
                <Form
                  ref="form"
                  type={Person}
                  options={options}
                />
              </View>
              <View style={styles.row}>
                <TouchableHighlight
                  style={styles.button}
                  onPress={() => this.authUser(loginUrl)}
                  underlayColor={gray}
                >
                  <Text style={styles.buttonText}>Login</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={styles.button}
                  onPress={() => this.authUser(signupUrl)}
                  underlayColor={gray}
                >
                  <Text style={styles.buttonText}>Signup</Text>
                </TouchableHighlight>
              </View>
            </Components.BlurView>
          </View>
        </Image>
      </View>
    );
  }
}
