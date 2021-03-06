import React, { useEffect,useState } from 'react'
import './App.css';
import { 
  BrowserRouter as Router, 
  Route, 
} from 'react-router-dom';

//pages
import Homepage from './Components/Homepage/index';
import Ingredientcategory from './Components/IngredientCategory/index';
import RecipeOptions from './Components/RecipeDetails/index';
import Random from './Components/RandomRecipe/index';
import Header from './Components/Navbar/index';
// import NoIngredient from './Components/NoIngredient';
// import NoIngredient from './Components/NoIngredient';


function App() {
  // const [recipe, setRecipe] = useState('')
  const [ingredient, setIngredient] = useState()
  const [searchString, setSearchString] = useState('')
  const [random, setRandom] = useState('')
  const [searchID, setSearchID] = useState('')

  const categoryAPI = `https://www.themealdb.com/api/json/v2/${process.env.REACT_APP_MEALS_API_KEY}/filter.php?i=${searchString}`

  useEffect(() => {
    fetch(categoryAPI)
    .then(res => res.json())
    .then(res => {
      setIngredient(res.meals)
      setRandom(res.meals)
      setSearchID(res.meals.idMeal)
    })
    .catch(err => {
      console.error(err)
    })
},[]);


//fetch request inside a function so that it can be passed to the Homepage to render the search results.
//Will need to find a better way of doing this as this causes a data refresh on every character passed in to the form? 
const getRecipes = (event) => {
  event.preventDefault()
    fetch(categoryAPI)
    .then(res => res.json())
    .then (res => {
        setIngredient(res.meals)
        // setSearchID(res.meals.idMeal)
    })
    .catch(err => {
        console.error(err)
    })
  }

console.log(ingredient)

if (!ingredient){
  return <div>...loading</div>
  // return <NoIngredient />
}

  return (
    <>
    <Router>
      <Header />
      {/* //To render only when the location matches, inside Homepage is the a Link to search imported from react-router-DOM.  */}
      <Route path='/' exact render={() => {
        return (
          <Homepage 
          setSearchString={setSearchString} 
          getRecipes={getRecipes}
          searchID={searchID}
          />
        )
      }}
      />
      <Route path='/random' render={() => {
        return (
          <Random 
          random={random}
          setRandom={setRandom}
          />
        )
      }}
      />
      <Route path='/search-ingredients/' render={() =>{
        return (
          <Ingredientcategory 
          setSearchID={setSearchID} 
          searchString={searchString} 
          setSearchString={setSearchString} 
          ingredient={ingredient} 
          setIngredient={setIngredient}
        />
        ) 
      }}/>
      {/* //Route path for RecipeDetails uses Route from react-router-DOM to get the render method, which is used here to 
      //pass routerProps to the component on match. AKA routerProps are being passed to RecipeDetails which needs the ID of a meal 
      //any time "View Recipe" in the Ingredient component is clicked.  */}
      <Route path='/details/:idMeal'  render={(routerProps)=> {
        return (
          <RecipeOptions 

          //The Match property is a useful part of routerProps because it allows the this component to access
          //the ID from the URL path, as each Ingredient link has an ID to display a certain recipe. 
          match={routerProps.match}/>
        )
      }}
      />
    </Router>
    </>
  );
}

export default App;

