import '/styles/style.scss';
import '/styles/button.scss';
import '/styles/note.scss';
import '/styles/popup.scss';
import '/styles/popup-edit.scss';
import '/styles/popup-tags.scss';
import '/styles/sidebar.scss';
import '/styles/filter.scss';

//! If Vercel throws an error regarding "rollup failed to resolve" then it's because i tried to push a commit for main.js where I've imported a new scss file but have yet to push the actually scss file so Vercel woudn't see it in my repo because it only exists on my local machine NOT the repo. So I have to push the scss file first then push the main.js file.