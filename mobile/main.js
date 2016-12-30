import Exponent, { Font } from 'exponent';
import React from 'react';
import { Navigator } from 'react-native';
import NavBar from './app/NavBar';
import Login from './app/Login';
import compileList from './lib/compileList';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: null,
      token: null,
      mealList: [],
      searchRecipes: [],
      shoppingList: [],
    };

    this.getToken            = this.getToken.bind(this);
    this.getUserId           = this.getUserId.bind(this);
    this.updateMealList      = this.updateMealList.bind(this);
    this.updateToken         = this.updateToken.bind(this);
    this.updateUserId        = this.updateUserId.bind(this);
    this.updateSearchRecipes = this.updateSearchRecipes.bind(this);
    this.renderScene         = this.renderScene.bind(this);
    this.setShoppingList     = this.setShoppingList.bind(this);
    this.setChecked          = this.setChecked.bind(this);
  }

  getToken() { return this.state.token; }
  getUserId() { return this.state.userId; }
  updateToken(token) { this.setState({ token }); }
  updateUserId(userId) { this.setState({ userId }); }
  updateSearchRecipes(searchRecipes) { this.setState({ searchRecipes }); }
  setShoppingList (shoppingList) { this.setState({shoppingList}) }

  updateMealList(mealList) { 
    const context = this;
    this.setState({ mealList }); 
    setTimeout(() => context.updateShoppingList(), 10)
  }

  updateShoppingList () {
    console.log('props from inside main', this.props);
    const newList = compileList(this.state.mealList);
    const oldList = this.state.shoppingList.slice();

    function arrayObjectIndexOf(myArray, searchTerm, property) {
      for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
      }
      return -1;
    }
    
    newList.forEach(item => {
      var i = arrayObjectIndexOf(oldList, item.ingredient, 'ingredient')

      if (i !== -1) { item.checked = oldList[i].checked }
    });

    this.setState({ shoppingList: newList });
  }

  setChecked(i) {
    const currentCheck = this.state.shoppingList[i].checked;
    this.setState({
      shoppingList: [
        ...this.state.shoppingList.slice(0, i),
        Object.assign(this.state.shoppingList[i], {
          checked: !currentCheck
        }),
        ...this.state.shoppingList.slice(i + 1)
      ]
    });
  }

  renderScene(route, navigator) {
    return (
      <route.component
        {...route.passProps}
        navigator={navigator}
        mealList={this.state.mealList}
        getToken={this.getToken}
        getUserId={this.getUserId}
        getSearchRecipes={this.state.searchRecipes}
        updateMealList={this.updateMealList}
        updateToken={this.updateToken}
        updateUserId={this.updateUserId}
        updateSearchRecipes={this.updateSearchRecipes}
        shoppingList={this.state.shoppingList}
        setShoppingList={this.setShoppingList}
        setChecked={this.setChecked}
      />
    );
  }

  render() {
    return (
      <Navigator
        style={{ flex: 1 }}
        initialRoute={{ name: 'Login', component: Login }}
        renderScene={this.renderScene}
        configureScene={() => Navigator.SceneConfigs.PushFromRight}
        navigationBar={<NavBar navigator={this.navigator} />}
      />
    );
  }
}

Exponent.registerRootComponent(App);
