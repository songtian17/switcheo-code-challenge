# Problem 5

Please refer to https://github.com/songtian17/ignite-cli-blog

## Blog

The following changes are made as an extension of the [Blog tutorial](https://docs.ignite.com/guide/blog):

- Field added to type Post: `tag: []string`
- Query added: list-post-by-tag

## Interacting with the Blog

### 1. Create a Post

`blogd tx blog create-post hello world test,hello,world --from alice --chain-id blog`

### 2. View a Post

`blogd q blog show-post 0`

### 3. List All Posts

`blogd q blog list-post`

### 4. List Posts By Tag (New)

`blogd q blog list-post-by-tag world`

### 5. Update a Post

`blogd tx blog update-post "Hello" "Cosmos" hello,cosmos 0 --from alice --chain-id blog`

### 6. Delete a Post

`blogd tx blog delete-post 0 --from alice  --chain-id blog`
