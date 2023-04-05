# Customer Support App
**Link to App** https://versatile-topic-162112.ew.r.appspot.com/ 

Please refer to diagrams\
SystemDiagram.drawio (System diagrams)
Functions.drawio (Function diagrams)

##  Description
The customer support app facilitates return of products from  the customer. 
It is used both by employees and customers. Employees login to the app  to view and handle tickets.
The admin user is responsible for managing th list of users in the system

### Create Ticket
* Customer creates a ticket.
* The ticket is auto assigned to any available user

### Handle Ticket
* Employee Logs in to the app
* If there is a ticket assigned,  the user works on the ticket and marks is resolved
* Employee takes another to work on

### Create Users
* Admin Employee Logs in to the app
* Admin can see Tickets and Users
* Admin can handle ticket same as Handle ticket
* Admin can create and delete users


##  Technical Aspects
There are two apps in the project.\
The frontend app is built with ReactJs. The user interacts  through with the frontend application   through the browser.\
The backend application is built with Nest.js. The backend app process requests from the browser via http api requests.  The backend app maintains users and tickets data in the SQL Lite database.

## Choice of Technology 
It is firstime developing using NestJS, tailwind, GitHub actions and Publish to google Cloud. All of the applications is built using tutorials from the respective websites, stackoverflow and medium.  

### Front End
* **react**\
React JS has the advantage of easy to learn and build encapsulating and abstracting complex html element manipulations. There are many components available to build extensive user centric applications

* **heroicons** \
A great set of svg based icons

* **react-router-dom**\
Client side routing and navigation of links and pages

* **swr**\
Library with extended features for making get requests 


### Back End
* **nestJS**\
A framework for building efficient, scalable node js applications. 

* **SQLLite**\
File based data store for the applciation easily created and deployed through typeorm migration

### Development
* VSCode
* GITHub
* GITHub actions
* pnpm

The monorepo is made up of two packages backend and fronend in its respective folder. They share a workspace for common entity and packagess.
After clone from github,  the packages need to be installed in each folder by running the command `pnpm install`

**install dependencies** \
go to packages/frontend and run command  `pnpm install`\
go to packages/backennd and run command  `pnpm install`

**To start backend server**\
go to packages/backend and run command `pnpm start`

**To run the frontend**\
go to packages/frontend and run command `pnpm run`

## Publish
The apps are published through Github actions to Google Cloud
