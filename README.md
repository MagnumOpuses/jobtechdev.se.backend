![alt text][logo]

[logo]: https://github.com/MagnumOpuses/project-meta/blob/master/img/jobtechdev_black.png "JobTech dev logo"
[A JobTech Project]( https://www.jobtechdev.se)
# Jobtechdev.se backend

This project gives jobtechdev.se a more advanced backend. 
As of now it just proxys our downtime monitors from https://uptimerobot.com/ to an open api with the respons from our account. 

## Prerequisites

* You will need an account on https://uptimerobot.com/
* nodejs 
* npm on your local machine

## Usage

It sends a HTTP POST to uptimerobot.com with the variables from the .env file


### Installation

modify the .env file

```bash
API_URL=http://the-api-to-consume.example.com
API_KEY=123-456-789
```

To start the proxy simply run:

```bash
node index.js
```

The proxy server is now available on `http://localhost:3000`. You can override the port
by using the `PORT` environment variable.

## Test

N/A 

## Deployment 

Put in an server and serve it with nodejs. 

## Docker
you might need to run them with `sudo`

1. goto project root
2. run: `docker build . -t <image name>`
3. run: `docker run -it -p 8080:3001 <image name>`
4. open a browser of your choice and goto: `http://localhost:8080/`

## License

read [LICENSE](LICENSE)

