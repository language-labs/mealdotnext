import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import MealTile from './MealTile';
import InfoDisplay from './InfoDisplay';
import Instructions from './Instructions';
import PriceBreakdown from './PriceBreakdown';
import LogoDisplay from './LogoDisplay';
import HeadBuffer from './HeadBuffer';

const userUrl = 'https://mealdotnextxlabs.herokuapp.com/api/user/';
const mealUrl = 'https://mealdotnextxlabs.herokuapp.com/api/meal/';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  contentContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  loadScreen: {
    flex: 1,
    height: height - 120,
    width,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default class MealList extends React.Component {
  constructor(props) {
    super(props);
    this.getData = this.getData.bind(this);
    this.addMeal = this.addMeal.bind(this);
    this.removeMeal = this.removeMeal.bind(this);
    this.gotoNext = this.gotoNext.bind(this);
    this.gotoInstructions = this.gotoInstructions.bind(this);
    this.gotoPriceBreakdown = this.gotoPriceBreakdown.bind(this);

    this.state = {
      loading: false,
    };
  }

  componentWillMount() {
    this.getData(() => this.setLoading());
  }

  setLoading() {
    this.setState({ loading: !this.state.loading });
  }

  getData(cb) {
    this.setLoading();

    fetch(userUrl + this.props.getUserId(), {
      method: 'GET',
      headers: { 'x-access-token': this.props.getToken() },
    })
    .then(res => res.json())
    .then(data => this.props.updateMealList(data.mealsObjs))
    .done(() => cb ? cb() : null);
  }

  addMeal(recipeId) {
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
    .then(() => this.getData());
  }

  removeMeal(recipeId, mealId) {
    fetch(mealUrl + mealId, {
      method: 'DELETE',
      headers: { 'x-access-token': this.props.getToken() },
    })
    .then(() => this.getData(() => this.setState({ loading: false })));
  }

  gotoNext(recipe, mealId) {
    this.props.navigator.push({
      component: InfoDisplay,
      passProps: {
        recipe,
        mealId,
        postMeal: this.postMeal,
        text: 'Remove',
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
        <LogoDisplay />
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          alwaysBounceVertical
        >
          {!this.state.loading &&
            this.props.mealList.map((meal, i) => (
              <MealTile
                key={i}
                recipe={meal.recipe}
                url={meal.recipe.url}
                showInfo={this.gotoNext}
                showInstructions={this.gotoInstructions}
                showPriceBreakdown={this.gotoPriceBreakdown}
                mealId={meal._id}
                addMeal={this.addMeal}
                removeMeal={this.removeMeal}
                location="MealList"
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

