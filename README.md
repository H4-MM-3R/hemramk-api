# My General Purpose API to use for my projects

## TODO
- [x] 1.Create an API for github contributions chart of me and upload to cloudflare workers.
    - [x] Iteration 1: Scrape data from github profile, process with cheerio and expose it via API.
        >##### Downside: 
        > Years response time: ~1.5s
        > Contributions by Year response time: ~2.3s

    - [x] Iteration 2: Use a array to store the xml and cheerio to parse it and expose it via API.
        >##### Improvement: 
        > Years response time: 
        >   - First request: \~1.5s
        >   - Subsequent requests: \~343ms
        > Contributions by Year response time: 
        >   - First request: \~2.3s
        >   - Subsequent requests: \~900ms

    - [x] Iteration 3: Seed the data to Cloudflare KV and Create a Cron job to update the data everyday at 8:20PM.
        >##### Improvement: 
        > Years response time: ~46ms
        > Contributions by Year response time: ~447ms




