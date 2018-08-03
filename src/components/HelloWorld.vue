<template>
  <div class="hello white--text">
    <h1 v-on:click="playAgain()">{{scoreText}}</h1>
    <div class="imageHolder">
      <img v-on:click="playAgain()" class="flag" :class="currentCountries.length > 0 ? 'shadow':''" :src="getFlag()">
    </div>
    <div class="answers">
      <v-btn class="answer" v-for="(country, index) in orderedCountries" :key="country.code" 
      :color="colors[index]" :outline="!(reveal && country.code === correctCountry.code)"
      :class="[!reveal ? '' : reveal && country.code === correctCountry.code ? 'highlight white--text':'blur']"
              v-on:click="checkCountry(country, $event)" 
      >{{country.name}}</v-btn>
    </div>
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
      reveal: false,
      hasEnded: false,
      colors: [
        "light-blue darken-1",
        "amber darken-2",
        "pink lighten-1",
        "light-green"
      ]
    };
  },
  computed: {
    orderedCountries: function() {
      return orderBy(this.currentCountries, "name");
    },
    scoreText: function() {
      if (this.hasEnded) {
        return `Verloren 😢 ${this.currentScore} punten! 🤩`;
      }
      if (this.currentCountries.length === 0) {
        return "Hallo Wereld";
      } else if (this.currentScore === 0) {
        return "Raad de vlag!";
      } else {
        return this.currentScore === 1
          ? "Eentje is geentje!"
          : "Je hebt " + this.currentScore + " punten!";
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
    getCountries: function({ delay = 0 } = {}) {
      setTimeout(() => {
        this.currentCountries = sampleSize(this.countries, 4);
        this.correctCountry = this.currentCountries[0];
        this.reveal = false;
      }, delay);
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
      if (this.currentScore === 10) {
        this.countries = countries.filter(country => country.level < 3);
      }

      if (this.currentScore === 20) {
        this.countries = countries;
      }
    },
    checkCountry: function(country, event) {
      this.increaseLevelIfNeeded();
      setTimeout(() => {
        this.reveal = true;
        if (country.code === this.correctCountry.code) {
          this.currentScore++;
          this.getCountries({ delay: 0 });
        } else {
          if (this.currentScore > this.maxScore) {
            this.maxScore = this.currentScore;
          }
          this.hasEnded = true;
        }
        event.target.blur();
      }, 300);
    }
  }
};
</script>

<style scoped>
h1 {
  margin-bottom: 10px;
}
.hello {
  padding: 16px 10px;
  max-width: 800px;
  margin: 0 auto;
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
  opacity: 0.5;
}

.flag.shadow {
  box-shadow: -2px 4px 24px 3px rgba(22, 23, 24, 0.75);
  opacity: 0.9;
}

.answer {
  width: 335px;
  text-align: left;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow-x: hidden;
  height: 44px;
}

.blur {
  filter: grayscale(70%) blur(1px);
  transition: 0.5s filter ease-in-out;
}
.highlight {
  transform-origin: top center;
  animation-name: tada;
  animation-duration: 1s;
  animation-fill-mode: both;
  animation-timing-function: linear;
}

@keyframes tada {
  from {
    transform: scale3d(1, 1, 1);
  }

  10%,
  20% {
    transform: scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg);
  }

  30%,
  50%,
  70%,
  90% {
    transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg);
  }

  40%,
  60%,
  80% {
    transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg);
  }

  to {
    transform: scale3d(1, 1, 1);
  }
}

@media (min-width: 420px) {
  .answers {
    margin-top: 40px;
  }
}
</style>
