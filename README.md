# Project Pulse

### Description:-

Project Pulse is a tool used by organizations to tract the progress and status of their projects. backend of this project is completed using nodejs.

### How to Install the Project

Download the git repository manually or clone it by following command

```
git clone https://github.com/ShameerShaik0598/PROJECT-PULSE
```

If you download it manually then extract the zip file.

Now run the following command to install all the modules that are used in this project

```
  npm install
```

now start the server using the below command

```
  npm start
```

### Configurations

create `.env` file and add the following details to the `.env` file
PORT=1000
HOST=localhost
DB_NAME=YOUR_DB_NAME
DB_USER=YOUR_DB_USER
DB_PASS=YOUR_DB_PASSWORD
SECRET_KEY=SECRET_KEY
EMAIL_SERVICE_PROVIDER=EMAIL_SERVICE_PROVIDER
EMAIL=EMAIL_ID
EMAIL_PASSWORD=APP_PASSWORD

```

## Overview
### Roles in this project:-
```

1.SuperAdmin
2.Admin
3.GDO (Global Delivery Organization)
4.Project Manager
5.HR Manager

```
### Tasks of the assined roles

#### superAdmin
```

1.Get all the users.
2.Assign the roles to the Employees.

```
#### Admin

```

1.Get all the projects in the organization
2.Get specific project details (Detailed Overview,Project Concerns, Project Updates Team Composition)
3.Create a project
4.Get the resourcing requests
5.Update the existing project
6.Delete existing project(soft delete)

```

#### GDO (Global Delivery Organization)
```

1.Get all projects under his supervision
2.Get specific project details (Detailed Overview,Project Concerns, Project Updates Team Composition)
3.Assigning projects to employees (he can create a team)
4.Update employees in the project
5.Delete Employees from the project
6.Raising Resource Requests

```
#### Project Manager

```

1.Adding project updates
2.Raise project concerns
3.Get all the projects under his maintanance
4.Get specific project details (Detailed Overview,Project Concerns, Project Updates Team Composition)

```

```
