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
<!-- *change background - click bg pic to cycle over -->
<!-- *Create your own category -->
<!-- *Delete a category -->
**Create Backend** - add task, delete task, update task, dump task
<!-- error message not sure if meaningful(SAWarning: Object of type <Task> not in session, add operation along 'Step.task' won't proceed)
  db.session.commit() -->
<!-- *Welcome to Demo mode - w instructions on what you can do* -->
<!-- *category of newly created tasks = allTasks??* -->
*create category gives new category next order index/del category reshuffles order indexes*
*attribute <a href="https://www.freepik.com/free-vector/trophy-flat-style_73897148.htm#query=trophy%20png&position=3&from_view=keyword&track=ais&uuid=007cb5db-57b1-420e-a773-9e90c9bd46a0">Image by juicy_fish</a> on Freepik for the trophy img in missionCompleted modal*
<!-- *add my day to full tray icons* -->
*create dumped key and arr for dumped tasks*
*Deep navbar will have dumped tasks, account settings, my friends, points, log out?*
<!-- *confetti for final mission completed?* - nahhh -->
<!-- are you sure modal for task dumping -->
<!-- *remove it would be cool textarea from feedback modal* -->
<!-- *not all tasks completed but mission still getting completed ??* -->
<!-- *photoURL nullable, backup render if no photoURL -->
<!-- *add time created key to tasks - not needed, initial frontend task list is based on chrono -->
<!-- *Add participants to create/edit task modals - between Notes and date/time! OR next to cancel button in the bott-right -->
<!-- *make + Add steps button fade out if 5 steps already added -->
*equalize image sizes of tips on auth page, make fade out fade in with small delay*
AFTER MVP UPDATES
Have quick update edit from taskbar settings be close modal on click?
**User sign in and out with Firebase - catch login errors**
**Earn pts for completing and deleting tasks (will need tooltip explaining)**
*animation for dumping tasks*
*enable leveling up*
*Friends - send friend requests, add friends to participate in your tasks
<!-- **Make the column title area fixed when scrolling** -->
*Location, weather and time at top right?
*Four formality settings for greetings (day greetings, Hi/Hola/Hey/We missed you/Welcome back/Good to see you - nice, What's up/Ayoo/Welcome back/Hello Sunshine/How goes it - informal, quotes - motivational)
*character limits on task title, notes, steps
*Are you sure clear category/delete category modals
*"..." if task name is longer than available width
<!-- *slide title text in? -->
<!-- *diff color backgrounds for list headers -->
*Theme settings - Dark mode toggle
*allow making words bold in task title?
*glow when category is first made
*0 tasks in this category when you first create it and haven't added anything yet card
<!-- *make time picker w/o 0 in front of time -->
*dump folder that you can restore tasks from
space man mascot
don't confirm if dump tasks just do it option in account settings
notes edit shouldn't disappear if you edit notes in taskbar and delete all text?


Feedback
<!-- *Make AM/PM drop down separate selection (meet user expectations) -->
<!-- *Make priority btn bolder when inactive -->
*create tooltips to help users understand how to... use advanced settings/set priority/add to my day/edit name and steps of tasks from task box
<!-- make priority button on task bar more visible -->
make indicator to turn on advanced settings more visible or have quick tooltip
make demo give task date in the future
make dump tasks a button
<!-- hit enter to confirm a step and add a new one -->
add new category when creating a task
see dumped tasks
have a specific task to add during the mission
selecting same day doesn't work when updating date/time from task bar


**axios caused 1 high severity vulnerability**

**Backend connection points**
CompleteSignUpModal.jsx - when signing up the user info is sent to the backend for saving to database (local)

On spin up
Make sure db turned off!