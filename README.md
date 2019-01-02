# CoreUI

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.1.4.

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build. Also use `--base-href /cubes/` for hosting app in cubes subfolder.

Note: since Roboto font and Material Icons are serverd locally (added either on styles.scss or angular.json styles array), we must add `--extract-css=false` on the build command. Poassibly related to [this](https://github.com/angular/angular-cli/issues/8577) issue.

The final commands should look like:
```
ng build --prod --extract-css=false --base-href /cubes/
```


## Nginx configuration
To serve the app on Nginx under the path `/cubes`, add the following configuration on Nginx config files:
```
  server {

    gzip on;
    listen 8001;
    server_name _;
    
    location /cubes {
      alias /path_to_project_folder/Cubes.UI/dist/cubes-ui;
      try_files $uri /index.html =404;
      index index.html;
    }
  }
```



# TODO

- [ ]	Active class on main toolbar
- [ ] Job editor
- [ ] About page
- [ ] Actual calls
