# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh



**<!-- Potential features and add-ons -->**
<!-- *Capitalize first letter of task name for the user in case they forgot to - steps as well! -->
<!-- *Advanced settings toggle stays simple/advanced until you change it again -->
<!-- *Are you sure before deleting a task -->
<!-- *Make TaskBox component -->
<!-- **Quick update task functions - need time and category** -->
<!-- **Edit task modal if you want to change everything at once - need to complete update function** -->
<!-- **Create pages for each category that holds tasks of that category - may have to create running counts for each category and tasktype (priority/completed etc.) as you update tasks** -->
<!-- **Task completion strikes out task - struck out task stays at the bottom of the list but not indicated in # tasks to complete in that category - second map after primary one listing completed tasks in the category** -->
<!-- *Put tasks list into DataContext to access app wide -->
<!-- **id in task objects must rearrange when deleting a task!** -->
**User sign in and out with Firebase - catch login errors**
<!-- *change background - click bg pic to cycle over -->
<!-- *Create your own category -->
<!-- *Delete a category -->
**feedback modal send message to my database**
**Create Backend**
*create category gives new category next order index/del category reshuffles order indexes
<!-- *photoURL nullable, backup render if no photoURL -->
<!-- *add time created key to tasks - not needed, initial frontend task list is based on chrono -->
<!-- *Add participants to create/edit task modals - between Notes and date/time! OR next to cancel button in the bott-right -->
<!-- *make + Add steps button fade out if 5 steps already added -->
AFTER MVP UPDATES
**Earn pts for completing and deleting tasks (will need tooltip explaining)**
*animation for dumping tasks*
*enable leveling up*
*Friends - send friend requests, add friends to participate in your tasks
**Make the column title area fixed when scrolling? - optional setting toggled with a checkbox**
*Location, weather and time at top right?
*Four formality settings for greetings (day greetings, Hi/Hola/Hey/We missed you/Welcome back/Good to see you - nice, What's up/Ayoo/Welcome back/Hello Sunshine/How goes it - informal, quotes - motivational)
*character limits on task title, notes, steps
*Are you sure clear category/delete category modals
*"..." if task name is longer than available width
<!-- *slide title text in? -->
<!-- *diff color backgrounds for list headers -->
*Theme settings
*allow making words bold in task title
*glow when category is first made
*0 tasks in this category when you first create it and haven't added anything yet card
<!-- *make time picker w/o 0 in front of time -->
*dump folder that you can restore tasks from
*equalize image sizes of tips on auth page


Feedback
*Make AM/PM drop down separate selection (meet user expectations)
*Make priority btn bolder when inactive
*create tooltips to help users understand how to... use advanced settings/set priority/add to my day/edit name and steps of tasks from task box

**axios caused 1 high severity vulnerability**

**Backend connection points**
CompleteSignUpModal.jsx - when signing up the user info is sent to the backend for saving to database (local)