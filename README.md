# FinanceWatch API

Simple REST API for the tracking of latest quote, logo and news of stocks.

## Getting Started

Clone the repository

```
git clone https://github.com/KinIcy/finance-watch-api.git
```

Run!

```
npm start
```

Sample request:

```
curl http://localhost:3456/stock/twtr/
```

Sample response:

```JSON
{
    "quote": "32.05",
    "logo": "https://storage.googleapis.com/iexcloud-hl37opg/api/logos/TWTR.png",
    "lastNew": "https://cloud.iexapis.com/v1/news/article/0b0e6cfa-d41a-42f7-a613-88ae4c9f841b"
}
```

### Prerequisites

This project requires Node.js version 11 or higher. No further dependencies are required.

## Testing

```
  npm test
```

## Authors

* **Jason Lopez** - *Initial work* - [KinIcy](https://github.com/KinIcy)
