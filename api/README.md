#### Setup KV

```
wrangler kv:namespace create "USERS"
wrangler kv:namespace create "POSTS"
wrangler kv:namespace create "REPLIES"
wrangler kv:namespace create "RELATIONS"
wrangler kv:namespace create "CATEGORIES"
wrangler kv:namespace create "EXCEPTIONS"
```

```
wrangler kv:namespace delete --binding "USERS"
wrangler kv:namespace delete --binding "POSTS"
wrangler kv:namespace delete --binding "REPLIES"
wrangler kv:namespace delete --binding "RELATIONS"
wrangler kv:namespace delete --binding "CATEGORIES"
wrangler kv:namespace delete --binding "EXCEPTIONS"
```