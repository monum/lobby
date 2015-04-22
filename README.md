lobby
======

> This branch of the project is for specific monum use only! If you're looking to fork, fork master.
> __This project is still under construction!__ Not yet ready for prime time.

This project is responsible for displaying a pretty ui of city data, for display in the lobby of the Boston City Hall building.  
The general structure of this project is as follows:

+ `tool/` - where our templating tool lives
+ `public/` - where our public site lives


# Tool

This project is written using [paularmstrong/swig](https://github.com/paularmstrong/swig) as a templating engine, so that the main site can easily be updated with new data sources. `tool/` is responsible for doing said updates.

## Views

The project views live in `tool/views/` and are `.swig` files. You can edit them there, and then run `tool` to build the static pages into `public/`.

##To use

```
# on *nix
./tool.sh <args>

# on windows
./tool.cmd <args>
```

Where `<args>` may be any of the following:

+ `c <path to json>` - specify a path to the json config file. default is `./config.json`


# Public

The site's root directory. note that `tool` is configured to __overwrite__ content in here when it is run. 


# License

Licensed under the [MIT License](./LICENSE)
