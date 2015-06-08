# Lobby

This project is responsible for displaying a pretty ui of city data, for display in the lobby of the Boston City Hall building.

Before running anything, first `npm install`.

# db_setup.js

> Note: for now, this doesn't delete databases or tables, so if you wish to recreate, you must manually delete them first.

this script contains the necessary configuration for our database. Running it will create the
needed databases and tables.

# run-tasks.js

> Note: for now, this deletes all data before importing! We should change this, and only write new data.

this script actually runs import tasks, to take calendar data and open311 data and import it
into the database.

# tasks/Task.js

This is the base class for which all tasks derive from. It is handy because it allows us to choose
to run tasks (for importing) on a schedule, or just run them immediately.

# tasks/models/Event.js

This is the model for an event within our database. An array of these objects is passed to `rethinkdb.insert()`
when we upload data.

# tasks/models/ServiceRequest.js

This is the model for a service request within our database. An array of these objects is passed to `rethinkdb.insert()`
when we upload data.

# test/test-Task.js

> To run: use `mocha`.

This is the mocha test file for tasks/Task.js, in order to ensure that derived tasks function as expected.
