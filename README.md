# Core.WebApp

This project will provide basic configuration functionality for Cubes.Core application.

## Packaging

To create deployment package use `scripts\package.ps1` file. Version is controlled by Git tags.

## Nginx configuration
To serve the app on Nginx under the path `/cubes`, add the following configuration on Nginx config files:
```
  server {

    gzip on;
    listen 8001;
    server_name _;
    
    location /cubes {
      alias /path_to_project_folder/Cubes.UI/dist/core-webapp;
      try_files $uri /index.html =404;
      index index.html;
    }
  }
```
