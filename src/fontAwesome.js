// import the FontAwesome core
import { library } from "@fortawesome/fontawesome-svg-core";

// import font awesome icon component
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// import specific icons
import {
  faGlobe,
  faMoon,
  faSun,
  faPlus,
  faPenToSquare,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
// import { faMoon } from "@fortawesome/free-regular-svg-icons";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";

// add icons to the library
library.add(faGlobe, faSun, faMoon, faPlus, faTwitter, faPenToSquare, faXmark);

export default FontAwesomeIcon;
