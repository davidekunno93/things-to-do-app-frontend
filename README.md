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
**Create Backend** - add task, delete task, update task, dump task, update level and points
<!-- error message not sure if meaningful(SAWarning: Object of type <Task> not in session, add operation along 'Step.task' won't proceed)
  db.session.commit() -->
<!-- *Welcome to Demo mode - w instructions on what you can do* -->
<!-- *category of newly created tasks = allTasks??* -->
<!-- change no category to none -->
*attribute <a href="https://www.freepik.com/free-vector/trophy-flat-style_73897148.htm#query=trophy%20png&position=3&from_view=keyword&track=ais&uuid=007cb5db-57b1-420e-a773-9e90c9bd46a0">Image by juicy_fish</a> on Freepik for the trophy img in missionCompleted modal*
<!-- *add my day to full tray icons* -->
<!-- **Theme settings - Dark mode toggle** -->
<!-- open create category from task modals -->
<!-- only show priority popup when create task not when log in - cut off by carousel window (title section + tasks need to go in carousel window) -->
**Deep navbar will have my profile, my friends, achievements (change username, password, photoURL), account settings, Sign out**
<!-- **create dumped key and arr for dumped tasks* - *dump folder that you can restore tasks from-remove myDay, remove progress, add completed date, add points earned** -->
<!-- *create level key* -->
Level n 15(n+2)/15(n+2) + 15([n-1]+2) + 15([n-2]+2)... until n=1
Level 1 45/45
Level 2 60/105
Level 3 75/180
Level 4 90/270
Level 5 105/385
Level 6 120/505
Level 7 135/640
Level 8 150/890
Level 9 165/1055
Level 10 180/1235

Finally...
<!-- clear am pm when clearing time (make timeOfDay > "AM" or "PM") - not needed. Time updated problem solved -->
<!-- update dump task screenshot in mission modal to dump selected tasks -->
<!-- 810 sunrise not responding with completion -->
dark blue of long duration doesn't pop well in dark mode.. later
<!-- when updating task from edit modal - if nothing is changed, when hitting update the time delivered back to the task is messed up -->
Create get tasks & user categories routes
complete login error handling
Host backend (on render?)

<!-- *make 2nd category list scrollable -->
<!-- *confetti for final mission completed?* - nahhh -->
<!-- are you sure modal for task dumping -->
<!-- *remove it would be cool textarea from feedback modal* -->
<!-- *not all tasks completed but mission still getting completed ??* -->
<!-- *photoURL nullable, backup render if no photoURL -->
<!-- *add time created key to tasks - not needed, initial frontend task list is based on chrono -->
<!-- *Add participants to create/edit task modals - between Notes and date/time! OR next to cancel button in the bott-right -->
<!-- *make + Add steps button fade out if 5 steps already added -->
*******
**MVP ONE**
*******
limit category dropdown list's height in task modals
*create category gives new category next order index/del category reshuffles order indexes*
edit category - name, color, icon
upon creation of 5th category tell popup for user to scroll categories to see more - add scroll indicators that disappear if you get to the end of the scroll
*equalize image sizes of tips on auth page, make fade out fade in with small delay*
**User sign in and out with Firebase - catch login errors**
**Earn pts for completing and deleting tasks (will need tooltip explaining)**
*enable leveling up*
*character limits on task title, notes, steps, location (30)
*Are you sure clear category/delete category modals
*"..." if task name is longer than available width
Search bar to search tasks
new navbar icons w/ boxes for all - more muted modern style
Dump selected tasks - add square checkbox toggles to completed tasks page
*******
**MVP TWO**
*******

AFTER MVP UPDATES
parallex scroll on title bg
Add emoji functionality to task name? 
Change date format in task modals to something more modern
Have quick update edit from taskbar settings be close modal on click?
*animation for dumping tasks*
*Friends - send friend requests, add friends to participate in your tasks
<!-- **Make the column title area fixed when scrolling** -->
*time at top right?
*Four formality settings for greetings (day greetings, Hi/Hola/Hey/We missed you/Welcome back/Good to see you - nice, What's up/Ayoo/Welcome back/Hello Sunshine/How goes it - informal, quotes - motivational)
<!-- *slide title text in? -->
<!-- *diff color backgrounds for list headers -->
*allow making words bold in task title?
*glow when category is first made
*0 tasks in this category when you first create it and haven't added anything yet card
<!-- *make time picker w/o 0 in front of time -->
space man mascot
don't confirm if dump tasks just do it option in account settings
notes edit shouldn't disappear if you edit notes in taskbar and delete all text?
update progress on the task object global and database when toggle complete task


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