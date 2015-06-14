<<<<<<< HEAD
//Part One: Data
//Step 1A


var animal = {};

animal.species = 'Japanese Macaque';
console.log(animal.species);

animal['tagline'] = 'monkey business';
console.log(animal['tagline']);

animal.noises = null;
console.log(animal);

// Step 1B


noiseArray = [];

noiseArray[0] = 'howl';
noiseArray.push('screech');

noiseArray.unshift('chirp');
console.log(noiseArray);

noiseArray[3] = 'squeak';
console.log(noiseArray);

console.log(noiseArray.length);

console.log(noiseArray.length - 1);

console.log(noiseArray);

// Step 1C


var noizes = 'noises';

console.log(animal[noizes]);

animal[noizes] = noiseArray;

console.log(animal);


//Start review


//What are the different ways you can add properties and values to objects?
/*
use dot notation(line5),
use bracket notation (line8),
also upon creation of the object(line3) *not done in this project*
*/

//What about arrays?

/*
use bracket notation(line18)
use native array methods -  push(line19),unshift(line21)
*/

//What if you wanted to add a property to an object that had a weird symbol?
/*
use bracket notation ex: animal['&thepark!'] = true;
*/

// What about if it is a variable, how does that change the syntax?
/*
remove quotes ex: animal[&thepark!] = true;
*/

//Step 2: Create a collection of animals

var animals = [];
animals.push(animal);

var quackers = {
    species: 'duck',
    tagline: 'Afflack',
    noises: ['quack', 'honk', 'sneeze', 'growl']
};

animals[1] = quackers; //"Add quackers to the animal array using a different method than before."
//Vague wording of the question-this is refferring to the 'animals'(plural) array.

console.log(animals);

var longNose = {
    species: 'elephant',
    tagline: 'remover of obstacles',
    noises: ['trumpet', 'sneeze', 'sniff', 'slurp']
};

var gobble = {
    species: 'turkey',
    tagline: 'isPopular during Thanksgiving',
    noises: ['gobble', 'hiss', 'squawk', 'rumble']
};

animals.push(longNose, gobble);
console.log(animals);
console.log(animals.length);

//Step 3: Create relationships between animals
//3a: Create a Friendslist

var friends = []; //an array of objects 
//allows to access list of friends by index and store detailed key value pairs in objects.

friends.push(animals[0].species);
friends.push(animals[1].species);

console.log(friends);

//3b: Create a Relationships object
var relationships = {};
relationships.friends = friends; //length is undefined - objects do not have length
var matches = [];
relationships.matches = matches;

relationships.matches.push(animals[2].species);

for (var i = 0; i < animals.length; i++) {
    animals[i]
}
=======
//Use this file to implement Part One of your project

var animal;
>>>>>>> a7c0a93e998818a17b4805155e41afe03731a123
