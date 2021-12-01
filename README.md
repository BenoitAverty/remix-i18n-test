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

My experiment can be found in the `custom-i18next-solution` branch. The code that would be extracted into a package is the `app/remix-i18next` folder.

The above problems are all related to the fact that translations are retrieved in the loaders. This is the fundamental problem in my opinion : **translations data is not application data**. It doesn't have the same lifecycle (changes leff often) and the freshness requirements are not thez same (most of the time, it's ok to have some stale translations until the next refresh).

So I've implemented the following strategy :

1. configure the i18next namespaces needed for a route module using [handle](https://remix.run/docs/en/v1/api/conventions#handle). This is gread DX : very easy to do, no interference with loaders.
2. For the SSR phase, create an i18next instance that can retrieve the translations using a configurable backend. Use the handles to know what namespaces to get, use the request to know the language needed. This is all done in `entry.server.tsx`
3. During SSR phase, render a script tag that puts the translation on `window`. That way, the browser i18next instance will be able to get the translations without an extra request. This is the strategy remix uses for the loader data, but it's separate because I don't want to use ther loaders. This is done in the document component (right before remix `<Scripts />` component)
4. Before hydration, create an i18next instance that gets its translations and the language from `window` (thanks to step 3) and hydrate the app using that instance.
5. During client side navigation, the browser i18next instance fetches the translations using a [resource route](https://remix.run/docs/en/v1/guides/resource-routes). Unfortunately, this is the part that doesn't work well yet.

## Problems

My solution *almost* works. If you run the app, you'll se that my solution doesn't retrieve duplicate translations during SSR and doesnt't fetch translations that were already loaded during client side navigation.

However, this strategy relies heavily on private remix APIs, which make using this risky.

Also, there is no way to instruct remix to wait for the translations before navigating. The translations are loaded in parallel with the loaders, but if the loader response arrives before the translation responses then the default translation text is displayed until the translation request finishes.

Finally, since the server-side i18n instance is constructed in handleRequest, it is not available in the `meta` function of a loader which prevents translation of the meta tags and title.

## What next ? (no pun intended)

This strategy is not really usable right now because of the problems mentioned above. If the translations are very fast and you don't need to translate the title and meta tags, then I guess it can be used. The DX is better in my opinion and this optimizes the loading of translations.

The problems couls be solved with some evolutions in Remix :

- Provide real introspections API to avoid the use of provate remix APIs (expose route IDs, get next matches in useTransition even if it is incomplete before bundles are not loaded)
- Provide a way, on the server, to get the handles given a pathname (that way we could do an api route that retrieves the handles of a requested url and computes the needed namespaces server side)
- Provide a way to customize the navigation behaviour in the browser. That way we could make the navigation wait for the translation requests)

Remix will probably implement i18n at some point, I hope this experiment will bring some ideas. See remix-run/remix#202

Thanks for reading.