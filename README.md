# PatchworkWeb
This is the repository for [Patchwork Lab's](https://www.patchworklabs.org/) website proposal.

This site is built entirely using pure HTML5, CSS3, and JavaScript. No frameworks or libraries
have been involved, since I like to keep things under control, so I can ensure they are lightweight
and efficient.

# How to use
If you don't want the donate page being operative (you can even remove it if you want by just deleting a bit of code),
you can just host the site as a static webpage. If you do want the donate page to work, just install Node.js and
execute the following commands in your terminal:

```
npm install
npm start
```

That should be enough to get you set up and running, as long as you change the `STRIPE_SECRET_KEY` variable in 
`server.js` and the public key in `res/donate.js` with your very own Stripe API keys. If it doesn't work, open an issue
or something, I guess. What use would you have for such a specific website though xd?