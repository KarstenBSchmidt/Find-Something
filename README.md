# Find Something

This CSS 481 Web Programming And Applications project was developed by Karsten Schmidt, Jac Chambers, Cole Weber and Kerry Thornock.

This application finds places to bike to, walk to or see around you. This is displayed on a map, which draws your route. 

## Setup
To setup this project, you must first establish a Firebase project with Firestore and Authentication by email and password enabled.

Then, download the directory: 
```
npm i
```
> If not working, sometimes you have to individually run these two commands:
> ```
> npm i firebase 
> npm run dev
> ```
This allows you to see the site in developer mode.

# ENJOY! :)

### SETTING UP FIREBASE - IF NEEDED

```
Go to firebase.google.com

Login or create an account

Go into the dashboard and click "Create a project"

Follow the instructions filling in required details

You will recieve all .env variables such as your Firebase API key

Once done, go into your project and select "Firestore", follow the instructions to enable this and copy and paste the rules in firestorerules.txt into "rules" under the Firstore dashboard

The setup authentication and follow the steps to enable this, under sign-in method, enable Email/Password as your provider

Firebase should be all setup for you. Ensure your .env has the proper variables, and connect to your DB

Running npm run dev should now be fully functional with your Firebase DB!  
```
