<template>
  <div class="hello">
    <h1 v-on:click="playAgain()">{{scoreText}}</h1>
    <div class="imageHolder">
      <img v-on:click="playAgain()" class="flag" :src="getFlag()">
    </div>
    <div class="answers">
      <button class="answer" v-for="country in orderedCountries" :key="country.code" 
              v-on:click="checkCountry(country, $event)" 
              v-bind:class="[country.isWinner ? 'right' : '']"
      >{{country.name}}</button>
    </div>
     <p class="result">{{resultText}}</p>
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
      currentScore: 0,
      hasEnded: false
    };
  },
  computed: {
    orderedCountries: function() {
      return orderBy(this.currentCountries, "name");
    },
    resultText: function() {
      if (this.hasEnded) {
        return `Goed zo! Je behaalde ${
          this.currentScore
        } punten. Duw op de vlag om opnieuw te beginnen. Volgende keer beter! 👍👍👍`;
      }
      if (this.currentCountries.length === 0) {
        return "Spelletjestijd! Raad de vlag. Duw op de wereld om te beginnen. Veel succes! 👍👍👍";
      }
    },
    scoreText: function() {
      if (this.hasEnded) {
        return "😢 Verloren 😢";
      }
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
      this.currentCountries = sampleSize(this.countries, 4);
      this.currentCountries[0].isWinner = true;
    },
    playAgain: function() {
      this.getCountries();
      this.currentScore = 0;
      this.hasEnded = false;
    },
    checkCountry: function(country, event) {
      setTimeout(() => {
        if (country.isWinner) {
          this.currentScore++;
          this.getCountries();
        } else {
          if (this.currentScore > this.maxScore) {
            this.maxScore = this.currentScore;
          }
          event.target.classList.add("wrong");
          document
            .querySelectorAll(".answer")
            .forEach(element => element.classList.add("reveal"));
          this.hasEnded = true;
        }
      }, 300);
    }
  }
};
</script>

<style scoped>
.hello {
  padding: 0 10px;
}
.imageHolder {
  box-sizing: border-box;
  width: 100%;
  height: 45vh;
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
  margin: 8px;
  transition: all 0.3s ease-out;
}

.answer:hover,
.answer:active {
  background-color: lightseagreen;
  color: white;
}

.answer.reveal.wrong {
  background-color: red;
  color: white;
  border-color: red;
}
.answer.reveal.right {
  background-color: lightseagreen;
  color: white;
}
.result {
  text-align: left;
  font-size: 1em;
}
</style>
