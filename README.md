# 🚫🚫🦆 Ununduck

DuckDuckGo's bang redirects are slow and original unduck even slower (at least for me) because of it's slowanalytics. Add the following URL as a custom search engine to your browser. Enables all of DuckDuckGo's bangs to work, but much faster.

```
https://ununduck.link?q=%s
```

## How is it that much faster?

DuckDuckGo does their redirects server side. Their DNS is...not always great. Result is that it often takes ages.

I solved this by doing all of the work client side. Once you've went to https://ununduck.link once, the JS is all cache'd and will never need to be downloaded again. Your device does the redirects, not me.

## How is it faster than unduck?

This fork:
- uses service workers for cache
- does not have any analytics
