// import the FontAwesome core
import { library } from "@fortawesome/fontawesome-svg-core";

// import font awesome icon component
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// import specific icons
import {
  faMagnifyingGlass,
  faAngleDown,
  faArrowLeftLong,
} from "@fortawesome/free-solid-svg-icons";
import { faMoon } from "@fortawesome/free-regular-svg-icons";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";

// add icons to the library
library.add(faTwitter, faMoon, faMagnifyingGlass, faAngleDown, faArrowLeftLong);

export default FontAwesomeIcon;
