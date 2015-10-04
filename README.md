# Gulp Site Builder

Combination of Glup plugins for building static websites.

## The plugins

This repo includes the following plugins

* HTML
    * Use inheritance, partials, etc via Nunjucks (the files in `app/layouts`, `app/shared` won't be copied to dist)
* JavaScript
    * Packs JS files using Browserify
    * Transforms ES6 files using Babel
* Styles
    * Compiles SCSS/SASS files
    * Autoprefixes the styles
    * Removes the unused rules via uncss plugin
* Images
    * Easily create responsive version of the Images
    * Optimize the images
* Dev server
    * Integrated dev server
    * Livereload
    * Browser syncing for testing

For the production build, all the files are minified and revisioned.

## Project structure

The project follows a simple structure and all you have to worry about is the app folder.

```
project-name/
    app/
        images/      - all the images
        javascripts/ - all the scripts
        styles/      - all the stylesheets
        index.html

    tmp/             - used be the dev server
    dist/            - this is where the build is stored
```

## Start the dev server

The dev server can be started just be typing `gulp` or `gulp serve`. Then you can visit `localhost:8091` to access it.

## Production build

Running `gulp build` will build and optimize your project.
The build files will be stored in the dist folder which is the folder you must deploy to your server.
