const express = require ('express');
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());

const recipes = [];

function logRequest(request, response, next){
  const{method, url} = request;
  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.time(logLabel);

  next();

  console.timeEnd(logLabel);
}

function validateRecipeId(request, response, next){
  const{ id } = request.params;

  if(!isUuid(id)){
    return response.status(400).json({error:'invalid project ID.'});
  }
  return next();
}

app.use(logRequest);
app.use('/cooking/:id', validateRecipeId);

app.get('/cooking',(request,response)=>{
  const {title} = request.query;

  const results = title
    ? recipes.filter(recipe => recipe.title.includes(title))
    : recipes;


  return response.json(results);
});

app.post('/cooking',(request,response)=>{
  const {title,  ingredients, description} = request.body;

  const recipe = {id: uuid(),title, ingredients, description};

  console.log(recipe);

  recipes.push(recipe);
  return response.json(recipe);
  
});

app.put('/cooking/:id',(request,response)=>{
  const {id} = request.params;
  const {title, ingredients, description} = request.body;

  const recipeIndex = recipes.findIndex(recipe => recipe.id === id);
  console.log(ingredients)
  

  if(recipeIndex < 0){
    return response.status(400).json({
      error: 'project not found.'
    })
  }

  const recipe = {id, title, ingredients, description};

  recipes[recipeIndex] = recipe

  return response.json(recipe)

});

app.delete('/cooking/:id',(request,response)=>{
  const {id} = request.params;
  const recipeIndex = recipes.findIndex(recipe => recipe.id === id);

  if(recipeIndex < 0 ){
    return response.status(400).json({ error: 'Project not found.'})
  }

  recipes.splice(recipeIndex, 1);

  return response.status(204).send();
});

app.listen(3336, () =>{
  console.log(':) Back-end Started! :)');
});