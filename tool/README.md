tool
====

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

