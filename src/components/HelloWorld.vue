<template>
  <div class="hello">
    <h1>{{scoreText}}</h1>
    <div class="imageHolder">
      <img v-on:click="getCountries()" class="flag" :src="getFlag()">
    </div>
    <div class="answers">
   <button class="answer" v-for="country in orderedCountries" :key="country.code" v-on:click="checkCountry(country)">{{country.name}}</button>
  </div>
  </div>
</template>

<script>
import countries from "svg-country-flags/countries.json";
import sampleSize from "lodash/sampleSize";
import orderBy from "lodash/orderBy";

export default {
  name: "HelloWorld",
  data: () => {
    return {
      currentCountry: {},
      currentCountries: [],
      countries: [],
      maxScore: 0,
      currentScore: 0
    };
  },
  computed: {
    orderedCountries: function() {
      return orderBy(this.currentCountries, "name");
    },
    scoreText: function() {
      if (this.currentCountries.length === 0) {
        return "Hallo Wereld";
      } else if (this.currentScore === 0) {
        return "Raad de vlag!";
      } else {
        return "Je hebt " + this.currentScore + " punten!";
      }
    }
  },
  created: function() {
    for (let country in countries) {
      this.countries.push({
        code: country.toLowerCase(),
        name: countries[country]
      });
    }
  },
  methods: {
    getRandomCountry: function() {
      this.currentCountry = sampleSize(this.countries, 1);
    },
    getFlag: function() {
      if (this.currentCountries.length > 0) {
        return require("./../assets/flags/" +
          this.currentCountries[0].code +
          ".svg");
      } else {
        return require("./../assets/world-map.svg");
      }
    },
    getCountries: function() {
      console.log("hola");
      this.currentCountries = sampleSize(this.countries, 4);
      this.currentCountries[0].isWinner = true;
    },
    checkCountry: function(country) {
      if (country.isWinner) {
        this.currentScore++;
        this.getCountries();
      } else {
        if (this.currentScore > this.maxScore) {
          this.maxScore = this.currentScore;
          alert(`proficiat met je nieuw record van ${this.maxScore} punten`);
        } else {
          alert("boehoehoe");
        }
        this.currentCountries = [];
        this.currentScore = 0;
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}

.imageHolder {
  box-sizing: border-box;
  width: 100%;
  height: 55vh;
  display: flex;
  align-items: center;
}
.flag {
  max-width: 70%;
  max-height: 50vh;
  padding: 0;
  height: auto;
  margin: 0 auto;
  border: 1px solid #fafafa;
  justify-content: center;
}
.answers {
  display: flex;
  flex-wrap: wrap;
}
.answer {
  width: 150px;
  text-align: left;
  font-size: 1em;
  height: 40px;
  background-color: white;
  border: 1px solid lightseagreen;
  border-radius: 6px;
  color: lightseagreen;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow-x: hidden;
  margin: 16px;
}
</style>
