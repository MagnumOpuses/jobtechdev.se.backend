# proxify - (proof-of-concept) API proxy

Consuming APIs with SPAs reveals the API key to the end user. This is not the
desired behavior, as one wants to keep his API key a secret.

This package starts an `express` server that proxies all `POST` requests to the
API specified in the `API_URL` environment variable. The API key can be
specified with `API_KEY`.

## Usage

### Locally

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

