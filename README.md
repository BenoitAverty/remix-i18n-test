# Remix i18n experiment 

This is a remix experiment for a great i18n solution.

## Motivation

About a year ago, I worked on a Next.js app with the following requirements for internationalization :

 - Load the translations from a database
 - Different translations depending on an environment variable.

I made it work, but it was pretty hard and I needed to dive deep into next.js and i18next code (the i18 solution we chose)

I've been using remix since the supporter preview launch and I suspected the same requirements would be easier to implement using remix.

## remix-18next

[remix-i18next](https://github.com/sergiodxa/remix-i18next) is a great solution and solves the above requirements out of the box. So thanks to @sergiodxa for the good work. It already proves that the level of abstraction remix provides is better at this kind of things (control of the entrypoints is really great when we need to do things before React starts its work)

However, there are drawbacks to this solution that could affect the performance of an application that uses remix-i18next.

 - If two route modules use the same i18next namespace, the translations for that namespace will be fetched twice during the SSR phase (in parallel, but still).
 - On client side navigation, the translations for the destination page will be fetched, even though they could already be loaded in the browser i18next instance. This is wasted time for the navigation.

These problems are showed in this repo : I made a backend that retrieves translations very slowly, and the performances of the app suffer.

There is also a problem related to developer experience : code for i18n must be included in all loaders. This can be tedious, and it forces the creation of a loader fo routes that don't necessarily need it.

## An attempt at a solution

My experiment is located in the `custom-i18next-solution` branch. The code that would be extracted into a package is the `app/remix-i18next` folder.

The above problems are all related to the fact that translations are retrieved in the loaders. This is the fundamental problem in my opinion : **translations data is not application data**. It doesn't have the same lifecycle (changes leff often) and the freshness requirements are not thez same (most of the time, it's ok to have some stale translations until the next refresh).

So I've implemented the following strategy :
 
 1. configure the i18next namespaces needed for a route module using [handle](https://remix.run/docs/en/v1/api/conventions#handle). This is gread DX : very easy to do, no interference with loaders.
 2. For the SSR phase, create an i18next instance that can retrieve the translations using a configurable backend. Use the handles to know what namespaces to get, use the request to know the language needed. This is all done in `entry.server.tsx`
 3. During SSR phase, render a script tag that puts the translation on `window`. That way, the browser i18next instance will be able to get the translations without an extra request. This is the strategy remix uses for the loader data, but it's separate because I don't want to use ther loaders. This is done in the document component (right before remix `<Scripts />` component)
 4. Before hydration, create an i18next instance that gets its translations and the language from `window` (thanks to step 3) and hydrate the app using that instance.
 5. During client side navigation, the browser i18next instance fetches the translations using a [resource route](https://remix.run/docs/en/v1/guides/resource-routes). Unfortunately, this is the part that doesn't work well yet. 

## Problems

My solution *almost* works. If you run the app, you'll se that my solution doesn't retrieve duplicate translations during SSR and doesnt't fetch translations that were already loader during client side navigation.

However there is an important limitation. This is because there is currently no way in remix to get the handles of the **next** route modules of a client side navigation (because the js bundles of those route modules may not be downloaded yet), and on the server side there is no way (or maybe a very hacky way) to get the handles of route modules using an url (you can only get the handles of the matches of the request).

This leads to waterfall requests (on navigation, first the browser downlaods the next js bundles, then the translations). This means there is a period of time when React shows default translations instead of the right translation value. This is very visible in my demo since I've artificially delayed the retrieval of translations. I find that a bit sad since Remix is especially great at avoiding this particular situation.

## What next ? (no pun intended)

In the current situation, I don't know what I would chose between remix-i18next or my custom solution. Fortunately, I don't have to make that choice right now :)

If translation retrieval is very fast and the app is not too big, both solutions are probably viable.

If the app is big, I think I prefer my solution to avoid the network cost of downloading translations several times.

If the translations are slow to retrieve, I prefer remix-i18next because the default translations would be shown for an unacceptable period of time.

But the best of both worlds could be achieved with some evolutions in Remix. I hope they will exist one day (maybe I'll take a shot :) )

 - Provide a way to get the handles of next modules when navigating (I don't think it's easy because handles are not necessarily serializable as json)
 - Provide a way, on the server, to get the handles given a pathname (that way we could do an api route that retrieves the handles of a requested url and computes the needed namespaces server side)
 - AND provide a way to customize the navigation behaviour in the browser. Because even if we can fetch translations in parallel of the loaders, there is no way to be sure that the translations will arrive before the loader data. No waterfall, but potentielly still some incorrect translations (although this could be mitigated with `link rel=preload` tags)


Thanks for reading.