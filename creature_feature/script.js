const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const creatureName = document.getElementById("creature-name");
const creatureId = document.getElementById("creature-id");
const weight = document.getElementById("weight");
const height = document.getElementById("height");
const types = document.getElementById("types");
const ability = document.getElementById("ability-name");
const description = document.getElementById("ability-description");
const hp = document.getElementById("hp");
const attack = document.getElementById("attack");
const defense = document.getElementById("defense");
const specialAttack = document.getElementById("special-attack");
const specialDefense = document.getElementById("special-defense");
const speed = document.getElementById("speed");
const creatureToggle = document.getElementById("creature-toggle");
let creatureArray = [];
let apiString;



searchButton.addEventListener("click", async () => {
    try {
        const res = await fetch('https://rpg-creature-api.freecodecamp.rocks/api/creatures');
        const creatureArray = await res.json();
        
        const foundCreature = creatureArray.find(creature => {
            return creature.name.toLowerCase() === searchInput.value.toLowerCase() || 
                   creature.id === Number(searchInput.value);
        });

        if (!foundCreature) {
            alert("Creature not found");
            return;
        }

        const apiString = foundCreature.name.toLowerCase();
        const res2 = await fetch(`https://rpg-creature-api.freecodecamp.rocks/api/creature/${apiString}`);
        const data = await res2.json();
        const findTypes = (arr) => arr.map(type => `<div class="types-button type-${type.name.toLowerCase()}">${type.name.toUpperCase()}</div>`).join('');
        

        
        creatureName.textContent = data.name;
        creatureId.textContent = "#" + data.id;
        weight.textContent = data.weight;
        height.textContent = data.height;
        types.innerHTML = findTypes(data.types);
        ability.textContent = data.special.name;
        description.textContent = data.special.description;
        hp.textContent = data.stats[0].base_stat;
        attack.textContent = data.stats[1].base_stat;
        defense.textContent = data.stats[2].base_stat;
        specialAttack.textContent = data.stats[3].base_stat;
        specialDefense.textContent = data.stats[4].base_stat;
        speed.textContent = data.stats[5].base_stat;

        creatureToggle.style.visibility = "visible";
        
    } catch (error) {
        console.error('Error fetching creature data:', error);
        alert('Failed to fetch creature data. Please try again later.');
    }
});

