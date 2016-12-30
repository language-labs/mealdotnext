import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import MealTile from './MealTile';
import Searchbar from './Searchbar';
import LogoDisplay from './LogoDisplay';
import InfoDisplay from './InfoDisplay';
import Instructions from './Instructions';
import PriceBreakdown from './PriceBreakdown';
import HeadBuffer from './HeadBuffer';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const userUrl = 'https://mealdotnextxlabs.herokuapp.com/api/user/';
const recipeUrl = 'https://mealdotnextxlabs.herokuapp.com/api/recipe/';
const mealUrl = 'https://mealdotnextxlabs.herokuapp.com/api/meal/';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  contentContainer: {
    alignItems: 'center',
  },
  loadScreen: {
    flex: 1,
    height: height - 280,
    width,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default class AddMeal extends React.Component {
  constructor(props) {
    super(props);
    this.getData = this.getData.bind(this);
    this.addMeal = this.addMeal.bind(this);
    this.gotoNext = this.gotoNext.bind(this);
    this.gotoInstructions = this.gotoInstructions.bind(this);
    this.gotoPriceBreakdown = this.gotoPriceBreakdown.bind(this);

    this.state = {
      loading: false,
    };
  }

  setLoading() {
    this.setState({ loading: !this.state.loading });
  }

  getData(searchString) {
    const context = this;
    this.setLoading();

    fetch(recipeUrl + searchString, {
      method: 'GET',
      headers: { 'x-access-token': this.props.getToken() },
    })
    .then(res => res.json())
    .then((data) => {
      if (data) {
        this.props.updateSearchRecipes(data);
      }
    })
    .done(() => context.setLoading());
  }

  updateMeals() {
    fetch(userUrl + this.props.getUserId(), {
      method: 'GET',
      headers: { 'x-access-token': this.props.getToken() },
    })
    .then(res => res.json())
    .then((data) => {
      this.props.updateMealList(data.mealsObjs);
    });
  }

  addMeal(recipeId) {
    const context = this;

    fetch(mealUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': this.props.getToken(),
      },
      body: JSON.stringify({
        userId: this.props.getUserId(),
        recipeId,
      }),

    })
    .then(() => context.updateMeals());
  }

  gotoNext(recipe) {
    this.props.navigator.push({
      component: InfoDisplay,
      passProps: {
        recipe,
        postMeal: this.postMeal,
        text: 'Add',
      },
    });
  }

  gotoInstructions(uri, title) {
    this.props.navigator.push({
      component: Instructions,
      passProps: {
        uri,
        title,
      },
    });
  }

  gotoPriceBreakdown(recipe) {
    this.props.navigator.push({
      component: PriceBreakdown,
      passProps: {
        recipe,
      },
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <HeadBuffer />
        <Searchbar enter={this.getData} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          alwaysBounceVertical
        >
          {!this.state.loading &&
            this.props.getSearchRecipes.map((meal, i) => (
              <MealTile
                recipe={meal}
                url={meal.url}
                showInfo={this.gotoNext}
                showInstructions={this.gotoInstructions}
                showPriceBreakdown={this.gotoPriceBreakdown}
                key={i}
                addMeal={this.addMeal}
                location="AddMeal"
              />
          ))}
          {this.state.loading &&
            <View style={styles.loadScreen}>
              <ActivityIndicator />
            </View>
          }
        </ScrollView>
      </View>
    );
  }
}

