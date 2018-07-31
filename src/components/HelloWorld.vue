<template>
  <div class="hello">
    <h1 v-on:click="playAgain()">{{scoreText}}</h1>
    <div class="imageHolder">
      <img v-on:click="playAgain()" class="flag" :src="getFlag()">
    </div>
    <div class="answers">
      <button class="answer" v-for="country in orderedCountries" :key="country.code" 
              v-on:click="checkCountry(country, $event)" 
              v-bind:class="[country.code === correctCountry.code ? 'right' : '']"
      >{{country.name}}</button>
    </div>
     <p class="result">{{resultText}}</p>
  </div>
</template>

<script>
import countries from "./../assets/countries.json";
import sampleSize from "lodash/sampleSize";
import orderBy from "lodash/orderBy";

export default {
  name: "HelloWorld",
  data: () => {
    return {
      correctCountry: null,
      currentCountries: [],
      countries: countries.filter(country => country.level === 1),
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
      this.correctCountry = this.currentCountries[0];
    },
    playAgain: function() {
      this.getCountries();
      this.currentScore = 0;
      this.hasEnded = false;
      document
        .querySelectorAll(".answer")
        .forEach(element => element.classList.remove("reveal"));
    },
    increaseLevelIfNeeded: function() {
      if (this.currentScore === 20) {
        this.countries = countries.filter(country => country.level < 3);
      }

      if (this.countries === 50) {
        this.countries = countries;
      }
    },
    checkCountry: function(country, event) {
      this.increaseLevelIfNeeded();
      setTimeout(() => {
        if (country.code === this.correctCountry.code) {
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
  max-width: 800px;
}
.imageHolder {
  box-sizing: border-box;
  width: 100%;
  height: 40vh;
  display: flex;
  align-items: center;
}
.flag {
  max-width: 90%;
  max-height: 40vh;
  padding: 0;
  height: auto;
  margin: 0 auto;
  justify-content: center;
  box-shadow: -2px 4px 24px 3px rgba(77, 77, 77, 0.32);
}
.answers {
  display: flex;
  flex-wrap: wrap;
  padding-left: 10px;
  padding-right: 10px;
  justify-content: center;
}
.answer {
  width: 335px;
  text-align: left;
  font-size: 1.25em;
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
  background-color: seagreen;
  color: white;
}

.answer.reveal.wrong {
  background-color: red;
  color: white;
  border-color: red;
}
.answer.reveal.right {
  background-color: seagreen;
  color: white;
  border: 2px solid seagreen;
  box-shadow: -2px 4px 24px 3px rgba(77, 77, 77, 0.32);
}
.result {
  text-align: left;
  font-size: 1em;
}

@media (min-width: 420px) {
  .answers {
    margin-top: 40px;
  }
}
</style>
